# Carpeta de Archivos Privados

Esta carpeta está destinada a almacenar documentos sensibles (como archivos PDF y otra documentación) que **NO deben ser públicos ni accesibles mediante una URL directa**.

A diferencia de la carpeta `public/`, los archivos guardados en esta carpeta no pueden ser descargados por nadie desde el navegador.

Para enviar o descargar estos archivos hacia los usuarios, deberán usarse API Routes o Server Actions en Next.js donde se valide primero la sesión del usuario para luego leer el archivo.
