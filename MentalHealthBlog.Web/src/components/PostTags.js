import React from 'react'
import Tag from './Tag'

export const PostTags = (props) => {
  let post = props.post

  return (
    <div className="post-container-tags">
      {post.tags.map((tag) => {
        return <Tag key={tag} post={post} tag={tag} />
      })}
    </div>
  )
}
