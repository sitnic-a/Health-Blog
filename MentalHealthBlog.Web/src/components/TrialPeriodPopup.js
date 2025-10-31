import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { openTrialPeriodPopup } from '../redux-toolkit/features/modalSlice'
import { application } from '../application'

import TrialPeriodPopupCSS from './TrialPeriodPopup.css'
import { getUserById } from '../redux-toolkit/features/userSlice'
import { checkSubscription } from '../utils/helper-methods/methods'

export const TrialPeriodPopup = ({ authenticatedUser }) => {
  let dispatch = useDispatch()
  let { dbUser } = useSelector((store) => store.user)

  let { isTrialPeriodPopupOpen } = useSelector((store) => store.modal)

  return (
    <div id="trial-period-main-container">
      <Modal
        id="trial-period-modal"
        appElement={document.getElementById('root')}
        isOpen={isTrialPeriodPopupOpen}
        style={application.trial_period_style}
        onAfterClose={() => {
          //Change on database state
        }}
        onAfterOpen={() => {
          dispatch(getUserById(authenticatedUser?.id))
        }}
        onRequestClose={() => {
          //Change on database state
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
              dispatch(openTrialPeriodPopup(!isTrialPeriodPopupOpen))
              checkSubscription(dbUser)
            }}
          >
            Nastavi korištenje aplikacije
          </button>
        </div>
      </Modal>
    </div>
  )
}
