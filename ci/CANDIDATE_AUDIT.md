# FreePass CI candidate audit

Audit date: 2026-09-21
Decision: **HOLD — no canonical master selected**

## Candidate evidence

| Family | Observed source | Dimensions / viewBox | Transparency | Observed colors | SHA-256 | Actual use and history | Decision |
|---|---|---|---|---|---|---|---|
| Mobility wordmark SVG | `freepass-estimate/apps/new/public/freepass-wordmark.svg` | 340×56 / `0 0 340 56` | vector | `#1B2A4A`, `#7F93B3` | `fcafd091c97e2b6c28a4baec12ae869c5c8024da019bfdb3196c30405e9c01e3` | Used by the FreePass company config and runtime brand theme. First recorded at commit `b1257b4e3ac141b027f404eec350a29bd5f3f878` on 2026-09-19. | `HOLD_FONT_DEPENDENT`: the SVG uses live text with Exo 2/Pretendard/Arial, not outlined paths. |
| Mobility wordmark PNG | local Docshub `양식/assets/logo-freepass.png` | 3180×720 | alpha | dominant `#1B2A4A`, `#7F93B3` with antialias shades | `8238bc4eb7fc628f7f2aa7b30d3499380fc024d51e5752ab37e9e01a47648bdd` | One legacy document-template reference was found. The source directory is not a Git repository; file timestamp is 2026-07-02. | `HOLD_PROVENANCE_UNVERIFIED`: no generator, vector source, rights record, or approval evidence found. |
| Check symbol SVG | `freepasserp4/public/icon.svg` | 512×512 / `0 0 512 512` | vector | `#1B2A4A`, `#FFFFFF` | `5863db6b1515691ce31fe2ad7523ffbdc7978bdbe3040f32838226f978957096` | Used by PWA metadata, electronic-signature UI, product-photo UI, and deterministic coordinate checks. Current check-symbol form recorded by commit `c6b135bbec80d2ffb605a2ca1f68ad329196024f` on 2026-08-23. | `HOLD_FAMILY_BINDING_UNVERIFIED`: strong product-use evidence, but no authoritative package binds it to the wordmark. |
| Check symbol PNG 192 | `freepasserp4/public/icon-192.png` | 192×192 | alpha channel | `#1B2A4A`, `#FFFFFF` plus antialias shades | `1cd6ccbd40b1d1f26db4914a8cbe308e417e56e3e097bc21a30b6ed8b14e38b3` | Generated from `public/icon.svg` by `scripts/build-icons.mjs`. | `HOLD_DERIVED_FROM_CANDIDATE` |
| Check symbol PNG 512 | `freepasserp4/public/icon-512.png` | 512×512 | alpha channel | `#1B2A4A`, `#FFFFFF` plus antialias shades | `c9608bef6addc8cf3d3436f17b99cc7bc28a26cfa5c22aeb814bcf239474011a` | Generated from `public/icon.svg` by `scripts/build-icons.mjs`. | `HOLD_DERIVED_FROM_CANDIDATE` |
| Check symbol maskable PNG | `freepasserp4/public/icon-maskable-512.png` | 512×512 | alpha channel | `#1B2A4A`, `#FFFFFF` plus antialias shades | `83b1d6dc59adadfd36eee5b2133ccae2fa22c626a9324e80787e9581362b9164` | Generated with a navy safe zone by `scripts/build-icons.mjs`. | `HOLD_DERIVED_FROM_CANDIDATE` |

The files in `assets/candidates/` match these source hashes byte-for-byte.

## Boundary findings

- `freepasserp4/public/brand/` contains partner, white-label, and vehicle-maker material. None of those files is copied into this CI Center.
- MEWCAR assets remain separate from FreePass assets.
- Welrix colors and marks remain a supplier/partner concern and are not FreePass CI.
- AI Core may reference a future approved manifest version and digest, but it does not own or merge FreePass brand masters.

## Evidence gaps that block approval

1. An authorized original design package or explicit brand-owner approval.
2. A portable outlined wordmark master.
3. Rights holder and license/redistribution evidence.
4. Approved relationship between the wordmark and check-symbol families.
5. Approved monochrome, inverse/dark, and favicon variants.
6. Final minimum-size and clear-space measurements.
