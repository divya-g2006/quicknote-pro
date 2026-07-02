# QuickNotes Dashboard

A plain JavaScript/JSX MERN app for managing notes on a corkboard-style dashboard.

## Structure

```text
quick-notes-dashboard/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteEditorModal.jsx
│   │   │   ├── NoteReadModal.jsx
│   │   │   └── Header.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── api.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── models/
│   │   └── Note.js
│   ├── routes/
│   │   └── notes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Setup

1. Install dependencies at the root, client, and server:
   ```bash
   npm install
   npm install --prefix client
   npm install --prefix server
   ```
2. Copy the server environment example and add your MongoDB Atlas URI:
   ```bash
   copy server/.env.example server/.env
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

The client runs on http://localhost:5173 and the server on http://localhost:5000.
