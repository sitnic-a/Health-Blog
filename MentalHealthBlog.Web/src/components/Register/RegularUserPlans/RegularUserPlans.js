import { IoMdCheckmark } from 'react-icons/io'

import RegularUserPlansCSS from './RegularUserPlans.css'
import { toggleChosenPlan } from '../../../utils/helper-methods/methods'

export const RegularUserPlans = () => {
  let { plans } = require('../../subscriptionPlans.json')
  return (
    <section
      className="register-regular-plans-main-container"
      id="register-regular-plans-main-container"
    >
      {plans.regular_user_plans.map((plan, index) => {
        return (
          <div key={index} className="register-regular-plan-main-container">
            <div className="register-regular-plan-main-container-header">
              <h3 className="register-regular-plan-main-container-header-title">
                {plan.plan_type}
              </h3>
              <h1 className="register-regular-plan-main-container-header-subtitle">
                {plan.plan_price} KM
              </h1>
            </div>
            <hr className="register-regular-plan-main-container-separator" />
            <div className="register-regular-plan-accommodations-main-container">
              {plan.accommodation_list.map((accommodation, index) => {
                return (
                  <div
                    key={index}
                    className="register-regular-plan-accommodation-main-container"
                  >
                    <div className="register-regular-plan-accommodation-container">
                      <IoMdCheckmark className="register-regular-plan-accommodation-icon" />
                      <p className="register-regular-plan-accommodation-container-value">
                        {accommodation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="register-regular-plan-choose-plan-button-container">
              <button
                className="register-regular-plan-choose-plan-button"
                type="button"
                onClick={(e) => {
                  let planMainContainer = e.currentTarget.parentNode.parentNode

                  toggleChosenPlan(planMainContainer)
                }}
              >
                Odaberi plan
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}
