import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Homepage from "./pages/Homepage.jsx";
import Accountpage from "./pages/Accountpage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/Aboutpage.jsx";
import EditAccountPage from "./pages/Editinfopage.jsx";
import EditPasswordPage from "./pages/Editpasswordpage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Insert Routes here in the following format:
               //<Route path='/...' element={<... />}
               //Where the ellipsis (...) in the path prop is the extension added to the url
               //And the ellipsis in the element prop is the actual component that will be rendered when the path is added to the url
                 //   ^^ Note you must first import the component.
               //EXAMPLE --> <Route path='/login' element={<Login />} />
  
               //To then use the Route you can use the Link component in the 'react-router-dom' library. They replace anchor tags.
               //EXAMPLE --> <Link to='/...'> text/image here </Link>
               //Where the ellipsis in the 'to' prop matches a path extension in the Routes.
          */}
        <Route
          path="/login"
          element={
            localStorage.getItem("authenticated") !== "true" ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/accountpage" element={<Accountpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/editinfo" element={<EditAccountPage />} />
        <Route path="/editpassword" element={<EditPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
