import React, { useState, useMemo, useEffect } from 'react';
import { 
  ObjetoInventario, 
  RegistroMovimiento 
} from './types';
import { 
  GABINETES_INICIALES, 
  getStoredItems, 
  saveStoredItems, 
  getStoredMovimientos, 
  saveStoredMovimientos, 
  resetDemoData 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CabinetSchematic } from './components/CabinetSchematic';
import { SearchResults } from './components/SearchResults';
import { ItemDetailCard } from './components/ItemDetailCard';
import { SacarModal } from './components/SacarModal';
import { DevolverModal } from './components/DevolverModal';
import { ConfirmationToast } from './components/ConfirmationToast';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Search } from 'lucide-react';

export const App: React.FC = () => {
  // Estados de datos
  const [objetos, setObjetos] = useState<ObjetoInventario[]>(() => getStoredItems());
  const [movimientos, setMovimientos] = useState<RegistroMovimiento[]>(() => getStoredMovimientos());
  const gabinetes = GABINETES_INICIALES;

  // Estados de interfaz y navegación
  const [vistaActual, setVistaActual] = useState<'almacen' | 'busqueda' | 'historial'>('almacen');
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(false);

  // Estados de búsqueda y filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas');

  // Estados de foco y selección
  const [gabineteActivoId, setGabineteActivoId] = useState<string>('GAB-A01');
  const [cajaSeleccionadaId, setCajaSeleccionadaId] = useState<string | null>(null);
  const [objetoFoco, setObjetoFoco] = useState<ObjetoInventario | null>(() => objetos[0] || null);

  // Estados de modales
  const [objetoParaSacar, setObjetoParaSacar] = useState<ObjetoInventario | null>(null);
  const [devolverModalAbierto, setDevolverModalAbierto] = useState<boolean>(false);
  const [objetoPredefinidoDevolver, setObjetoPredefinidoDevolver] = useState<ObjetoInventario | null>(null);
  const [confirmacionToast, setConfirmacionToast] = useState<RegistroMovimiento | null>(null);

  // Guardar en almacenamiento local ante cambios
  useEffect(() => {
    saveStoredItems(objetos);
  }, [objetos]);

  useEffect(() => {
    saveStoredMovimientos(movimientos);
  }, [movimientos]);

  // Lista de categorías únicas para los filtros rápidos
  const categoriasDisponibles = useMemo(() => {
    const cats = new Set(objetos.map(o => o.categoria));
    return ['Todas', ...Array.from(cats)];
  }, [objetos]);

  // Filtrado de objetos por búsqueda y categoría
  const objetosFiltrados = useMemo(() => {
    return objetos.filter((obj) => {
      // Filtro de categoría
      if (categoriaActiva !== 'Todas' && obj.categoria !== categoriaActiva) {
        return false;
      }

      // Si no hay texto de búsqueda
      if (!busqueda.trim()) {
        return true;
      }

      const q = busqueda.toLowerCase().trim();
      const matchNombre = obj.nombre.toLowerCase().includes(q);
      const matchSku = obj.sku.toLowerCase().includes(q);
      const matchMarca = obj.marca ? obj.marca.toLowerCase().includes(q) : false;
      const matchCategoria = obj.categoria.toLowerCase().includes(q);
      const matchGabinete = obj.ubicacion.gabineteCodigo.toLowerCase().includes(q);
      const matchCaja = obj.ubicacion.cajaCodigo.toLowerCase().includes(q);

      return matchNombre || matchSku || matchMarca || matchCategoria || matchGabinete || matchCaja;
    });
  }, [objetos, busqueda, categoriaActiva]);

  // Manejar selección de un objeto desde la búsqueda o el plano
  const handleSeleccionarObjeto = (objeto: ObjetoInventario) => {
    setObjetoFoco(objeto);
    setGabineteActivoId(objeto.ubicacion.gabineteId);
    setCajaSeleccionadaId(objeto.ubicacion.cajaId);
  };

  // Enfocar gabinete desde el detalle
  const handleEnfocarGabinete = (gabineteId: string) => {
    setGabineteActivoId(gabineteId);
    setVistaActual('almacen');
  };

  // Localizar en estante desde confirmación o historial
  const handleVerGabineteYcaja = (gabineteCodigo: string, cajaNumero: number) => {
    const targetGab = gabinetes.find(g => g.codigo === gabineteCodigo);
    if (targetGab) {
      setGabineteActivoId(targetGab.id);
      const targetCaja = targetGab.cajas.find(c => c.numero === cajaNumero);
      if (targetCaja) {
        setCajaSeleccionadaId(targetCaja.id);
      }
    }
    setVistaActual('almacen');
  };

  // Abrir modal de sacar
  const handleAbrirSacar = (objeto: ObjetoInventario) => {
    setObjetoParaSacar(objeto);
  };

  // Abrir modal de devolver
  const handleAbrirDevolver = (objeto?: ObjetoInventario) => {
    setObjetoPredefinidoDevolver(objeto || objetoFoco || null);
    setDevolverModalAbierto(true);
  };

  // Confirmar SACAR
  const handleConfirmarSacar = async (cantidad: number, motivo: string) => {
    if (!objetoParaSacar) return;

    // Simular latencia sutil realista de procesamiento (220ms)
    await new Promise(resolve => setTimeout(resolve, 220));

    const nuevoStock = Math.max(0, objetoParaSacar.cantidadDisponible - cantidad);
    const nuevoEstado = nuevoStock === 0 ? 'AGOTADO' : nuevoStock <= objetoParaSacar.stockMinimo ? 'BAJO_STOCK' : 'DISPONIBLE';

    const objetoActualizado: ObjetoInventario = {
      ...objetoParaSacar,
      cantidadDisponible: nuevoStock,
      estado: nuevoEstado
    };

    // Actualizar lista de objetos
    setObjetos(prev => prev.map(o => o.id === objetoParaSacar.id ? objetoActualizado : o));

    if (objetoFoco?.id === objetoParaSacar.id) {
      setObjetoFoco(objetoActualizado);
    }

    // Registrar movimiento
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nuevoRegistro: RegistroMovimiento = {
      id: `mov-${Date.now()}`,
      tipo: 'SACAR',
      objetoId: objetoParaSacar.id,
      objetoNombre: objetoParaSacar.nombre,
      sku: objetoParaSacar.sku,
      cantidad,
      unidad: objetoParaSacar.unidadMedida,
      ubicacion: {
        gabineteCodigo: objetoParaSacar.ubicacion.gabineteCodigo,
        cajaNumero: objetoParaSacar.ubicacion.cajaNumero,
        espacio: objetoParaSacar.ubicacion.espacio
      },
      motivo,
      trabajador: 'Carlos P. (Operador)',
      fechaHora: `Hoy, ${horaFormateada}`,
      stockRestante: nuevoStock
    };

    setMovimientos(prev => [nuevoRegistro, ...prev]);
    setObjetoParaSacar(null);
    setConfirmacionToast(nuevoRegistro);
  };

  // Confirmar DEVOLVER
  const handleConfirmarDevolver = async (
    objetoId: string,
    cantidad: number,
    ubicacion: { gabineteCodigo: string; cajaNumero: number; espacio: number },
    motivo: string
  ) => {
    await new Promise(resolve => setTimeout(resolve, 220));

    const objOriginal = objetos.find(o => o.id === objetoId);
    if (!objOriginal) return;

    const targetGab = gabinetes.find(g => g.codigo === ubicacion.gabineteCodigo) || gabinetes[0];
    const targetCaja = targetGab.cajas.find(c => c.numero === ubicacion.cajaNumero) || targetGab.cajas[0];

    const nuevoStock = objOriginal.cantidadDisponible + cantidad;
    const nuevoEstado = nuevoStock <= objOriginal.stockMinimo ? 'BAJO_STOCK' : 'DISPONIBLE';

    const objetoActualizado: ObjetoInventario = {
      ...objOriginal,
      cantidadDisponible: nuevoStock,
      estado: nuevoEstado,
      ubicacion: {
        gabineteId: targetGab.id,
        gabineteCodigo: targetGab.codigo,
        gabineteNombre: targetGab.nombre,
        cajaId: targetCaja.id,
        cajaNumero: targetCaja.numero,
        cajaCodigo: targetCaja.codigo,
        espacio: ubicacion.espacio
      }
    };

    setObjetos(prev => prev.map(o => o.id === objetoId ? objetoActualizado : o));
    setObjetoFoco(objetoActualizado);
    setGabineteActivoId(targetGab.id);
    setCajaSeleccionadaId(targetCaja.id);

    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nuevoRegistro: RegistroMovimiento = {
      id: `mov-${Date.now()}`,
      tipo: 'DEVOLVER',
      objetoId: objOriginal.id,
      objetoNombre: objOriginal.nombre,
      sku: objOriginal.sku,
      cantidad,
      unidad: objOriginal.unidadMedida,
      ubicacion: {
        gabineteCodigo: ubicacion.gabineteCodigo,
        cajaNumero: ubicacion.cajaNumero,
        espacio: ubicacion.espacio
      },
      motivo,
      trabajador: 'Carlos P. (Operador)',
      fechaHora: `Hoy, ${horaFormateada}`,
      stockRestante: nuevoStock
    };

    setMovimientos(prev => [nuevoRegistro, ...prev]);
    setDevolverModalAbierto(false);
    setConfirmacionToast(nuevoRegistro);
  };

  // Restablecer demo a los datos originales
  const handleResetDemo = () => {
    const { items, movimientos: movs } = resetDemoData();
    setObjetos(items);
    setMovimientos(movs);
    setObjetoFoco(items[0]);
    setGabineteActivoId('GAB-A01');
    setCajaSeleccionadaId(null);
    setBusqueda('');
    setCategoriaActiva('Todas');
    setVistaActual('almacen');
  };

  const gabineteActivoObj = gabinetes.find(g => g.id === gabineteActivoId) || gabinetes[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* 1. NAVEGACIÓN LATERAL OSCURA (Figma reference) */}
      <Sidebar
        vistaActual={vistaActual}
        onCambiarVista={(v) => {
          setVistaActual(v);
          if (v === 'busqueda') {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
          }
        }}
        onAbrirDevolver={() => handleAbrirDevolver()}
        onResetDemo={handleResetDemo}
        totalMovimientos={movimientos.length}
        colapsada={sidebarColapsada}
        onToggleColapsar={() => setSidebarColapsada(prev => !prev)}
      />

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* 2. ENCABEZADO CON BÚSQUEDA PRIORITARIA */}
        <Header
          busqueda={busqueda}
          onCambiarBusqueda={(val) => {
            setBusqueda(val);
            if (val.trim() && vistaActual === 'historial') {
              setVistaActual('almacen');
            }
          }}
          categoriaActiva={categoriaActiva}
          onCambiarCategoria={setCategoriaActiva}
          categorias={categoriasDisponibles}
          onAbrirDevolver={() => handleAbrirDevolver()}
          gabineteSeleccionadoCodigo={gabineteActivoObj.codigo}
        />

        {/* 3. ESPACIO DE TRABAJO DINÁMICO */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
          {vistaActual === 'historial' ? (
            /* Vista completa de Historial de Movimientos */
            <div className="max-w-4xl mx-auto">
              <HistoryDrawer
                movimientos={movimientos}
                onCerrar={() => setVistaActual('almacen')}
                onVerGabinete={handleVerGabineteYcaja}
              />
            </div>
          ) : (
            /* Vista Principal: Layout de 2 Columnas (Búsqueda / Detalle + Plano Físico de Gabinete) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              
              {/* Columna Izquierda: Resultados o Detalle del Objeto (5 columnas) */}
              <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
                {/* Si hay un objeto seleccionado, mostramos su ficha detallada primero */}
                {objetoFoco && (
                  <ItemDetailCard
                    objeto={objetoFoco}
                    onCerrar={() => setObjetoFoco(null)}
                    onAbrirSacar={handleAbrirSacar}
                    onAbrirDevolver={handleAbrirDevolver}
                    onEnfocarGabinete={handleEnfocarGabinete}
                  />
                )}

                {/* Lista interactiva de resultados o catálogo de objetos */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>{busqueda ? 'Resultados de Búsqueda' : 'Catálogo Rápido del Almacén'}</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {objetosFiltrados.length} disponibles
                    </span>
                  </div>

                  <SearchResults
                    objetos={objetosFiltrados}
                    busqueda={busqueda}
                    objetoSeleccionadoId={objetoFoco?.id || null}
                    onSeleccionarObjeto={handleSeleccionarObjeto}
                  />
                </div>
              </div>

              {/* Columna Derecha: Esquema Físico Conceptual del Gabinete (7 columnas) */}
              <div className="lg:col-span-7 h-full min-h-[500px]">
                <CabinetSchematic
                  gabinetes={gabinetes}
                  gabineteActivoId={gabineteActivoId}
                  onSeleccionarGabinete={(id) => {
                    setGabineteActivoId(id);
                    setCajaSeleccionadaId(null);
                  }}
                  cajaSeleccionadaId={cajaSeleccionadaId}
                  onSeleccionarCaja={setCajaSeleccionadaId}
                  objetoFoco={objetoFoco}
                  objetos={objetos}
                  onSeleccionarObjeto={handleSeleccionarObjeto}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. MODAL: SACAR OBJETO */}
      {objetoParaSacar && (
        <SacarModal
          objeto={objetoParaSacar}
          onCerrar={() => setObjetoParaSacar(null)}
          onConfirmar={handleConfirmarSacar}
        />
      )}

      {/* 5. MODAL: DEVOLVER / INTRODUCIR OBJETO */}
      {devolverModalAbierto && (
        <DevolverModal
          objetoInicial={objetoPredefinidoDevolver}
          todosObjetos={objetos}
          gabinetes={gabinetes}
          onCerrar={() => setDevolverModalAbierto(false)}
          onConfirmar={handleConfirmarDevolver}
        />
      )}

      {/* 6. TOAST DE CONFIRMACIÓN */}
      <ConfirmationToast
        movimiento={confirmacionToast}
        onCerrar={() => setConfirmacionToast(null)}
        onVerGabinete={handleVerGabineteYcaja}
        onHacerOtroMovimiento={() => {
          setConfirmacionToast(null);
          setBusqueda('');
        }}
      />
    </div>
  );
};

export default App;
