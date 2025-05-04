import React from 'react'
import { useParams } from 'react-router-dom'

export const Assignments = () => {
  let { id } = useParams()

  return <div>Assignments to be displayed for id: {id}</div>
}
