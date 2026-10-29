"""Junta src/ en index.html (página completa, para Vercel/GitHub) y en un fragmento para el link de Claude."""
import pathlib, sys
root = pathlib.Path(__file__).parent
d = root / 'src'
body = (d / 'shell.html').read_text()
body = body.replace('/*ENGINE*/', (d / 'engine.js').read_text()).replace('/*APP*/', (d / 'app.js').read_text())
head = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#eef2f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1614" media="(prefers-color-scheme: dark)">
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
'''
(root / 'index.html').write_text(head + body + '\n</body>\n</html>\n')
# fragmento para el link de Claude (ese visor agrega su propio <head>)
if len(sys.argv) > 1:
    pathlib.Path(sys.argv[1]).write_text(body)
print('ok')
