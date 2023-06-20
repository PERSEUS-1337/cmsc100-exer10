import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Post from './pages/Post'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/feed" element={<Feed />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/feed/:pId" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
