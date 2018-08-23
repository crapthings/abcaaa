import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import {
  Layout,
  Home,
  Document,
} from './components'

export default () => (
  <Router>
    <Fragment>
      <Route path='/' render={Layout(Home)} exact />
      <Route path='/nodes/:_id' render={Layout(Document)} />
    </Fragment>
  </Router>
)