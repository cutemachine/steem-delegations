import {h} from 'hyperapp'
import config from '../common/config'
import { unitString2Number, vests2Steem } from '../common/utils'

export default ({state, actions}) => {
  let delegationItems = state.delegations.map((item, index) => {
    return (
      <tr>
        <td>{item.delegator}</td>
        <td>{item.delegatee}</td>
        <td>{unitString2Number(item.vesting_shares)} VESTS</td>
        <td>{vests2Steem(item.vesting_shares, state.dynamicGlobalProperties)} SP</td>
        <td>{item.min_delegation_time}</td>
      </tr>
    )
  })
  return (
    <section class='section'>
      <div class='container'>
        <div class='content'>
          <h1>{config.projectName}</h1>
          <p>Enter a steem user name and hit return to retrieve delegation information from the Steem blockchain.</p>
          <div class="field has-addons">
            <div class="control has-icons-left">
              <input
                onkeyup={
                  event => {
                    (event.keyCode === 13) ? actions.submitUsername() : actions.changeUsername(event.target.value)
                  }
                }
                class="input"
                type="text"
                placeholder="username …"
                autofocus
              />
              <span class="icon is-small is-left">
                <i class="fa fa-at"></i>
              </span>
            </div>
            <div class="control">
              <button class='button is-primary' onclick={actions.submitUsername}>
                Request Delegations
              </button>
            </div>
          </div>
          <h3 class='title'>Current Delegations</h3>
          <table class='table is-hoverable is-fullwidth'>
            <thead>
              <tr>
                <th>Delegator</th>
                <th>Delegatee</th>
                <th>Vesting Shares</th>
                <th>Steem Power</th>
                <th>Min Delegation Time</th>
              </tr>
            </thead>
            <tbody>
              { delegationItems }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
