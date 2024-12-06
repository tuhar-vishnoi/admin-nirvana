import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Blog from "./Blog"; // Your Blog screen
import Login from "./Login";
import Banner from "./Banner";
import AddBlog from "./AddBlog";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/addblog" element={<AddBlog />} />
        <Route path="/addblog/:id" element={<AddBlog />} />{" "}
        {/* This will match /addblog/:id */}
      </Routes>
    </Router>
  );
}

export default App;
