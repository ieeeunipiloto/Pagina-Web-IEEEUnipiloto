/**
 * App.tsx — Componente raíz del enrutamiento de la aplicación.
 *
 * Define la estructura de navegación SPA (Single Page Application) usando
 * React Router DOM v6. Cada ruta renderiza una sección específica:
 *
 * Rutas definidas:
 * - `/`            → Home (página principal con hero, proyectos, blog, contacto)
 * - `/ieee-unipiloto` → IEEEInfo (información del capítulo estudiantil)
 * - `/proyecto/:id`   → ProjectDetail (detalle de un proyecto de laboratorio)
 * - `/noticia/:id`    → PostDetail (detalle de un evento o bitácora)
 * - `*`             → Redirección a `/` (cualquier ruta no definida)
 *
 * Todas las rutas están envueltas en <Layout /> que provee Header y Footer.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import IEEEInfo from './components/sections/IEEEInfo';
import ProjectDetail from './components/sections/ProjectDetail';
import PostDetail from './components/sections/PostDetail';

/**
 * Componente funcional App.
 * Renderiza el enrutador BrowserRouter con Layout como contenedor principal.
 * Layout encapsula Header + contenido + Footer para mantener consistencia visual.
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ieee-unipiloto" element={<IEEEInfo />} />
          <Route path="/proyecto/:id" element={<ProjectDetail />} />
          <Route path="/noticia/:id" element={<PostDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
