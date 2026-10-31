# cipher_ref contribution rules

- Keep `src/core` independent from game content.
- Modules may import `src/contracts.ts` and `src/core`, but not one another's private files.
- Content belongs in `src/content`; modules turn content into runtime objects.
- Keep the starter asset-free. Use procedural geometry or openly licensed assets with attribution.
- Run `npm run verify` before publishing.
