import React, { useState, useEffect } from 'react';
import { GabineteFisico, ObjetoInventario } from '../types';
import { Layers, CheckCircle2 } from 'lucide-react';

interface CabinetSchematicProps {
  gabinetes: GabineteFisico[];
  gabineteActivoId: string;
  onSeleccionarGabinete: (id: string) => void;
  cajaSeleccionadaId: string | null;
  onSeleccionarCaja: (cajaId: string) => void;
  objetoFoco: ObjetoInventario | null;
  objetos: ObjetoInventario[];
  onSeleccionarObjeto: (objeto: ObjetoInventario) => void;
}

export const CabinetSchematic: React.FC<CabinetSchematicProps> = ({
  gabinetes,
  gabineteActivoId,
  onSeleccionarGabinete,
  cajaSeleccionadaId,
  onSeleccionarCaja,
  objetoFoco,
  objetos,
  onSeleccionarObjeto
}) => {
  const gabineteActual = gabinetes.find(g => g.id === gabineteActivoId) || gabinetes[0];

  // Si el gabinete tiene más de 30 cajas (5 filas x 6 columnas), permitimos cambiar entre bloques de 5 filas
  const [bloqueFilas, setBloqueFilas] = useState<'1-5' | '6-8'>('1-5');

  // Si hay un objeto en foco, verificamos si está en este gabinete
  const cajaConObjetoFoco = objetoFoco && objetoFoco.ubicacion.gabineteId === gabineteActual.id
    ? objetoFoco.ubicacion.cajaId
    : null;

  // Si el objeto seleccionado está en filas 6-8, cambiar automáticamente al bloque 6-8
  useEffect(() => {
    if (objetoFoco && objetoFoco.ubicacion.gabineteId === gabineteActual.id) {
      const caja = gabineteActual.cajas.find(c => c.id === objetoFoco.ubicacion.cajaId);
      if (caja && caja.fila > 5) {
        setBloqueFilas('6-8');
      } else {
        setBloqueFilas('1-5');
      }
    }
  }, [objetoFoco, gabineteActual]);

  const totalFilas = Math.max(...gabineteActual.cajas.map(c => c.fila), 5);
  const tieneMasDe5Filas = totalFilas > 5;

  // Obtener cajas para el bloque actual (6 cajas de ancho x 5 de alto)
  const filasAMostrar = bloqueFilas === '1-5' ? [1, 2, 3, 4, 5] : [6, 7, 8];

  const getObjetosDeCaja = (cajaId: string) => {
    return objetos.filter(o => o.ubicacion.cajaId === cajaId);
  };

  const cajaActiva = gabineteActual.cajas.find(c => c.id === cajaSeleccionadaId) || null;
  const objetosEnCajaActiva = cajaActiva ? getObjetosDeCaja(cajaActiva.id) : [];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Selector superior de Gabinetes con pestañas claras */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Esquema Físico (6 cajas de ancho × 5 de alto)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Mueble industrial de gavetas: 6 columnas por 5 entrepaños de altura
            </p>
          </div>

          {/* Selector de gabinetes y módulos */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {gabinetes.map((gab) => {
              const esActivo = gab.id === gabineteActual.id;
              const tieneObjetoBuscado = objetoFoco && objetoFoco.ubicacion.gabineteId === gab.id;
              const totalItemsGab = objetos.filter(o => o.ubicacion.gabineteId === gab.id).length;

              return (
                <button
                  key={gab.id}
                  onClick={() => {
                    onSeleccionarGabinete(gab.id);
                    setBloqueFilas('1-5');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    esActivo
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                  title={`${gab.nombre} (${totalItemsGab} piezas)`}
                >
                  <span>{gab.codigo}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${esActivo ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-500'}`}>
                    {totalItemsGab}
                  </span>
                  {tieneObjetoBuscado && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" title="El objeto buscado está en este gabinete" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicador de ubicación de foco */}
        {objetoFoco && (
          <div className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-medium truncate">
                Localizando: <strong className="font-bold underline">{objetoFoco.nombre}</strong> ({objetoFoco.sku})
              </span>
            </div>
            <div className="font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded border border-emerald-300 shrink-0 font-mono">
              {objetoFoco.ubicacion.gabineteCodigo} ➔ {objetoFoco.ubicacion.cajaCodigo} (Espacio {objetoFoco.ubicacion.espacio})
            </div>
          </div>
        )}

        {/* Toggle para módulos que exceden 30 cajas (5 filas) */}
        {tieneMasDe5Filas && (
          <div className="mt-2.5 flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              Este módulo tiene {gabineteActual.cajas.length} cajas. Mostrando en matriz 6 de ancho:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBloqueFilas('1-5')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  bloqueFilas === '1-5'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Filas 1 a 5 (Cajas 01–30)
              </button>
              <button
                onClick={() => setBloqueFilas('6-8')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  bloqueFilas === '6-8'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Filas 6 a {totalFilas} (Cajas 31–{gabineteActual.cajas.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ÁREA DE DIBUJO DEL MUEBLE FÍSICO INDUSTRIAL */}
      <div className="flex-1 p-3 sm:p-5 overflow-y-auto flex justify-center items-start">
        {/* Estructura del Gabinete Metálico */}
        <div className="w-full max-w-4xl bg-slate-200/90 rounded-2xl p-3 sm:p-4 border-4 border-slate-700 shadow-xl relative">
          
          {/* Viga Superior / Placa del Gabinete */}
          <div className="bg-slate-900 text-white rounded-t-xl px-4 py-2.5 flex items-center justify-between border-b-2 border-slate-950 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 shadow-sm" />
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider uppercase text-emerald-400">
                {gabineteActual.codigo}
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-700 pl-2">
                {gabineteActual.nombre}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              {gabineteActual.zona}
            </div>
          </div>

          {/* CUERPO DEL GABINETE: 5 FILAS × 6 CAJAS DE ANCHO */}
          <div className="relative bg-slate-300/95 border-x-6 border-slate-700 p-2 sm:p-3 space-y-2.5 shadow-inner">
            
            {/* Postes laterales con perforaciones industriales */}
            <div className="absolute left-[-5px] top-3 bottom-3 flex flex-col justify-between pointer-events-none py-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-900/60" />
              ))}
            </div>
            <div className="absolute right-[-5px] top-3 bottom-3 flex flex-col justify-between pointer-events-none py-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-900/60" />
              ))}
            </div>

            {/* RENDER DE CADA FILA (ENTREPAÑO) */}
            {filasAMostrar.map((filaNum, idx) => {
              const cajasDeEstaFila = gabineteActual.cajas.filter(c => c.fila === filaNum);
              if (cajasDeEstaFila.length === 0) return null;

              // Identificar letra o número de nivel
              const letraNivel = gabineteActual.id === 'GAB-GRIS2'
                ? ['A', 'B', 'C', 'D', 'E'][filaNum - 1]
                : `Fila ${filaNum}`;

              return (
                <React.Fragment key={filaNum}>
                  {idx > 0 && (
                    /* Viga divisoria de estante */
                    <div className="h-2 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded border-y border-slate-600 shadow-2xs flex items-center justify-between px-3">
                      <span className="text-[8px] font-mono text-slate-700 uppercase font-bold tracking-widest opacity-60">
                        Entrepaño Nivel {filaNum}
                      </span>
                      <span className="text-[8px] font-mono text-slate-700 uppercase font-bold tracking-widest opacity-60">
                        Carga 250kg
                      </span>
                    </div>
                  )}

                  {/* Fila de 6 Cajas de Ancho */}
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-600 mb-1 flex items-center justify-between px-1">
                      <span>{gabineteActual.id === 'GAB-GRIS2' ? `Fila ${letraNivel}` : `Nivel ${filaNum}`} (6 cajas):</span>
                      <span className="text-[9px] text-slate-400 font-normal">Columnas 1 a 6</span>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                      {cajasDeEstaFila.map((caja) => {
                        const tieneObjetoFoco = cajaConObjetoFoco === caja.id;
                        const estaSeleccionada = cajaSeleccionadaId === caja.id;
                        const objetosEnCaja = getObjetosDeCaja(caja.id);
                        const cantidadTotal = objetosEnCaja.reduce((acc, o) => acc + o.cantidadDisponible, 0);

                        return (
                          <div
                            key={caja.id}
                            onClick={() => onSeleccionarCaja(caja.id)}
                            className={`relative rounded-lg p-1.5 sm:p-2 cursor-pointer transition-all duration-150 select-none flex flex-col justify-between min-h-[72px] sm:min-h-[82px] ${
                              tieneObjetoFoco
                                ? 'bg-emerald-50 border-2 sm:border-3 border-emerald-500 shadow-md ring-3 ring-emerald-500/25 z-10 scale-[1.02]'
                                : estaSeleccionada
                                ? 'bg-white border-2 border-slate-800 shadow-md ring-1 ring-slate-800'
                                : 'bg-white/95 border border-slate-300 hover:border-slate-400 hover:bg-white hover:shadow-2xs'
                            }`}
                          >
                            {/* Insignia cuando contiene el objeto buscado */}
                            {tieneObjetoFoco && (
                              <div className="absolute -top-2.5 right-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 animate-bounce z-20">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>¡AQUÍ!</span>
                              </div>
                            )}

                            {/* Cabezal de la Caja con Asidero y Código */}
                            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                              <span className={`text-[11px] sm:text-xs font-mono font-extrabold truncate ${
                                tieneObjetoFoco ? 'text-emerald-950 font-black' : 'text-slate-800'
                              }`}>
                                {caja.codigo}
                              </span>

                              {/* Asidero de cajón */}
                              <div className="w-3 h-1.5 rounded-2xs bg-slate-300 border border-slate-400 flex items-center justify-center">
                                <div className="w-1.5 h-0.5 bg-slate-500 rounded" />
                              </div>
                            </div>

                            {/* Contenido / Piezas dentro */}
                            <div className="my-1">
                              {objetosEnCaja.length > 0 ? (
                                <div>
                                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded block truncate text-center">
                                    {objetosEnCaja.length} {objetosEnCaja.length === 1 ? 'ref.' : 'refs.'}
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono block text-center mt-0.5">
                                    ({cantidadTotal} disp.)
                                  </span>
                                </div>
                              ) : (
                                <div className="text-center py-1">
                                  <span className="text-[9px] text-slate-300 italic">Vacía</span>
                                </div>
                              )}
                            </div>

                            {/* Mini compartimentos (Espacios 1 a 4) */}
                            <div className="grid grid-cols-4 gap-0.5 pt-0.5 border-t border-slate-100">
                              {[1, 2, 3, 4].map(esp => {
                                const tieneItemFoco = tieneObjetoFoco && objetoFoco?.ubicacion.espacio === esp;
                                const tieneCualquierItem = objetosEnCaja.some(o => o.ubicacion.espacio === esp);

                                return (
                                  <div
                                    key={esp}
                                    className={`h-2 rounded-2xs transition-all ${
                                      tieneItemFoco
                                        ? 'bg-emerald-500 shadow-2xs'
                                        : tieneCualquierItem
                                        ? 'bg-slate-400'
                                        : 'bg-slate-100'
                                    }`}
                                    title={`Espacio ${esp}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Base con soportes metálicos */}
          <div className="bg-slate-900 h-4 rounded-b-xl border-t-2 border-slate-950 flex justify-between items-center px-6">
            <div className="w-8 h-2 bg-slate-950 rounded-b border border-slate-700" />
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
              Estructura Modular 6×5 • Nave Industrial
            </div>
            <div className="w-8 h-2 bg-slate-950 rounded-b border border-slate-700" />
          </div>
        </div>
      </div>

      {/* PANEL INFERIOR CONTEXTUAL: Contenido detallado de la caja seleccionada */}
      {cajaActiva && (
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 animate-slideUp shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-white bg-slate-900 px-2 py-0.5 rounded">
                {cajaActiva.codigo}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                Inventario en {cajaActiva.codigo} ({gabineteActual.codigo})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {objetosEnCajaActiva.length} objeto(s) en esta caja
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {objetosEnCajaActiva.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 col-span-full">
                Esta caja no tiene componentes registrados en este momento (disponible para almacenar nuevos ingresos o devoluciones).
              </p>
            ) : (
              objetosEnCajaActiva.map(obj => {
                const esFoco = objetoFoco?.id === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => onSeleccionarObjeto(obj)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      esFoco
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {obj.sku}
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        {obj.cantidadDisponible} {obj.unidadMedida}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 truncate" title={obj.nombre}>
                      {obj.nombre}
                    </p>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Marca: <strong>{obj.marca || 'SMC'}</strong></span>
                      <span className="font-mono text-emerald-700 bg-emerald-100/70 px-1 rounded">
                        Espacio {obj.ubicacion.espacio}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
