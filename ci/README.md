# FreePass CI Center

This directory is the proposed source and distribution boundary for FreePass brand assets.

## Current release state

- Manifest version: `0.1.0-hold.1`
- Release status: `HOLD`
- Approved assets: `0`
- Hotlinking: forbidden
- Rights/license: `UNKNOWN`; candidate redistribution is evidence-only

The files under `assets/candidates/` are byte-preserved evidence copies. Their presence does not approve them as canonical brand masters.

See `CANDIDATE_AUDIT.md` for dimensions, observed colors, source hashes, actual use, Git history, and the unresolved evidence gaps.

## Why HOLD

The wordmark and check-symbol families are both in real use, but no authoritative package or explicit owner decision was found that binds them into one approved CI family. The SVG wordmark is also font-dependent rather than outlined. Missing monochrome, inverse, outlined-master, and small favicon variants are not synthesized.

## Release process

1. Identify the authorized source package or obtain explicit owner approval for each semantic role.
2. Replace or approve candidates without changing their permanent `assetId` accidentally.
3. Mark only verified assets `APPROVED` and set the release status to `APPROVED`.
4. Recalculate `brand-manifest.sha256`.
5. Run `node scripts/verify-ci.mjs`.
6. Build the downloadable bundle and review the `/ci/` page on desktop and mobile.
7. Merge and publish only after the operational domain routing is separately approved.

## Consumer contract

Consumers must download or check out one immutable release, pin both its manifest version and SHA-256 digest, then copy approved assets into their own repository. Runtime hotlinks are forbidden. A consumer receipt must record:

```json
{
  "source": "freepass-creator/freepasshomepage/ci",
  "manifestVersion": "0.1.0-hold.1",
  "manifestSha256": "<64 lowercase hex>",
  "assets": [
    {
      "assetId": "freepass.example",
      "sourceSha256": "<64 lowercase hex>",
      "destination": "public/brand/example.svg"
    }
  ]
}
```

`scripts/sync-ci-assets.mjs` enforces the release gate and refuses the current HOLD release.

## Brand separation

MEWCAR, Welrix, partner/white-label brands, and vehicle-maker marks are excluded. They retain their own ownership and licenses and must never be copied into the FreePass manifest merely because another FreePass application displays them.
