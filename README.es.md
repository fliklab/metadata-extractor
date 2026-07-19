# Meta Checker

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md)

**Tu aliado de metadatos para GEO y SEO.**

Meta Checker es una extensión de Chrome que compara los metadatos del DOM actual
con la respuesta HTML original. Te ayuda a entender qué pueden ver los motores de
búsqueda y los rastreadores de IA, y a detectar rápidamente valores añadidos,
modificados o eliminados después de cargar la página.

[Instalar desde Chrome Web Store](https://chromewebstore.google.com/detail/metadata-extractor/pdikiboojnhoacoknfdpndeddocnbmop)

![Comparación de metadatos de Meta Checker](docs/images/meta-checker-overview.png)

![Guía de estados de Meta Checker](docs/images/meta-checker-state-guide.png)

## Qué puedes inspeccionar

- Título de la página, meta título, meta descripción y URL canónica
- Título, descripción, tipo, nombre del sitio, URL e imagen de Open Graph
- Directivas robots, idioma del documento y enlaces de idiomas alternativos
- Estado HTTP, URL final, redirecciones, tipo de contenido y `X-Robots-Tag`
- Número de bloques JSON-LD, errores de validación y valores `@type` detectados
- Etiqueta original completa mediante el botón de código

Puedes contraer secciones y elegir secciones completas o campos individuales en
la configuración de visualización. La interfaz admite inglés, coreano, japonés,
español y portugués de Brasil.

## Flujo de trabajo para GEO y SEO

- Comprueba qué metadatos contiene el HTML entregado por el servidor.
- Detecta valores modificados en tiempo de ejecución por frameworks, scripts o gestores de etiquetas.
- Revisa señales canonical, de idioma, robots, Open Graph, HTTP y JSON-LD en una sola pasada.
- Investiga diferencias entre la respuesta original y la página que ven usuarios o rastreadores compatibles.

Meta Checker ofrece una inspección técnica de metadatos. No predice ni garantiza
posiciones en buscadores ni visibilidad en respuestas generadas por IA.

## Estados de metadatos

| Estado | Significado |
| --- | --- |
| `Same` | El DOM actual coincide con la respuesta HTML original. |
| `New` | El valor existe en el DOM actual, pero no en la respuesta original. |
| `Changed` | El valor del DOM actual es diferente al de la respuesta original. |
| `Removed` | El valor existe en la respuesta original, pero no en el DOM actual. |

Haz clic en cualquier chip de estado o en el botón `?` de la esquina superior
derecha para abrir la guía de estados.

## Cómo usarlo

1. Abre una página web normal que quieras inspeccionar.
2. Inicia Meta Checker desde la barra de herramientas de Chrome.
3. Revisa los valores de metadatos y sus chips de estado.
4. Usa el botón de código para ver la etiqueta original completa.
5. Elige las secciones y los campos visibles en la configuración.
6. Selecciona el idioma de la interfaz en el menú de idiomas.

Después de instalar o volver a cargar la extensión sin empaquetar, actualiza las
páginas que ya estaban abiertas antes de iniciar Meta Checker. Chrome no inyecta
el nuevo script de contenido en las pestañas abiertas antes de cargar la extensión.

## Instalación local

1. Descarga o clona este repositorio.
2. Abre `chrome://extensions` en Chrome.
3. Activa el **Modo de desarrollador**.
4. Selecciona **Cargar descomprimida**.
5. Elige la carpeta raíz que contiene `manifest.json`.
6. Fija Meta Checker desde el menú de extensiones de la barra de herramientas.

## Versión

Versión actual: `1.1.1`
