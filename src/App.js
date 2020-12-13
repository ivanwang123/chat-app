import React from 'react'
import {HashRouter as Router, Route} from 'react-router-dom'
import Chat from './components/Chat'
import Register from './components/Register'
import Login from './components/Login'
import Logout from './components/Logout'

function App() {

  return (
    <div class="App">
      <Router>
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
      </Router>
    </div>
  );
}

export default App;
