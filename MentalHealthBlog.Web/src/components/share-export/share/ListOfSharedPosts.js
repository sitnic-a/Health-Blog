import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { formatDateToString } from '../../utils/helper-methods/methods'
import { toast } from 'react-toastify'
import { PostEmotions } from '../../PostEmotions'
import { PostTags } from '../../PostTags'

export const ListOfSharedPosts = () => {
  let { postsToShare } = useSelector((store) => store.shareExport)

  useEffect(() => {
    toast.success('Content retrieved succesfully!', {
      position: 'bottom-right',
    })
  }, [])

  return (
    <section id="shared-posts-via-link-main-container">
      {postsToShare?.map((post, index) => {
        console.log('Post LS ', post)

        let date = formatDateToString(post?.createdAt)
        let tags = post.tags
        let emotions = post?.emotions
        return (
          <div
            className="shared-posts-via-link-post-main-container"
            key={index}
          >
            <span className="shared-post-via-link-post-number">
              {index + 1}
            </span>

            <div className="shared-posts-via-link-post-container">
              <div className="shared-posts-via-link-post-details">
                <div className="shared-posts-via-link-tags-main-container">
                  <p className="shared-posts-via-link-post-details-subtitle">
                    Your thoughts about:
                  </p>

                  {tags?.length > 0 && (
                    <div className="shared-posts-via-link-tags-container">
                      <PostTags post={post} />
                    </div>
                  )}
                </div>

                {emotions?.length > 0 && (
                  <div className="shared-posts-via-link-emotions-main-container">
                    <p className="shared-posts-via-link-post-details-subtitle">
                      Emotions recognized:
                    </p>
                    <div className="shared-posts-via-link-emotions-container">
                      <PostEmotions post={post} />
                    </div>
                  </div>
                )}

                <p className="shared-posts-via-link-post-details-date">
                  Created at: {date}
                </p>
              </div>

              <div className="shared-posts-via-link-post-content">
                <div className="shared-posts-via-link-post-header">
                  <h1 className="shared-posts-via-link-header-title">
                    {post?.title}
                  </h1>
                </div>
                <pre className="shared-posts-via-link-post-content-details">
                  {post?.content}
                </pre>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
