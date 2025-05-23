import React, { useState } from "react";
import partidosProximos from "../utils/partidos";
import Swal from "sweetalert2";

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

const Reservas = () => {
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [mapasPorPartido, setMapasPorPartido] = useState(() => {
    const inicial = {};
    partidosProximos.forEach((p) => {
      inicial[p.id] = generarMapaAsientos();
    });
    return inicial;
  });
  const [seleccionados, setSeleccionados] = useState([]);

  const seleccionarAsiento = (filaIdx, asientoIdx) => {
    const mapaActual = mapasPorPartido[partidoSeleccionado.id];
    const asiento = mapaActual[filaIdx][asientoIdx];
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

  const confirmarReserva = async () => {
    const asientosTexto = seleccionados
      .map((s) => `Fila ${s.fila + 1} - Asiento ${s.asiento + 1}`)
      .join(", ");

    const resultado = await Swal.fire({
      title: "¿Confirmar reserva?",
      html: `
      <p>Estás por reservar <strong>${seleccionados.length}</strong> asiento(s):</p>
      <p>${asientosTexto}</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      const mapaActual = mapasPorPartido[partidoSeleccionado.id];
      const nuevoMapa = mapaActual.map((fila) =>
        fila.map((asiento) => {
          const reservado = seleccionados.some(
            (s) => s.fila === asiento.fila && s.asiento === asiento.asiento
          );
          return reservado ? { ...asiento, reservado: true } : asiento;
        })
      );

      setMapasPorPartido({
        ...mapasPorPartido,
        [partidoSeleccionado.id]: nuevoMapa,
      });
      setSeleccionados([]);

      await Swal.fire({
        title: "¡Reserva confirmada!",
        html: `<p>Has reservado los siguientes asientos:</p><p>${asientosTexto}</p>`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🎟️ Reservar Asientos
      </h2>

      {!partidoSeleccionado ? (
        <div className="space-y-4">
          {partidosProximos.map((partido) => (
            <button
              key={partido.id}
              onClick={() => {
                setPartidoSeleccionado(partido);
                setSeleccionados([]);
              }}
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
      ) : (
        <div>
          <button
            onClick={() => setPartidoSeleccionado(null)}
            className="mb-4 text-blue-600 underline"
          >
            ← Volver a partidos
          </button>

          <h3 className="text-lg font-bold mb-2">
            {partidoSeleccionado.equipos} - {partidoSeleccionado.dia}
          </h3>

          <div className="grid gap-2 my-4">
            {mapasPorPartido[partidoSeleccionado.id].map((fila, filaIdx) => (
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
            ))}
          </div>

          <button
            onClick={confirmarReserva}
            disabled={seleccionados.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </main>
  );
};

export default Reservas;
