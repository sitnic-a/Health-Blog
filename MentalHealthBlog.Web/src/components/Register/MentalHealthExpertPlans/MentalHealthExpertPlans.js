import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
let { plans } = require('../../subscriptionPlans.json')

export const MentalHealthExpertPlans = () => {
  return (
    <section id="register-mental-health-expert-plans-main-container">
      {plans.mental_health_expert_plans.map((plan, index) => {
        return (
          <div key={index} className="register-regular-plan-main-container">
            <div className="register-regular-plan-main-container-header">
              <h3>{plan.plan_type}</h3>
              <h1>{plan.plan_price} KM</h1>
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
