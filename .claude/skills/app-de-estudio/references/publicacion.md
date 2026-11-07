# Publicación: link de Claude, GitHub y Vercel

## Link de Claude (Artifact)

- El visor de Claude agrega su propio `<head>` (charset, viewport), así que se publica el **fragmento** que genera `python3 build.py <ruta-del-fragmento>`, no el `index.html` completo.
- Publica siempre en la misma URL del artifact para que el link no cambie (con `url` si el archivo publicado es otro).
- Es privado: si el estudiante quiere compartir la app con compañeros, el link público es el de Vercel.

## GitHub

1. Inicia el repo en la carpeta de la app (`git init -b main`), agrega un `README.md` en el idioma del estudiante (qué hay en la app, estructura de archivos, cómo compilar) y haz el primer commit.
2. Normalmente no se puede crear el repo desde la sesión. Pídele al estudiante que lo cree **vacío** en https://github.com/new (sin README) y te diga el nombre. Si hace falta, que dé acceso a Claude en https://claude.ai/connect-github.
3. Conéctalo (en sesiones en la nube, con la herramienta para agregar repos con permiso de escritura), agrega el remoto y haz `git push -u origin main`.
4. Revisa el nombre real con la lista de repos: en la app original se creó con un punto al final (`quimica-nomenclatura.`) y hubo que usarlo así.
5. Sube directo a `main`, sin ramas ni pull requests, salvo que el estudiante pida otra cosa. Si pregunta "¿fusionaste?", explica que no hace falta y comprueba con `git ls-remote origin main` que el último commit está en GitHub.

## Vercel

Pasos para el estudiante (no hay acceso a Vercel desde la sesión):
1. Entrar a https://vercel.com con su cuenta de GitHub.
2. **+ Create New → Project** (en el panel nuevo no dice "Add New"), importar el repo. Si no aparece, ajustar los permisos de la app de GitHub de Vercel.
3. Nombre del proyecto sin caracteres raros (Vercel no acepta un punto final). Framework Preset: **Other**. Nada más. **Deploy**.

Desde la sesión no se puede abrir `*.vercel.app` (el proxy lo bloquea): pídele capturas para verificar.

### Errores que ya pasaron

- **En el teléfono se veía la versión de compu en miniatura.** El `index.html` era un fragmento sin `<meta name="viewport">`. Por eso `build.py` genera una página completa (`<!doctype html>`, `lang`, charset, viewport) para Vercel y un fragmento aparte para Claude.
- **Si lo abre desde WhatsApp** puede ver una versión vieja guardada: que recargue o abra en el navegador.

## Contar visitas (Vercel Web Analytics)

1. `build.py` ya incluye en el `<head>` de la página completa:
   ```html
   <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
   <script defer src="/_vercel/insights/script.js"></script>
   ```
2. El estudiante activa **Analytics → Enable** en el proyecto.
3. **Hay que volver a publicar después de activarlo**: Analytics solo funciona en publicaciones hechas después. Un commit vacío basta (`git commit --allow-empty -m "Republicar para activar Web Analytics"` y push).
4. Si sigue en 0: que abra `https://<proyecto>.vercel.app/_vercel/insights/script.js` (con `https://` para que el enlace se pueda tocar). Si ve código, Analytics está activo y el problema es caché o un bloqueador: que abra la app en incógnito con `?v=2` o desde otro navegador. Si ve 404, que haga **Redeploy** en Deployments.
5. Mientras no llegue la primera visita, Vercel muestra instrucciones de instalación y ofrece el **Vercel Agent** para crear un pull request con Analytics. No hace falta: si lo crea, que no lo fusione (duplicaría el script y editaría `index.html`, que se genera desde `src/`).
6. Cómo leerlo: *Visitors* son personas o dispositivos distintos, *Page Views* las veces que se abrió. Las pruebas del propio estudiante cuentan (cada navegador o pestaña de incógnito es un visitante). En una app de una sola página, el *Bounce Rate* sale alto y *Pages* solo muestra `/`, porque cambiar de sección no es una página nueva; se puede registrar cada sección como vista si lo pide.
