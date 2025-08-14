import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from 'lucide-react';
import { useApi } from '../../axios/useApi.js';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'sonner';
const Register = () => {
  const api = useApi()
  const navigate = useNavigate();
  const [ loading , setLoading ] = React.useState(false)
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async(values) => {
      console.log(values, 'values in register')
      setLoading(true)
      try{
        const payload = {
            full_name : values.firstName + " " + values.lastName ,
            email: values.email,
            password: values.password
        }
        const res = await api.post('/user/register',payload)
        console.log(res.data);
        
        if (res.data.status === 200){
          console.log(res.data, 'response in register')
          formik.resetForm();
          toast.success('Registration successful')
          navigate('/login')
        }
      }catch(error) {
        toast.error(error.response.data.detail || 'Registration failed', {
          duration: 5000,
          description: 'Please try again later.',
        })
        console.log(error, 'error in registration')
      }finally{
        setLoading(false)
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 bg-opacity-80">
      <div className="bg-black bg-opacity-60 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Register <User className="inline" size={30} />
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-gray-300 mb-2" htmlFor="firstName">First Name</label>
                <input
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    placeholder="First Name"
                  />
                {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                )}
                </div>

                <div>
                <label className="block text-gray-300 mb-2" htmlFor="lastName">Last Name</label>
                <input
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    placeholder="Last Name"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                )}
                </div>
            </div>


          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <input
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-semibold hover:from-gray-800 hover:to-gray-900 transition"
          >
            Register
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
