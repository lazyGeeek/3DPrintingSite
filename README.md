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
Tailwind CSS v4 exposes these tokens through `@theme inline`. `next-themes`
switches the `light` and `dark` classes on `<html>`; the `.dark` palette updates
the same utilities automatically. Use Tailwind's `dark:` variant for differences
beyond token values, such as header images and gradient opacity. Background
accents use Tailwind radial-gradient and color-stop utilities.
The full light and dark scales live in `app/theme-palette.css`, generated with
[Radix's custom palette tool](https://www.radix-ui.com/colors/custom?accent-light=4F46E5&accent-dark=4F46E5&bg-light=F8F9FA&bg-dark=040E2F).
The URL leaves the neutral reference at Radix's default `#8B8D98`. Semantic roles
in `app/globals.css` map those scales to surfaces (gray 2), muted backgrounds
(gray 3), borders (gray 6), secondary text (gray 11), body text (gray 12), solid
actions (accent 9), action hover (accent 10), and accent text (accent 11).
Use `text-primary-text` for links and `bg-primary-hover` for action hover states.
Radix red remains reserved for destructive actions and validation errors.
Photo overlays use the navy `image-overlay` and white `image-foreground` tokens
in both themes to keep text legible over photographs. Theme-specific header
images remain supported.
