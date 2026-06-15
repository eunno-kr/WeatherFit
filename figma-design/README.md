# WeatherFit Figma Design Version

Figma file: https://www.figma.com/design/YTit1nabjJQtA9p2nF8lPj

This folder contains a copied, runnable version of WeatherFit with the Figma design direction applied. The original files in `D:\WeatherFit` are kept unchanged.

## How To Run

Option 1:

```powershell
cd D:\WeatherFit\figma-design
npm.cmd run dev
```

Option 2:

Double-click:

```text
D:\WeatherFit\figma-design\start-figma-weatherfit.bat
```

Then open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5175/
```

The Figma design version is fixed to port `5175` so it does not conflict with the original WeatherFit app on `5173`.

## Figma Sections

- Cover
- User Flow
- Design System
- Profile Setup Screen
- Main Recommendation Screen
- Wardrobe Panel
- Mobile View

## Design Direction

- Keep the strong WEATHERFIT wordmark.
- Warm paper background, thin editorial borders, minimal fashion curation tone.
- Use clear color chips and plain Korean explanations for fashion terms.
- Separate general weather recommendation from personal wardrobe-based recommendation.

## Local Project Structure

```text
figma-design/
├─ README.md
├─ start-figma-weatherfit.bat
├─ package.json
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
└─ src/
   ├─ App.jsx
   ├─ index.css
   ├─ components/
   ├─ data/
   └─ lib/
```
