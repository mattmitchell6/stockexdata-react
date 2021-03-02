import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Stock from './components/Stock'
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
