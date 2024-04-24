import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import TopicList from './components/TopicList';
import NotFoundPage from './components/NotFoundPage';
import ProblemList from './components/ProblemList';
import Exercise from './routes/exercise';
import Statistics from './routes/statistics';
import 'katex/dist/katex.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar></Navbar>
          <div className="flex-grow">
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/" element={<Init />}></Route>
              <Route path="/universidades" element={<UniversityList />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/edit-profile" element={<EditProfile />}></Route>
              <Route path="/premium" element={<Premium />}></Route>
              <Route path="/about-us" element={<AboutUs />}></Route>
              <Route path="/afterpay" element={<AfterPay />}></Route>
              <Route path="/statistics" element={<Statistics />}></Route>
              <Route path="/universidades/:universitySlug" element={<CareerList />} />
              <Route path="/universidades/:universitySlug/:careerSlug" element={<SubjectList />} />
              <Route path="/universidades/:universitySlug/:careerSlug/:subjectSlug" element={<TopicList />} />
              <Route path="/universidades/:universitySlug/:careerSlug/:subjectSlug/:topicSlug" element={<ProblemList />} />
              <Route path="/universidades/:universitySlug/:careerSlug/:subjectSlug/:topicSlug/:problemSlug" element={<Exercise />} />
            </Routes>
          </div>
          <Footer></Footer>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;

