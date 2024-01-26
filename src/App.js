import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Register from './routes/register/index';
import Home from './routes/home/index'
import Login from './routes/login';
import Init from './routes/init';
import EditProfile from './routes/editProfile';
import Premium from './routes/premium';
import AboutUs from './routes/aboutUs';
import Footer from './components/footer';
import Navbar from './components/navbar';

function App() {
  return (

    <Router>
      <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Init />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/edit-profile" element={<EditProfile />}></Route>
          <Route path="/premium" element={<Premium />}></Route>
          <Route path="/about-us" element={<AboutUs />}></Route>
        </Routes>
      </div>
      <Footer></Footer>
      </div>
    </Router>
  );
}
export default App;

