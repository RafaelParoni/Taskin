import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages
import RegistroPage from './components/Registro/Registro';
import AutoLoginPage from './components/Autologin/AutoLogin';
import LoginPage from './components/login/login';
import Background from './components/background/background';
import TasksPage from './components/Tasks/Tasks';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Background/>
    <Routes>
      <Route path="/" element={<TasksPage />} />
      <Route path='/registro' element={<RegistroPage/>}/>
      <Route path='/autologin' element={<AutoLoginPage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/*' element={<AutoLoginPage/>}/>
    </Routes>
  </BrowserRouter> 
);