# Medication Database

A searchable web database for medications and conditions with links to research papers and case studies.

## Features

- Search medications by name, generic name, or description
- Search conditions by name or symptoms
- Filter by category (Antibiotic, Pain Relief, Psychiatric, etc.)
- View medication details with related conditions
- View condition details with treatment options
- Effectiveness ratings for medication-condition pairs
- Links to research papers and case studies
- Responsive design for desktop and mobile

## Prerequisites

- Node.js 16+ and npm

## Installation

1. Clone or extract the project:
```bash
cd medication-db
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
cd server
npm start
# Server will run on http://localhost:5000
```

### Terminal 2 - Start Frontend Development Server
```bash
cd client
npm run dev
# Frontend will run on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## Project Structure

```
medication-db/
├── server/
│   ├── db/
│   │   ├── schema.sql       # Database schema
│   │   ├── seeds.json       # Initial data (50+ medications/conditions)
│   │   └── medications.db   # SQLite database (auto-created)
│   ├── server.js            # Express server & API routes
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/medications` - List medications (with search, category filter, pagination)
- `GET /api/medications/:id` - Get medication details with related conditions
- `GET /api/conditions` - List conditions (with search, category filter)
- `GET /api/conditions/:id` - Get condition details with treatment medications
- `GET /api/search` - Cross-search medications and conditions
- `GET /api/categories` - Get all available categories

## Database

SQLite database automatically created on first run with:
- Medications table (50+ entries)
- Conditions table (35+ entries)
- MedicationUses table (relationships between medications and conditions)
- ResearchLinks table (links to PubMed, NIH, and case studies)

## Data

Initial seed data includes:
- **Medications**: Antibiotics, Antihistamines, Pain relievers, Antidepressants, Anticonvulsants, etc.
- **Conditions**: Infections, Allergies, Arthritis, Depression, Diabetes, Hypertension, Asthma, etc.
- **Research Links**: 16+ links to peer-reviewed papers and case studies

## Testing

1. Search for a medication (e.g., "Amoxicillin")
2. Click on a medication to see conditions it treats
3. Click on a condition to see treatment options
4. View research papers and external links
5. Try filtering by category

## Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Railway/Render)
Deploy the server/ directory to Railway or Render with Node.js buildpack.

Set environment variable: `PORT=5000`

## Disclaimer

**Educational purposes only.** This database is not a substitute for professional medical advice. Always consult with qualified healthcare professionals before starting any medication or treatment. Research links are for educational reference only.

## License

MIT
