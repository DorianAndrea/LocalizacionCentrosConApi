import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapaContainer from './Components/MapaContainer';
import Header from './Components/Header';
import Footer from './Components/Footer';


function App() {
  
const [centrosSalud, setCentrosSalud] = useState([]);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
          <>
            <Header />
            <MapaContainer centrosSalud={centrosSalud}  />
            <Footer />
          </>
        } />
        </Routes>
      </Router>
    </>
  )
}

export default App
