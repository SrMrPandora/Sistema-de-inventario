import React from 'react';
import { RegistroMovimiento } from '../types';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MapPin, 
  Clock, 
  X
} from 'lucide-react';

interface HistoryDrawerProps {
  movimientos: RegistroMovimiento[];
  onCerrar: () => void;
  onVerGabinete: (gabineteCodigo: string, cajaNumero: number) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  movimientos,
  onCerrar,
  onVerGabinete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Movimientos Registrados en el Turno
            </h2>
            <p className="text-xs text-slate-500">
              Bitácora local de retiros e ingresos realizados por el trabajador
            </p>
          </div>
        </div>
        <button
          onClick={onCerrar}
          aria-label="Cerrar bitácora de movimientos"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {movimientos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No hay movimientos registrados en este turno</p>
          <p className="text-xs text-slate-400 mt-1">Prueba a buscar un objeto y registrar una salida o devolución.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {movimientos.map((mov) => {
            const esSalida = mov.tipo === 'SACAR';

            return (
              <div
                key={mov.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        esSalida
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {esSalida ? (
                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            esSalida ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {esSalida ? 'Salida de Material' : 'Ingreso / Devolución'}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {mov.sku}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {mov.objetoNombre}
                      </h4>
                      {mov.motivo && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">
                          Motivo: {mov.motivo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-extrabold font-mono ${
                        esSalida ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {esSalida ? '-' : '+'}{mov.cantidad} {mov.unidad}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Restante: {mov.stockRestante}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {mov.ubicacion.gabineteCodigo} ➔ {mov.ubicacion.cajaCodigo || `Caja ${mov.ubicacion.cajaNumero}`} ➔ Espacio {mov.ubicacion.espacio}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {mov.fechaHora}
                    </span>
                    <button
                      onClick={() => onVerGabinete(mov.ubicacion.gabineteCodigo, mov.ubicacion.cajaNumero)}
                      className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Localizar en estante
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
