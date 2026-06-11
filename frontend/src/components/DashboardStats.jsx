import { useEffect, useState } from "react";
import axios from "axios";

function DashboardStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="stats-container">

      <div className="stat-card">
        <h3>Total Resumes</h3>
        <p>{stats.totalResumes}</p>
      </div>

      <div className="stat-card">
        <h3>Average Score</h3>
        <p>{stats.averageScore}%</p>
      </div>

      <div className="stat-card">
        <h3>Highest Score</h3>
        <p>{stats.highestScore}%</p>
      </div>

    </div>
  );
}

export default DashboardStats;