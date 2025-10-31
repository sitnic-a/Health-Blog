import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'
import { openTrialPeriodPopup } from '../../redux-toolkit/features/modalSlice'
import { checkSubscription } from '../../utils/helper-methods/methods'
import { application } from '../../application'

import TrialPeriodPopupCSS from './TrialPeriodPopup.css'

export const TrialPeriodPopup = ({ authenticatedUser }) => {
  let dispatch = useDispatch()
  let { isTrialPeriodPopupOpen } = useSelector((store) => store.modal)

  useEffect(() => {
    dispatch(openTrialPeriodPopup(authenticatedUser?.isUsingForTheFirstTime))
  }, [])

  return (
    <div id="trial-period-main-container">
      <Modal
        id="trial-period-modal"
        appElement={document.getElementById('root')}
        isOpen={isTrialPeriodPopupOpen}
        style={application.trial_period_style}
        onAfterClose={() => {
          //Change on database state for usingForTheFirstTime flag
          //Set timer for trial subscription on
        }}
        onAfterOpen={() => {
          let objectWithData = {
            authenticatedUser,
          }
          dispatch(getUsersTrialPeriod(objectWithData))
        }}
        onRequestClose={() => {
          //Change on database state for usingForTheFirstTime flag
          //Set timer for trial subscription on
          dispatch(openTrialPeriodPopup(!isTrialPeriodPopupOpen))
        }}
      >
        <div className="trial-period-actions-container">
          <span
            className="trial-period-action-close"
            onClick={() => {
              dispatch(openTrialPeriodPopup(!isTrialPeriodPopupOpen))
            }}
          >
            X
          </span>
        </div>

        <div className="trial-period-content-header">
          <p className="trial-period-content-header-title">Informacija</p>
        </div>

        <div className="trial-period-content">
          <p className="trial-period-content-description">
            Poštovani/a {authenticatedUser?.username}, <br />
            <br />
            Ovim putem želimo da Vam zahvalimo što ste odlučili koristiti našu
            aplikaciju. Kao vid zahvalnosti nudimo Vam sedam dana besplatnog
            korištenja!
            <br />
            <br />
            Dan prije isteka biti ćete obaviješteni putem emaila da Vaš
            besplatni period ističe i da će se profil zaključati do sljedeće
            uplate.
            <br />
            <br />
            Želimo Vam ugodan period korištenja. Za dodatne informacije,
            sugestije i primjedbe možete nas kontaktirati na:
            <span className="trial-period-content-link">
              {' '}
              support@mapp-terapija.com
            </span>
          </p>
        </div>

        <div className="trial-period-footer">
          <button
            type="button"
            className="trial-period-continue-button"
            onClick={() => {
              //Change on database state for usingForTheFirstTime flag
              //Set timer for trial subscription on
              dispatch(openTrialPeriodPopup(!isTrialPeriodPopupOpen))
              dispatch()
            }}
          >
            Nastavi korištenje aplikacije
          </button>
        </div>
      </Modal>
    </div>
  )
}
