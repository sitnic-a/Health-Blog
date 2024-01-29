import { useEffect, useState } from "react";
import { application } from "../application";

export const PieGraph = () => {
  let [statisticsData, setStatisticsData] = useState([]);
  let url = `${application.application_url}/statistics/pie`;

  useEffect(() => {
    let getStatistics = async (url) => {
      try {
        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setStatisticsData(data.serviceResponseObject);
            console.log(statisticsData);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getStatistics(url);
  }, []);
  console.log(statisticsData);
  return <section style={{ width: "100%", background: "red" }}>Test</section>;
};
