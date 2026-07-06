# Contributing & development

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) 10 (`corepack enable` if needed)
- For Android builds: Android Studio with SDK and a JDK compatible with the project Gradle version

## Install dependencies

```bash
pnpm install
```

## Development server

Start the local dev server:

```bash
pnpm start
```

Open `http://localhost:4200/`. The app reloads when source files change.

API requests are proxied to `https://invest.aigenis.by` via `proxy.conf.json` (`/aigenis-api` → production API). Sign in with a valid Aigenis account to load portfolio data.

## Building

Production build:

```bash
pnpm build
```

Output goes to `dist/aigenis-coupons-calendar/browser/`.

Development build with watch mode:

```bash
pnpm watch
```

## Testing

Unit tests (Vitest via Angular CLI):

```bash
pnpm test
```

End-to-end tests:

```bash
ng e2e
```

Angular CLI does not ship an e2e framework by default; configure one if you add e2e coverage.

## Linting and formatting

```bash
pnpm lint
pnpm format        # write
pnpm format:check  # check only
```

## Code scaffolding

Generate a new component:

```bash
ng generate component component-name
```

List available schematics:

```bash
ng generate --help
```

## Android (Capacitor)

After a web build, sync native projects:

```bash
pnpm build
npx cap sync android
```

Open the Android project in Android Studio:

```bash
npx cap open android
```

Regenerate launcher icons and splash screens from `assets/logo.png` and `assets/splash.png`:

```bash
pnpm assets:android
```

## Additional resources

- [Angular CLI overview](https://angular.dev/tools/cli)
- [Capacitor docs](https://capacitorjs.com/docs)
- [Ionic Angular docs](https://ionicframework.com/docs/angular/overview)
