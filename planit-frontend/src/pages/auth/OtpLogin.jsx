import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useApi } from '../../axios/useApi';
import qs from 'qs';
import { CircleCheckBig, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const OtpLogin = () => {
  const api = useApi();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState('email'); // 'email' or 'otp'
  const [email, setEmail] = React.useState('');
  const { saveToken, saveUser } = useAuth();
  const navigate = useNavigate();

  // Email form validation
  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Send email as query parameter
        const res = await api.post('/user/sent-otp', null, {
          params: {
            email: values.email
          }
        });

        if (res.status === 200 || res.status === 201) {
          setEmail(values.email);
          setStep('otp');
          toast('OTP sent to your email successfully', {
            icon: <CircleCheckBig className="text-green-500" />,
          });
        }
      } catch (error) {
        toast(error.response?.data?.detail || 'Failed to send OTP', {
          duration: 5000,
          icon: <ShieldAlert className="text-red-500" />,
        });
        console.log(error, 'error in sending OTP');
      } finally {
        setLoading(false);
      }
    },
  });

  // OTP form validation
  const otpFormik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits')
        .matches(/^\d+$/, 'OTP must contain only numbers'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Send OTP as query parameter
        const res = await api.post('/user/otp-login', null, {
          params: {
            otp: values.otp
          }
        });

        const { access_token, token_type } = res.data;
        
        if (res.status === 200) {
          saveToken(access_token);
          
          // Get user details
          const userDetails = await api.get('/user/me', {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          });

          if (userDetails.status === 200) {
            saveUser(userDetails.data);
            toast('Login successful!', {
              icon: <CircleCheckBig className="text-green-500" />,
            });
            navigate('/');
          }
        }
      } catch (error) {
        toast(error.response?.data?.detail || 'Invalid OTP', {
          duration: 5000,
          icon: <ShieldAlert className="text-red-500" />,
        });
        console.log(error, 'error in OTP login');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Send email as query parameter
      const res = await api.post('/user/sent-otp', null, {
        params: {
          email: email
        }
      });

      if (res.status === 200 || res.status === 201) {
        toast('OTP resent successfully', {
          icon: <CircleCheckBig className="text-green-500" />,
        });
      }
    } catch (error) {
      toast(error.response?.data?.detail || 'Failed to resend OTP', {
        duration: 5000,
        icon: <ShieldAlert className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
    otpFormik.resetForm();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 bg-opacity-80">
      <div className="bg-black bg-opacity-60 rounded-lg shadow-lg p-8 w-full max-w-md">
        {step === 'email' ? (
          <>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              OTP Login <Mail className="inline" size={30} />
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Enter your email to receive OTP
            </p>
            <form onSubmit={emailFormik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  type="email"
                  id="email"
                  name="email"
                  onChange={emailFormik.handleChange}
                  onBlur={emailFormik.handleBlur}
                  value={emailFormik.values.email}
                  placeholder="Enter your email"
                />
                {emailFormik.touched.email && emailFormik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{emailFormik.errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-semibold hover:from-gray-800 hover:to-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Enter OTP <Shield className="inline" size={30} />
            </h2>
            <p className="text-gray-400 text-center mb-2">
              OTP sent to: <span className="text-white">{email}</span>
            </p>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Check your email and enter the 6-digit code
            </p>
            
            <form onSubmit={otpFormik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="otp">
                  OTP Code
                </label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center text-2xl tracking-widest"
                  type="text"
                  id="otp"
                  name="otp"
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.otp}
                  placeholder="000000"
                  maxLength={6}
                />
                {otpFormik.touched.otp && otpFormik.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{otpFormik.errors.otp}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white font-semibold hover:from-green-700 hover:to-green-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Verifying...
                  </>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-gray-400 hover:text-white text-sm underline"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-500 hover:text-blue-400 text-sm underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Want to use password instead?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Regular Login
            </Link>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;