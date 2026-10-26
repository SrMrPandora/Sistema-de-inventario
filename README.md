# Demo Visual de Inventario para Trabajadores

Demo interactiva de alta fidelidad orientada a la experiencia diaria del trabajador de almacén. Diseñada siguiendo las especificaciones del brief técnico y actualizada con los datos reales de **`Inventario_Por_Gabinete.xlsx`** y la estructura de mueble físico de **6 cajas de ancho por 5 de alto**.

---

## 🚀 Cómo Iniciar la Demo

### Opción 1: Con el ejecutable directo (Recomendado en Windows)
Haz doble clic en:
```bat
iniciar_demo.bat
```

### Opción 2: Desde la terminal
```bash
npm run dev
```
La aplicación abrirá automáticamente la dirección local: **`http://localhost:3000`**

---

## 🗄️ Nueva Arquitectura de Gabinetes (6 Cajas de Ancho × 5 de Alto)

Se implementó el formato físico exacto solicitado:
- **6 Cajas de ancho (Columnas 1 al 6):** Disposición horizontal tipo rack industrial de gavetas.
- **5 Cajas de alto (Filas 1 al 5):** Cada entrepaño estructural aloja una fila de 6 cajas continuas.
- **Gavetero de 30 compartimentos:** Cada vista despliega una cuadrícula de 30 cajas (`grid-cols-6`).
- **Módulos configurados del archivo XLSX:**
  1. **Gabinete GRIS 1 — Módulo A:** Ventosas de vacío, pinzas neumáticas y cilindros guiados SMC (Cajas A-01 a A-30).
  2. **Gabinete GRIS 1 — Módulo B:** Válvulas solenoide serie SY, mesas de deslizamiento y actuadores (Cajas B-01 a B-30, con selector para filas 6 a 8).
  3. **Gabinete GRIS 1 — Módulo C:** Conectores instantáneos KQ2, silenciadores y unidades FRL (Cajas C-01 a C-30, con selector para filas 6 a 8).
  4. **Gabinete GRIS 2:** Sensores fotoeléctricos, inductivos, amplificadores de fibra KEYENCE, Panasonic y OMRON (Filas A, B, C, D, E × 6 columnas).

---

## 📦 Datos del Archivo Excel Integrados
Se cargaron **246 referencias reales** extraídas directamente de `Inventario_Por_Gabinete.xlsx`:
- **Marcas industriales:** SMC, KEYENCE, Panasonic, OMRON, AirTAC, Trupper, Parker Legris, Baumer, Banner, etc.
- **Categorías:** Sensores, Cilindros, Válvulas, Electroválvulas, Mesas Móviles, Grippers (Pinzas), Fuentes, Acoplamientos.
- **Búsqueda instantánea:** Puedes buscar por SKU (`ZPT10BUK10-06-A10`, `MHZ2-10D-M9B`, `FU-77TZ`, `SY5220-5DZ-C4`), por descripción o por marca. Al seleccionar cualquier resultado, el sistema enfoca de inmediato el gabinete correspondiente, activa el módulo y resalta la caja exacta en el plano 6×5.

---

## 🎯 Flujos Principales para Probar

1. **Búsqueda rápida y enfoque automático:**
   - Escribe `ZPT10` o `Ventosa` ➔ Se resalta la coincidencia y al seleccionar enfoca **Gabinete GRIS 1 - Módulo A**, destacando **Caja A-01**.
   - Escribe `KEYENCE` o `FU-77TZ` ➔ Enfoca automáticamente el **Gabinete GRIS 2** y resalta la **Caja A-01 (Fila A, Columna 1)**.
   - Escribe `SY5220` o `Electroválvula` ➔ Enfoca **Gabinete GRIS 1 - Módulo B**, destacando la caja correspondiente.
2. **Sacar Objeto (Flujo de Salida):**
   - Pulsa **"SACAR OBJETO"** en la ficha de detalle (botón ámbar).
   - Ajusta la cantidad requerida con los botones accesibles `+` y `-`.
   - Confirma la salida para ver el toast de éxito con el nuevo saldo y la ubicación física afectada.
3. **Introducir o Devolver Objeto (Flujo de Entrada):**
   - Pulsa **"Devolver / Ingresar"** (botón verde en detalle, cabecera o lateral).
   - Selecciona la cantidad y la ubicación en la cuadrícula de 6 columnas.
   - Confirma el movimiento y visualiza la actualización inmediata.
4. **Historial de Movimientos y Reinicio:**
   - Consulta la bitácora del turno en el menú lateral.
   - Usa **"Reiniciar Datos Demo"** en cualquier momento para restaurar los datos estáticos del Excel.
