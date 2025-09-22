import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/bs'

import { getPosts } from '../../redux-toolkit/features/postSlice'
import {
  prepareForPieGraph,
  setRerendering,
} from '../../redux-toolkit/features/pieSlice'

import ListOfPostsFilterOptionsCSS from './ListOfPostsFilterOptions.css'

export const ListOfPostsFilterOptions = (props) => {
  let dispatch = useDispatch()
  let { isFiltering } = useSelector((store) => store.filter)
  let { authenticatedUser } = useSelector((store) => store.user)
  let [months, setMonths] = useState([])

  let searchPostDto = props?.searchPostDto

  useEffect(() => {
    moment.locale('bs')
    let bsMonthsWithFirstUppercaseLetter = moment.months().map((month) => {
      return month.charAt(0).toUpperCase() + month.slice(1)
    })
    setMonths(bsMonthsWithFirstUppercaseLetter)
  }, [])

  let filterPosts = (e) => {
    searchPostDto = {
      authenticatedUser,
      monthOfPostCreation: e.target.selectedIndex,
    }

    dispatch(getPosts(searchPostDto))
    dispatch(setRerendering())
    dispatch(prepareForPieGraph(searchPostDto))
  }

  return (
    isFiltering && (
      <div className="dashboard-filter-container">
        <h3>Filteri:</h3>
        <div className="dashboard-filter-options">
          <div className="filter-by-month">
            <p>Mjesec:</p>
            <select
              name="filter-by-month"
              id="filter-by-month"
              onChange={(e) => {
                filterPosts(e)
              }}
            >
              <option>Odaberite mjesec</option>
              {months?.map((month, index) => {
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
