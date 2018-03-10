import { location } from '@hyperapp/router'
import steem from 'steem'
import { TRANSACTION_TYPES } from '../common/constants'
import { unitString2Number, vests2Steem } from '../common/utils'

const assembleDelegationHistory = (accountHistory, dynamicGlobalProperties) => {
  let currentDelegations = {}
  let delegationHistory = accountHistory.reduce((result, item) => {
    const transactionType = item[1].op[0]
    let record = item[1].op[1]
    let key
    switch (transactionType) {
      case TRANSACTION_TYPES.DELEGATE_VESTING_SHARES:
        key = `${record.delegator}_${record.delegatee}`
        currentDelegations[key] = record.vesting_shares
        result.push({
          type: 'DELEGATION',
          from: record.delegator,
          to: record.delegatee,
          delegatedSteemPower: vests2Steem(record.vesting_shares, dynamicGlobalProperties),
          amount: 'n/a',
          timestamp: item[1].timestamp
        })
        break;
      case TRANSACTION_TYPES.TRANSFER:
        key = `${record.to}_${record.from}`
        if (currentDelegations[key]) {
          let currentDelegation = vests2Steem(currentDelegations[key], dynamicGlobalProperties)
          result.push({
            type: 'TRANSFER',
            from: record.from,
            to: record.to,
            delegatedSteemPower: currentDelegation,
            amount: record.amount,
            timestamp: item[1].timestamp
          })
        }
        // else {
            // No delegation found in currentDelegations object.
            // This means we need to go back furhter in the account history to find the delegation for this transfer.
            // We do nothing here, which means we ignore transfers we have no delegation for.
        // }
        break;
      default:
        // Do nothing. Ignore item.
    }
    return result
  }, [])
  return delegationHistory
}

export default {
  error: {
    set: message => state => ({ message }),
    clear: () => state => ({ message: '' }),
  },
  delegationForm: {
    changeDelegator: value => ({ delegator: value }),
    changeDelegatee: value => ({ delegatee: value }),
    changeAmount: value => ({ amount: value })
  },
  location: location.actions,
  toggleNavbarMenu: () => state => ({ isNavbarMenuActive: !state.isNavbarMenuActive }),
  changeUsername: (value) => (state, actions) => {
    return { username: value }
  },
  submitUsername: () => (state, actions) => {
    actions.requestDelegations(state.username)
  },
  setDynamicGlobalProperties: obj => state => ({ dynamicGlobalProperties: obj }),
  requestDynamicGlobalProperties: () => async (state, actions) => {
    try {
      const dynamicGlobalProperties = await steem.api.getDynamicGlobalPropertiesAsync()
      if (!dynamicGlobalProperties) { throw new Error('Sorry, could not get dynamic global properties.')}
      actions.setDynamicGlobalProperties(dynamicGlobalProperties)
    } catch (error) {
      actions.error.set(error.message)
    }
  },
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
      actions.setDynamicGlobalProperties(dynamicGlobalProperties)
      actions.requestAccountHistory(username)
    } catch (error) {
      actions.error.set(error.message)
    }
  },
  setAccountHistory: arr => state => ({ accountHistory: arr }),
  requestAccountHistory: (username) => async (state, actions) => {
    try {
      let accountHistory = await steem.api.getAccountHistoryAsync(username, -1, 5000)
      if (!accountHistory) { throw new Error('Sorry, no account history found.')}
      actions.setAccountHistory(accountHistory)
      actions.setDelegationHistory(assembleDelegationHistory(accountHistory, state.dynamicGlobalProperties).reverse())
    } catch (error) {
      actions.error.set(error.message)
    }
  },
  setDelegationHistory: arr => state => ({ delegationHistory: arr }),
}
