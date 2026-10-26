import React from 'react';
import { 
  Boxes, 
  Search, 
  ArrowDownLeft, 
  History, 
  RotateCcw, 
  ShieldCheck, 
  UserCheck, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  vistaActual: 'almacen' | 'busqueda' | 'historial';
  onCambiarVista: (vista: 'almacen' | 'busqueda' | 'historial') => void;
  onAbrirDevolver: () => void;
  onResetDemo: () => void;
  totalMovimientos: number;
  colapsada: boolean;
  onToggleColapsar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  vistaActual,
  onCambiarVista,
  onAbrirDevolver,
  onResetDemo,
  totalMovimientos,
  colapsada,
  onToggleColapsar
}) => {
  return (
    <aside 
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 select-none z-30 shrink-0 ${
        colapsada ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5 text-emerald-400" />
          </div>
          {!colapsada && (
            <div className="truncate">
              <h1 className="font-semibold text-white text-sm tracking-tight truncate">
                Almacén Visual
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium">Terminal Trabajador</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleColapsar}
          aria-label={colapsada ? "Expandir menú lateral" : "Colapsar menú lateral"}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={colapsada ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
          {colapsada ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => onCambiarVista('almacen')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            vistaActual === 'almacen'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
          }`}
          title="Ver almacén y gabinetes físicos"
        >
          <Boxes className="w-5 h-5 shrink-0" />
          {!colapsada && <span className="truncate">Almacén y Gabinetes</span>}
        </button>

        <button
          onClick={() => onCambiarVista('busqueda')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            vistaActual === 'busqueda'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
          }`}
          title="Búsqueda rápida de objetos"
        >
          <Search className="w-5 h-5 shrink-0" />
          {!colapsada && <span className="truncate">Buscar Objeto</span>}
        </button>

        <button
          onClick={onAbrirDevolver}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-colors"
          title="Introducir o devolver un objeto"
        >
          <ArrowDownLeft className="w-5 h-5 shrink-0 text-emerald-400" />
          {!colapsada && <span className="truncate">Devolver / Reingresar</span>}
        </button>

        <button
          onClick={() => onCambiarVista('historial')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            vistaActual === 'historial'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
          }`}
          title="Historial de movimientos de turno"
        >
          <div className="flex items-center gap-3 truncate">
            <History className="w-5 h-5 shrink-0" />
            {!colapsada && <span className="truncate">Movimientos del Turno</span>}
          </div>
          {!colapsada && (
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {totalMovimientos}
            </span>
          )}
        </button>
      </nav>

      {/* Demo helper & Reset action */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onResetDemo}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Restablecer datos ficticios iniciales"
        >
          <RotateCcw className="w-4 h-4 shrink-0 text-slate-400" />
          {!colapsada && <span>Reiniciar Datos Demo</span>}
        </button>

        {/* Worker Badge */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            {!colapsada && (
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">Carlos P. (Operador)</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>Turno Activo • Nave 3</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Ficticio */}
        {!colapsada && (
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Demostración con datos ficticios</span>
          </div>
        )}
      </div>
    </aside>
  );
};
