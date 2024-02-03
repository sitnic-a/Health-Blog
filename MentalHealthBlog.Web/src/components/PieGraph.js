import { useEffect, useState } from 'react'
import { application } from '../application'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const PieGraph = () => {
  let [labels, setLabels] = useState([])
  let [numberOfTags, setNumberOfTags] = useState([])
  let url = `${application.application_url}/statistics/pie`

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
    let getStatisticsData = async (url) => {
      let tagLabels = []
      let tagNumberOfTags = []
      let funcData = []
      try {
        let apiCall = await fetch(url)
          .then((responseJSON) => responseJSON.json())
          .then((data) => {
            funcData = [...data.serviceResponseObject]
          })
      } catch (err) {
        console.log(`Couldn't fetch the data`, err)
      }

      for (var i = 0; i < funcData.length; i++) {
        tagLabels.push(funcData[i].tagName)
        tagNumberOfTags.push(funcData[i].numberOfTags)
      }
      setLabels(tagLabels)
      setNumberOfTags(tagNumberOfTags)
    }
    getStatisticsData(url)
  }, [])
  return (
    <section className="pie-graph-section">
      <p>Pie Graph Chart</p>
      <Pie data={data} />
    </section>
  )
}
