import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import { Operations } from './pages/Operations';
import { Login } from './pages/Login';
import { UserContextProvider } from './context/UserContext';

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/operations" component={Operations} />
        </Switch>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
