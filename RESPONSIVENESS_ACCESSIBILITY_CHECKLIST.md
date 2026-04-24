# Responsiveness & Accessibility Checklist

This checklist documents the responsive and accessibility improvements made in the admin dashboard.

## Pages to verify

- `Dashboard`
  - Stats cards stack on mobile
  - Charts have default zero states when data is missing
- `Content`
  - TOS/Privacy/Help editor cards scroll internally while header remains visible
  - Editor text areas retain padding and responsive height
- `Users`
  - Filters are full-width on mobile
  - Table scrolls horizontally on small screens
  - Clickable rows support keyboard activation
- `Support`
  - Table subject text truncates with consistent widths
  - Desktop rows support keyboard `Enter`/`Space`
  - Mobile cards remain readable and accessible
- `Match` / `EditMatch`
  - Form layout is responsive
  - Icon buttons meet touch target sizing
  - Save action remains visible and accessible
- `Settings`
  - Sidebar tabs are buttons with accessible focus states
  - Form inputs are full-width in narrow layouts

## UI primitives to verify

- `src/components/ui/table.tsx`
  - Added mobile padding around table wrapper
  - Added focus-visible ring styles for focusable rows
- `src/components/ui/dropdown-menu.tsx`
  - Replaced nonstandard `min-w-32` with `min-w-[128px]`
- `src/components/ui/pagination.tsx`
  - Replaced nonstandard `min-w-8` with `min-w-[32px]`
- `src/components/ui/button.tsx`
  - Touch target sizing verified for `default`, `sm`, and icon buttons

## Key accessibility fixes

- Added keyboard activation for rows in `SupportTable` and `UserRow`
- Increased icon-only button hit areas in review and action menus
- Added focus-visible rings on table rows and buttons

## Manual test steps

1. Open on mobile widths (320px–768px):
   - Verify filter fields and content cards expand full width
   - Verify tables horizontally scroll when needed
2. Open on desktop widths:
   - Tab through table rows and menu triggers
   - Press `Enter` or `Space` on clickable rows to activate them
3. Confirm default chart cards render zero state copies when data is empty
4. Check that editor card headers remain visible while content scrolls internally

## Notes

- The repo uses Tailwind utilities and custom component wrappers; pay attention to `className` updates in custom components.
- More detailed QA can be performed with browser devtools and keyboard-only navigation.
