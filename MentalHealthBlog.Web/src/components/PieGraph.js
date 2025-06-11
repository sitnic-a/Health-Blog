import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { prepareForPieGraph } from './redux-toolkit/features/pieSlice'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { toast } from 'react-toastify'
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
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
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
    dispatch(prepareForPieGraph(searchPostDto)).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode !== 200) {
        toast.error('Tags are not fetched properly, statistics unavailable', {
          position: 'bottom-right',
        })
      }
    })
  }, [])

  return (
    <section className="pie-graph-section">
      {labels.length > 0 && numberOfTags.length > 0 && (
        <>
          <p>Pie Graph Chart</p>
          <Pie data={data} />
        </>
      )}
    </section>
  )
}
