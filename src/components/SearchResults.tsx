import React from 'react';
import { ObjetoInventario } from '../types';
import { MapPin, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  objetos: ObjetoInventario[];
  busqueda: string;
  objetoSeleccionadoId: string | null;
  onSeleccionarObjeto: (objeto: ObjetoInventario) => void;
  estaCargando?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  objetos,
  busqueda,
  objetoSeleccionadoId,
  onSeleccionarObjeto,
  estaCargando = false
}) => {
  // Función para resaltar las palabras coincidentes en el texto
  const resaltarCoincidencia = (texto: string, consulta: string) => {
    if (!consulta.trim()) return texto;
    const palabras = consulta.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${palabras.join('|')})`, 'gi');
    const partes = texto.split(regex);

    return partes.map((parte, i) =>
      regex.test(parte) ? (
        <mark key={i} className="bg-amber-200 text-amber-950 font-semibold px-0.5 rounded">
          {parte}
        </mark>
      ) : (
        parte
      )
    );
  };

  if (estaCargando) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">Buscando en catálogo y gabinetes...</p>
      </div>
    );
  }

  // Estado: Sin resultados
  if (objetos.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No se encontraron objetos
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          No hay coincidencias para "<span className="font-semibold text-slate-700">{busqueda}</span>". Prueba buscando por código SKU, categoría o nombre general.
        </p>
        <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200/80 inline-block text-left">
          <p className="font-semibold text-slate-600 mb-1">Sugerencias rápidas:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Prueba con "Cable HDMI", "Multímetro" o "Guantes"</li>
            <li>Busca por gabinete como "A-01" o "Caja 1"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>{objetos.length} resultado(s) encontrado(s)</span>
        <span>Haz clic para enfocar en el gabinete</span>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {objetos.map((obj) => {
          const esSeleccionado = objetoSeleccionadoId === obj.id;
          const bajoStock = obj.cantidadDisponible <= obj.stockMinimo;

          return (
            <div
              key={obj.id}
              onClick={() => onSeleccionarObjeto(obj)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                esSeleccionado
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 translate-x-1'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {resaltarCoincidencia(obj.sku, busqueda)}
                    </span>
                    {obj.marca && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {obj.marca}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      {obj.categoria}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {resaltarCoincidencia(obj.nombre, busqueda)}
                  </h4>
                </div>

                {/* Badge de cantidad */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                      obj.cantidadDisponible === 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : bajoStock
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {obj.cantidadDisponible} {obj.unidadMedida}
                  </span>
                </div>
              </div>

              {/* Ubicación física clara en ruta */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="text-slate-900">{obj.ubicacion.gabineteCodigo}</strong>
                    {' '}➔ {obj.ubicacion.cajaCodigo}
                    {' '}➔ Espacio <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1 rounded">{obj.ubicacion.espacio}</span>
                  </span>
                </div>

                {esSeleccionado && (
                  <span className="text-[11px] font-bold text-emerald-600">
                    En foco visual ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
