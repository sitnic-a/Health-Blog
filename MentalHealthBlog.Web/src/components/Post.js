import React from 'react'

export const Post = ({ props }) => {
  return (
    <section>
      <h1>{props.title}</h1>
      <h2>{props.content}</h2>
    </section>
  )
}
