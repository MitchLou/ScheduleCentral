import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Login from './pages/Login'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
    <main>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="about" element={<About />}/>
      </Routes>
    </main>
    </BrowserRouter>
  );
}

export default App;
