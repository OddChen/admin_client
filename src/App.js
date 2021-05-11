import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/register'
import Home from './pages/home/home'
import Editor from './pages/editor/editor'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/editor' component={Editor}></Route>
          <Route path='/' component={Home}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
