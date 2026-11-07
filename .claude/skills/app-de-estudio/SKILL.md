---
name: app-de-estudio
description: Construye una app web de estudio (tarjetas para memorizar, resumen de teoría por temas y zona de práctica con corrección y explicación) a partir de las guías, hojas de práctica o apuntes de clase que suba el estudiante, de cualquier materia, y la publica en un link de Claude, un repo de GitHub y Vercel. Úsala siempre que alguien quiera una app, página o herramienta para estudiar, repasar, memorizar o practicar con su material de clase (química, biología, historia, idiomas, matemáticas…), aunque solo diga "hazme algo para estudiar esto", "quiero flashcards de esta guía" o "convierte mi práctica en ejercicios", o cuando pida cambiar, decorar o publicar una app de estudio ya hecha.
---

# App de estudio a partir de guías de clase

Esta skill recoge cómo se hizo una app de nomenclatura química que el estudiante usa a diario: leer sus guías, preguntarle cómo quiere estudiar, construir la app con las reglas **de su profe** y publicarla donde pueda abrirla desde el teléfono. El resultado tiene que servir para estudiar de verdad, así que lo importante es que las respuestas sean correctas según su material y que se use cómodo en el celular.

Habla con el estudiante en su idioma, con palabras simples. Muchos no saben qué es un repo, un commit o un deploy: explícalo en una frase cuando haga falta.

## 1. Leer el material

Lee todos los archivos que suba (Word, PDF, imágenes). Para un `.docx` basta con extraer el texto del XML (`word/document.xml`) y quitar las etiquetas; las tablas salen como líneas sueltas, así que reconstrúyelas con cuidado (por ejemplo, columnas de cargas o de equivalencias).

Mientras lees, separa tres cosas:
- **Lo que hay que memorizar** (listas, símbolos, fechas, vocabulario, fórmulas): será el mazo de tarjetas.
- **Las reglas y procedimientos** (cómo clasificar, cómo resolver, patrones): será la teoría.
- **Los ejercicios de las hojas de práctica**: serán preguntas "de tu práctica" y la prueba de que el motor responde bien.

Respeta las convenciones del profe aunque difieran de un libro estándar, porque así lo van a evaluar. Si encuentras un error claro en la guía (cargas que no cuadran, un nombre mal escrito), corrígelo en la app y avísale al estudiante qué cambiaste y por qué. Si la guía es ambigua, elige una interpretación, aplícala de forma consistente y díselo para que lo confirme con su profe.

## 2. Preguntar antes de construir

Después de leer, cuéntale en pocas líneas cómo ves la app (secciones, qué va en cada una) y hazle preguntas concretas. Las que importaron en la app original:
- ¿Dónde la va a usar? (la propuesta por defecto: página web que funcione en el teléfono)
- ¿Cómo quiere responder? Escribir es bueno para respuestas de texto; para fórmulas, símbolos o cosas difíciles de teclear en el celular, ofrece un teclado propio en pantalla con botones (los elementos necesarios mezclados con distractores, números y signos).
- ¿Cada pregunta pide una sola forma de responder o varias, como en sus hojas?
- ¿Ejercicios de sus hojas, inventados, o ambos? (por defecto: cerca de un tercio de sus hojas, el resto generados)
- ¿Quiere guardar su progreso? (en el dispositivo, con localStorage)
- ¿Cómo divide los temas? Respeta la división que él diga (en la app original fueron 3 temas).

Si deja preguntas sin contestar, toma la opción más útil para él, sigue adelante y dile qué elegiste.

## 3. Estructura de la app

