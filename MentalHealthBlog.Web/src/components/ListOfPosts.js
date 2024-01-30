import React from "react";
//Import hooks
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

//Import custom configuration and data
import { application } from "../application";

//Import components
import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { PieGraph } from "./PieGraph";

export const ListOfPosts = () => {
  let [posts, setPosts] = useState([]);
  let [statisticsData, setStatisticsData] = useState([]);
  let [pieGraphData, setPieGraphData] = useState({});

  let location = useLocation();

  let loggedUser = location.state.loggedUser;
  let url = `${application.application_url}/post?UserId=${loggedUser.id}`;
  let statisticsUrl = `${application.application_url}/statistics/pie`;

  let labels;
  let numberOfTags;
  let d;
  useEffect(() => {
    let getStatistics = async (url) => {
      try {
        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setStatisticsData(data.serviceResponseObject);
            console.log(statisticsData);
            labels = statisticsData.map((t) => t.tagName);
            numberOfTags = statisticsData.map((t) => t.numberOfTags);
            // d = {
            //   labels: labels,
            //   numberOfTags: numberOfTags,
            // };
            setPieGraphData({
              labels: labels,
              datasets: [
                {
                  label: "# of Votes",
                  data: numberOfTags,
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
            });
          });
      } catch (error) {
        console.log(error);
      }
    };

    let getPosts = async (url) => {
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setPosts(data.serviceResponseObject));
    };
    getPosts(url);
    getStatistics(statisticsUrl);

    // setPieGraphData(d);
  }, []);

  return (
    <>
      <ListOfPostsHeader />
      <div className="dashboard">
        <section className="list-of-posts-main-container">
          {posts.map((post) => {
            return <Post key={post.id} {...post} />;
          })}
        </section>
        <section className="pie-graph-main-container">
          <PieGraph pieData={pieGraphData} />
        </section>
      </div>
    </>
  );
};
