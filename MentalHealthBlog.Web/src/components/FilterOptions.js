import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { getPosts } from './redux-toolkit/features/postSlice'
import {
  prepareForPieGraph,
  setRerendering,
} from './redux-toolkit/features/pieSlice'

export const FilterOptions = (props) => {
  let dispatch = useDispatch()
  let { isFiltering } = useSelector((store) => store.filter)
  let { authenticatedUser } = useSelector((store) => store.user)
  let [months, setMonths] = useState([])

  let searchPostDto = props.searchPostDto

  useEffect(() => {
    setMonths(moment.months())
  }, [])

  let filterPosts = (e) => {
    searchPostDto = {
      authenticatedUser,
      monthOfPostCreation: e.target.selectedIndex,
    }
    console.log('On change obj ', searchPostDto)
    dispatch(getPosts(searchPostDto))
    dispatch(setRerendering())
    dispatch(prepareForPieGraph(searchPostDto))
  }

  return (
    isFiltering && (
      <div className="dashboard-filter-container">
        <h3>Filter:</h3>
        <div className="dashboard-filter-options">
          <div className="filter-by-month">
            <p>Month:</p>
            <select
              name="filter-by-month"
              id="filter-by-month"
              onChange={(e) => {
                filterPosts(e)
              }}
            >
              <option>Pick a month</option>
              {months.map((month, index) => {
                return (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
    )
  )
}
