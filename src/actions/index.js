import { location } from '@hyperapp/router'
import steem from 'steem'

export default {
  location: location.actions,
  toggleNavbarMenu: () => state => ({ isNavbarMenuActive: !state.isNavbarMenuActive }),
  changeUsername: (value) => (state, actions) => {
    return { username: value }
  },
  submitUsername: () => (state, actions) => {
    actions.requestDelegations(state.username)
  },
  setDynamicGlobalProperties: obj => state => ({ dynamicGlobalProperties: obj }),
  setDelegations: arr => state => ({ delegations: arr }),
  requestDelegations: (username) => async (state, actions) => {
    try {
      const [delegations, dynamicGlobalProperties] = await Promise.all([
        steem.api.getVestingDelegationsAsync(username, -1, 100),
        steem.api.getDynamicGlobalPropertiesAsync()
      ])
      if (!delegations) { throw new Error('Sorry, could not get delegations for user.')}
      if (!dynamicGlobalProperties) { throw new Error('Sorry, could not get dynamic global properties.')}
      actions.setDelegations(delegations)
      console.log('Vesting Delegations', delegations)
      actions.setDynamicGlobalProperties(dynamicGlobalProperties)
      console.log('Dynamic Global Properties', dynamicGlobalProperties)
    } catch (error) {
      actions.error.set(error.message)
    }
  },
}
