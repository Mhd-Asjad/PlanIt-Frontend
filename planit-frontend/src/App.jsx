import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import './index.css'
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';
import OtpLogin from './pages/auth/OtpLogin.jsx';
function App() {

  return (
    <>  
    <Router>
      <Routes>

        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
        <Route path='/otp-login' element={<PublicRoute><OtpLogin/></PublicRoute>} />
        <Route 
          path='/' 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
    </>

  )
}

export default App
