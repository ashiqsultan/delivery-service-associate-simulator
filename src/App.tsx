import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Simulator from './Simulator';
import Home from './Home';
import AppBar from './AppBar';

function App() {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/simulator/:deliveryassociateid' element={<Simulator />} />
      </Routes>
    </Router>
  );
}

export default App;
