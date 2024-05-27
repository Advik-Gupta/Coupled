import './css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Chats from './components/Chats';
import Home from './components/Home';
import PersonalChat from './components/PersonalChat';
import Entry from './components/Entry';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import EditProfile from './components/EditProfile';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';
import MatchPage from './components/MatchPage';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import db from './firebase'

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div className="App">
      {
        user ? (
          <>
            <Router>
              <Routes>
                <Route path='/chats/:personChattingWith' element={<><Header backButton={true} personal={true} hideChat={true} /><PersonalChat user={user} /></>} />
                <Route path='/chats' element={<><Header backButton={true} hideChat={true} /><Chats user={user} /></>} />
                <Route path='/' element={<><Header /><Home user={user} /><Footer /></>} />
                <Route path='/editProfile' element={<><Header backButton={true} hideChat={true} hideBack={user.school ? false : true} /><EditProfile user={user} setUser={setUser} showData={user.school ? true : false} /><Footer /></>} />
                <Route path='/profilePage/:idOfUser' element={<><Header backButton={true}/><ProfilePage /><Footer /></>} />
                <Route path='/matchPage/:idOfMatchedUser' element={<><Header hideChat={true} backButton={true}/><MatchPage user={user} /><Footer /></>} />
              </Routes >
            </Router>
          </>
        ) : (
          <>
            <Router>
              <Routes>
                <Route path='/' element={<><Entry setUser={setUser} /><Footer /></>} />
                <Route path='/signin' element={<><SignIn setUser={setUser} /><Footer /></>} />
                <Route path='/signup' element={<><SignUp setUser={setUser} /><Footer /></>} />
              </Routes >
            </Router>
          </>
        )
      }
    </div>
  );
}

export default App;
