import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/register'
import Home from './pages/home/home'
import EditorScheme from './pages/editorscheme/editorscheme'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/editorscheme' component={EditorScheme}></Route>
          <Route path='/' component={Home}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
