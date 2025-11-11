import { IoMdCheckmark } from 'react-icons/io'
import { toggleChosenPlan } from '../../../utils/helper-methods/methods'

import RegisterPlanCSS from '../RegisterPlan.css'

export const RegularUserPlans = () => {
  let { plans } = require('../../subscriptionPlans.json')
  return (
    <section
      className="register-plans-main-container"
      id="register-plans-main-container"
    >
      {plans.regular_user_plans.map((plan, index) => {
        return (
          <div key={index} className="register-plan-main-container">
            <div className="register-plan-main-container-header">
              <h3 className="register-plan-main-container-header-title">
                {plan.plan_type}
              </h3>
              <h1 className="register-plan-main-container-header-subtitle">
                {plan.plan_price} KM
              </h1>
            </div>
            <hr className="register-plan-main-container-separator" />
            <div className="register-plan-accommodations-main-container">
              {plan.accommodation_list.map((accommodation, index) => {
                return (
                  <div
                    key={index}
                    className="register-plan-accommodation-main-container"
                  >
                    <div className="register-plan-accommodation-container">
                      <IoMdCheckmark className="register-plan-accommodation-icon" />
                      <p className="register-plan-accommodation-container-value">
                        {accommodation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="register-plan-choose-plan-button-container">
              <button
                className="register-plan-choose-plan-button"
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
