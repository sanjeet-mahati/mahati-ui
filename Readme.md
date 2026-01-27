# Mahati UI Components - Development & Publishing Guide

Complete guide for developing, testing, and publishing the Mahati UI Components library.

## 📁 Project Structure

```
uicomponents/
   ├── library/          # Main library (publishable package)
   │   ├── src/
   │   │   ├── components/    # React components
   │   │   └── index.ts       # Main export file
   │   ├── dist/              # Build output (generated)
   │   ├── package.json
   │   ├── tsconfig.json
   │   └── tsup.config.ts
   │
   └── testbed/               # Testing/demo application
       ├── src/
      │   └── app/
       ├── package.json
       └── next.config.js

---

## 🚀 Quick Start

### 1. Initial Setup

install individually
cd packages/library
npm install

cd ../testbed
npm install
```

---

## 🔧 Development Workflow

### Option A: Using Yalc (Local Development) ⭐ RECOMMENDED

Yalc creates a local npm-like registry for testing your library locally without publishing.

#### **Setup Yalc (One-time)**

```bash
# Install yalc globally
npm install -g yalc

#### **Daily Development Workflow**
**Window 1 - Library(UICOmponents):**
cd packages/uicomponents

# Watch mode - auto-rebuild and publish to yalc on changes
npm run dev:yalc

# This runs: tsup (watch) + yalc publish --push
# Every time you save a file, it rebuilds and updates testbed automatically
```

**Window 2 - Client(Communicaionhub):**

# First time: Link the library
npm run use:yalc(this will add local build of ui components)

# Run testbed
npm run dev
# Mandatory step*******************************
 once local development done, please run this command npm run use:npm(before pushing your code)
# Open: http://localhost:3000
```

#### **How it Works:**

```
1. You edit: packages/uicomponents/src/components/Button.tsx
2. tsup detects change → rebuilds to dist/
3. yalc publishes → updates testbed's node_modules
4. client/chub hot-reloads → you see changes instantly

### Build Output Structure

```
dist/
├── index.js          # CommonJS bundle (for Node.js)
├── index.mjs         # ESM bundle (for modern bundlers)
├── index.d.ts        # TypeScript type definitions
└── [other assets]    # Any other compiled files
```

## 📦 Publishing to npm

### Pre-publish Checklist

- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] All files in `dist/` folder
- [ ] No yalc installations in testbed
- [ ] Committed and pushed to Git

---

### Publishing Process

#### **Step 1: Prepare for Publishing**

```bash
cd packages/uicomponents

# Clean previous builds
npm run clean

# Fresh build
npm run build

## **Step 2: Verify package.json**

Ensure these fields are correct:

```json
{
  "name": "@mahatisystems/mahati-ui-components",
  "version": "3.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "npm run build:js",
    "prepublishOnly": "npm run build"
  }
}
```

**The `prepublishOnly` script is CRITICAL** - it ensures build runs before publish.

#### **Step 3: Version Bump**

```bash
# Patch version (3.1.0 → 3.1.1) for bug fixes
npm version patch

# Minor version (3.1.0 → 3.2.0) for new features
npm version minor

# Major version (3.1.0 → 4.0.0) for breaking changes
npm version major

# Or set specific version
npm version 3.1.1

# This automatically:
# - Updates package.json
# - Creates a git commit
# - Creates a git tag
```

#### **Step 4: Publish**

```bash
# Login to npm (first time only)
npm login

# Publish to npm registry
npm publish

# For scoped packages (if needed)
npm publish --access public

# Verify it's published
npm view @mahatisystems/mahati-ui-components
```

#### **Step 5: Push to Git**

```bash
# Push commits and tags
git push origin main
git push origin --tags
```

---

### Post-Publish Steps

#### **Test the Published Package**

```bash
# In testbed or a fresh project
npm uninstall @mahatisystems/mahati-ui-components
npm install @mahatisystems/mahati-ui-components@latest

# Verify it works
npm run dev
```

#### **Update Documentation**

```bash
# Update CHANGELOG.md
# Add release notes
# Update README.md if API changed
```

---

## 🔄 Complete Workflow Examples

### Example 1: Daily Development

```bash
# Morning routine
cd packages/uicomponents
npm run dev:yalc          # Terminal 1

cd packages/testbed
npm run dev               # Terminal 2

# Work on components all day
# Changes auto-reload in testbed

# Evening - commit work
git add .
git commit -m "Added new Button variants"
git push
```

### Example 2: Publishing a New Version

```bash
# 1. Stop yalc development
cd packages/testbed
yalc remove @mahatisystems/mahati-ui-components

# 2. Final testing
cd packages/uicomponents
npm run build
npm test

# 3. Version bump
npm version patch

# 4. Publish
npm publish

# 5. Verify
cd ../testbed
npm install @mahatisystems/mahati-ui-components@latest
npm run dev

# 6. Push to git
git push origin main --tags
```

### Example 3: Emergency Hotfix

```bash
# 1. Create hotfix branch
git checkout -b hotfix/button-crash

# 2. Fix the bug
# ... make changes ...

# 3. Test with yalc
cd packages/uicomponents
npm run yalc:pub

cd ../testbed
npm run dev
# Verify fix works

# 4. Build and publish
cd packages/uicomponents
npm run build
npm version patch
npm publish

# 5. Merge hotfix
git push origin hotfix/button-crash
# Create PR, merge to main
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" after yalc publish

**Solution:**
```bash
cd packages/testbed
yalc remove --all
yalc add @mahatisystems/mahati-ui-components
rm -rf node_modules
npm install
```

### Issue: Changes not reflecting in testbed

**Solution:**
```bash
# In uicomponents:
npm run build

# In testbed:
yalc update
# Or force reinstall
rm -rf node_modules/@mahatisystems
yalc add @mahatisystems/mahati-ui-components --force
```

### Issue: "dist folder is empty" when publishing

**Solution:**
```bash
# Check if build script runs
npm run build

# Check package.json has prepublishOnly
# Add if missing:
"scripts": {
  "prepublishOnly": "npm run build"
}
```

### Library (uicomponents)

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run build:watch` | Watch mode build |
| `npm run dev:yalc` | Dev mode with yalc auto-push |
| `npm run yalc:pub` | Build & publish to yalc once |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run clean` | Remove dist folder |
| `npm version patch` | Bump patch version |
| `npm publish` | Publish to npm |

### Testbed

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |


### Yalc Global

| Command | Description |
|---------|-------------|
| `yalc installations list` | List all yalc installations |
| `yalc installations clean` | Clean all installations |
| `yalc publish` | Publish package to yalc store |
| `yalc push` | Publish and update all links |

---

## 🎯 Best Practices

### 1. **Always use yalc for local development**
   - Faster than npm link
   - More reliable
   - Mimics actual npm install

### 2. **Never commit yalc files**
   ```
   .yalc/
   yalc.lock
   ```
   Add these to .gitignore

### 4. **Use semantic versioning**
   - MAJOR: Breaking changes (4.0.0)
   - MINOR: New features (3.2.0)
   - PATCH: Bug fixes (3.1.1)

### 6. **Test before publishing**
   npm run build
   npm pack --dry-run
   # Verify output looks correct
   npm publish
 

**Last Updated:** January 26 2026  
**Maintainers:** Mahati Systems Team(Divya Korukanti)