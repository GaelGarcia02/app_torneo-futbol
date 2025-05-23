import React, { useState, useEffect } from "react";
import partidosData from "../utils/partidos";
import resultadosData from "../utils/resultados";

const Horario = () => {
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [equipoFiltro, setEquipoFiltro] = useState("");
  const [estadioFiltro, setEstadioFiltro] = useState("");
  const [notificaciones, setNotificaciones] = useState({});

  const obtenerFechaNormalizada = (diaTexto) => {
    const partes = diaTexto.split(" ");
    const dia = parseInt(partes[1], 10);
    const mesTexto = partes[3].toLowerCase();

    const meses = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12",
    };

    const mes = meses[mesTexto];
    const diaFormateado = dia < 10 ? `0${dia}` : `${dia}`;
    return `2025-${mes}-${diaFormateado}`;
  };

  // Cargar notificaciones desde localStorage al montar
  useEffect(() => {
    const guardadas = localStorage.getItem("notificacionesPartidos");
    if (guardadas) {
      setNotificaciones(JSON.parse(guardadas));
    }
  }, []);

  const toggleNotificacion = (id) => {
    const actualizado = {
      ...notificaciones,
      [id]: !notificaciones[id],
    };
    setNotificaciones(actualizado);
    localStorage.setItem("notificacionesPartidos", JSON.stringify(actualizado));
  };

  const estadiosUnicos = [...new Set(partidosData.map((p) => p.estadio))];

  const partidosFiltrados = partidosData.filter((partido) => {
    const fechaNormalizada = obtenerFechaNormalizada(partido.dia);
    const coincideFecha = fechaFiltro ? fechaNormalizada === fechaFiltro : true;
    const coincideEquipo = equipoFiltro
      ? partido.equipos.toLowerCase().includes(equipoFiltro.toLowerCase())
      : true;
    const coincideEstadio = estadioFiltro
      ? partido.estadio === estadioFiltro
      : true;
    return coincideFecha && coincideEquipo && coincideEstadio;
  });

  const resultadosFiltrados = resultadosData.filter((resultado) => {
    const fechaNormalizada = obtenerFechaNormalizada(resultado.dia);
    const coincideFecha = fechaFiltro ? fechaNormalizada === fechaFiltro : true;
    const coincideEquipo = equipoFiltro
      ? resultado.equipos.toLowerCase().includes(equipoFiltro.toLowerCase())
      : true;
    const coincideEstadio = estadioFiltro
      ? resultado.estadio === estadioFiltro
      : true;
    return coincideFecha && coincideEquipo && coincideEstadio;
  });

  const enJuego = resultadosFiltrados.filter((p) => p.estado === "jugando");

  return (
    <main className="flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg max-w-5xl w-full">
        <h2 className="text-blue-700 text-2xl font-semibold mb-6 text-center">
          Horario de Partidos
        </h2>

        {/* Filtros */}
        <div className="hidden xs:flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border px-3 py-2 rounded w-full block md:w-1/3 lg:hidden"
          />
          <input
            type="text"
            placeholder="Filtrar por equipo (Ej. México)"
            value={equipoFiltro}
            onChange={(e) => setEquipoFiltro(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />
          <select
            value={estadioFiltro}
            onChange={(e) => setEstadioFiltro(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          >
            <option value="">Todos los campos</option>
            {estadiosUnicos.map((estadio, idx) => (
              <option key={idx} value={estadio}>
                {estadio}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de partidos */}
        {partidosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay partidos programados.
          </p>
        ) : (
          <div>
            <div className="">
              {enJuego.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-red-600 mb-4 text-center">
                    🔴 Jugando ahora mismo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enJuego.map((partido, index) => (
                      <div
                        key={index}
                        className="border rounded-xl shadow-xl p-6 bg-white text-center"
                      >
                        <h3 className="text-xl font-bold text-red-600 mb-2">
                          {partido.equipos}
                        </h3>
                        <p className="text-black font-semibold text-lg mt-2">
                          Marcador en vivo: <br />
                          {partido.marcador}
                        </p>
                        <p className="text-gray-700">📍 {partido.estadio}</p>
                        <p className="text-red-500 mt-2 font-semibold">
                          En juego
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* // */}
            <h3 className=" text-xl font-bold text-blue-600 mb-4 text-center">
              📢 Partidos por Jugar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partidosFiltrados.map((partido, index) => (
                <div
                  key={index}
                  className="border rounded-xl shadow-xl p-6 bg-white text-center relative"
                >
                  <p className="text-md text-gray-500 font-medium mb-1">
                    {partido.dia}
                  </p>
                  <h3 className="text-xl font-bold text-blue-700 mb-2">
                    {partido.equipos}
                  </h3>
                  <p className="text-gray-700">⏰ {partido.hora}</p>
                  <p className="text-gray-700 mb-2">📍 {partido.estadio}</p>

                  <button
                    onClick={() => toggleNotificacion(partido.id)}
                    className={`px-3 py-1 text-sm rounded-full lg:hidden ${
                      notificaciones[partido.id]
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {notificaciones[partido.id]
                      ? "🔔 Recordatorio activado"
                      : "🔕 Activar recordatorio"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Horario;
