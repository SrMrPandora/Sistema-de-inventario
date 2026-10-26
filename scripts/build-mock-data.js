import fs from 'fs';
import xlsx from 'xlsx';

const wb = xlsx.readFile('../Inventario_Por_Gabinete.xlsx');
const sheet = wb.Sheets['Gabinete Gris 1'];
const rawData = xlsx.utils.sheet_to_json(sheet);

function cleanStr(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

// Generar lista de gabinetes y sus cajas (6 columnas de ancho x 5 filas de alto)
const GABINETES_DEFS = [
  {
    id: 'GAB-GRIS1-A',
    codigo: 'GRIS 1 - Módulo A',
    gabinetePadre: 'Gabinete GRIS 1',
    seccion: 'A',
    nombre: 'Neumática, Ventosas & Cilindros SMC',
    zona: 'Nave Central - Estación Neumática A',
    descripcion: 'Almacenamiento de ventosas de vacío, mini cilindros y pinzas neumáticas paralelas.',
    filas: 5,
    columnas: 6,
    maxCajas: 30,
    prefix: 'A'
  },
  {
    id: 'GAB-GRIS1-B',
    codigo: 'GRIS 1 - Módulo B',
    gabinetePadre: 'Gabinete GRIS 1',
    seccion: 'B',
    nombre: 'Válvulas, Actuadores & Fuentes',
    zona: 'Nave Central - Estación de Válvulas B',
    descripcion: 'Electroválvulas solenoide serie SY, mesas de deslizamiento y fuentes conmutadas.',
    filas: 5,
    columnas: 6,
    maxCajas: 42,
    prefix: 'B'
  },
  {
    id: 'GAB-GRIS1-C',
    codigo: 'GRIS 1 - Módulo C',
    gabinetePadre: 'Gabinete GRIS 1',
    seccion: 'C',
    nombre: 'Conectores, Filtros & FRL',
    zona: 'Nave Central - Accesorios & Conectores C',
    descripcion: 'Conexiones instantáneas KQ2, silenciadores de escape y reguladores de presión modular.',
    filas: 5,
    columnas: 6,
    maxCajas: 48,
    prefix: 'C'
  },
  {
    id: 'GAB-GRIS2',
    codigo: 'Gabinete GRIS 2',
    gabinetePadre: 'Gabinete GRIS 2',
    seccion: 'SENSORES',
    nombre: 'Detección, Sensores Láser & Fibra Óptica',
    zona: 'Laboratorio de Calidad - Panel de Sensores',
    descripcion: 'Sensores fotoeléctricos, inductivos, amplificadores de fibra KEYENCE, Panasonic y OMRON.',
    filas: 5,
    columnas: 6,
    maxCajas: 30,
    prefix: 'FILAS_A_E' // A=1, B=2, C=3, D=4, E=5
  }
];

// Construir cajas físicas para cada gabinete
const gabinetesList = GABINETES_DEFS.map(def => {
  const cajas = [];
  
  if (def.prefix === 'FILAS_A_E') {
    // GRIS 2: 5 filas (A, B, C, D, E) y 6 columnas (01 a 06)
    const letrasFilas = ['A', 'B', 'C', 'D', 'E'];
    for (let f = 1; f <= 5; f++) {
      const letra = letrasFilas[f - 1];
      for (let c = 1; c <= 6; c++) {
        const cod = `${letra}-0${c}`;
        cajas.push({
          id: `CAJA-GRIS2-${letra}-${c}`,
          gabineteId: def.id,
          numero: (f - 1) * 6 + c,
          codigo: cod,
          fila: f,
          columna: c,
          nombreEtiqueta: `Fila ${letra} - Posición ${c}`,
          totalEspacios: 4
        });
      }
    }
  } else {
    // GRIS 1 (Módulos A, B, C): Cajas numeradas 1 a maxCajas, 6 columnas de ancho
    const totalCajas = Math.max(30, def.maxCajas);
    for (let i = 1; i <= totalCajas; i++) {
      const fila = Math.ceil(i / 6);
      const columna = ((i - 1) % 6) + 1;
      const numStr = i < 10 ? `0${i}` : `${i}`;
      const cod = `${def.prefix}-${numStr}`;

      cajas.push({
        id: `CAJA-${def.prefix}-${i}`,
        gabineteId: def.id,
        numero: i,
        codigo: cod,
        fila,
        columna,
        nombreEtiqueta: `${def.prefix} - Caja ${numStr}`,
        totalEspacios: 4
      });
    }
  }

  return {
    id: def.id,
    codigo: def.codigo,
    gabinetePadre: def.gabinetePadre,
    seccion: def.seccion,
    nombre: def.nombre,
    zona: def.zona,
    descripcion: def.descripcion,
    filas: def.filas,
    columnas: def.columnas,
    cajas
  };
});

// Construir lista de objetos del inventario a partir del XLSX
const itemsList = [];

rawData.forEach((r, idx) => {
  const desc = cleanStr(r['Descripcion']);
  const rawSku = cleanStr(r['Num. De pieza/SKU']);
  const marca = cleanStr(r['Marca']) || 'SMC';
  const cat = cleanStr(r['Categoría'] || r['Categoria']) || 'Componente';
  const stock = parseInt(r['Stock Inicial'], 10) || 0;
  const rawLoc = cleanStr(r['Donde se encuentra']);
  const rawGab = cleanStr(r['Gabinete '] || r['Gabinete']) || 'GRIS 1';

  if (!desc && !rawSku && !marca) return;

  const sku = rawSku || (desc.startsWith('Arandela') ? 'ARAN-M5' : desc.startsWith('Manometro') ? 'MAN-SMC' : `COMP-${idx + 1}`);
  const nombre = desc || `${marca} ${sku}`;

  const esGris2 = rawGab.toUpperCase().includes('GRIS 2');

  // Mapear ubicación a la caja física correspondiente
  let targetGabId = 'GAB-GRIS1-A';
  let boxCodigo = 'A-01';
  let boxNumero = 1;
  let fila = 1;
  let columna = 1;

  if (esGris2) {
    targetGabId = 'GAB-GRIS2';
    // En Gris 2 las ubicaciones son como A-01, B-02, C-04, D-03
    const match = rawLoc.match(/([A-Da-d])[-]?(\d+)/);
    if (match) {
      const letra = match[1].toUpperCase();
      const col = Math.min(6, Math.max(1, parseInt(match[2], 10)));
      const filaMap = { A: 1, B: 2, C: 3, D: 4, E: 5 };
      fila = filaMap[letra] || 1;
      columna = col;
      boxCodigo = `${letra}-0${col}`;
      boxNumero = (fila - 1) * 6 + columna;
    } else {
      boxCodigo = 'A-01';
      fila = 1;
      columna = 1;
      boxNumero = 1;
    }
  } else {
    // GRIS 1: Módulos A, B, C
    const firstLoc = rawLoc.split(/[,/]/)[0].trim();
    const match = firstLoc.match(/([A-Ca-c])[-]?(\d+)/);
    if (match) {
      const sec = match[1].toUpperCase();
      const num = parseInt(match[2], 10);
      targetGabId = `GAB-GRIS1-${sec}`;
      boxNumero = num;
      fila = Math.ceil(num / 6);
      columna = ((num - 1) % 6) + 1;
      boxCodigo = `${sec}-${num < 10 ? '0' + num : num}`;
    } else {
      targetGabId = 'GAB-GRIS1-A';
      boxCodigo = 'A-01';
      boxNumero = 1;
      fila = 1;
      columna = 1;
    }
  }

  // Buscar si la caja existe en el gabinete, si no asignar fallback válido
  const gab = gabinetesList.find(g => g.id === targetGabId) || gabinetesList[0];
  let caja = gab.cajas.find(c => c.codigo === boxCodigo) || gab.cajas[0];

  const stockMin = Math.max(1, Math.min(10, Math.floor(stock * 0.25)));
  const estado = stock === 0 ? 'AGOTADO' : stock <= stockMin ? 'BAJO_STOCK' : 'DISPONIBLE';

  itemsList.push({
    id: `item-${idx + 1}`,
    sku,
    nombre,
    marca,
    categoria: cat,
    descripcion: desc || `${nombre} para automatización y control industrial.`,
    cantidadDisponible: stock,
    unidadMedida: 'piezas',
    stockMinimo: stockMin,
    estado,
    ubicacion: {
      gabineteId: gab.id,
      gabineteCodigo: gab.codigo,
      gabinetePadre: gab.gabinetePadre,
      seccion: gab.seccion,
      cajaId: caja.id,
      cajaNumero: caja.numero,
      cajaCodigo: caja.codigo,
      fila: caja.fila,
      columna: caja.columna,
      espacio: ((idx % 4) + 1), // Asignar un compartimento interno del 1 al 4
      rawUbicacion: rawLoc || caja.codigo
    }
  });
});

// Movimientos iniciales de demo realistas
const movimientosDemo = [
  {
    id: 'mov-demo-01',
    tipo: 'SACAR',
    objetoId: itemsList[0]?.id || 'item-1',
    objetoNombre: itemsList[0]?.nombre || 'Ventosa de vacío industrial con adaptador y suspensión',
    sku: itemsList[0]?.sku || 'ZPT10BUK10-06-A10',
    cantidad: 2,
    unidad: 'piezas',
    ubicacion: {
      gabineteCodigo: itemsList[0]?.ubicacion.gabineteCodigo || 'GRIS 1 - Módulo A',
      cajaNumero: itemsList[0]?.ubicacion.cajaNumero || 1,
      cajaCodigo: itemsList[0]?.ubicacion.cajaCodigo || 'A-01',
      espacio: itemsList[0]?.ubicacion.espacio || 1
    },
    motivo: 'Mantenimiento preventivo en celda de empaque',
    trabajador: 'Carlos P. (Operador)',
    fechaHora: 'Hoy, 08:15 AM',
    stockRestante: Math.max(0, (itemsList[0]?.cantidadDisponible || 5) - 2)
  },
  {
    id: 'mov-demo-02',
    tipo: 'DEVOLVER',
    objetoId: itemsList[3]?.id || 'item-4',
    objetoNombre: itemsList[3]?.nombre || 'Pinza neumática paralela estándar de doble efecto',
    sku: itemsList[3]?.sku || 'MHZ2-10D-M9B',
    cantidad: 1,
    unidad: 'piezas',
    ubicacion: {
      gabineteCodigo: itemsList[3]?.ubicacion.gabineteCodigo || 'GRIS 1 - Módulo A',
      cajaNumero: itemsList[3]?.ubicacion.cajaNumero || 2,
      cajaCodigo: itemsList[3]?.ubicacion.cajaCodigo || 'A-02',
      espacio: itemsList[3]?.ubicacion.espacio || 2
    },
    motivo: 'Devolución tras reemplazo de kit de sellos',
    trabajador: 'Carlos P. (Operador)',
    fechaHora: 'Hoy, 07:40 AM',
    stockRestante: (itemsList[3]?.cantidadDisponible || 2)
  }
];

// Generar archivo mockData.ts
const fileContent = `import { GabineteFisico, ObjetoInventario, RegistroMovimiento } from '../types';

export const GABINETES_INICIALES: GabineteFisico[] = ${JSON.stringify(gabinetesList, null, 2)};

export const OBJETOS_INICIALES: ObjetoInventario[] = ${JSON.stringify(itemsList, null, 2)};

export const MOVIMIENTOS_DEMO: RegistroMovimiento[] = ${JSON.stringify(movimientosDemo, null, 2)};

const STORAGE_KEY_ITEMS = 'demo_trabajador_inventario_items_v2';
const STORAGE_KEY_MOVIMIENTOS = 'demo_trabajador_inventario_movimientos_v2';

export function getStoredItems(): ObjetoInventario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo items locales', e);
  }
  return OBJETOS_INICIALES;
}

export function saveStoredItems(items: ObjetoInventario[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando items locales', e);
  }
}

export function getStoredMovimientos(): RegistroMovimiento[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOVIMIENTOS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo movimientos locales', e);
  }
  return MOVIMIENTOS_DEMO;
}

export function saveStoredMovimientos(movs: RegistroMovimiento[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MOVIMIENTOS, JSON.stringify(movs));
  } catch (e) {
    console.error('Error guardando movimientos locales', e);
  }
}

export function resetDemoData(): { items: ObjetoInventario[]; movimientos: RegistroMovimiento[] } {
  localStorage.removeItem(STORAGE_KEY_ITEMS);
  localStorage.removeItem(STORAGE_KEY_MOVIMIENTOS);
  return {
    items: OBJETOS_INICIALES,
    movimientos: MOVIMIENTOS_DEMO
  };
}
`;

fs.writeFileSync('src/data/mockData.ts', fileContent, 'utf8');
console.log('Successfully wrote src/data/mockData.ts with', itemsList.length, 'items and', gabinetesList.length, 'cabinets!');
