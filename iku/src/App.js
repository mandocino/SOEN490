import { Routes, Route } from 'react-router-dom';

import "./App.css";
import React from "react";

import Login from './components/Login/Login';
import Signup from './components/Login/Signup';

function App() {
  return (
    <>
      <Routes>
        {
          /* Insert Routes here in the following format:
             <Route path='/...' element={<... />}
             Where the ellipsis (...) in the path prop is the extension added to the url
             And the ellipsis in the element prop is the actual component that will be rendered when the path is added to the url
                  ^^ Note you must first import the component.
             EXAMPLE --> <Route path='/login' element={<Login />} />

             To then use the Route you can use the Link component in the 'react-router-dom' library. They replace anchor tags.
             EXAMPLE --> <Link to='/...'> text/image here </Link>
             Where the ellipsis in the 'to' prop matches a path extension in the Routes.
          */
        }

      </Routes>
    </>
  );
}

export default App;
