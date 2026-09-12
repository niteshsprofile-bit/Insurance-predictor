# Medical Insurance Predictor

**Medical Insurance Predictor** is a simple full-stack project that provides an interactive React frontend for collecting user health information and a FastAPI backend that returns an estimated annual insurance charge (quote) based on that data.

**Contents**
- `backend/` — FastAPI server, model code and requirements
- `frontend/` — React app (CRA) that collects inputs and displays results

**Key features**
- Interactive multi-step form for user health input (age, height, weight, BMI, blood pressure, sugar level, smoker, children, region).
- Backend prediction endpoint: `POST /predict` which returns an estimated charge and health summary.
- Lightweight model code (see `backend/model.py`) — can be retrained or replaced with any regression model.

**Dataset**
- Primary public dataset used: "Medical Cost Personal Dataset" (commonly available on Kaggle as `insurance.csv`) — link: https://www.kaggle.com/datasets/mirichoi0218/insurance
  - This dataset includes common fields: `age`, `sex`, `bmi`, `children`, `smoker`, `region`, and `charges` (the target insurance charge).
- Project-specific notes: The frontend collects a few additional vitals (e.g., `blood_pressure`, `sugar_level`) that are not present in the original Kaggle CSV. For demo and model-training purposes the dataset was augmented / simulated with plausible vitals to match the form inputs. If you plan to reproduce training results, either augment the dataset the same way or retrain using your real dataset.

If you will present this project externally, say: "Model was trained on the public 'Medical Cost Personal Dataset' (Kaggle) and augmented with simulated vitals to match the app's inputs." Be explicit if you used a different or private dataset.

**API (backend)**
- Base URL (development): `http://localhost:8000`
- POST `/predict`
  - Request JSON (example):
    ```json
    {
      "age": 35,
      "gender": "male",
      "height": 170,
      "weight": 72,
      "blood_pressure": 120,
      "sugar_level": 95,
      "children": 1,
      "smoker": false,
      "region": "northeast"
    }
    ```
  - Response JSON (example):
    ```json
    {
      "predicted_charges": 15342.23,
      "bmi": 24.91
    }
    ```

**Run locally (recommended)**

- Backend (Python / FastAPI)
  1. Create and activate a venv (Windows PowerShell):
     ```powershell
     cd backend
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     pip install --upgrade pip
     pip install -r requirements.txt
     ```
  2. Start the server (example with Uvicorn):
     ```powershell
     uvicorn app:app --reload --port 8000
     ```
  3. The API docs are usually available at `http://127.0.0.1:8000/docs` (if FastAPI docs enabled).

- Frontend (React)
  1. Open a new terminal, change to the frontend folder and install dependencies:
     ```powershell
     cd frontend
     npm install
     npm start
     ```
  2. The CRA dev server opens in your browser (default `http://localhost:3000`). If port 3000 is busy the CLI will prompt to use a different port — choose `Y` to run on the alternate port (e.g. 3001).

**Development notes & troubleshooting**
- CSS / import casing: On case-insensitive systems (Windows) this can still surface in tooling; imports must match file names exactly. If you see errors like "does not match the corresponding name on disk", check import paths and file-case.
- Linting errors: If you converted files from TypeScript syntax to plain JS, remove any leftover type annotations (e.g., `: string | null`) or set up TypeScript properly.
- If the frontend shows a blank page, ensure `public/index.html` contains a `<div id="root"></div>` for React to mount.
- If port 3000 is taken, press `Y` when prompted to run on a different port, or stop the process using port 3000.

**Where to change the model**
- `backend/model.py` — contains model creation/loading logic. If you replace or retrain the model, update the prediction code in `backend/app.py` to load the new artifact.

**Acknowledgements & datasets**
- Dataset: "Medical Cost Personal Dataset" (Kaggle) — https://www.kaggle.com/datasets/mirichoi0218/insurance
- Libraries: FastAPI, Uvicorn, scikit-learn (if used), React, Create React App.

**Contact / next steps**
- If you want, I can:
  - Add a `DATA.md` describing the augmentation steps used to create `blood_pressure` and `sugar_level` columns.
  - Add a small `TRAINING.md` describing model training code and hyperparameters.
  - Add a `Procfile` / Dockerfile for deployment.

---
Generated on: November 27, 2025
