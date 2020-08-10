import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from './components/home'
import Stock from './components/stock'
import './App.css';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/:symbol" component={Stock}/>
      </Switch>
    </div>
  );
}

export default App;
