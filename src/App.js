import logo from './logo.svg';
import './App.css';
import Navbar from './compnnet/Navbar';
import Register from './compnnet/Register';
import Login from './compnnet/Login';
import {Routes,Route} from 'react-router-dom'
import Home from './compnnet/Home';
import NotFound from './compnnet/NotFound';

function App() {
  return (
    < >
    <Navbar/>
    <Routes>
      <Route path='/' element={<Register/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='*' element={<NotFound/>} />
    </Routes>

    </>
  );
}

export default App;
