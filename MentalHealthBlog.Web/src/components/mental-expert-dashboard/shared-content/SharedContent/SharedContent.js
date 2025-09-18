import moment from 'moment'
import { PostTags } from '../../../PostTags/PostTags'
import { PostEmotions } from '../../../PostEmotions/PostEmotions'

import SharedContentCSS from './SharedContent.css'

export const SharedContent = (props) => {
  let content = props?.content
  let date = moment(content?.createdAt, 'YYYYMMDDHHmmss').fromNow()

  return (
    <div className="sharing-users-post-container">
      <div className="sharing-users-post-header">
        <h2 className="sharing-users-post-header-title">{content?.title}</h2>
        <p className="sharing-users-post-header-datetime">{date}</p>
      </div>

      <div className="sharing-users-post-content">
        <p className="sharing-users-post-content-text">{content?.content}</p>
      </div>

      <div className="sharing-users-main-post-tags">
        <div className="sharing-users-post-tags">
          <span className="sharing-users-post-tags-subtitle">Tagovi: </span>
          <PostTags post={content} />
        </div>
      </div>

      <div className="sharing-users-main-post-emotions">
        <div className="sharing-users-post-emotions">
          <span className="sharing-users-post-emotions-subtitle">Emocije:</span>
          <PostEmotions post={content} />
        </div>
      </div>
    </div>
  )
}
