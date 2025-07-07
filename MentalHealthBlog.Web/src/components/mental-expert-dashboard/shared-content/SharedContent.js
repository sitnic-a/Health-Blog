import { formatDateToString } from '../../utils/helper-methods/methods'

import { PostEmotions } from '../../PostEmotions'

export const SharedContent = (props) => {
  let content = props.content
  let date = formatDateToString(content.createdAt)

  return (
    <div className="sharing-users-post-container">
      <div className="sharing-users-post-header">
        <h2 className="sharing-users-post-header-title">{content.title}</h2>
        <p className="sharing-users-post-header-datetime">{date}</p>
      </div>

      <div className="sharing-users-post-content">
        <p className="sharing-users-post-content-text">{content.content}</p>
      </div>

      <div className="sharing-users-main-post-tags">
        <div className="sharing-users-post-tags">
          <span className="sharing-users-post-tags-subtitle">Tags: </span>
          {content.tags.map((tag) => {
            return (
              <span className="sharing-users-post-tag" key={tag}>
                {tag}
              </span>
            )
          })}
        </div>
      </div>

      <div className="sharing-users-main-post-emotions">
        <div className="sharing-users-post-emotions">
          <span className="sharing-users-post-emotions-subtitle">
            Emotions:
          </span>
          <PostEmotions post={content} />
        </div>
      </div>
    </div>
  )
}
