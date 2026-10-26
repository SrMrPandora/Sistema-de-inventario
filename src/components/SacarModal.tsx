import React, { useState } from 'react';
import { ObjetoInventario } from '../types';
import { 
  X, 
  Minus, 
  Plus, 
  ArrowUpRight, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  Check 
} from 'lucide-react';

interface SacarModalProps {
  objeto: ObjetoInventario;
  onCerrar: () => void;
  onConfirmar: (cantidad: number, motivo: string) => Promise<void>;
}

export const SacarModal: React.FC<SacarModalProps> = ({
  objeto,
  onCerrar,
  onConfirmar
}) => {
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('Orden de Mantenimiento');
  const [procesando, setProcesando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const maximoDisponible = objeto.cantidadDisponible;

  const handleIncrementar = () => {
    if (cantidad < maximoDisponible) {
      setCantidad(prev => prev + 1);
      setError(null);
    } else {
      setError(`No puedes sacar más de las ${maximoDisponible} ${objeto.unidadMedida} disponibles.`);
    }
  };

  const handleDecrementar = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
      setError(null);
    }
  };

  const handleSetMax = () => {
    setCantidad(maximoDisponible);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad <= 0) {
      setError('La cantidad a retirar debe ser mayor a 0.');
      return;
    }
    if (cantidad > maximoDisponible) {
      setError(`Existencia insuficiente. Solo hay ${maximoDisponible} ${objeto.unidadMedida}.`);
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      await onConfirmar(cantidad, motivo);
    } catch (err) {
      setError('Ocurrió un error al procesar el retiro. Inténtalo de nuevo.');
      setProcesando(false);
    }
  };

  const stockRestante = maximoDisponible - cantidad;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sacar-title"
      >
        {/* Cabezal de Extracción (Ámbar) */}
        <div className="bg-amber-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/40 flex items-center justify-center border border-white/20">
              <ArrowUpRight className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h2 id="sacar-title" className="font-bold text-base leading-snug">
                Sacar Objeto de Almacén
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Paso de confirmación y retiro físico
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            disabled={procesando}
            aria-label="Cerrar modal de extracción"
            className="p-1.5 rounded-lg hover:bg-amber-700 text-amber-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Resumen del objeto a retirar */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-mono font-bold text-slate-700">{objeto.sku}</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {objeto.categoria}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mb-2">
              {objeto.nombre}
            </p>

            {/* Ubicación Física donde debe abrir la caja */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Abrir: <strong>{objeto.ubicacion.gabineteCodigo}</strong> ➔ <strong>{objeto.ubicacion.cajaCodigo}</strong> (Espacio {objeto.ubicacion.espacio})
              </span>
            </div>
          </div>

          {/* Selector de Cantidad con controles grandes y cómodos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cantidad a retirar:
              </label>
              <span className="text-xs text-slate-500">
                Disponible: <strong className="text-slate-800">{maximoDisponible} {objeto.unidadMedida}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-300 flex-1">
                <button
                  type="button"
                  onClick={handleDecrementar}
                  disabled={cantidad <= 1 || procesando}
                  aria-label="Disminuir cantidad"
                  className="w-12 h-12 rounded-lg bg-white shadow-2xs hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-all font-bold"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center font-mono font-extrabold text-2xl text-slate-900">
                  {cantidad}
                </div>
                <button
                  type="button"
                  onClick={handleIncrementar}
                  disabled={cantidad >= maximoDisponible || procesando}
                  aria-label="Aumentar cantidad"
                  className="w-12 h-12 rounded-lg bg-white shadow-2xs hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-all font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Botón rápido sacar todo el lote */}
              <button
                type="button"
                onClick={handleSetMax}
                disabled={procesando}
                className="px-3 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all"
              >
                Todo ({maximoDisponible})
              </button>
            </div>

            {/* Previsualización del saldo restante */}
            <div className="mt-2 text-xs flex justify-between text-slate-500 px-1">
              <span>Saldo tras retiro:</span>
              <span className={`font-bold ${stockRestante === 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                {stockRestante} {objeto.unidadMedida} restantes
              </span>
            </div>
          </div>

          {/* Motivo o destino rápido */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivo del retiro:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Orden de Mantenimiento',
                'Prueba Técnica en Línea',
                'Reparación de Tablero',
                'Dotación a Técnico'
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMotivo(m)}
                  className={`p-2 rounded-lg text-left font-medium border transition-all ${
                    motivo === m
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Alerta de Error Recuperable */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onCerrar}
              disabled={procesando}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesando || maximoDisponible <= 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando salida...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirmar Salida ({cantidad} {objeto.unidadMedida})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
