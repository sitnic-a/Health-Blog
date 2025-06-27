import { useDispatch, useSelector } from 'react-redux'

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
                <span>X</span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span>X</span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span>X</span>
              </div>
            </div>
          </div>

          <div className="share-modal-action-container">
            <div className="share-modal-filter-container">
              <input
                type="text"
                className="search-by-name-surname-organization"
              />
              <button type="button">Search</button>
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
            <input type="checkbox" name="person-to-share-content-with" />

            <div className="person-to-share-with-main-container">
              <div className="person-to-share-with-img-container">
                <img className="person-to-share-with-img" src="" alt="" />
              </div>

              <div className="person-to-share-with-header-info-container">
                <h3>Ime i Prezime</h3>
                <p>Role</p>
              </div>

              <div className="person-to-share-with-additional-info-container">
                <div className="person-to-share-with-additional-info-field">
                  <span>icon</span>
                  <span>+38762/000-111</span>
                </div>

                <div className="person-to-share-with-additional-info-field">
                  <span>icon</span>
                  <span>emailemail123@email.com</span>
                </div>

                <hr />

                <div className="person-to-share-with-additional-info-field">
                  <span>organization</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  )
}
