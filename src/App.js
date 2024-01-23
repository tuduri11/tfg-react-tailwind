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


function App() {
  return (

    <Router>
      <div>
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
    </Router>
  );
}
export default App;

