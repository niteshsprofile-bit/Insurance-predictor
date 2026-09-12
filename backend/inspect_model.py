import os
import sys
import joblib
import pickle
from pprint import pprint

IGNORED_DIRS = {"venv", ".venv", "node_modules", "__pycache__", ".git"}
MODEL_EXTS = (".joblib", ".pkl", ".sav", ".bin")

def is_ignored(path):
    for d in IGNORED_DIRS:
        if d in path.split(os.sep):
            return True
    return False

def find_model_files(root):
    matches = []
    for dirpath, _, files in os.walk(root):
        if is_ignored(dirpath):
            continue
        for name in files:
            if name.lower().endswith(MODEL_EXTS):
                matches.append(os.path.join(dirpath, name))
    return matches

def try_load(path):
    try:
        if path.lower().endswith(".joblib"):
            return joblib.load(path)
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        return f"ERROR loading model: {e}"

def main():
    repo_root = os.path.dirname(os.path.abspath(__file__))
    # Prefer typical model folders
    search_paths = [
        os.path.join(repo_root, "models"),
        os.path.join(repo_root, "model"),
        repo_root
    ]
    print("Searching for model files under (preferred order):")
    for p in search_paths:
        print(" -", p)
    found = []
    for p in search_paths:
        if os.path.exists(p):
            found.extend(find_model_files(p))
    # fallback to repo_root if none found in preferred
    if not found:
        found = find_model_files(repo_root)
    if not found:
        print("No model files found. Expected locations: backend/models/ or backend/model.joblib")
        sys.exit(1)
    for m in found:
        print("\nFound model file:", m)
        obj = try_load(m)
        if isinstance(obj, str):
            print(obj)
            continue
        print("Model Python type:", type(obj))
        try:
            if hasattr(obj, "get_params"):
                print("get_params() ->")
                pprint(obj.get_params())
        except Exception as e:
            print("Could not get params:", e)
        if hasattr(obj, "feature_importances_"):
            print("Feature importances (first 10):")
            print(obj.feature_importances_[:10])
        if hasattr(obj, "coef_"):
            print("Coefficients (first 10):")
            print(obj.coef_[:10])
    print("\nDone.")

if __name__ == "__main__":
    main()