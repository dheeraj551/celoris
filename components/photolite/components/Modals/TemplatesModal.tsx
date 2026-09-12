// The PhotoLite "Canva-Style Design Templates" feature has been removed from
// the product (see components/photolite/App.tsx) because we can't support it
// right now. This component is no longer imported or rendered anywhere.
//
// It's kept as an inert stub (instead of being deleted) so that:
//   1. Next.js's project-wide type-check doesn't fail on dead code changes.
//   2. The original implementation can be restored from git history if the
//      Templates feature is ever revived — the underlying template data is
//      still intact in components/photolite/data/templates.ts.
//
// Safe to delete this file entirely with `git rm` if you'd rather clean it up.

export const TemplatesModal = () => null;