Secciones que funcionaron (adáptalas a la materia):
- **Inicio**: qué hay en la app, progreso por sección y "para repasar" con los temas donde más falla.
- **Tarjetas**: mazos separados por grupos lógicos del material, con dirección *A → B*, *B → A* y *mezclado*. Las que no se sabe vuelven a salir unas tarjetas después. Incluye una vista de lista para repasar todo junto.
- **Teoría**: dividida en los temas del estudiante, más una pestaña "Lo básico" con lo que se usa en todos. Para cada concepto: definición, forma general, cómo reconocerlo y una tabla patrón → ejemplo resuelto.
- **Práctica**: elegir tema, modo (por ejemplo nombrar/formular, traducir ida/vuelta) y cantidad. Cada pregunta pide también clasificar (el tipo o grupo), porque así suelen ser las hojas. Al corregir, muestra la respuesta correcta, el razonamiento paso a paso y el patrón aplicado. Botón de pista. Al final: puntaje, lista de aciertos y fallos, y "repetir las que fallé".
- **Secciones extra** cuando el material las tenga (en química fueron los nombres vulgares: tarjetas, quiz de opción múltiple y tabla).

### Un motor, no listas a mano

Si las respuestas siguen reglas (nomenclatura, conjugaciones, conversiones, cálculos), programa las reglas en un motor (`engine.js`, sin DOM) que genere la pregunta y todas sus respuestas válidas. Así las preguntas no se acaban y la teoría puede usar el mismo motor para sus ejemplos, sin contradicciones. Si el material es solo memoria (historia, vocabulario), el "motor" es una lista de datos bien estructurada.

Corrige con tolerancia: ignora mayúsculas, tildes, espacios y signos; acepta variantes válidas (prefijos opcionales, sinónimos, números arábigos en vez de romanos). Lo que sí importa (por ejemplo mayúsculas en símbolos químicos o el orden cuando cambia el significado) compruébalo aparte y explica el error.

### Verificar antes de publicar

Ejecuta el motor en Node con cada ejercicio de las hojas y compara con lo que espera el profe; imprime la tabla completa y revísala. Genera también varios ejercicios aleatorios de cada tipo y léelos. Corrige el motor hasta que todo cuadre. Este paso es el que evita que el estudiante memorice algo mal.

## 4. Diseño

- **Teléfono primero.** Barra de navegación fija abajo con íconos en pantallas angostas; tablas de teoría convertidas en fichas apiladas; pestañas y chips que se deslizan de lado; botones de al menos 44 px; campos de texto de 16 px o más (en iPhone evita el zoom). Prueba a 360 y 390 px de ancho y comprueba que no haya desplazamiento horizontal.
- **Color con sentido.** Un color por sección y por tema, usado en el menú, botones, encabezados y tablas; versión clara y oscura.
- **Detalles de la materia** como decoración: en química fueron casillas de la tabla periódica con número atómico real y un fondo de átomos que se enlazan.
- **Fondo reactivo (opcional, gustó mucho):** un `<canvas>` detrás del contenido con elementos de la materia que flotan, siguen el dedo y "reaccionan" al tocar el fondo; otro canvas encima solo para los efectos de acierto (verde) y error (rojo), para que se vean sobre las tarjetas. Pausa la animación cuando la página no está visible, respeta "reducir movimiento" y pon un interruptor para apagarla.

## 5. Archivos y publicación

Organiza el código así (plantilla de compilación en `assets/build.py`):

```
src/shell.html   estilos y estructura (con marcadores /*ENGINE*/ /*FX*/ /*APP*/)
src/engine.js    reglas y datos
src/fx.js        fondo animado (opcional)
src/app.js       vistas e interacción
build.py         genera index.html completo + un fragmento para el link de Claude
```

Publica en tres lugares y, en cada cambio posterior, actualiza los tres: link de Claude, commit + push a GitHub y Vercel (que publica solo al recibir el push). Lee `references/publicacion.md` antes de crear el repo o conectar Vercel: ahí están los pasos que tiene que hacer el estudiante y los errores que ya ocurrieron (falta de viewport, Analytics que no contaba, el pull request del Vercel Agent).

## 6. Después de publicar

Pídele que la abra en su teléfono y te mande una captura. Ajusta lo que vea raro. Cada cambio: compila, prueba en tamaño de teléfono, publica en el link de Claude, haz commit con un mensaje que describa el cambio en su idioma y haz push. Al terminar, dile qué cambió, en qué links ya está y cuánto tarda Vercel.
