import { useSelector } from 'react-redux'

import { SiViber, SiGmail } from 'react-icons/si'
import { LuCopy } from 'react-icons/lu'
import { Link } from 'react-router-dom'

export const ShareViaLink = () => {
  let { isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { shareLinkUrl } = useSelector((store) => store.shareExport)

  let openGmail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&v=b&cs=wh&to=email@domain.example&su=Share content&body=Please review my content: ${shareLinkUrl}`
    )
  }

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
                  <span>
                    <SiViber />
                  </span>
                </div>

                <svg width="0" height="0">
                  <linearGradient
                    id="es-gmail-container-gradient"
                    x1="100%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop stopColor="#34a853" offset="0%" />
                    <stop stopColor="#fbbc05" offset="20%" />
                    <stop stopColor="#ea4335" offset="40%" />
                    <stop stopColor="#bb001b" offset="65%" />
                    <stop stopColor="#4285f4" offset="100%" />
                  </linearGradient>
                </svg>

                <div
                  className="external-system es-gmail-container"
                  onClick={() => openGmail()}
                >
                  <span>
                    <SiGmail
                      style={{ stroke: 'url(#es-gmail-container-gradient)' }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="share-via-link-url-main-container">
            {shareLinkUrl !== '' && (
              <div className="share-via-link-url-container">
                <p className="share-via-link-url">
                  Link:
                  <Link
                    to={shareLinkUrl}
                    target="_top"
                    className="share-via-link-url-value"
                  >
                    {shareLinkUrl}
                  </Link>
                </p>
                <div
                  className="share-via-link-url-copy-container"
                  onClick={() => {
                    let urlContainer = document.querySelector(
                      '.share-via-link-url-container'
                    )

                    urlContainer.addEventListener('click', (e) => {
                      let linkContainer = urlContainer.querySelector(
                        '.share-via-link-url > .share-via-link-url-value'
                      )
                      let contentUrl = linkContainer.href
                      navigator.clipboard.writeText(contentUrl)
                    })
                  }}
                >
                  <LuCopy />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  )
}
