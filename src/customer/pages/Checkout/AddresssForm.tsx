import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Address } from '../../../types/userTypes';

// ── Validation ────────────────────────────────────────────────────────────────
const schema = Yup.object().shape({
    name:     Yup.string().min(2, 'Name too short').required('Required'),
    mobile:   Yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit number').required('Required'),
    pinCode:  Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit PIN').required('Required'),
    address:  Yup.string().min(5, 'Enter full address').required('Required'),
    locality: Yup.string().required('Required'),
    city:     Yup.string().required('Required'),
    state:    Yup.string().required('Required'),
});

interface AddressFormProp {
    handleClose: () => void;
    paymentGateway: string;
    onAddressSaved?: (address: any) => void;
}

// ── Individual input field ────────────────────────────────────────────────────
const InputField = ({
    label, name, placeholder, formik, half = false, type = 'text',
}: {
    label: string; name: string; placeholder?: string;
    formik: any; half?: boolean; type?: string;
}) => {
    const touched = formik.touched[name];
    const error   = formik.errors[name];
    const hasError = touched && Boolean(error);
    const isValid  = touched && !error && formik.values[name];

    return (
        <div className={`af-field ${half ? 'af-half' : 'af-full'}`}>
            <label className='af-label'>{label}</label>
            <div className={`af-input-wrap ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}`}>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='af-input'
                    autoComplete='off'
                />
                {isValid && (
                    <span className='af-check'>✓</span>
                )}
            </div>
            {hasError && <p className='af-error'>{error}</p>}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AddressForm: React.FC<AddressFormProp> = ({ handleClose, paymentGateway, onAddressSaved }) => {
    const [done, setDone] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '', mobile: '', pinCode: '',
            address: '', locality: '', city: '', state: '',
        },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            setDone(true);
            try {
                onAddressSaved?.(values as Address);
                setTimeout(handleClose, 1200);
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const filled = Object.values(formik.values).filter(Boolean).length;
    const total  = Object.keys(formik.values).length;
    const progress = Math.round((filled / total) * 100);

    // ── Success screen ──
    if (done) {
        return (
            <>
                <style>{styles}</style>
                <div className='af-success'>
                    <div className='af-success-circle'>
                        <svg viewBox='0 0 52 52' className='af-checkmark'>
                            <circle cx='26' cy='26' r='25' fill='none' />
                            <path fill='none' d='M14 27l8 8 16-16' />
                        </svg>
                    </div>
                    <h3 className='af-success-title'>Address Saved!</h3>
                    <p className='af-success-sub'>Placing your order now…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{styles}</style>
            <div className='af-wrap'>

                {/* ── Header ── */}
                <div className='af-header'>
                    <div>
                        <h2 className='af-title'>Delivery Address</h2>
                        <p className='af-subtitle'>Tell us where to deliver your order</p>
                    </div>
                    <button className='af-close' onClick={handleClose} type='button'>✕</button>
                </div>

                {/* ── Progress bar ── */}
                <div className='af-progress-wrap'>
                    <div className='af-progress-bar' style={{ width: `${progress}%` }} />
                </div>
                <p className='af-progress-label'>{filled} of {total} fields filled</p>

                {/* ── Form ── */}
                <form onSubmit={formik.handleSubmit} className='af-form'>

                    {/* Section: Contact */}
                    <div className='af-section'>
                        <p className='af-section-label'>
                            <span className='af-section-dot' />
                            Contact Details
                        </p>
                        <div className='af-row'>
                            <InputField label='Full Name' name='name' placeholder='As on your ID' formik={formik} />
                        </div>
                        <div className='af-row'>
                            <InputField label='Mobile Number' name='mobile' placeholder='10-digit number' formik={formik} half type='tel' />
                            <InputField label='PIN Code' name='pinCode' placeholder='6-digit PIN' formik={formik} half />
                        </div>
                    </div>

                    {/* Section: Address */}
                    <div className='af-section'>
                        <p className='af-section-label'>
                            <span className='af-section-dot' />
                            Address Details
                        </p>
                        <div className='af-row'>
                            <InputField label='Flat / House No. / Building / Street' name='address' placeholder='e.g. 12B, Sunrise Apts, MG Road' formik={formik} />
                        </div>
                        <div className='af-row'>
                            <InputField label='Area / Colony / Locality' name='locality' placeholder='e.g. Bandra West' formik={formik} />
                        </div>
                        <div className='af-row'>
                            <InputField label='City / Town' name='city' placeholder='e.g. Mumbai' formik={formik} half />
                            <InputField label='State' name='state' placeholder='e.g. Maharashtra' formik={formik} half />
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className='af-actions'>
                        <button type='button' onClick={handleClose} className='af-btn-cancel'>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='af-btn-submit'
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            {formik.isSubmitting ? (
                                <span className='af-spinner' />
                            ) : (
                                <>
                                    <span>Use this Address &amp; Continue</span>
                                    <span className='af-arrow'>→</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  .af-wrap {
    width: 500px;
    max-width: 95vw;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  /* Header */
  .af-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 22px 24px 14px;
    border-bottom: 1px solid #f0f0f0;
  }
  .af-title {
    font-size: 17px;
    font-weight: 700;
    color: #0f1111;
    margin: 0;
  }
  .af-subtitle {
    font-size: 12px;
    color: #888;
    margin: 3px 0 0;
  }
  .af-close {
    background: none;
    border: none;
    font-size: 16px;
    color: #aaa;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 6px;
    line-height: 1;
    transition: background 0.15s, color 0.15s;
  }
  .af-close:hover { background: #f5f5f5; color: #444; }

  /* Progress */
  .af-progress-wrap {
    height: 3px;
    background: #f0f0f0;
  }
  .af-progress-bar {
    height: 100%;
    background: linear-gradient(to right, #0b7285, #00a693);
    transition: width 0.35s ease;
  }
  .af-progress-label {
    font-size: 11px;
    color: #aaa;
    text-align: right;
    padding: 5px 24px 0;
    margin: 0;
  }

  /* Form body */
  .af-form {
    padding: 4px 24px 24px;
  }

  /* Section */
  .af-section {
    margin-top: 18px;
  }
  .af-section-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #0b7285;
    margin: 0 0 12px;
  }
  .af-section-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0b7285;
    flex-shrink: 0;
  }

  /* Row */
  .af-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  /* Field */
  .af-field { display: flex; flex-direction: column; flex: 1; }
  .af-full  { width: 100%; }
  .af-half  { flex: 1; min-width: 0; }

  .af-label {
    font-size: 11.5px;
    font-weight: 600;
    color: #555;
    margin-bottom: 5px;
    letter-spacing: 0.1px;
  }

  .af-input-wrap {
    position: relative;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .af-input-wrap:focus-within {
    border-color: #0b7285;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,113,133,0.1);
  }
  .af-input-wrap.error {
    border-color: #e53935;
    background: #fff9f9;
  }
  .af-input-wrap.valid {
    border-color: #43a047;
  }

  .af-input {
    width: 100%;
    padding: 9px 36px 9px 12px;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #111;
    outline: none;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .af-input::placeholder { color: #bbb; }

  .af-check {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #43a047;
    font-size: 13px;
    font-weight: 700;
  }

  .af-error {
    font-size: 11px;
    color: #e53935;
    margin: 4px 0 0 2px;
  }

  /* Actions */
  .af-actions {
    display: flex;
    gap: 10px;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid #f0f0f0;
  }
  .af-btn-cancel {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1.5px solid #ddd;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .af-btn-cancel:hover { background: #f5f5f5; border-color: #ccc; }

  .af-btn-submit {
    flex: 2;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #e1a836;
    background: linear-gradient(to bottom, #f4c24d, #e9b12f);
    font-size: 13px;
    font-weight: 700;
    color: #111;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.1s;
  }
  .af-btn-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .af-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .af-arrow {
    font-size: 15px;
    transition: transform 0.15s;
  }
  .af-btn-submit:hover .af-arrow { transform: translateX(3px); }

  /* Spinner */
  .af-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(0,0,0,0.15);
    border-top-color: #333;
    border-radius: 50%;
    animation: af-spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes af-spin { to { transform: rotate(360deg); } }

  /* Success */
  .af-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    gap: 12px;
    text-align: center;
    min-width: 320px;
  }
  .af-success-circle {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: #007600;
    display: flex; align-items: center; justify-content: center;
  }
  .af-checkmark {
    width: 32px; height: 32px;
  }
  .af-checkmark circle {
    stroke: rgba(255,255,255,0.3);
    stroke-width: 2;
    animation: af-circle 0.5s ease-in-out forwards;
  }
  .af-checkmark path {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: af-tick 0.4s 0.3s ease-out forwards;
  }
  @keyframes af-circle { to { stroke-dashoffset: 0; } }
  @keyframes af-tick   { to { stroke-dashoffset: 0; } }

  .af-success-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f1111;
    margin: 0;
  }
  .af-success-sub {
    font-size: 13px;
    color: #888;
    margin: 0;
  }
`;

export default AddressForm;
