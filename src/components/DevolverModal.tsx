import React, { useState } from 'react';
import { ObjetoInventario, GabineteFisico } from '../types';
import { 
  X, 
  Minus, 
  Plus, 
  ArrowDownLeft, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  Check 
} from 'lucide-react';

interface DevolverModalProps {
  objetoInicial?: ObjetoInventario | null;
  todosObjetos: ObjetoInventario[];
  gabinetes: GabineteFisico[];
  onCerrar: () => void;
  onConfirmar: (
    objetoId: string, 
    cantidad: number, 
    ubicacion: { gabineteCodigo: string; cajaNumero: number; espacio: number }, 
    motivo: string
  ) => Promise<void>;
}

export const DevolverModal: React.FC<DevolverModalProps> = ({
  objetoInicial,
  todosObjetos,
  gabinetes,
  onCerrar,
  onConfirmar
}) => {
  const [objetoId, setObjetoId] = useState<string>(objetoInicial?.id || todosObjetos[0]?.id || '');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('Devolución tras mantenimiento');
  const [procesando, setProcesando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const objetoSeleccionado = todosObjetos.find(o => o.id === objetoId) || objetoInicial || todosObjetos[0];

  // Ubicación seleccionada: por defecto la ubicación original del objeto
  const [gabineteCodigo, setGabineteCodigo] = useState<string>(
    objetoSeleccionado?.ubicacion.gabineteCodigo || gabinetes[0].codigo
  );
  const [cajaNumero, setCajaNumero] = useState<number>(
    objetoSeleccionado?.ubicacion.cajaNumero || 1
  );
  const [espacio, setEspacio] = useState<number>(
    objetoSeleccionado?.ubicacion.espacio || 1
  );

  // Al cambiar de objeto, sugerir su ubicación habitual
  const handleCambioObjeto = (nuevoId: string) => {
    setObjetoId(nuevoId);
    const obj = todosObjetos.find(o => o.id === nuevoId);
    if (obj) {
      setGabineteCodigo(obj.ubicacion.gabineteCodigo);
      setCajaNumero(obj.ubicacion.cajaNumero);
      setEspacio(obj.ubicacion.espacio);
    }
  };

  const handleIncrementar = () => {
    setCantidad(prev => prev + 1);
    setError(null);
  };

  const handleDecrementar = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objetoSeleccionado) {
      setError('Debes seleccionar un objeto válido.');
      return;
    }
    if (cantidad <= 0) {
      setError('La cantidad a devolver debe ser mayor a 0.');
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      await onConfirmar(
        objetoSeleccionado.id,
        cantidad,
        {
          gabineteCodigo,
          cajaNumero,
          espacio
        },
        motivo
      );
    } catch (err) {
      setError('Ocurrió un error al registrar la devolución. Inténtalo de nuevo.');
      setProcesando(false);
    }
  };

  const gabineteActual = gabinetes.find(g => g.codigo === gabineteCodigo) || gabinetes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="devolver-title"
      >
        {/* Cabezal de Devolución / Ingreso (Verde Esmeralda) */}
        <div className="bg-emerald-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/60 flex items-center justify-center border border-white/20">
              <ArrowDownLeft className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h2 id="devolver-title" className="font-bold text-base leading-snug">
                Introducir o Devolver Objeto
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Reingreso de material al inventario y asignación de espacio
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            disabled={procesando}
            aria-label="Cerrar modal de devolución"
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Selector de Objeto si no vino predefinido */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Objeto a registrar o devolver:
            </label>
            <select
              value={objetoId}
              onChange={(e) => handleCambioObjeto(e.target.value)}
              disabled={procesando}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 outline-none"
            >
              {todosObjetos.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.nombre} ({obj.sku}) — Actual: {obj.cantidadDisponible} {obj.unidadMedida}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Cantidad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cantidad a ingresar / devolver:
              </label>
              <span className="text-xs text-slate-500">
                Unidad: <strong className="text-slate-800">{objetoSeleccionado?.unidadMedida}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-300 flex-1">
                <button
                  type="button"
                  onClick={handleDecrementar}
                  disabled={cantidad <= 1 || procesando}
                  aria-label="Disminuir cantidad a devolver"
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
                  disabled={procesando}
                  aria-label="Aumentar cantidad a devolver"
                  className="w-12 h-12 rounded-lg bg-white shadow-2xs hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 transition-all font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Atajos de cantidad */}
              <div className="flex gap-1.5">
                {[1, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCantidad(num)}
                    disabled={procesando}
                    className="px-3 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SELECTOR FÍSICO DE UBICACIÓN (Gabinete, Caja, Espacio) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Confirmar Ubicación Física de Depósito:</span>
              </label>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                Recomendada: {objetoSeleccionado?.ubicacion.gabineteCodigo} / {objetoSeleccionado?.ubicacion.cajaCodigo}
              </span>
            </div>

            {/* Selector de Gabinete */}
            <div>
              <p className="text-[11px] text-slate-500 font-semibold mb-1">1. Gabinete / Módulo de Almacenamiento:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {gabinetes.map((gab) => (
                  <button
                    key={gab.id}
                    type="button"
                    onClick={() => {
                      setGabineteCodigo(gab.codigo);
                    }}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                      gabineteCodigo === gab.codigo
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={gab.nombre}
                  >
                    {gab.codigo}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Caja dentro del gabinete */}
            <div>
              <p className="text-[11px] text-slate-500 font-semibold mb-1">2. Caja Física (Matriz de 6 columnas de ancho):</p>
              <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {gabineteActual.cajas.map((caja) => (
                  <button
                    key={caja.id}
                    type="button"
                    onClick={() => setCajaNumero(caja.numero)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold border transition-all text-center ${
                      cajaNumero === caja.numero
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {caja.codigo}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Espacio / Compartimento interno */}
            <div>
              <p className="text-[11px] text-slate-500 font-semibold mb-1">3. Compartimento / Espacio en Caja:</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((esp) => (
                  <button
                    key={esp}
                    type="button"
                    onClick={() => setEspacio(esp)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                      espacio === esp
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-2 ring-emerald-600/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Espacio {esp}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de destino visual */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span>Destino final confirmado:</span>
              <strong className="font-mono font-bold text-emerald-800">
                {gabineteCodigo} ➔ Caja {cajaNumero} ➔ Espacio {espacio}
              </strong>
            </div>
          </div>

          {/* Motivo de devolución */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivo del movimiento:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Devolución tras mantenimiento',
                'Sobrante no utilizado en turno',
                'Reingreso tras calibración',
                'Ingreso de material nuevo'
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMotivo(m)}
                  className={`p-2 rounded-lg text-left font-medium border transition-all ${
                    motivo === m
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Error Recuperable */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 shrink-0">
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
              disabled={procesando}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando devolución...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirmar Depósito ({cantidad} {objetoSeleccionado?.unidadMedida})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
