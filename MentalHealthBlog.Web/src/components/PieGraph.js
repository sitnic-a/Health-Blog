import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { prepareForPieGraph } from './redux-toolkit/features/pieSlice'

ChartJS.register(ArcElement, Tooltip, Legend)

export const PieGraph = ({ searchPostDto }) => {
  let dispatch = useDispatch()
  let { labels, numberOfTags } = useSelector((store) => store.pie)

  const data = {
    labels: [...labels],
    datasets: [
      {
        label: 'Times posted',
        data: [...numberOfTags],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 0.4,
      },
    ],
  }

  useEffect(() => {
    dispatch(prepareForPieGraph(searchPostDto))
  }, [])

  return (
    <section className="pie-graph-section">
      <p>Pie Graph Chart</p>
      <Pie data={data} />
    </section>
  )
}
