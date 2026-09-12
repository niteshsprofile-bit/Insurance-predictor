class InsurancePredictionModel:
    """Rule-based insurance prediction model with 10 health factors."""
    
    def __init__(self):
        self.base_charge = 2500

    def predict(self, data: dict) -> float:
        """Calculate insurance charges based on input data."""
        charge = self.base_charge

        # Age Factor
        age = int(data.get("age", 30))
        if age < 18:
            age_factor = 0.5
        elif age < 30:
            age_factor = 0.8
        elif age < 45:
            age_factor = 1.0
        elif age < 60:
            age_factor = 1.5
        else:
            age_factor = 2.0
        charge += 200 * age * age_factor

        # BMI Factor
        height_cm = float(data.get("height", 170))
        weight_kg = float(data.get("weight", 70))
        height_m = height_cm / 100.0
        bmi = weight_kg / (height_m ** 2) if height_m > 0 else 0

        if bmi < 18.5:
            bmi_multiplier = 0.8
        elif bmi < 25:
            bmi_multiplier = 1.0
        elif bmi < 30:
            bmi_multiplier = 1.3
        elif bmi < 35:
            bmi_multiplier = 1.6
        else:
            bmi_multiplier = 2.0
        charge += 1000 * bmi_multiplier

        # Blood Pressure Factor
        bp = float(data.get("blood_pressure", 120))
        if bp < 120:
            bp_charge = 0
        elif bp < 130:
            bp_charge = 500
        elif bp < 140:
            bp_charge = 1000
        else:
            bp_charge = 2000
        charge += bp_charge

        # Sugar Level Factor
        sugar = float(data.get("sugar_level", 100))
        if sugar < 100:
            sugar_charge = 0
        elif sugar < 126:
            sugar_charge = 800
        else:
            sugar_charge = 2500
        charge += sugar_charge

        # Smoker Factor
        smoker = bool(data.get("smoker", False))
        if smoker:
            charge += charge * 0.4

        # Gender Factor
        gender = str(data.get("gender", "")).lower()
        if gender == "female":
            charge += 300
        elif gender in ["others", "other"]:
            charge += 100

        # Children Factor
        children = int(data.get("children", 0))
        charge += children * 600

        # Region Factor
        region = str(data.get("region", "northeast")).lower()
        region_multipliers = {
            "northeast": 1.0,
            "northwest": 0.95,
            "southeast": 1.1,
            "southwest": 0.9,
        }
        charge *= region_multipliers.get(region, 1.0)

        # Previous Medical History
        history = str(data.get("previous_medical_history", "")).lower()
        if any(key in history for key in ["cancer", "tumor", "dialysis", "heart attack"]):
            charge += 15000
        elif "surgery" in history:
            charge += 5000

        # Family History
        family = str(data.get("family_medical_history", "")).lower()
        if family not in ["", "nil", "none", "no", "na", "n/a"]:
            charge += 7000

        return round(charge, 2)


# Create global model instance
model = InsurancePredictionModel()
