# PawNotes Mobile Landing Page — Design QA

## Evidence

- Source visual truth: user-provided 562 × 399 px landscape reference image in the conversation (orange mascot-led `404` page).
- Implementation: `artifacts/pawnotes-home-mobile-393x852.jpg`.
- Interaction evidence: `artifacts/pawnotes-menu-mobile-375x667.jpg`.
- Primary viewport: 393 × 852 CSS px, device scale factor 1, English locale, menu closed.
- Compact viewport: 375 × 667 CSS px, device scale factor 1, English locale, menu closed and open.
- Density normalization: implementation captures are exactly 1 CSS pixel per output pixel. The source is landscape while the requested implementation is intentionally portrait and mobile-first, so comparison is based on hierarchy, art direction, and relative composition rather than identical coordinates.
- Browser-rendered evidence: Chrome local preview at `http://localhost:3000/en`.
- Browser console: no warnings or errors on the final clean page load.
- Runtime overlays excluded from findings: the Next.js development badge and the browser translation-extension badge are not product UI.

## Full-View Comparison

The implementation preserves the reference’s defining hierarchy: orange tactile background, oversized low-contrast display lettering, a centered 3D mascot overlapping the lettering, minimal floating navigation, and concise copy beneath the character. The original `404` content has been appropriately replaced by `PAW` and PawNotes product copy.

The portrait composition is intentionally reflowed for phone use. Navigation sits within the top safe area, the mascot owns the central touch target, and the 56 px primary CTA remains fully visible at the bottom without page scrolling at both tested mobile heights.

## Focused Region Comparison

- Hero and mascot: the existing Lottie character remains sharp and animated, has no card or circular container, and overlaps the oversized `PAW` lettering in the same visual manner as the reference mascot overlaps `404`.
- Navigation: the compact brand lockup and high-contrast menu pill retain the reference’s floating-control feel while providing 44 px minimum touch targets.
- CTA region: the title, subtitle, and full-width white action pill form a thumb-friendly bottom action zone. The compact 375 × 667 capture confirms the CTA remains visible without overflow.
- Menu state: the 375 × 667 interaction capture confirms the sheet, close control, four navigation rows, backdrop, and bottom CTA are visually complete and usable.

## Required Fidelity Surfaces

- Fonts and typography: passed. Geist’s heavy weight, tight display tracking, uppercase micro-label, and high-contrast hierarchy match the playful premium direction. Copy remains readable at both tested phone sizes.
- Spacing and layout rhythm: passed. Safe-area padding, 44 px navigation controls, 56 px CTA, centered mascot, and full-height composition are consistent. No horizontal or vertical document overflow was detected.
- Colors and visual tokens: passed. The generated low-contrast orange paper texture, cream `PAW` lettering, white copy, and dark-orange controls closely track the reference palette without introducing unrelated gradients.
- Image quality and asset fidelity: passed. The supplied Lottie remains the hero asset and renders without a white container or transparency halo. The WebP background texture is 18 KB and visually clean.
- Copy and content: passed. Error-page-specific `404` messaging was not copied; the page uses the existing localized PawNotes title, subtitle, and CTA.

## Interaction and Accessibility Checks

- Menu opens and reports `aria-expanded="true"`.
- Body scrolling locks while the menu is open.
- Escape closes the menu and restores body scrolling.
- Hidden menu controls are removed from the tab order.
- The primary CTA navigates successfully from `/en` to `/en/app`.
- Both static assets return HTTP 200.
- Focus-visible rings and minimum touch sizes are present on primary controls.

## Comparison History

### Iteration 1

- Finding: `[P1]` The initial 393 × 852 implementation obscured too much of the background word, weakening the reference’s oversized-letter composition.
- Fix: increased the mobile word size from `32vw` to `46vw`, reduced mascot width from `92vw` to `86vw`, and lowered the mascot slightly.
- Post-fix evidence: `artifacts/pawnotes-home-mobile-393x852.jpg` shows `P`, `A`, and `W` clearly extending around the character.

No actionable P0, P1, or P2 findings remain.

## Follow-up Polish

- `[P3]` A future custom display typeface could bring the `PAW` letterforms even closer to the reference, but the current Geist treatment is coherent with the existing application and does not block delivery.

## Final Result

final result: passed
