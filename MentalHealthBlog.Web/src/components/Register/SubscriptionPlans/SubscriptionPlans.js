import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { RegularUserPlans } from '../RegularUserPlans/RegularUserPlans'
import { MentalHealthExpertPlans } from '../MentalHealthExpertPlans/MentalHealthExpertPlans'

import SubscriptionPlansCSS from './SubscriptionPlans.css'

export const SubscriptionPlans = () => {
  let { plans } = require('../../subscriptionPlans.json')
  let justRegisteredUser = localStorage.getItem('justRegisteredUser')
  let isMentalHealthExpert = false

  return (
    <section id="register-choose-subscription-plan-main-container">
      <div className="register-choose-subscription-plan-container">
        <div className="register-choose-subscription-plan-header">
          <h1 className="register-choose-subscription-plan-header-title">
            Odabir plana pretplate
          </h1>
          <p className="register-choose-subscription-plan-header-subtitle">
            Molimo Vas da odaberete željeni plan
          </p>
        </div>
        <div className="register-choose-subscription-plan-plans-container">
          {isMentalHealthExpert ? (
            <MentalHealthExpertPlans />
          ) : (
            <RegularUserPlans />
          )}
        </div>

        <div className="register-choose-subscription-plan-actions-container">
          <button
            className="register-choose-subscription-plan-action-register"
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </section>
  )
}
