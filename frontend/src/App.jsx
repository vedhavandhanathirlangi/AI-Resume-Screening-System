import ResumeUpload from "./components/ResumeUpload";
import History from "./components/History";
import DashboardStats from "./components/DashboardStats";
import ScoreChart from "./components/ScoreChart";

function App() {
  return (
    <>
      <DashboardStats />
      <ScoreChart />
      <ResumeUpload />
      <History />
    </>
  );
}
export default App;