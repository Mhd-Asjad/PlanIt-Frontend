import React from 'react'
import Navbar from '../../components/navbar/Navbar.jsx'
import CalendarView from '../../components/calendar/CalendarView.jsx'

function Dashboard() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-700 to-gray-800 bg-opacity-80' >
      <Navbar/>
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-3 w-full">
        <div className="w-full max-w-7xl">
        <CalendarView/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
