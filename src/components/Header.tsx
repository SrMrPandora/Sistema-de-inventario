import React, { useRef, useEffect } from 'react';
import { Search, X, ArrowDownLeft, SlidersHorizontal, MapPin } from 'lucide-react';

interface HeaderProps {
  busqueda: string;
  onCambiarBusqueda: (valor: string) => void;
  categoriaActiva: string;
  onCambiarCategoria: (categoria: string) => void;
  categorias: string[];
  onAbrirDevolver: () => void;
  gabineteSeleccionadoCodigo: string;
}

export const Header: React.FC<HeaderProps> = ({
  busqueda,
  onCambiarBusqueda,
  categoriaActiva,
  onCambiarCategoria,
  categorias,
  onAbrirDevolver,
  gabineteSeleccionadoCodigo
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado: presionar '/' o 'Ctrl+K' para enfocar búsqueda inmediatamente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement !== inputRef.current) ||
          ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-6 py-3 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Barra de búsqueda prominente accesible desde el inicio */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={(e) => onCambiarBusqueda(e.target.value)}
              placeholder="Buscar objeto por nombre, código SKU, categoría o gabinete (ej: HDMI, multímetro, Caja 1)..."
              className="w-full pl-11 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-emerald-500 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-emerald-500/15"
              autoFocus
            />
            {busqueda && (
              <button
                onClick={() => onCambiarBusqueda('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 mr-1.5 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1 absolute right-3 pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Acciones y contexto del almacén */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* Gabinete en foco rápido */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Foco: <strong className="text-slate-800">{gabineteSeleccionadoCodigo}</strong></span>
          </div>

          {/* Botón directo de Introducir / Devolver objeto */}
          <button
            onClick={onAbrirDevolver}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-3 focus:ring-emerald-500/30"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Devolver / Ingresar</span>
          </button>
        </div>
      </div>

      {/* Chips de filtro rápido por categoría */}
      <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 flex items-center gap-1 font-medium shrink-0 pr-1">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          Filtros:
        </span>
        {categorias.map((cat) => {
          const activa = categoriaActiva === cat;
          return (
            <button
              key={cat}
              onClick={() => onCambiarCategoria(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activa
                  ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </header>
  );
};
