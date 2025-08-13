import { useDispatch, useSelector } from 'react-redux'
import { revokeShareContent } from '../../../../redux-toolkit/features/shareExportSlice'

import PostsToShareCSS from './PostsToShare.css'

export const PostsToShare = () => {
  let dispatch = useDispatch()
  let { postsToExport } = useSelector((store) => store.shareExport)

  return (
    <div className="share-modal-posts-to-share-container">
      <div className="share-modal-posts-to-share">
        {postsToExport?.map((post) => {
          return (
            <div className="share-modal-post-to-share-container" key={post?.id}>
              <p className="share-modal-post-to-share-title">{post?.title}</p>
              <span
                className="share-modal-post-to-share-remove-from-list"
                onClick={() => {
                  dispatch(revokeShareContent(post.id))
                }}
              >
                X
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
