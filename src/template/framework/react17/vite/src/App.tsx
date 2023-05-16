import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HelloWorld from './components/helloWorld'
import Page404 from './components/404'

export const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/helloword" element={<HelloWorld />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
  );
};