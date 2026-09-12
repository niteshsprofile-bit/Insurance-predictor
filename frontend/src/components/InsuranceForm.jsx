import React, { useState, useEffect } from 'react';

const InsuranceForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    blood_pressure: '',
    sugar_level: '',
    children: '0',
    smoker: false,
    region: 'northeast',
    previous_history_type: 'none',
    previous_history_other: '',
    family_medical_history: 'nil',
  });

  const [bmi, setBmi] = useState('');
  const [errors, setErrors] = useState({});

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height);
      const w = parseFloat(formData.weight);
      if (h > 0 && w > 0) {
        const heightM = h / 100;
        const calculated = w / (heightM * heightM);
        setBmi(calculated.toFixed(2));
      } else {
        setBmi('');
      }
    } else {
      setBmi('');
    }
  }, [formData.height, formData.weight]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const age = Number(formData.age);
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    const bp = Number(formData.blood_pressure);
    const sugar = Number(formData.sugar_level);
    const children = Number(formData.children);

    if (!age || age < 18 || age > 100) {
      newErrors.age = 'Age must be between 18 and 100.';
    }
    if (!height || height < 50 || height > 250) {
      newErrors.height = 'Height must be between 50 and 250 cm.';
    }
    if (!weight || weight < 20 || weight > 200) {
      newErrors.weight = 'Weight must be between 20 and 200 kg.';
    }
    if (!bp || bp < 60 || bp > 250) {
      newErrors.blood_pressure = 'Blood pressure must be between 60 and 250.';
    }
    if (!sugar || sugar < 50 || sugar > 500) {
      newErrors.sugar_level = 'Sugar level must be between 50 and 500.';
    }
    if (children < 0 || children > 10) {
      newErrors.children = 'Children must be between 0 and 10.';
    }

    if (
      formData.previous_history_type === 'other' &&
      !formData.previous_history_other.trim()
    ) {
      newErrors.previous_history_other =
        'Please describe your other previous medical history.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPreviousHistoryText = () => {
    const type = formData.previous_history_type;
    const otherText = formData.previous_history_other.trim();

    if (type === 'none') {
      return 'No significant previous medical history';
    }
    if (type === 'other') {
      return otherText;
    }

    // Predefined label text
    switch (type) {
      case 'major_surgeries':
        return 'Major surgeries';
      case 'dialysis':
        return 'Dialysis';
      case 'cancer':
        return 'Cancer';
      case 'brain_tumor':
        return 'Brain tumor';
      case 'heart_attacks':
        return 'Heart attacks';
      default:
        return type;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const previous_medical_history = buildPreviousHistoryText();

    const payload = {
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      blood_pressure: Number(formData.blood_pressure),
      sugar_level: Number(formData.sugar_level),
      children: Number(formData.children),
      smoker: Boolean(formData.smoker),
      region: formData.region,
      previous_medical_history,
      family_medical_history: formData.family_medical_history,
    };

    onSubmit(payload);
  };

  return (
    <div className="form-container">
      <h2>Get Your Insurance Quote</h2>
      <p className="form-subtitle">Fill in your health and history information below</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Row 1: Age & Gender */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="18-100"
              min="18"
              max="100"
            />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
              <option value="would not prefer to answer">
                Would not prefer to answer
              </option>
            </select>
          </div>
        </div>

        {/* Row 2: Height & Weight */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Height (cm) *</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="150-220"
              min="50"
              max="250"
            />
            {errors.height && <span className="field-error">{errors.height}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg) *</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="40-150"
              min="20"
              max="200"
            />
            {errors.weight && <span className="field-error">{errors.weight}</span>}
          </div>
        </div>

        {/* Row 3: BMI */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bmi">BMI (Auto-calculated)</label>
            <input
              type="number"
              id="bmi"
              value={bmi}
              readOnly
              placeholder="Calculated automatically"
            />
            {bmi && (
              <span className="bmi-info">
                {bmi < 18.5 && 'Underweight'}
                {bmi >= 18.5 && bmi < 25 && 'Normal weight'}
                {bmi >= 25 && bmi < 30 && 'Overweight'}
                {bmi >= 30 && 'Obese'}
              </span>
            )}
          </div>
        </div>

        {/* Row 4: BP & Sugar */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="blood_pressure">Blood Pressure (Systolic) *</label>
            <input
              type="number"
              id="blood_pressure"
              name="blood_pressure"
              value={formData.blood_pressure}
              onChange={handleInputChange}
              placeholder="80-200"
              min="60"
              max="250"
            />
            {errors.blood_pressure && (
              <span className="field-error">{errors.blood_pressure}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sugar_level">Sugar Level (mg/dL) *</label>
            <input
              type="number"
              id="sugar_level"
              name="sugar_level"
              value={formData.sugar_level}
              onChange={handleInputChange}
              placeholder="70-200"
              min="50"
              max="500"
            />
            {errors.sugar_level && (
              <span className="field-error">{errors.sugar_level}</span>
            )}
          </div>
        </div>

        {/* Row 5: Children & Smoker */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="children">Number of Children *</label>
            <input
              type="number"
              id="children"
              name="children"
              value={formData.children}
              onChange={handleInputChange}
              placeholder="0-10"
              min="0"
              max="10"
            />
            {errors.children && (
              <span className="field-error">{errors.children}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="smoker">
              <input
                type="checkbox"
                id="smoker"
                name="smoker"
                checked={formData.smoker}
                onChange={handleInputChange}
              />
              <span>Are you a smoker?</span>
            </label>
          </div>
        </div>

        {/* Row 6: Region */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="region">Region *</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
            >
              <option value="northeast">Northeast</option>
              <option value="northwest">Northwest</option>
              <option value="southeast">Southeast</option>
              <option value="southwest">Southwest</option>
            </select>
          </div>
        </div>

        {/* Row 7: Previous Medical History (dropdown + text) */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="previous_history_type">Previous Medical History</label>
            <select
              id="previous_history_type"
              name="previous_history_type"
              value={formData.previous_history_type}
              onChange={handleInputChange}
            >
              <option value="none">None / No major history</option>
              <option value="major_surgeries">Major surgeries</option>
              <option value="dialysis">Dialysis</option>
              <option value="cancer">Cancer</option>
              <option value="brain_tumor">Brain tumor</option>
              <option value="heart_attacks">Heart attacks</option>
              <option value="other">Others (describe below)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="previous_history_other">
              If Others, describe (text)
            </label>
            <textarea
              id="previous_history_other"
              name="previous_history_other"
              value={formData.previous_history_other}
              onChange={handleInputChange}
              placeholder="Type any other previous medical conditions or details..."
              rows={3}
            />
            {errors.previous_history_other && (
              <span className="field-error">{errors.previous_history_other}</span>
            )}
          </div>
        </div>

        {/* Row 8: Family / Genetic History */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="family_medical_history">
              Family / Genetic / Hereditary Medical History
            </label>
            <select
              id="family_medical_history"
              name="family_medical_history"
              value={formData.family_medical_history}
              onChange={handleInputChange}
            >
              <option value="nil">Nil / None</option>
              <option value="diabetes">Diabetes in family</option>
              <option value="hypertension">Hypertension in family</option>
              <option value="heart_disease">Heart disease in family</option>
              <option value="cancer_family">Cancer in family</option>
              <option value="other_family">
                Other hereditary / genetic conditions
              </option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Get Quote'}
        </button>
      </form>
    </div>
  );
};

export default InsuranceForm;
