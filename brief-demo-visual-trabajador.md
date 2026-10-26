# Brief para agente: demo visual de inventario para trabajadores

## Objetivo

Construye una demo visual de alta fidelidad para el trabajador que usa el sistema en el día a día. Debe permitir localizar un objeto y representar sus acciones principales: **buscar, sacar, introducir y devolver** un objeto.

Toma como referencia de distribución el diseño de Figma compartido en la conversación: navegación lateral oscura, espacio de trabajo claro, encabezado con búsqueda y contenido organizado en tarjetas. Úsalo como guía visual; no es necesario reproducir elementos administrativos ni construir el sistema de producción.

## Alcance

Incluye solo las vistas y estados necesarios para el flujo del trabajador:

1. **Inicio / almacén:** resumen útil y gabinetes o ubicaciones disponibles.
2. **Buscar objeto:** búsqueda por nombre, categoría, código o ubicación, con resultados claros.
3. **Detalle del objeto:** ubicación exacta (gabinete, caja y espacio), cantidad/estado y acciones disponibles.
4. **Sacar objeto:** confirmar cantidad y registrar la salida.
5. **Introducir o devolver objeto:** seleccionar cantidad, confirmar ubicación y registrar el movimiento.
6. **Confirmación:** feedback del movimiento completado y acceso al siguiente paso.

No incluyas paneles de administración, gestión de usuarios, configuración, reportes administrativos ni creación/edición de gabinetes. No hace falta backend: usa datos de ejemplo realistas y estados locales para que la demo sea navegable.

## Datos ficticios

Todos los nombres, códigos, cantidades, ubicaciones, movimientos y perfiles que aparezcan en la demo deben ser **ficticios**. No uses ni sugieras datos reales de personas, almacenes o inventarios. Identifica los registros como datos de demostración cuando sea útil y mantén los cambios solo en el estado local de la demo.

## Experiencia principal

- Prioriza la búsqueda desde el primer pantallazo. El trabajador debe poder empezar a escribir sin navegar por varias secciones.
- Al abrir un resultado, muestra primero el nombre del objeto y su ubicación física, con jerarquía visual clara.
- Al seleccionar un resultado, enfoca y centra en el área de trabajo el gabinete que contiene el objeto. Resalta la caja exacta y, cuando aplique, señala también el espacio dentro de ella.
- Diferencia visualmente **sacar** de **introducir/devolver**, pero mantén ambas acciones accesibles desde el detalle.
- Pide confirmación antes de completar un movimiento. Tras confirmar, muestra qué objeto y cantidad se movieron y la ubicación afectada.
- Incluye estados para búsqueda vacía, sin resultados, carga breve, error recuperable y operación completada.
- Usa texto breve, etiquetas directas y controles grandes, legibles y cómodos para uso rápido.

## Dirección visual

- Interfaz de escritorio adaptable, limpia y profesional, coherente con la referencia: navegación lateral oscura, fondo de contenido claro, tarjetas blancas y verde como acento principal.
- Mantén una jerarquía clara: título de pantalla, búsqueda, resultados/ubicación y acción principal.
- Usa tipografía legible, espaciado consistente, contraste suficiente e iconos simples con el mismo estilo.
- Evita la densidad de un sistema administrativo. Muestra solo información que ayude a encontrar y mover un objeto.
- En tamaños estrechos, convierte la navegación lateral en menú compacto y apila las tarjetas sin perder el acceso a búsqueda y acciones.

## Animaciones y microinteracciones

Las animaciones deben hacer que la demo se sienta cuidada y explicar los cambios de estado. Manténlas rápidas, discretas y funcionales; no deben retrasar el trabajo.

