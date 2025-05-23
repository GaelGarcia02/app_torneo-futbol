import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import partidosData from "../utils/partidos";

const generarMapaAsientos = (filas = 5, columnas = 10) => {
  const mapa = [];
  for (let i = 0; i < filas; i++) {
    const fila = [];
    for (let j = 0; j < columnas; j++) {
      fila.push({ fila: i, asiento: j, reservado: false });
    }
    mapa.push(fila);
  }
  return mapa;
};

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

const Reservas = () => {
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [asientosPorPartido, setAsientosPorPartido] = useState({});
  const [seleccionados, setSeleccionados] = useState([]);

  const [fechaFiltro, setFechaFiltro] = useState("");
  const [equipoFiltro, setEquipoFiltro] = useState("");
  const [estadioFiltro, setEstadioFiltro] = useState("");

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

  const seleccionarAsiento = (filaIdx, asientoIdx) => {
    const asiento =
      asientosPorPartido[partidoSeleccionado.id][filaIdx][asientoIdx];
    if (asiento.reservado) return;

    const yaSeleccionado = seleccionados.find(
      (s) => s.fila === filaIdx && s.asiento === asientoIdx
    );

    let nuevosSeleccionados = [...seleccionados];
    if (yaSeleccionado) {
      nuevosSeleccionados = nuevosSeleccionados.filter(
        (s) => !(s.fila === filaIdx && s.asiento === asientoIdx)
      );
    } else {
      nuevosSeleccionados.push(asiento);
    }

    setSeleccionados(nuevosSeleccionados);
  };

  const confirmarReserva = () => {
    if (seleccionados.length === 0) return;

    const resumen = seleccionados
      .map((s) => `Fila ${s.fila + 1}, Asiento ${s.asiento + 1}`)
      .join("<br>");

    Swal.fire({
      title: "¿Confirmar reserva?",
      html: `Has seleccionado los siguientes asientos:<br><br>${resumen}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoMapa = asientosPorPartido[partidoSeleccionado.id].map(
          (fila) =>
            fila.map((asiento) => {
              const reservado = seleccionados.some(
                (s) => s.fila === asiento.fila && s.asiento === asiento.asiento
              );
              return reservado ? { ...asiento, reservado: true } : asiento;
            })
        );

        const nuevosAsientos = {
          ...asientosPorPartido,
          [partidoSeleccionado.id]: nuevoMapa,
        };

        setAsientosPorPartido(nuevosAsientos);
        localStorage.setItem(
          "asientosPorPartido",
          JSON.stringify(nuevosAsientos)
        );
        setSeleccionados([]);

        Swal.fire({
          title: "Reserva confirmada",
          html: `
          <p>Escanea este código QR al llegar al estadio:</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=RESERVA-${partidoSeleccionado.id}&size=200x200" alt="QR" class="mx-auto mt-4" />
          <p class="mt-2 text-sm text-gray-500">Puedes tomarle una captura de pantalla.</p>
        `,
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
          width: 300,
        });
      }
    });
  };

  useEffect(() => {
    const guardado = localStorage.getItem("asientosPorPartido");
    if (guardado) {
      setAsientosPorPartido(JSON.parse(guardado));
    } else {
      const inicial = {};
      partidosData.forEach((p) => {
        inicial[p.id] = generarMapaAsientos();
      });
      setAsientosPorPartido(inicial);
    }
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🎟️ Reservar Asientos
      </h2>

      {!partidoSeleccionado ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/3 lg:hidden"
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
          <div className="space-y-4">
            {partidosFiltrados.map((partido) => (
              <button
                key={partido.id}
                onClick={() => setPartidoSeleccionado(partido)}
                className="block w-full border p-4 rounded bg-white hover:bg-gray-100 text-left"
              >
                <h3 className="text-lg font-semibold">{partido.equipos}</h3>
                <p>
                  {partido.dia} - {partido.hora}
                </p>
                <p>📍 {partido.estadio}</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setPartidoSeleccionado(null)}
            className="mb-6 bg-white text-green-700 border border-green-500 px-4 py-2 rounded-md shadow hover:bg-green-50 transition-all"
          >
            ← Volver a partidos
          </button>

          <h3 className="text-lg font-bold mb-2">
            {partidoSeleccionado.equipos} - {partidoSeleccionado.dia}
          </h3>
          <p className="text-sm text-gray-800 mb-6 text-center">
            - Seleccione los asientos que desea reservar -
          </p>

          <div className="grid gap-2 my-4">
            {asientosPorPartido[partidoSeleccionado.id]?.map(
              (fila, filaIdx) => (
                <div key={filaIdx} className="flex justify-center gap-1">
                  {fila.map((asiento, asientoIdx) => {
                    const esSeleccionado = seleccionados.some(
                      (s) =>
                        s.fila === asiento.fila && s.asiento === asiento.asiento
                    );
                    return (
                      <button
                        key={asientoIdx}
                        onClick={() => seleccionarAsiento(filaIdx, asientoIdx)}
                        className={`w-8 h-8 rounded text-xs font-bold ${
                          asiento.reservado
                            ? "bg-gray-400 cursor-not-allowed"
                            : esSeleccionado
                            ? "bg-green-500 text-white"
                            : "bg-white border"
                        }`}
                        disabled={asiento.reservado}
                      >
                        {filaIdx + 1}-{asientoIdx + 1}
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>

          <div className="text-center">
            <button
              onClick={confirmarReserva}
              disabled={seleccionados.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Reservas;
