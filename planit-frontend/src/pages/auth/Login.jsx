import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Lock, ShieldAlert } from 'lucide-react';
import { useApi } from '../../axios/useApi';
import qs from 'qs';
import { CircleCheckBig } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
  const api = useApi()
  const [ loading , setLoading ] = React.useState(false)
  const { saveToken , saveUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async(values) => {
      console.log(values, 'values in register')
      setLoading(true)
      try{
        const payload = qs.stringify({
          username: values.email,
          password: values.password

        })
        const res = await api.post('/user/login', payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log(res.data, 'response in login')
        const { access_token , token_type } = res.data;
        console.log(access_token, 'access token in login')
        if (res.status === 200) {
          saveToken(access_token)
          const userDetails = await api.get('/user/me',{
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })
          console.log(userDetails.status, 'user details status in login')
          if (userDetails.status === 200) {
            saveUser(userDetails.data)
            console.log(userDetails , 'user details in login')
            toast('user loggined successfully', {
              icon: <CircleCheckBig className="text-green-500"/>,
            })
            navigate('/')
          }
        }else{
          toast.error('Login failed, please try again');
        }
      }catch(error) {
        toast(error.response?.data?.detail || 'Login failed', {
          duration: 5000,
          icon: <ShieldAlert className="text-red-500"/>,
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
          Login <Lock className="inline" size={30} />
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
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
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
