import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Horario from "./pages/Horario";
import Reservas from "./pages/Reservas";
import Resultados from "./pages/Resultados";
import Info from "./pages/info";

const App = () => {
  return (
    <Router>
      <header className="hidden xs:grid bg-blue-700 text-white p-4 text-center">
        <h1 className="text-xl md:text-3xl font-bold">
          Torneo Escolar de Fútbol
        </h1>
      </header>
      <Navbar />
      <div className="pt-4 pb-20 md:pb-4 px-4">
        <Routes>
          <Route path="/" element={<Horario />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
