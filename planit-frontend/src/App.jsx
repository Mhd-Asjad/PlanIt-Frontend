import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login';
import './index.css'
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
function App() {

  return (
    <>  
    <Router>
      <Routes>

        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
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
