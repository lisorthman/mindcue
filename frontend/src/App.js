import { Routes, Route } from 'react-router-dom';
import LocationSelect from './pages/LocationSelect';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LocationSelect />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
