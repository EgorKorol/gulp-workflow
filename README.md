# Workflow for development

## Setup

```bash
# Clone or download this repository
git clone https://github.com/EgorKorol/gulp-workflow.git

# Install dependencies
npm i
```

## Commands

```bash
# Start development
npm start

# Build for production with minification
npm run build

# Minify all your images
npm run imagemin

# Fix all eslint problems
npm run eslint:fix

# Make your code beautiful
npm run prettier:fix
```

## Before commit

Before your commit started husky script, which check and prettier your staged files

## Dependencies

- SCSS, autoprefixer, cssnano for styles
- Webpack, babel, eslint, prettier for js
- Nunjucks, htmlmin for work with HTML
- Imagemin for minify images, critical-css for optimized render
- Husky, pretty-quick, npm-run-all for precommit actions

## How to use includes files

##### Include html partials

`{% include "part.html" %}`

##### Include scss partials

`@import './scss/part';`

##### Include js partials

`import './js/module';`

## Info for multi page sites

If you want make multi page site. You should created are `other.scss`, `other.html` and `other.js` files.
P.s. doesn't forget write `other.js` file in `gulpfile.js` => `js:dev` and `js:build` => `entry`
