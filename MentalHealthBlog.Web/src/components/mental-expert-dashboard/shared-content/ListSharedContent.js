import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOverlayPost } from '../../redux-toolkit/features/mentalExpertSlice'
import { SharedContent } from './SharedContent'
import { OverlayPostPreview } from './OverlayPostPreview'

export const ListSharedContent = (props) => {
  let dispatch = useDispatch()
  let { overlayPost } = useSelector((store) => store.mentalExpert)
  let sharedContent = [...props.sharedContent]

  return (
    <section className="sharing-users-content-container">
      <h1>Shared content</h1>

      {overlayPost !== null && <OverlayPostPreview content={overlayPost} />}

      <div className="sharing-users-posts">
        {sharedContent.length > 0 &&
          sharedContent.map((content) => {
            return (
              <div
                className="sharing-users-main-post-container"
                key={content.id}
                onClick={() => dispatch(setOverlayPost(content))}
              >
                <SharedContent content={content} />
              </div>
            )
          })}
      </div>
    </section>
  )
}
