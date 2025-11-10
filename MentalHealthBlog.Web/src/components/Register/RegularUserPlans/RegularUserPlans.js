import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

import RegularUserPlansCSS from './RegularUserPlans.css'

export const RegularUserPlans = () => {
  let { plans } = require('../../subscriptionPlans.json')
  return (
    <section id="register-regular-plans-main-container">
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
            <hr />
            <div className="register-regular-plan-accommodations-main-container">
              {plan.accommodation_list.map((accommodation, index) => {
                return (
                  <div
                    key={index}
                    className="register-regular-plan-accommodation-main-container"
                  >
                    <div className="register-regular-plan-accommodation-container">
                      <IoIosCheckmarkCircleOutline className="register-regular-plan-accommodation-icon" />
                      <p className="register-regular-plan-accommodation-container-value">
                        {accommodation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
