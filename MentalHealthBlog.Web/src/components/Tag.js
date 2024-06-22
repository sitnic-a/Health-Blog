import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsHovered,
  setHoveredPost,
  setHoveredTag,
} from './redux-toolkit/features/tagGradeSlice'

import { TagGrade } from './TagGrade'

export const Tag = (props) => {
  let dispatch = useDispatch()
  let post = props.post
  let tag = props.tag

  let { isHovered, hoveredPost, hoveredTag } = useSelector(
    (store) => store.tagGrade
  )

  if (isHovered) {
    console.log('IsHovered ', isHovered)
    if (hoveredPost.id === post.id && hoveredTag === tag) {
      return (
        <>
          <span className="add-post-content-picked-tags-span-tag">{tag}</span>
          <TagGrade post={post} tag={tag} />
        </>
      )
    }
  }

  return (
    <div
      className="add-post-content-picked-tags-span-tag"
      onMouseOver={(e) => {
        dispatch(setIsHovered(true))
        dispatch(setHoveredPost(post))
        dispatch(setHoveredTag(tag))
      }}
    >
      {tag}
    </div>
  )
}

export default Tag
