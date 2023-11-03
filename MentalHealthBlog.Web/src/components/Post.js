import React from 'react'
import { MdOutlineModeEditOutline, MdOutlineDelete } from 'react-icons/md'

export const Post = (props) => {
  return (
    <section className="post-container">
      <section className="post-container-content">
        <div className="post-header">
          <h1>{props.title}</h1>
        </div>
        <div className="post-information">
          <textarea
            className="post-content"
            name="content"
            cols={30}
            rows={13}
            value={props.content}
            // disabled={true}
          ></textarea>
        </div>
      </section>
      <div className="overlay-mask">
        <button data-action-update="update" type="button">
          <MdOutlineModeEditOutline onClick={() => alert('Edit')} />
        </button>
        <button data-action-delete="delete" type="button">
          <MdOutlineDelete onClick={() => alert('Delete')} />
        </button>
      </div>
    </section>
  )
}
