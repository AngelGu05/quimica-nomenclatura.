# Nomenclatura Química

App web para estudiar y practicar nomenclatura de compuestos inorgánicos, basada en las guías de clase (2026).

## Secciones
- **Iones:** tarjetas de iones monoatómicos y poliatómicos.
- **Teoría:** lo básico y los 3 temas (binarios; oxosales, oxoácidos e hidróxidos; sales ácidas, básicas, dobles e hidratadas).
- **Práctica:** nombrar y formular con ejercicios de las prácticas y ejercicios generados.
- **Nombres vulgares:** tarjetas, quiz y tabla.

## Estructura
- `src/engine.js`: motor de nomenclatura (iones, reglas de cada sistema, generador de ejercicios, ejercicios de las prácticas).
- `src/app.js`: interfaz (vistas, tarjetas, práctica).
- `src/shell.html`: estilos y estructura de la página.
- `build.py`: junta todo en `index.html` (página completa que publica Vercel).

## Compilar
```bash
python3 build.py
```
Abre `index.html` en el navegador.
