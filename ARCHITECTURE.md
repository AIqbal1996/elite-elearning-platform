# Architecture Blueprint

## Static-first flow

```txt
Excel / CSV files
  ↓
Data import script
  ↓
Normalized JSON
  ↓
Service layer
  ↓
Reusable React components
  ↓
Static deployment
```

## Folder responsibilities

- `public/data/raw`: source Excel/CSV files
- `public/data/generated`: normalized JSON for runtime
- `scripts/import-data.mjs`: converts Excel/CSV into JSON
- `src/data`: API-ready data service layer
- `src/components`: reusable UI components
- `src/pages`: route-level page experiences
- `src/styles`: design tokens and full UI styling

## UI mapping

- Course catalogue → course cards, filters, learning paths
- Training sheet → course duration, track labels, external CTAs
- Python/SQL sheets → syllabus accordions
- HackerRank assessments → assessment matrix with difficulty badges
- Pilots → portfolio/use-case showcase
- Global Courses CSV → expanded master course list and secondary resources
