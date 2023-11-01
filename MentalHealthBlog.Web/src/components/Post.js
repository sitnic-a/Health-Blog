import React from 'react'

export const Post = (props) => {
  return (
    <section className="post-container">
      <div className="post-header">
        <label>{props.title}</label>
      </div>
      <div className="post-information">
        <textarea
          className="post-content"
          name="content"
          id="post-content"
          cols={15}
          rows={12}
          value={props.content}
          disabled={true}
        ></textarea>
      </div>
      <button data-put="update" type="button">
        Checkmark
      </button>
      <button type="button">X</button>
    </section>
  )
}
