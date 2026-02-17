import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div>
      <p>Dashboard layout</p>
      <Outlet />
    </div>
  )
}

export default DashboardLayout