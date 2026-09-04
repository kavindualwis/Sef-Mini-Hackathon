import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineCheckCircle } from 'react-icons/hi';
import { authAPI } from '../../services/api';
import './Verify.css';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const userName = location.state?.name || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/');
  }, [email, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authAPI.verify({ email, code });
      // Store token
      localStorage.setItem('fixmate_token', response.data.token);
      localStorage.setItem('fixmate_user', JSON.stringify(response.data.user));
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendCode({ email });
      setResendCooldown(60);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  // Success state
  if (success) {
    return (
      <div className="verify-page">
        <div className="verify-container">
          <div className="verify-card">
            <div className="verify-success">
              <div className="success-icon">
                <HiOutlineCheckCircle />
              </div>
              <h2>You're All Set!</h2>
              <p>Your account has been verified successfully. Welcome to FixMate, {userName}!</p>
              <button className="btn-continue" onClick={() => navigate('/home')}>
                Explore FixMate Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-icon">
            <HiOutlineMail />
          </div>
          <h1>Check Your Email</h1>
          <p className="verify-subtitle">
            We've sent a 6-digit verification code to<br />
            <span className="verify-email-highlight">{email}</span>
          </p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* OTP inputs */}
          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                className={`otp-input ${digit ? 'filled' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button className="btn-verify" onClick={handleVerify} disabled={loading || otp.join('').length !== 6}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>

          <div className="resend-section">
            Didn't receive the code?{' '}
            <button onClick={handleResend} disabled={resendCooldown > 0}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
