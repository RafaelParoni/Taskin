import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages
import Inicio from './Inicio';
import RegistroPage from './components/Registro/Registro';
import AutoLoginPage from './components/Autologin/AutoLogin';
import LoginPage from './components/login/login';






const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> 
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path='/registro' element={<RegistroPage/>}/>
      <Route path='/autologin' element={<AutoLoginPage/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
  </BrowserRouter> 
);