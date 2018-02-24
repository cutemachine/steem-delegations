import { h, app } from 'hyperapp'
import { Route } from '@hyperapp/router'
import config from '../common/config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeView from './HomeView'

export default (state, actions) => (
  <div>
    <Navbar isNavbarMenuActive={state.isNavbarMenuActive} toggleNavbarMenu={actions.toggleNavbarMenu} />
    <Route path='/' render={() => <HomeView state={state} actions={actions} />} />
    <Footer>
      <strong>{config.projectName}</strong> by <a href='https://steemit.com/@cutemachine'>@cutemachine</a>.
    </Footer>
  </div>
)
