import React from 'react';
import { RegistroMovimiento } from '../types';
import { CheckCircle2, ArrowRight, X, MapPin } from 'lucide-react';

interface ConfirmationToastProps {
  movimiento: RegistroMovimiento | null;
  onCerrar: () => void;
  onVerGabinete: (gabineteCodigo: string, cajaNumero: number) => void;
  onHacerOtroMovimiento: () => void;
}

export const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  movimiento,
  onCerrar,
  onVerGabinete,
  onHacerOtroMovimiento
}) => {
  if (!movimiento) return null;

  const esSalida = movimiento.tipo === 'SACAR';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slideUp">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden">
        {/* Banner superior de estado */}
        <div className={`px-4 py-2.5 flex items-center justify-between ${esSalida ? 'bg-amber-600' : 'bg-emerald-600'}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              {esSalida ? 'Salida Registrada Correctamente' : 'Devolución Guardada en Inventario'}
            </span>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar notificación"
            className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo con los detalles precisos que exige el brief */}
        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                {movimiento.sku}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {movimiento.fechaHora}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              {movimiento.objetoNombre}
            </h4>
          </div>

          {/* Bloque de movimiento y ubicación afectada */}
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Cantidad movida:</p>
              <p className="font-bold text-emerald-400 text-sm mt-0.5">
                {esSalida ? '-' : '+'}{movimiento.cantidad} {movimiento.unidad}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Nuevo stock restante:</p>
              <p className="font-bold text-white text-sm mt-0.5">
                {movimiento.stockRestante} {movimiento.unidad}
              </p>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-700 flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Ubicación afectada: <strong>{movimiento.ubicacion.gabineteCodigo}</strong> ➔ {movimiento.ubicacion.cajaCodigo || `Caja ${movimiento.ubicacion.cajaNumero}`} ➔ Espacio {movimiento.ubicacion.espacio}
              </span>
            </div>
          </div>

          {/* Acciones para el siguiente paso */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => onVerGabinete(movimiento.ubicacion.gabineteCodigo, movimiento.ubicacion.cajaNumero)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              <span>Ver en gabinete</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onHacerOtroMovimiento}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              Hacer otra acción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
