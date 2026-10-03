import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ciRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(ciRoot, '..');
const errors = [];
const checks = [];

function check(condition, message) {
  if (condition) checks.push(message);
  else errors.push(message);
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function safePath(relativePath) {
  const absolute = resolve(ciRoot, relativePath);
  const inside = relative(ciRoot, absolute);
  check(inside !== '' && !inside.startsWith('..') && !inside.includes(`..${process.platform === 'win32' ? '\\' : '/'}`), `asset path stays inside ci/: ${relativePath}`);
  return absolute;
}

function pngDimensions(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature || buffer.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function svgDimensions(buffer) {
  const source = buffer.toString('utf8');
  const root = source.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const attr = (name) => root.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1] ?? null;
  return { width: Number.parseInt(attr('width') ?? '', 10), height: Number.parseInt(attr('height') ?? '', 10), viewBox: attr('viewBox'), source };
}

const manifestPath = join(ciRoot, 'brand-manifest.json');
const manifestBuffer = readFileSync(manifestPath);
const manifest = JSON.parse(manifestBuffer.toString('utf8'));
check(manifest.manifestId === 'freepass.brand.manifest', 'manifest id is fixed');
check(['HOLD', 'APPROVED', 'RETIRED'].includes(manifest.status), 'manifest status is recognized');
check(manifest.release.hotlinkPolicy === 'FORBIDDEN', 'runtime hotlinks are forbidden');
check(manifest.release.consumerPolicy === 'PIN_VERSION_AND_MANIFEST_DIGEST_THEN_COPY', 'consumer contract pins version and digest');
check(Boolean(manifest.rightsAndApproval), 'rights and approval gate exists');
if (manifest.status !== 'APPROVED') {
  check(manifest.rightsAndApproval.redistributionScope === 'EVIDENCE_ONLY', 'HOLD release is evidence-only');
  check(manifest.rightsAndApproval.releaseApprovalEvidence === null, 'HOLD release has no fabricated approval evidence');
}

const assetIds = new Set();
let approvedAssets = 0;
for (const asset of manifest.assets) {
  check(!assetIds.has(asset.assetId), `asset id is unique: ${asset.assetId}`);
  assetIds.add(asset.assetId);
  if (asset.status === 'APPROVED') approvedAssets += 1;
  check(!/^https?:/i.test(asset.path), `asset is local, not hotlinked: ${asset.assetId}`);
  const absolute = safePath(asset.path);
  check(existsSync(absolute), `asset exists: ${asset.path}`);
  if (!existsSync(absolute)) continue;
  const buffer = readFileSync(absolute);
  check(sha256(buffer) === asset.sha256, `asset digest matches: ${asset.assetId}`);
  if (extname(absolute).toLowerCase() === '.png') {
    const dimensions = pngDimensions(buffer);
    check(Boolean(dimensions), `PNG header is valid: ${asset.assetId}`);
    if (dimensions) check(dimensions.width === asset.dimensions.width && dimensions.height === asset.dimensions.height, `PNG dimensions match: ${asset.assetId}`);
  } else if (extname(absolute).toLowerCase() === '.svg') {
    const dimensions = svgDimensions(buffer);
    check(dimensions.width === asset.dimensions.width && dimensions.height === asset.dimensions.height, `SVG dimensions match: ${asset.assetId}`);
    check(dimensions.viewBox === asset.viewBox, `SVG viewBox matches: ${asset.assetId}`);
    check(!/<script\b/i.test(dimensions.source), `SVG has no script: ${asset.assetId}`);
    check(!/(?:href|src)=["']https?:/i.test(dimensions.source), `SVG has no remote dependency: ${asset.assetId}`);
    check(!/@|(?:\+?82|01[016789])[- .]?\d{3,4}[- .]?\d{4}/i.test(dimensions.source), `SVG has no contact data: ${asset.assetId}`);
  }
}

check(approvedAssets === manifest.release.approvedAssetCount, 'approved asset count matches release metadata');
if (manifest.status !== 'APPROVED') check(approvedAssets === 0, 'non-approved release exports no approved assets');

const digestPath = join(ciRoot, manifest.release.digestFile);
check(existsSync(digestPath), 'manifest digest sidecar exists');
if (existsSync(digestPath)) {
  const recorded = readFileSync(digestPath, 'utf8').trim().split(/\s+/)[0];
  check(recorded === sha256(manifestBuffer), 'manifest digest sidecar matches');
}

for (const jsonFile of ['brand-manifest.schema.json', 'tokens.json']) {
  JSON.parse(readFileSync(join(ciRoot, jsonFile), 'utf8'));
  checks.push(`${jsonFile} parses as JSON`);
}

for (const htmlPath of [join(ciRoot, 'index.html'), join(repositoryRoot, 'index.html')]) {
  const html = readFileSync(htmlPath, 'utf8');
  const base = dirname(htmlPath);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|#|data:)/i.test(target)) continue;
    const withoutQuery = target.split(/[?#]/, 1)[0];
    if (!withoutQuery || withoutQuery.startsWith('/')) continue;
    const localTarget = normalize(join(base, withoutQuery));
    check(existsSync(localTarget), `local page link exists: ${relative(repositoryRoot, localTarget)}`);
  }
}

const homepage = readFileSync(join(repositoryRoot, 'index.html'), 'utf8');
check(/href=["']ci\/["']/.test(homepage), 'homepage links to CI Center');

if (errors.length) {
  console.error(`CI verification failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`CI verification passed: ${checks.length} checks, ${manifest.assets.length} assets, release ${manifest.status}.`);
