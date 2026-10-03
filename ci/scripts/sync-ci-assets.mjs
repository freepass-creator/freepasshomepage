import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

function readArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value == null) throw new Error(`Invalid argument near ${key ?? '<end>'}`);
    result[key.slice(2)] = value;
  }
  return result;
}

function digest(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

const args = readArgs(process.argv.slice(2));
if (!args.source || !args.target || !args.version || !args.digest || !args.receipt) {
  console.error('Usage: node sync-ci-assets.mjs --source <ci-dir> --target <brand-dir> --version <manifest-version> --digest <manifest-sha256> --receipt <receipt.json> [--assets <asset-id,asset-id>]');
  process.exit(2);
}

const sourceRoot = resolve(args.source);
const targetRoot = resolve(args.target);
const manifestBuffer = readFileSync(join(sourceRoot, 'brand-manifest.json'));
const manifestDigest = digest(manifestBuffer);
const manifest = JSON.parse(manifestBuffer.toString('utf8'));

if (manifest.version !== args.version) throw new Error(`Version mismatch: expected ${args.version}, found ${manifest.version}`);
if (manifestDigest !== args.digest.toLowerCase()) throw new Error(`Manifest digest mismatch: expected ${args.digest.toLowerCase()}, found ${manifestDigest}`);
if (manifest.status !== 'APPROVED') throw new Error(`HOLD: manifest status is ${manifest.status}; no assets may be synchronized.`);

const requested = args.assets ? new Set(args.assets.split(',').filter(Boolean)) : null;
const selected = manifest.assets.filter((asset) => asset.status === 'APPROVED' && (!requested || requested.has(asset.assetId)));
if (!selected.length) throw new Error('No approved assets matched the request.');
if (requested && selected.length !== requested.size) throw new Error('One or more requested asset IDs are absent or not approved.');

mkdirSync(targetRoot, { recursive: true });
const receiptAssets = [];
for (const asset of selected) {
  const source = resolve(sourceRoot, asset.path);
  const sourceDigest = digest(readFileSync(source));
  if (sourceDigest !== asset.sha256) throw new Error(`Asset digest mismatch: ${asset.assetId}`);
  const destination = join(targetRoot, `${asset.assetId}-${basename(asset.path)}`);
  copyFileSync(source, destination);
  receiptAssets.push({ assetId: asset.assetId, sourceSha256: sourceDigest, destination });
}

const receipt = {
  source: manifest.owner.repository + '/' + manifest.owner.path,
  manifestVersion: manifest.version,
  manifestSha256: manifestDigest,
  synchronizedAt: new Date().toISOString(),
  assets: receiptAssets
};
mkdirSync(dirname(resolve(args.receipt)), { recursive: true });
writeFileSync(resolve(args.receipt), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(`Synchronized ${receiptAssets.length} approved assets.`);
