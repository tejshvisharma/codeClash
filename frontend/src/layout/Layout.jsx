import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        <Outlet /> {/* This renders HomePage, or other child routes */}
      </main>
    </div>
  );
};

export default Layout




