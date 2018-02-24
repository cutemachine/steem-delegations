import { h, app } from 'hyperapp'
import { location } from '@hyperapp/router'
import MainView from './views/MainView'
import state from './state'
import actions from './actions'
require('babel-polyfill')

const main = app(state, actions, MainView, document.body)

const unsubscribe = location.subscribe(main.location)
