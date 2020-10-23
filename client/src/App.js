import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import ApolloProvider from './ApolloProvider'

function App() {

  return(
    <ApolloProvider>
      <BrowserRouter>
        <Switch>
          <Container className="pt-5">
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
          </Container>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App;
