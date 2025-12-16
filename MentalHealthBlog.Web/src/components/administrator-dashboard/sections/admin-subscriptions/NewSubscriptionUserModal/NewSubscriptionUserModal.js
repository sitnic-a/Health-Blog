import Modal from 'react-modal'
import { application } from '../../../../../application'

import NewSubscriptionUserModalCSS from './NewSubscriptionUserModal.css'

export const NewSubscriptionUserModal = () => {
  return (
    <section id="new-subscription-user-modal-main-container">
      <Modal
        style={application.add_post_modal_style}
        isOpen={true}
        appElement={document.getElementById('root')}
      >
        <span className="new-subscription-user-non-subscribed-users-close-button">
          X
        </span>
        <div className="new-subscription-user-modal-container">
          <div className="new-subscription-user-non-subscribed-users-main-container">
            <div className="new-subscription-user-non-subscribed-users-container">
              <div className="new-subscription-user-non-subscribed-users-container-header">
                <label className="new-subscrition-user-non-subscribed-label">
                  Pretražite po imenu ili prezimenu
                </label>
                <input
                  className="form-field new-subscription-user-non-subscribed-users-first-or-last-name"
                  list="new-subscription-user-non-subscribed-users"
                  type="text"
                  placeholder="Unesite ime ili prezime"
                />
                <datalist id="new-subscription-user-non-subscribed-users">
                  <option value="Ahmed Kadić" />
                  <option value="Safija Bošković" />
                  <option value="Admir Sitnić" />
                  <option value="Emir Adžemović" />
                  <option value="Dijana Fermić" />
                </datalist>
              </div>

              <div className="new-subscription-user-non-subscribed-users-container-content">
                <div className="new-subscription-user-non-subscribed-users-field">
                  <p className="new-subscription-user-non-subscribed-users-field-label">
                    Odabrana osoba
                  </p>
                  <p className="new-subscription-user-non-subscribed-selected-user">
                    [Osoba]
                  </p>
                </div>

                <div className="new-subscription-user-non-subscribed-users-field">
                  <p className="new-subscription-user-non-subscribed-users-field-label">
                    Uplatio:
                  </p>
                  <input
                    type="number"
                    className="form-field new-subscription-user-non-subscribed-user-amount"
                    placeholder="Unesite iznos..."
                  />
                </div>

                <div className="new-subscription-user-non-subscribed-users-field">
                  <button
                    className="new-subscription-user-non-subscribed-users-save-button"
                    type="button"
                  >
                    Snimi uplatu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}
