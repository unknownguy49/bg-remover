# Virtual Background Remover

## Description

This project consists of a **frontend** built with Next.js and a **backend** that handles background removal functionality. It allows users to upload images and remove the background using the backend API.

---

## Live Demo

You can view the live version of the app by visiting the following link:

[Live Demo](https://bgremover-delta.vercel.app/)

---

## View Locally

### 1. Backend Setup (FastAPI)

#### Local Backend Setup:

To run the backend locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/unknownguy49/bg-remover
cd bg-remover
```

or <br>
`Download ZIP from the repository.`

2. Install dependencies (ensure Python is installed):

```bash
pip install -r requirements.txt
```

3. Start the backend API:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

This will run the backend locally on `http://localhost:8000`.

---

### 2. Frontend Setup (Next.js)

If you'd like to run the frontend locally using **Next.js**, follow the steps below.

#### Prerequisites:

- Ensure you have **Node.js** installed. You can verify by running:

```bash
node -v
```

- Ensure you have **npm** installed. You can verify by running:

```bash
npm -v
```

#### Steps to Run Frontend:

1. Install dependencies:

```bash
npm i --force
```

2. Run the development server:

```bash
npm run dev
```

The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Additional Information

- **Backend**: The backend is designed to handle image uploads, remove the background, and return the processed image.
- **Frontend**: The frontend allows users to interact with the backend and upload images for background removal.

---
