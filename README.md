This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Code style and themes

Run `npm run format` to format the project, `npm run format:check` to check
formatting, and `npm run lint` for ESLint checks. Prettier uses two spaces, double
quotes, semicolons, trailing commas, and LF line endings. EditorConfig provides
the same whitespace defaults in editors. Generated files and local Supabase
files are excluded from formatting. CI checks formatting, lint, and types.

Use the semantic Tailwind colors defined in `app/globals.css`: `bg-background`
for pages, `bg-card` and `text-card-foreground` for panels, `border-border` for
borders, `text-muted-foreground` for secondary text, and `primary` for actions.
Update the `:root` and `.dark` variables together when changing the palette.
Image overlays intentionally keep black backgrounds and white text for contrast
over photographs. Theme-specific header images remain supported.
