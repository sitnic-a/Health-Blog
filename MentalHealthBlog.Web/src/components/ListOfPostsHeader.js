import { useState } from 'react'

import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { AddPost } from './AddPost'

export const ListOfPostsHeader = () => {
  let [isCreatingPost, setIsCreatingPost] = useState(false)
  return (
    <>
      {isCreatingPost && <AddPost isOpen={isCreatingPost} />}
      <section className="list-of-posts-header">
        <h1 className="list-of-posts-author">Written by: ...</h1>
        <button
          data-action-add="add"
          type="button"
          onClick={() => {
            setIsCreatingPost(!isCreatingPost)
          }}
        >
          <MdOutlineAddCircleOutline />
          Add new post
        </button>
      </section>
    </>
  )
}
