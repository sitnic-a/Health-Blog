import { useSelector } from "react-redux";

import { SiViber, SiGmail } from "react-icons/si";
import { LuCopy } from "react-icons/lu";
import { Link } from "react-router-dom";

export const ShareViaLink = () => {
  let { isShareViaLinkOpen } = useSelector((store) => store.modal);
  let { shareLinkUrl } = useSelector((store) => store.shareExport);

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
            {shareLinkUrl !== "" && (
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

                <LuCopy />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  );
};
