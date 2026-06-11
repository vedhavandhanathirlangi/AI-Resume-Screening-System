import "./ResumeUpload.css";
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [matchScore, setMatchScore] = useState(0);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [jobDescription, setJobDescription] = useState("");

  const getProgressColor = () => {
  if (matchScore <= 40) return "#dc2626"; // Red
  if (matchScore <= 70) return "#f59e0b"; // Orange
  return "#22c55e"; // Green
};

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      alert(response.data.message);

      setResumeText(response.data.text);
      setSkills(response.data.skills);

      setMatchScore(response.data.matchScore);
      setMissingSkills(response.data.missingSkills);
      setSuggestions(response.data.suggestions);

    } catch (error) {
      console.error(error);

      alert("Upload failed");
    }
  };

  const downloadReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Resume Analysis Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`Match Score: ${matchScore}%`, 20, 40);

  doc.text(
    `Skills Found: ${skills.join(", ")}`,
    20,
    60
  );

  doc.text(
    `Missing Skills: ${missingSkills.join(", ")}`,
    20,
    90
  );

  doc.text(
    `Suggestions: ${suggestions.join(", ")}`,
    20,
    120
  );

  doc.save("Resume_Report.pdf");
};

  return (
  <div className="container">
    <h1 className="title">AI Resume Screening System</h1>

    {/* Upload Section */}
    <input
      type="file"
      accept=".pdf"
      onChange={(e) => setFile(e.target.files[0])}
    />

    <br />
    <br />

    {/* Job Description */}
    <h3>Job Description</h3>

    <textarea
      rows="6"
      cols="60"
      placeholder="Paste Job Description Here"
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
    />

    <br />
    <br />

    {/* Upload Button */}
    <button onClick={handleUpload}>
      Upload Resume
    </button>
    {matchScore > 0 && (
  <button
    onClick={downloadReport}
    style={{ marginLeft: "10px" }}
  >
    Download Report
  </button>
)}

    {/* Score Cards */}
    {matchScore > 0 && (
      <div className="card-container">
        <div className="card">
          <h3>Match Score</h3>
          <div className="score">{matchScore}%</div>
        </div>

        <div className="card">
          <h3>Skills Found</h3>
          <div className="score">{skills.length}</div>
        </div>
      </div>
    )}

   {/* Resume Match Progress */}
{matchScore > 0 && (
  <div>
    <h3>Resume Match Progress</h3>

    <div className="progress-container">
      <div
        className="progress-bar"
        style={{
          width: `${matchScore}%`,
          backgroundColor: getProgressColor(),
        }}
      >
        {matchScore}%
      </div>
    </div>

    <p>
      {matchScore >= 80
        ? "Excellent Match!"
        : matchScore >= 60
        ? "Good Match"
        : "Needs Improvement"}
    </p>
  </div>
)}

    {/* Selected File */}
    {file && (
      <p style={{ marginTop: "15px" }}>
        Selected File: <strong>{file.name}</strong>
      </p>
    )}

    {/* Resume Text */}
    {resumeText && (
      <div style={{ marginTop: "20px" }}>
        <h3>Extracted Resume Text</h3>

        <textarea
          rows="15"
          cols="80"
          value={resumeText}
          readOnly
        />
      </div>
    )}

    {/* Skills Found */}
    {skills.length > 0 && (
      <div style={{ marginTop: "20px" }}>
        <h3>Skills Found</h3>

        <div className="skills-container">
       {skills.map((skill, index) => (
       <span className="skill-badge" key={index}>
        {skill}
       </span>
  ))}
</div>
      </div>
    )}

    {/* Missing Skills */}
    {missingSkills.length > 0 && (
      <div style={{ marginTop: "20px" }}>
        <h3>Missing Skills</h3>

       <div className="skills-container">
       {missingSkills.map((skill, index) => (
       <span className="missing-badge" key={index}>
        {skill}
       </span>
  ))}
</div>
      </div>
    )}

     {/* AI Suggestions */}
    {suggestions.length > 0 && (
     <div className="suggestion-box">
    <h3>AI Suggestions</h3>

    {suggestions.map((suggestion, index) => (
      <p className="suggestion-item" key={index}>
        {suggestion}
      </p>
    ))}
  </div>
)}
  </div>
);
}

export default ResumeUpload;