import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import {
  changeIsUsingForTheFirstTime,
  refreshAccessToken,
} from '../../redux-toolkit/features/userSlice'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'
import { openTrialPeriodPopup } from '../../redux-toolkit/features/modalSlice'
import { checkSubscription } from '../../utils/helper-methods/methods'
import { application } from '../../application'

import Cookies from 'js-cookie'

import TrialPeriodPopupCSS from './TrialPeriodPopup.css'

export const TrialPeriodPopup = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { isTrialPeriodPopupOpen } = useSelector((store) => store.modal)

  const onCloseStartTimerAndChangeIsUsingForTheFirstTime = () => {
    let refreshToken = Cookies.get('refreshToken')
    dispatch(refreshAccessToken(refreshToken)).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode === 201) {
        let serviceResponseObject =
          data?.payload?.serviceResponseObject?.serviceResponseObject

        localStorage.setItem(
          'authenticatedUser',
          JSON.stringify(serviceResponseObject)
        )

        authenticatedUserLocalStorage =
          localStorage.getItem('authenticatedUser')
        authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

        dispatch(
          openTrialPeriodPopup(authenticatedUser?.isUsingForTheFirstTime)
        )
      }
    })
    let objectWithData = {
      authenticatedUser,
    }
    //Set timer for trial subscription on
    dispatch(getUsersTrialPeriod(objectWithData))
    console.log('On close counter started....')
  }

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
        onRequestClose={() => {
          //Change on database state for usingForTheFirstTime flag
          let patchDocument = [
            {
              op: 'replace',
              path: '/IsUsingForTheFirstTime',
              value: false,
            },
          ]
          let objectWithData = {
            authenticatedUser,
            patchDocument,
          }
          dispatch(changeIsUsingForTheFirstTime(objectWithData))
          onCloseStartTimerAndChangeIsUsingForTheFirstTime()
        }}
      >
        <div className="trial-period-actions-container">
          <span
            className="trial-period-action-close"
            onClick={() => {
              let patchDocument = [
                {
                  op: 'replace',
                  path: '/IsUsingForTheFirstTime',
                  value: false,
                },
              ]
              let objectWithData = {
                authenticatedUser,
                patchDocument,
              }
              dispatch(changeIsUsingForTheFirstTime(objectWithData))
              onCloseStartTimerAndChangeIsUsingForTheFirstTime()
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
              let patchDocument = [
                {
                  op: 'replace',
                  path: '/IsUsingForTheFirstTime',
                  value: false,
                },
              ]
              let objectWithData = {
                authenticatedUser,
                patchDocument,
              }
              dispatch(changeIsUsingForTheFirstTime(objectWithData))
              onCloseStartTimerAndChangeIsUsingForTheFirstTime()
            }}
          >
            Nastavi korištenje aplikacije
          </button>
        </div>
      </Modal>
    </div>
  )
}
