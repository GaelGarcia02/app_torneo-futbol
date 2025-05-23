import React from "react";

const Info = () => (
  <main className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
    <h2 className="text-blue-700 text-2xl font-semibold mb-4">
      ℹ️ Información General
    </h2>

    <section className="mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        🏟️ Sedes del Torneo
      </h3>
      <ul className="list-disc list-inside text-gray-700">
        <li>Campo Norte</li>
        <li>Campo Sur</li>
        <li>Campo Este</li>
        <li>Campo Central (Campo Principal)</li>
      </ul>
    </section>

    <section className="mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        📋 Comité Organizador
      </h3>
      <p className="text-gray-700 mb-1">Torneo Escolar de Fútbol 2025</p>
      <p className="text-gray-700 mb-1">
        Coordinador General: Prof. Luis Martínez
      </p>
      <p className="text-gray-700 mb-1">Contacto: +52 55 1234 5678</p>
      <p className="text-gray-700">Correo: mundial2025@escuela.edu.mx</p>
    </section>

    <section className="mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        ⚽ Reglas Básicas
      </h3>
      <ul className="list-disc list-inside text-gray-700">
        <li>Duración de cada partido: 2 tiempos de 20 minutos</li>
        <li>Los partidos son de ida y vuelta</li>
        <li>En caso de empate global, se definirá por penales</li>
        <li>Es obligatorio el uso de espinilleras</li>
        <li>No se permiten objetos metálicos dentro del recinto</li>
        <li>Comportamiento antideportivo será sancionado</li>
      </ul>
    </section>

    <section>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        📆 Formato del Torneo
      </h3>
      <ul className="list-disc list-inside text-gray-700">
        <li>Fase de Play-Ins: 8 equipos, 4 clasifican</li>
        <li>Playoffs: 4 clasificados + 4 preclasificados</li>
        <li>Eliminación directa en partidos de ida y vuelta</li>
        <li>Final única en el Campo Central</li>
      </ul>
    </section>
  </main>
);

export default Info;
