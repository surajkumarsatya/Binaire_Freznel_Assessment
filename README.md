# Binaire Freznel Assessment

A multi-user CSV processing application that allows users to upload CSV files with different priorities and processes them using a priority-based job queue and Node.js Worker Threads.

## Features

- Upload multiple CSV files
- Assign HIGH or LOW priority to each file
- Priority-based job queue
- Process CSV files using Node.js Worker Threads
- Calculate the sum of all numeric values in a CSV
- Generate a unique Process ID for every uploaded file
- Show job status and processing progress
- Poll the backend to get updated job status
- Handle invalid and empty CSV files
- Responsive React UI

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Multer
- csv-parse
- Worker Threads

## Project Structure

```
Binaire_Freznel_Assessment/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── UploadSection.tsx
│       │   ├── JobCard.tsx
│       │   └── QueueSection.tsx
│       │
│       ├── types/
│       │   └── job.ts
│       │
│       ├── App.tsx
│       ├── App.css
│       └── index.css
│
├── server/
│   └── src/
│       ├── routes/
│       │   └── job.routes.ts
│       │
│       ├── services/
│       │   ├── jobQueue.ts
│       │   └── jobProcessor.ts
│       │
│       ├── workers/
│       │   └── csv.worker.ts
│       │
│       ├── types/
│       │   └── job.ts
│       │
│       └── server.ts
│
└── README.md
```

## How It Works

### 1. File Upload

The user selects one or more CSV files from the frontend.

Each file can independently be assigned:
- HIGH priority
- LOW priority

When the user clicks **Upload & Queue**, each file is sent to the backend.

### 2. Job Creation

The backend creates a job for every uploaded file.

Each job contains:
- Process ID
- File name
- File path
- Priority
- Status
- Progress
- Result

The job is then added to the in-memory queue.

### 3. Priority Queue

The queue checks for HIGH priority jobs first.

If a HIGH priority job is available, it is processed before a LOW priority job.

If there are no HIGH priority jobs, the next LOW priority job is processed.

### 4. Worker Thread Processing

CSV processing is handled using Node.js Worker Threads.

The worker:
1. Reads the CSV file
2. Processes the rows
3. Checks numeric values
4. Adds all numeric values
5. Sends progress updates to the main thread
6. Returns the final sum

This keeps the CSV processing separate from the main server thread.

### 5. Progress Updates

The frontend polls the backend every second using:

```
GET /api/jobs/:id
```

The backend returns the current job status and progress.

The UI displays statuses such as:
- `QUEUED`
- `PROCESSING`
- `COMPLETED`
- `FAILED`

### 6. Final Result

After processing is completed, the worker sends the calculated sum back to the server.

The result is then displayed in the UI.

## API

### Upload CSV

```
POST /api/jobs/upload
```

Form data:
- `file`: CSV file
- `priority`: `HIGH` | `LOW`

Example response:

```json
{
  "message": "File added to queue",
  "job": {
    "id": "process-id",
    "fileName": "sample.csv",
    "priority": "HIGH",
    "status": "QUEUED",
    "progress": 0
  }
}
```

### Get Job Status

```
GET /api/jobs/:id
```

Example response:

```json
{
  "job": {
    "id": "process-id",
    "fileName": "sample.csv",
    "priority": "HIGH",
    "status": "COMPLETED",
    "progress": 100,
    "result": 844
  }
}
```

## Deadlock Handling

The application uses a simple queue and processes one job at a time.

A single Worker Thread processes the current job. The next job starts only after the current job is completed or fails.

This avoids multiple workers waiting for each other or competing for the same shared resource.

In a larger system with multiple workers and shared resources, improper resource locking could cause deadlocks and prevent jobs from progressing.

## Error Handling

The backend validates uploaded files before adding them to the queue.

The application handles:
- No file uploaded
- Non-CSV files
- Invalid priority
- Empty CSV files
- CSV files without numeric values
- CSV processing errors
- Worker errors

Failed jobs are marked with `FAILED`.

## Running the Project

### Backend

Go to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

### Frontend

Open another terminal and go to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL shown by Vite.

## Example

For a CSV containing:

```
23,3
76,98,56
445,90,1,52
```

The application processes all numeric values and returns:

```
844
```

## Design Decisions

The project intentionally uses a simple in-memory queue instead of introducing additional infrastructure such as Redis, BullMQ, or a database.

Polling is used for job status updates instead of WebSockets.

This keeps the implementation focused on the main requirements:
- Priority-based queueing
- Worker Thread processing
- Progress tracking
- Multi-file handling