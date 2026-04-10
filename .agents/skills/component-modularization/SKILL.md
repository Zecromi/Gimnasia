---
name: component-modularization
description: Guidelines for separating large components into granular files and applying Next.js lazy loading (next/dynamic) for performance optimization. Use this skill when writing, reviewing, or refactoring React/Next.js code to ensure clean file architecture and maximum performance.
---

# Component Modularization & Optimization Standards

Whenever you write, review, or refactor React/Next.js code, you MUST adhere strictly to the following best practices to maximize code separation, readability, and application performance:

## 1. Modular Architecture & Granular Files
- **Avoid Megafiles**: If a file exceeds a reasonable size (e.g., 300-400+ lines), you should split it into contextual sub-components.
- **Extract Features**: Extract distinct features like individual form tabs, heavy dialogs, standalone cards, or deeply nested logic into their own isolated `.tsx` files inside the same root directory.
- **Keep Wrappers Clean**: The main component wrapper (e.g., the `page.tsx` or a parent `Dialog`) should only act as an orchestrator and layout container. It should delegate complex rendering and business logic to its imported children.

## 2. Advanced Performance con `next/dynamic`
- **Use Lazy Loading por Defecto**: En componentes grandes o en interfaces que poseen Pestañas (Tabs), Formularios dinámicos o Gráficos, implementa `import dynamic from "next/dynamic"`.
- **Ventaja de Rendimiento**: Al usar `next/dynamic`, aseguras que el peso (bundle size) del código solo sea procesado y descargado por el navegador cuando la interfaz es descubierta/requerida por el usuario.
- **Ejemplo Práctico**:
  ```tsx
  import dynamic from "next/dynamic"

  // Cargar este tab sólo cuando el usuario lo visualiza
  const GeneralInfoForm = dynamic(
      () => import('./general-info-form').then((mod) => mod.GeneralInfoForm), 
      { ssr: false, loading: () => <p>Cargando información...</p> }
  )
  ```
- Usa `{ ssr: false }` si el componente contiene comportamientos puramente de navegador, librerías pesadas en formato cliente o APIs exclusivas del navegador (drag and drop, window, refs de canvas, etc).

## 3. Principio DRY (Don't Repeat Yourself)
- Si detectas patrones repetitivos o plantillas abstractas, aíslalas en componentes reutilizables y hazles refererencia. Todo el código estático y reiterativo debe limitarse para no contaminar un controlador principal.