- **Carga inicial:** entrada suave del encabezado y el contenido (opacidad y desplazamiento vertical leve, 180–260 ms). Evita animar cada elemento con retrasos largos.
- **Resultados de búsqueda:** al filtrar, actualiza la lista con transición breve de opacidad y altura; resalta por un instante el texto coincidente sin parpadeo.
- **Selección de resultado:** la tarjeta seleccionada eleva ligeramente su sombra y muestra un borde/acento; transición de 140–200 ms.
- **Localización en el gabinete:** al seleccionar un objeto, desplaza o enfoca suavemente la representación para centrar el gabinete que lo contiene. Resalta su caja con un acento visible y persistente mientras el objeto esté seleccionado; si se conoce el espacio dentro de la caja, indícalo también. No dependas solo del color: acompaña el resaltado con una etiqueta, número o icono.
- **Cambio a detalle:** presenta el detalle con una transición corta de desplazamiento lateral u opacidad, manteniendo clara la relación con los resultados y ofreciendo “Volver”.
- **Botones y controles:** estados hover, focus, pressed y disabled visibles; transición de color/sombra de 120–180 ms. El click debe dar respuesta inmediata.
- **Cantidad:** al incrementar o reducir, actualiza el valor con feedback sutil. Deshabilita la reducción por debajo de 1 y evita superar la cantidad disponible al sacar objetos.
- **Confirmación de movimiento:** al enviar, cambia el botón a estado de procesamiento con indicador; al terminar, muestra un toast o panel de éxito con icono y texto. El feedback debe durar lo suficiente para leerse y no bloquear la siguiente acción.
- **Ubicación:** cuando el usuario elige una caja/espacio, marca la selección de manera evidente y conserva el valor al volver atrás.
- **Errores:** muestra el mensaje junto al control afectado con aparición breve; no uses movimientos bruscos ni dependas solo del color.
- **Respeta “reducir movimiento” del sistema:** con `prefers-reduced-motion`, elimina desplazamientos y reduce o desactiva animaciones no esenciales.

Usa una sola familia de curvas y duraciones coherentes. Evita rebotes, zooms llamativos, efectos decorativos continuos, animación de fondo y transiciones que oculten información.

## Datos de ejemplo

Usa exclusivamente registros inventados. Incluye varios objetos y ubicaciones reconocibles, por ejemplo:

- Cable HDMI — Gabinete A-01 → Caja 1 → Espacio 4
- Multímetro digital — Gabinete B-02 → Caja 2 → Espacio 3
- Guantes de seguridad — Gabinete C-03 → Caja 3 → Espacio 2

Añade cantidades disponibles y, si se registra una salida o devolución, actualiza el estado local para que el cambio sea visible en la demo.

## Representación física de gabinetes

No representes cada gabinete como una tarjeta grande que solo contiene una lista de cajas. Dibuja el gabinete de forma conceptual como un mueble físico, visto principalmente de frente, para que el trabajador pueda relacionar la ubicación en pantalla con lo que verá en el almacén.

- Representa la estructura exterior del gabinete, sus divisiones/entrepaños y las cajas colocadas dentro de esos espacios.
- Distingue visualmente los gabinetes entre sí con su código o nombre visible, por ejemplo “Gabinete A-01”. Mantén los códigos de caja y su orden físico legibles.
- La distribución de las cajas debe respetar la geometría del mueble: cajas dentro del marco del gabinete y organizadas en filas/entrepaños, no como tarjetas flotantes ajenas a él.
- Si el inventario de ejemplo incluye una ubicación más precisa, muestra el espacio o compartimento dentro de la caja sin perder la jerarquía **gabinete → caja → espacio → objeto**.
- Cuando la búsqueda arroje varios objetos o coincidencias, permite elegir uno y enfoca el gabinete que contiene ese resultado. Si el mismo objeto existe en más de una ubicación, muestra cada ubicación como una opción seleccionable y enfoca el gabinete correspondiente al elegirla.
- El resaltado debe comunicar con claridad qué caja abrir: borde/acento, etiqueta como “Aquí está” y una conexión visual al objeto seleccionado. Mantén el resto del gabinete visible para conservar el contexto físico.
- Mantén el dibujo sobrio y legible; debe parecer un mapa esquemático del almacenamiento, no una ilustración decorativa ni una fotografía.

El objetivo es que el trabajador pueda responder rápidamente: **¿qué gabinete busco y qué caja debo abrir?**

## Criterios de aceptación

- Un trabajador puede completar sin ayuda el flujo de buscar un objeto y consultar su ubicación.
- Puede simular sacar una cantidad disponible y recibir confirmación.
- Puede simular introducir/devolver un objeto y seleccionar su ubicación.
- La navegación no conduce a pantallas administrativas.
- Los estados vacíos, confirmaciones y errores se entienden sin depender solo del color.
- Las animaciones son breves, consistentes, accesibles y compatibles con movimiento reducido.
- La interfaz se siente terminada y coherente en los tamaños de pantalla previstos.
- La demo usa datos locales; no aparenta guardar movimientos en un servidor real.

## Entrega

Implementa la demo navegable en el proyecto existente, siguiendo sus tecnologías y convenciones. Deja visibles las interacciones principales, usa datos de ejemplo y evita añadir funciones fuera de este brief. Indica brevemente cómo iniciar la demo y qué flujos se pueden probar.

