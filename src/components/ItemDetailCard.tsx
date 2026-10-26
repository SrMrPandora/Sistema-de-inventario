import React from 'react';
import { ObjetoInventario } from '../types';
import { 
  MapPin, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';

interface ItemDetailCardProps {
  objeto: ObjetoInventario;
  onCerrar: () => void;
  onAbrirSacar: (objeto: ObjetoInventario) => void;
  onAbrirDevolver: (objeto: ObjetoInventario) => void;
  onEnfocarGabinete: (gabineteId: string) => void;
}

export const ItemDetailCard: React.FC<ItemDetailCardProps> = ({
  objeto,
  onCerrar,
  onAbrirSacar,
  onAbrirDevolver,
  onEnfocarGabinete
}) => {
  const tieneStock = objeto.cantidadDisponible > 0;
  const stockCritico = objeto.cantidadDisponible <= objeto.stockMinimo;

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md p-4 sm:p-5 relative animate-fadeIn">
      {/* Botón cerrar detalle */}
      <button
        onClick={onCerrar}
        aria-label="Cerrar detalle de objeto"
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        title="Volver a lista completa"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Encabezado: Categoría, Marca y SKU */}
      <div className="flex flex-wrap items-center gap-2 mb-2 pr-8">
        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {objeto.sku}
        </span>
        {objeto.marca && (
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {objeto.marca}
          </span>
        )}
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {objeto.categoria}
        </span>
      </div>

      {/* Título Principal de Alta Jerarquía */}
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mb-3">
        {objeto.nombre}
      </h3>

      {/* UBICACIÓN FÍSICA DESTACADA (Jerarquía prioritaria según el Brief) */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 mb-4 shadow-inner">
        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Ubicación Exacta de Almacén
          </span>
          <button
            onClick={() => onEnfocarGabinete(objeto.ubicacion.gabineteId)}
            className="text-[11px] underline text-emerald-300 hover:text-white transition-colors"
          >
            Enfocar en plano
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/90 rounded-lg p-2 border border-slate-700">
            <p className="text-[10px] text-slate-400 uppercase font-mono">1. Gabinete</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {objeto.ubicacion.gabineteCodigo}
            </p>
          </div>
          <div className="bg-slate-800/90 rounded-lg p-2 border border-emerald-500/50 bg-emerald-950/20">
            <p className="text-[10px] text-emerald-400 uppercase font-mono font-semibold">2. Caja</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
              {objeto.ubicacion.cajaCodigo}
            </p>
          </div>
          <div className="bg-slate-800/90 rounded-lg p-2 border border-emerald-400 bg-emerald-900/30">
            <p className="text-[10px] text-emerald-300 uppercase font-mono font-semibold">3. Espacio</p>
            <p className="text-xs sm:text-sm font-extrabold text-emerald-200 mt-0.5">
              Espacio {objeto.ubicacion.espacio}
            </p>
          </div>
        </div>
      </div>

      {/* Estado de Existencias */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">Existencia disponible:</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900">
              {objeto.cantidadDisponible}
            </span>
            <span className="text-sm font-bold text-slate-600">
              {objeto.unidadMedida}
            </span>
          </div>
        </div>

        <div>
          {objeto.cantidadDisponible === 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Agotado
            </span>
          ) : stockCritico ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Stock Bajo (Mín: {objeto.stockMinimo})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Disponible
            </span>
          )}
        </div>
      </div>

      {/* ACCIONES PRINCIPALES: SACAR vs DEVOLVER (Claramente diferenciadas) */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Acciones de movimiento:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* BOTÓN SACAR (Ámbar / Naranja de Extracción con alto contraste) */}
          <button
            onClick={() => onAbrirSacar(objeto)}
            disabled={!tieneStock}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-xs transition-all ${
              tieneStock
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white hover:shadow focus:ring-4 focus:ring-amber-500/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            <span>SACAR OBJETO</span>
          </button>

          {/* BOTÓN DEVOLVER / INTRODUCIR (Verde Marca) */}
          <button
            onClick={() => onAbrirDevolver(objeto)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs hover:shadow transition-all focus:ring-4 focus:ring-emerald-500/25"
          >
            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
            <span>DEVOLVER / INGRESAR</span>
          </button>
        </div>
      </div>

      {/* Especificaciones / Descripción complementaria */}
      <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-200">
        <p className="flex items-start gap-1.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{objeto.descripcion}</span>
        </p>
        {objeto.especificaciones && (
          <p className="font-mono text-[11px] text-slate-500 pl-5">
            <strong>Especificación:</strong> {objeto.especificaciones}
          </p>
        )}
      </div>
    </div>
  );
};
