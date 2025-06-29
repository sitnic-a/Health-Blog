import { useDispatch, useSelector } from 'react-redux'

import { LiaSearchSolid } from 'react-icons/lia'
import defaultAvatar from '../images/default-avatar.png'

import { MdPhone, MdEmail } from 'react-icons/md'

export const ShareModal2 = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport } = useSelector((store) => store.shareExport)

  return (
    postsToExport.length > 0 &&
    isShareOpen && (
      <section className="share-modal-container-2-overlay">
        <section id="share-modal-container-2">
          <span className="share-modal-close-modal-btn">X</span>

          <div className="share-modal-header">
            <p>Share posts...</p>
          </div>

          <div className="share-modal-posts-to-share-container">
            <div className="share-modal-posts-to-share">
              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>
            </div>
          </div>

          <div className="share-modal-action-container">
            <div className="share-modal-filter-container">
              <input
                type="text"
                className="search-by-name-surname-organization"
              />
              <button
                className="search-by-name-surname-organization-filter-button"
                type="button"
              >
                Search
                <LiaSearchSolid className="search-by-name-surname-organization-filter-icon" />
              </button>
            </div>

            <div className="share-modal-share-actions">
              <button className="share-content-to-experts" disabled>
                Share Content
              </button>
              <button className="share-content-to-experts">
                Share via link
              </button>
            </div>
          </div>

          <div className="share-modal-people-to-share-with">
            <div className="person-to-share-with-main-container">
              <input
                className="person-to-share-content-with-checkbox"
                type="checkbox"
                name="person-to-share-content-with-checkbox"
              />
              <div className="person-to-share-with-container">
                <div className="person-to-share-with-img-container">
                  <img
                    className="person-to-share-with-img"
                    src={defaultAvatar}
                    alt="Person"
                  />
                </div>

                <div className="person-to-share-with-header-info-container">
                  <h3 className="person-to-share-with-name">Ime i Prezime</h3>
                  <p className="person-to-share-with-role">Role</p>
                </div>

                <div className="person-to-share-with-additional-info-container">
                  <div className="person-to-share-with-additional-info-field person-to-share-with-phone-field">
                    <MdPhone className="person-to-share-with-phone-icon" />
                    <p
                      className="person-to-share-with-phone-value"
                      title="+38762/000-111"
                    >
                      +38762/000-111
                    </p>
                  </div>

                  <div className="person-to-share-with-additional-info-field person-to-share-with-email-field">
                    <MdEmail className="person-to-share-with-email-icon" />
                    <p
                      className="person-to-share-with-email-value"
                      title="emaiemail123@email.com"
                    >
                      emailemail123@email.com
                    </p>
                  </div>

                  <hr />

                  <div className="person-to-share-with-additional-info-field person-to-share-with-organization-field">
                    <p className="person-to-share-with-organization-value">
                      organization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  )
}
