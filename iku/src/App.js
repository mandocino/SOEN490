import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Homepage from "./pages/Homepage";
import Accountpage from "./pages/Accountpage";
import Dashboard from "./pages/Dashboardpage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AboutUs from "./pages/Aboutpage";

function App() {
  return (
    <>
      <Routes>
        {
          <Route path="/" element={<Homepage />} />
          /* Insert Routes here in the following format:
               //<Route path='/...' element={<... />}
               //Where the ellipsis (...) in the path prop is the extension added to the url
               //And the ellipsis in the element prop is the actual component that will be rendered when the path is added to the url
                 //   ^^ Note you must first import the component.
               //EXAMPLE --> <Route path='/login' element={<Login />} />
  
               //To then use the Route you can use the Link component in the 'react-router-dom' library. They replace anchor tags.
               //EXAMPLE --> <Link to='/...'> text/image here </Link>
               //Where the ellipsis in the 'to' prop matches a path extension in the Routes.
          */
        }
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accountpage" element={<Accountpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;
