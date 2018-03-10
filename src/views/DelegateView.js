import {h} from 'hyperapp'
import config from '../common/config'
import { unitString2Number, vests2Steem, steem2Vests } from '../common/utils'

export default ({state, actions}) => {
  const delegateSteemPower = () => {
    const delegationURL = `https://steemconnect.com/sign/delegate-vesting-shares?delegator=${state.delegationForm.delegator}&delegatee=${state.delegationForm.delegatee}&vesting_shares=${steem2Vests(state.delegationForm.amount, state.dynamicGlobalProperties)} VESTS`
    window.open(delegationURL)
  }

  if (!state.dynamicGlobalProperties) {
    actions.requestDynamicGlobalProperties()
    return (
      <div class='container'>
        <div class='column is-half is-offset-one-quarter'>
          <h1>Loading …</h1>
        </div>
      </div>
    )
  }

  return (
    <div class='container'>
      <div class='column is-half is-offset-one-quarter'>
        <section class='section'>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Delegator</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-static">
                      @
                    </a>
                  </p>
                  <p class="control is-expanded">
                    <input
                      onkeyup={event => actions.delegationForm.changeDelegator(event.target.value)}
                      class="input" type="text" placeholder="Your Steemit username"
                    />
                  </p>
                </div>
                <p class="help">The account you want to delegate SP from. Normally you enter your Steemit username here.</p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Delegatee</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-static">
                      @
                    </a>
                  </p>
                  <p class="control is-expanded">
                    <input
                      onkeyup={event => actions.delegationForm.changeDelegatee(event.target.value)}
                      class="input" type="tel" placeholder="Steemit username"
                    />
                  </p>
                </div>
                <p class="help">The account you want to delegate SP to.</p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Amount</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-static">
                      SP
                    </a>
                  </p>
                  <p class="control is-expanded">
                    <input
                      onkeyup={event => actions.delegationForm.changeAmount(event.target.value)}
                      class="input" type="tel" placeholder="Amount in Steem Power"
                    />
                  </p>
                </div>
                <p class="help">The amount of SP you want to delegate.</p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <button class='button is-primary' onclick={delegateSteemPower}>
                    Delegate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
