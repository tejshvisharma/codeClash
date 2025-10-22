import React from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {Toaster} from 'react-hot-toast'

import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from "lucide-react"
import Layout from "./layout/Layout"
function App() {
    
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser){
     return (
     <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
     </div>);
  } 
   
  
  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster/>
      <Routes>

        <Route path="/" element={<Layout />} >

        <Route 
          index element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        </Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : < Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App