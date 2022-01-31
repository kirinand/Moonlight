import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

import Users from './user/pages/Users';
import NewEvent from './events/pages/NewEvent';
import MainNavigation from './common/components/Navigation/MainNavigation';
import UserEvents from './events/pages/UserEvents';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/:uid/events" element={ <UserEvents /> } />
          <Route path="/events/new" element={ <NewEvent /> } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
