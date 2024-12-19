import { useSelector } from "react-redux";

import { SiViber, SiGmail } from "react-icons/si";
import { LuCopy } from "react-icons/lu";
import { Link } from "react-router-dom";

export const ShareViaLink = () => {
  let { isShareViaLinkOpen } = useSelector((store) => store.modal);
  let { shareLinkUrl } = useSelector((store) => store.shareExport);

  let openExternal = (source) => {
    window.open(`${source}`, "_blank");
  };

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
                <div
                  className="external-system es-viber-container"
                  onClick={() =>
                    openExternal(
                      `viber://forward?text=Please review my content: ${shareLinkUrl}`
                    )
                  }
                >
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
                  onClick={() =>
                    openExternal(
                      `https://mail.google.com/mail/?view=cm&v=b&cs=wh&to=email@domain.example&su=Share content&body=Please review my content: ${shareLinkUrl}`
                    )
                  }
                >
                  <span>
                    <SiGmail
                      style={{ stroke: "url(#es-gmail-container-gradient)" }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="share-via-link-url-main-container">
            {shareLinkUrl !== "" && (
              <div className="share-via-link-url-container">
                <p className="share-via-link-url">
                  Link:
                  <Link
                    to={shareLinkUrl}
                    target="_blank"
                    className="share-via-link-url-value"
                  >
                    {shareLinkUrl}
                  </Link>
                </p>
                <div
                  className="share-via-link-url-copy-container"
                  onClick={() => {
                    let indicator = document.querySelector(".indicator");
                    var timeout = 0;

                    navigator.clipboard.writeText(shareLinkUrl);

                    indicator.classList.add("share-via-link-copy-indicator");

                    timeout = setTimeout(function () {
                      indicator.classList.remove(
                        "share-via-link-copy-indicator"
                      );
                    }, 1500);
                  }}
                >
                  <LuCopy />
                </div>
              </div>
            )}
          </div>
          <div className="indicator">Copied</div>
        </div>
      </section>
    )
  );
};
