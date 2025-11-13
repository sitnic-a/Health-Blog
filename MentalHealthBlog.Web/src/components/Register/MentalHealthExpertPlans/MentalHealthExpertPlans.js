import { IoMdCheckmark } from 'react-icons/io'
import { toggleChosenPlan } from '../../../utils/helper-methods/methods'

import RegisterPlanCSS from '../RegisterPlan.css'
import { useDispatch } from 'react-redux'
import { setSubscriptionPlanId } from '../../../redux-toolkit/features/subscriptionSlice'

export const MentalHealthExpertPlans = () => {
  let dispatch = useDispatch()
  let { plans } = require('../../subscriptionPlans.json')
  return (
    <section
      className="register-plans-main-container"
      id="register-plans-main-container"
    >
      {plans.mental_health_expert_plans.map((plan, index) => {
        return (
          <div key={index} className="register-plan-main-container">
            <input
              className="register-plan-main-container-id"
              type="hidden"
              value={plan.id}
            />
            <div className="register-plan-main-container-header">
              <div className="register-plan-main-container-header-title-container">
                <h3 className="register-plan-main-container-header-title">
                  {plan.plan_type}
                </h3>
                {plan?.discount && (
                  <span className="register-plan-main-container-header-title-discount">
                    Uštedite {plan.discount} KM
                  </span>
                )}
              </div>
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
                  let subscriptionPlanId = planMainContainer.querySelector(
                    '.register-plan-main-container-id'
                  ).value
                  dispatch(setSubscriptionPlanId(parseInt(subscriptionPlanId)))
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
