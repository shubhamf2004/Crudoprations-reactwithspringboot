import PostUser from './Pages/Employee/PostUser'
import NoMatch from './Pages/NoMatch/NoMatch';
import Header from './Pages/header/header'
import Dashbord from './Pages/Dashbord/Dashbord'
import React from 'react';
import Home from './Pages/HOME/HOME.JSX';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import UpdateUser from './Pages/Employee/UpdateUser';

function App() {

  return (
    <>
     <Header/>
     <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/view" element={<Dashbord/>}/>
          <Route path="*" element={<NoMatch/>}/>
          <Route path="/employee" element={<PostUser/>}/>
          <Route path="/employee/:id" element={<UpdateUser/>}/>
     </Routes>
    </>
  )
}

export default App
