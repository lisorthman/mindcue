import { Routes, Route } from 'react-router-dom';
import LocationSelect from './pages/LocationSelect';
import Home from './pages/Home';
import Entrance from './pages/entrance';  // <-- import your new page

function App() {
  return (
    <Routes>
      <Route path="/" element={<LocationSelect />} />
      <Route path="/entrance" element={<Entrance />} />   {/* New route */}
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
