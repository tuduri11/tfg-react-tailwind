import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import { AuthProvider } from './utils/AuthContext';
import AfterPay from './routes/afterPay/index';
import UniversityList from './components/UniversityList';
import CareerList from './components/CareerList';
import SubjectList from './components/SubjectList';
import ChatBot from './components/chatBot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar></Navbar>
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Init />}></Route>
              <Route path="/universidades" element={<UniversityList />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/edit-profile" element={<EditProfile />}></Route>
              <Route path="/premium" element={<Premium />}></Route>
              <Route path="/about-us" element={<AboutUs />}></Route>
              <Route path="/afterpay" element={<AfterPay />}></Route>
              <Route path="/universidades/:universitySlug/" element={<CareerList />} />
              <Route path="/universidades/:universitySlug/:careerSlug/" element={<SubjectList />} />
            </Routes>
          </div>
          <ChatBot></ChatBot>
          <Footer></Footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;

