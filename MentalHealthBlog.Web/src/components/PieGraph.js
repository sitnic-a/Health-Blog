import { useEffect, useState } from "react";
import { application } from "../application";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieGraph = (props) => {
  let arr = [{ ...props.pieData }];
  const data = {
    labels: arr.map((t) => t.tagName),
    datasets: [
      {
        label: "# of Votes",
        data: arr.map((t) => t.numberOfTags),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  let pieData = { ...props.pieData };
  console.log("Pie Graph", pieData);
  return <Pie data={pieData} />;
};
