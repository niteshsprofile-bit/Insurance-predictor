import React, { useState, useEffect } from 'react';

const steps = ['Personal Info', 'Health Metrics', 'Lifestyle', 'Medical History'];

const MultiStepForm = ({ onSubmit, loading, error }) => {
  const [currentStep, setCurrentStep] = useState(0);

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
    family_history_details: '',
  });

  const [bmi, setBmi] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height);
      const w = parseFloat(formData.weight);
      if (h > 0 && w > 0) {
        const m = h / 100;
        setBmi((w / (m * m)).toFixed(1));
      } else setBmi('');
    } else setBmi('');
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErr = {};
    if (currentStep === 0) {
      const age = Number(formData.age);
      const h = Number(formData.height);
      const w = Number(formData.weight);
      if (!age || age < 18 || age > 100) newErr.age = 'Age 18–100 only.';
      if (!h || h < 50 || h > 250) newErr.height = 'Height 50–250 cm.';
      if (!w || w < 20 || w > 200) newErr.weight = 'Weight 20–200 kg.';
    } else if (currentStep === 1) {
      const bp = Number(formData.blood_pressure);
      const sugar = Number(formData.sugar_level);
      if (!bp || bp < 60 || bp > 250) newErr.blood_pressure = 'BP 60–250.';
      if (!sugar || sugar < 50 || sugar > 500) newErr.sugar_level = 'Sugar 50–500.';
    } else if (currentStep === 2) {
      const ch = Number(formData.children);
      if (ch < 0 || ch > 10) newErr.children = 'Children 0–10.';
    } else if (currentStep === 3) {
      if (
        formData.previous_history_type === 'other' &&
        !formData.previous_history_other.trim()
      ) {
        newErr.previous_history_other = 'Please describe your history.';
      }
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const buildPreviousHistoryText = () => {
    const t = formData.previous_history_type;
    const other = formData.previous_history_other.trim();
    if (t === 'none') return 'No significant previous medical history';
    if (t === 'other') return other;
    const labels = {
      major_surgeries: 'Major surgeries',
      dialysis: 'Dialysis',
      cancer: 'Cancer',
      brain_tumor: 'Brain tumor',
      heart_attacks: 'Heart attacks',
    };
    return labels[t] || t;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
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
        previous_medical_history: buildPreviousHistoryText(),
        family_medical_history:
          formData.family_medical_history === 'nil'
            ? 'Nil'
            : `${formData.family_medical_history} ${
                formData.family_history_details || ''
              }`.trim(),
      };
      onSubmit(payload);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <>
          <h2>Personal Information</h2>
          <div className="step-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                placeholder="21"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
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

          <div className="step-row">
            <div className="form-group">
              <label>Height (cm) *</label>
              <input
                type="number"
                name="height"
                placeholder="185"
                value={formData.height}
                onChange={handleChange}
              />
              <small className="hint">Normal range: 150–190 cm</small>
              {errors.height && <span className="field-error">{errors.height}</span>}
            </div>
            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                placeholder="75"
                value={formData.weight}
                onChange={handleChange}
              />
              <small className="hint">Weight must be between 20–200 kg.</small>
              {errors.weight && <span className="field-error">{errors.weight}</span>}
            </div>
          </div>

          <div className="bmi-banner">
            <span>Calculated BMI:</span>
            <span className="bmi-value">
              {bmi || '--'}
            </span>
          </div>
        </>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <h2>Health Metrics</h2>
          <div className="step-row">
            <div className="form-group">
              <label>Blood Pressure (Systolic) *</label>
              <input
                type="number"
                name="blood_pressure"
                placeholder="120"
                value={formData.blood_pressure}
                onChange={handleChange}
              />
              <small className="hint">Normal: 90–120 mmHg</small>
              {errors.blood_pressure && (
                <span className="field-error">{errors.blood_pressure}</span>
              )}
            </div>
            <div className="form-group">
              <label>Sugar Level (mg/dL) *</label>
              <input
                type="number"
                name="sugar_level"
                placeholder="95"
                value={formData.sugar_level}
                onChange={handleChange}
              />
              <small className="hint">Normal (fasting): 70–100 mg/dL</small>
              {errors.sugar_level && (
                <span className="field-error">{errors.sugar_level}</span>
              )}
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <h2>Lifestyle Information</h2>
          <div className="step-row">
            <div className="form-group">
              <label>Number of Children *</label>
              <input
                type="number"
                name="children"
                placeholder="0"
                value={formData.children}
                onChange={handleChange}
              />
              {errors.children && (
                <span className="field-error">{errors.children}</span>
              )}
            </div>
            <div className="form-group">
              <label>Region *</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="northeast">Northeast</option>
                <option value="northwest">Northwest</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
              </select>
            </div>
          </div>

          <div className="smoker-toggle">
            <label>
              <input
                type="checkbox"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
              />
              <span>I am a smoker</span>
            </label>
          </div>
        </>
      );
    }

    // Step 3: Medical history
    return (
      <>
        <h2>Medical History</h2>

        <div className="form-group">
          <label>Previous Medical History</label>
          <select
            name="previous_history_type"
            value={formData.previous_history_type}
            onChange={handleChange}
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
          <label>Additional details (optional)</label>
          <textarea
            name="previous_history_other"
            rows={3}
            placeholder="Describe any other major medical events or conditions..."
            value={formData.previous_history_other}
            onChange={handleChange}
          />
          {errors.previous_history_other && (
            <span className="field-error">{errors.previous_history_other}</span>
          )}
        </div>

        <div className="form-group">
          <label>Family / Genetic Medical History</label>
          <select
            name="family_medical_history"
            value={formData.family_medical_history}
            onChange={handleChange}
          >
            <option value="nil">Nil / None</option>
            <option value="diabetes">Diabetes in family</option>
            <option value="hypertension">Hypertension in family</option>
            <option value="heart_disease">Heart disease in family</option>
            <option value="cancer_family">Cancer in family</option>
            <option value="other_family">Other hereditary conditions</option>
          </select>
        </div>

        <div className="form-group">
          <label>Family history details (optional)</label>
          <textarea
            name="family_history_details"
            rows={3}
            placeholder="Example: Father developed hypertension at 45."
            value={formData.family_history_details}
            onChange={handleChange}
          />
        </div>
      </>
    );
  };

  return (
    <div className="card-shell">
      <div className="card-header">
        <h1>Get Your Insurance Quote</h1>
        <p>Follow the steps to share your health profile and view your estimate.</p>
      </div>

      <div className="stepper">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`stepper-item ${
              index === currentStep
                ? 'active'
                : index < currentStep
                ? 'completed'
                : ''
            }`}
          >
            <div className="stepper-circle">{index + 1}</div>
            <span className="stepper-label">{label}</span>
            {index < steps.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <form
        className="step-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        {error && <div className="error-banner">{error}</div>}

        {renderStep()}

        <div className="step-actions">
          {currentStep > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrev}
            >
              ← Previous
            </button>
          )}
          <button
            type="submit"
            className="btn-primary wide"
            disabled={loading}
          >
            {currentStep === steps.length - 1
              ? loading
                ? 'Calculating...'
                : 'Get My Quote →'
              : 'Next Step →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
