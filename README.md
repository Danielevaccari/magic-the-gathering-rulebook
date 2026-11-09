# Magic: The Gathering Rulebook

A searchable rulebook for the Magic: The Gathering Comprehensive Rules. Browse by chapter, search every rule with highlighted matches, and follow links between rules. Dark glass UI, responsive down to phones.

Built with Next.js 16 and React 19. Every chapter is prerendered as static HTML; the rules are downloaded and parsed once at build time.

## Run locally

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm test`.

## Updating the rules

When Wizards publishes a new version (https://magic.wizards.com/en/rules), update `RULES_URL` in `scripts/build-rules.mjs` (or set the `RULES_URL` environment variable) and rebuild.

## Shortcuts

- `/` focus search
- `Esc` clear search / close the chapter drawer
