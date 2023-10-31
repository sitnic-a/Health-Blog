import React from 'react'
import { useEffect, useState } from 'react'

export const Posts = () => {
  useEffect(() => {
    let postsJSON = fetch('https://localhost:7029/api/post')
    let response = postsJSON.then((response) => response.json())
    setPosts(response)
  }, [])

  let [posts, setPosts] = useState([])
  console.log(posts)

  return (
    <section>
      <h1>Display all posts...</h1>
    </section>
  )
}
