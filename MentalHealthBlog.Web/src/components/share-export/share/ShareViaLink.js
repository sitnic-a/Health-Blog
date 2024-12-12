import { useDispatch, useSelector } from 'react-redux'
import { openShareViaLink } from '../../redux-toolkit/features/modalSlice'

import { SiViber, SiGmail } from 'react-icons/si'
import { LuCopy } from 'react-icons/lu'

export const ShareViaLink = () => {
  let dispatch = useDispatch()
  let { isShareViaLinkOpen } = useSelector((store) => store.modal)

  return (
    isShareViaLinkOpen === true && (
      <section id="share-via-link-main-container">
        <div className="share-via-link-container">
          <div className="share-via-link-heading">
            <h2>Choose how to share content...</h2>
          </div>
          <div className="share-via-link-systems">
            <div className="external-systems-main-container">
              <div className="external-systems-container">
                <div className="external-system es-viber-container">
                  <SiViber />
                </div>
                <div className="external-system es-gmail-container">
                  <SiGmail />
                </div>
              </div>
            </div>
          </div>
          <div className="share-via-link-url-main-container">
            <div className="share-via-link-url-container">
              {/* Show link if created */}
              <p className="share-via-link-url">
                Link:
                <span className="share-via-link-url-value">
                  https://localhost:7029/api/share/link/61e6bd5e-45db-4d76-b8f0-fe35e070eba4
                </span>
              </p>

              <LuCopy />
            </div>
          </div>
        </div>
      </section>
    )
  )
}
