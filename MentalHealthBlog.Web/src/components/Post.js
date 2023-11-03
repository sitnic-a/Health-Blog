import React from 'react'

export const Post = (props) => {
  return (
    <section className="post-container">
      <div className="post-header">
        <h1>{props.title}</h1>
      </div>
      <div className="post-information">
        <textarea
          className="post-content"
          name="content"
          cols={30}
          rows={12}
          value={props.content}
          disabled={true}
        ></textarea>
      </div>
      <button data-action-update="update" type="button">
        Checkmark
      </button>
      <button data-action-delete="delete" type="button">
        X
      </button>
    </section>
  )
}
