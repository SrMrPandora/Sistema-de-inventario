export interface UbicacionFisica {
  gabineteId: string;
  gabineteCodigo: string;
  gabineteNombre?: string;
  gabinetePadre?: string;
  seccion?: string;
  cajaId: string;
  cajaNumero: number;
  cajaCodigo: string;
  fila?: number;
  columna?: number;
  espacio: number; // 1, 2, 3, 4
  rawUbicacion?: string;
}

export interface ObjetoInventario {
  id: string;
  sku: string;
  nombre: string;
  marca?: string;
  categoria: string;
  descripcion: string;
  ubicacion: UbicacionFisica;
  cantidadDisponible: number;
  unidadMedida: string; // 'unidades', 'piezas', 'pares', 'rollos'
  stockMinimo: number;
  estado: 'DISPONIBLE' | 'BAJO_STOCK' | 'AGOTADO';
  especificaciones?: string;
  codigoBarras?: string;
}

export interface CajaFisica {
  id: string;
  gabineteId: string;
  numero: number;
  codigo: string;
  fila: number; // 1 a 5 (o superior si extendido)
  columna: number; // 1 a 6 (6 cajas de ancho)
  nombreEtiqueta: string;
  totalEspacios: number;
  colorBorde?: string;
}

export interface GabineteFisico {
  id: string;
  codigo: string;
  gabinetePadre?: string;
  seccion?: string;
  nombre: string;
  zona: string;
  descripcion: string;
  filas: number;
  columnas: number;
  cajas: CajaFisica[];
}

export type TipoMovimiento = 'SACAR' | 'DEVOLVER' | 'INTRODUCIR';

export interface RegistroMovimiento {
  id: string;
  tipo: TipoMovimiento;
  objetoId: string;
  objetoNombre: string;
  sku: string;
  cantidad: number;
  unidad: string;
  ubicacion: {
    gabineteCodigo: string;
    cajaNumero: number;
    cajaCodigo?: string;
    espacio: number;
  };
  motivo?: string;
  trabajador: string;
  fechaHora: string;
  stockRestante: number;
}
