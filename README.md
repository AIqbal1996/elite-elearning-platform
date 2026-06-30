# CogniLearn - Premium Static E-Learning Platform

A Coursera-inspired static e-learning platform built with React + Vite. It is powered by the uploaded Excel/CSV files but structured so the JSON data layer can later be replaced with API calls.

## Data Sources

Raw files live in:

```txt
public/data/raw/
├── Courses.xlsx
├── Courses.csv
├── Hacker_Rank_assessments.xlsx
└── Pilots.xlsx
```

Generated data lives in:

```txt
public/data/generated/
├── courses.json
├── learning-paths.json
├── assessments.json
├── pilots.json
├── syllabus-python.json
├── syllabus-sql.json
└── stats.json
```

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

## Build for deployment

```bash
npm run build
npm run preview
```

## Regenerate JSON after replacing Excel/CSV files

Place updated files in `public/data/raw/`, then run:

```bash
npm run import:data
```

## Future API migration

Currently the UI reads from `src/data/learningService.js` using static JSON:

```js
fetch('/data/generated/courses.json')
```

When backend APIs are ready, only replace this service layer with API calls. The pages and UI components can remain almost unchanged.

## Design system

The UI uses a trust-first Coursera-style palette:

- Deep blue authority palette
- White/light gray card surfaces
- Skill, duration, difficulty, and completion badges
- Search, filters, tabs, and accordions to reduce cognitive load
"# elite-elearning-platform" 
