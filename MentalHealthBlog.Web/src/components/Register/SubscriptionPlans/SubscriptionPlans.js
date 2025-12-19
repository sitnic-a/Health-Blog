import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createSubscription } from '../../../redux-toolkit/features/subscriptionSlice'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { RegularUserPlans } from '../RegularUserPlans/RegularUserPlans'
import { MentalHealthExpertPlans } from '../MentalHealthExpertPlans/MentalHealthExpertPlans'

import SubscriptionPlansCSS from './SubscriptionPlans.css'
import { Loader } from '../../shared/Loader/Loader'

export const SubscriptionPlans = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { plans } = require('../../subscriptionPlans.json')
  let { subscriptionPlanId, isLoading } = useSelector(
    (store) => store.subscription
  )
  let justRegisteredUserLocalStorage =
    localStorage.getItem('justRegisteredUser')
  let justRegisteredUser

  if (
    justRegisteredUserLocalStorage !== null ||
    justRegisteredUserLocalStorage !== undefined
  ) {
    justRegisteredUser = JSON.parse(justRegisteredUserLocalStorage)
  }

  return isLoading ? (
    <Loader />
  ) : (
    <section id="register-choose-subscription-plan-main-container">
      <div className="register-choose-subscription-plan-container">
        <div className="register-choose-subscription-plan-header">
          <h1 className="register-choose-subscription-plan-header-title">
            Odabir plana pretplate
          </h1>
          <p className="register-choose-subscription-plan-header-subtitle">
            Molimo Vas da odaberete željeni plan
          </p>
          <p className="register-choose-subscription-plan-header-subtitle">
            Neovisno o odabranom planu, dobijate{' '}
            <strong>7 dana besplatnog korištenja aplikacije</strong>
          </p>
        </div>
        <div className="register-choose-subscription-plan-plans-container">
          {justRegisteredUser?.isMentalHealthExpert ? (
            <MentalHealthExpertPlans />
          ) : (
            <RegularUserPlans />
          )}
        </div>

        <div className="register-choose-subscription-plan-actions-container">
          <button
            className="register-choose-subscription-plan-action-register"
            type="button"
            onClick={() => {
              let requestObj = {
                userId: justRegisteredUser?.id,
                subscriptionPlanId: subscriptionPlanId,
                paidAt: null,
                isCreatingAnAccount: true,
              }
              let objectWithData = {
                requestObj,
              }
              dispatch(createSubscription(objectWithData)).then((data) => {
                let statusCode = data?.payload?.statusCode
                if (statusCode === 201) {
                  localStorage.removeItem('justRegisteredUser')
                  navigate('/login')
                  toast.success('Uspješno ste se registrovali na aplikaciju', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                }
              })
            }}
          >
            Register
          </button>
        </div>
      </div>
    </section>
  )
}
