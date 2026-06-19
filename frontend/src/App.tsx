import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import IEEEInfo from './components/sections/IEEEInfo';
import ProjectDetail from './components/sections/ProjectDetail';
import PostDetail from './components/sections/PostDetail';

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
