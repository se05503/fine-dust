# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fine Dust is a React Native/Expo mobile application targeting iOS and Android platforms. The project uses Expo Router for file-based navigation and NativeWind (TailwindCSS) for styling.

## Development Commands

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Linting and formatting
npm run lint     # Check ESLint + Prettier
npm run format   # Auto-fix ESLint + Prettier

# Generate native projects
npm run prebuild
```

## Architecture

### Tech Stack
- **Framework**: Expo SDK 54 with React 19
- **Navigation**: Expo Router (file-based routing in `app/` directory)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: Zustand

### Project Structure
- `app/` - File-based routes (Expo Router). `_layout.tsx` is the root layout with Stack navigator
- `components/` - Reusable UI components
- `store/` - Zustand state stores
- `assets/` - Images and static assets

### Path Aliases
The project uses `@/*` path alias mapping to the root directory (configured in `tsconfig.json`).

### Styling Pattern
Components use a local `styles` object with TailwindCSS class strings:
```tsx
const styles = {
  container: 'flex flex-1 bg-white',
};
// Usage: className={styles.container}
```
