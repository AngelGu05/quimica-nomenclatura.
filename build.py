import pathlib
d=pathlib.Path(__file__).parent/'src'
s=(d/'shell.html').read_text()
s=s.replace('/*ENGINE*/',(d/'engine.js').read_text()).replace('/*APP*/',(d/'app.js').read_text())
(d.parent/'index.html').write_text(s)
print(len(s))
