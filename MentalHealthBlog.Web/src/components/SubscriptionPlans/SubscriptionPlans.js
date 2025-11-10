import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
let { plans } = require('../subscriptionPlans.json')

export const SubscriptionPlans = () => {
  let justRegisteredUser = localStorage.getItem('justRegisteredUser')
  let isMentalHealthExpert = false

  return (
    <section id="register-choose-subscription-plan-main-container">
      <div className="register-choose-subscription-plan-header">
        <h1 className="register-choose-subscription-plan-header-title">
          Odabir plana pretplate
        </h1>
        <p className="register-choose-subscription-plan-header-subtitle">
          Molimo Vas da odaberete željeni plan
        </p>
      </div>
      <div className="register-choose-subscription-plan-plans-container">
        {
          isMentalHealthExpert ? (
            <>
              {plans.mental_health_expert_plans.map((plan, index) => {
                return (
                  <div
                    key={index}
                    className="register-regular-plan-main-container"
                  >
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
            </>
          ) : (
            <>
              {plans.regular_user_plans.map((plan, index) => {
                return (
                  <div
                    key={index}
                    className="register-regular-plan-main-container"
                  >
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
            </>
          )
          //Uslovno prikazivanje u zavisnosti od tipa korisnika, planovi za korisnika ili za experta
        }
      </div>
    </section>
  )
}
