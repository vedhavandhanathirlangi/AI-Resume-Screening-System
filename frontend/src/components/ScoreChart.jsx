import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ScoreChart() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.log(err));
  }, []);

  const data = {
    labels: history.map((item) => `Resume ${item.id}`),
    datasets: [
      {
        label: "Match Score",
        data: history.map((item) => item.match_score),
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "30px auto" }}>
      <h2>Resume Match Score Analytics</h2>
      <Bar data={data} />
    </div>
  );
}

export default ScoreChart;