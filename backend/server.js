const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const db = require("./db");

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text;
    const jobDescription = req.body.jobDescription || "";

    const skillsDatabase = [
      "Java",
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "SQL",
      "HTML",
      "CSS",
      "C",
      "C++",
      "Git",
      "GitHub",
      "AWS",
      "Docker",
      "Express"
    ];

    const skillsFound = skillsDatabase.filter((skill) =>
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );
    const requiredSkills = skillsDatabase.filter((skill) =>
    jobDescription.toLowerCase().includes(skill.toLowerCase())
    );
    const matchedSkills = requiredSkills.filter((skill) =>
  skillsFound.includes(skill)
);

   const missingSkills = requiredSkills.filter(
   (skill) => !skillsFound.includes(skill)
    );

    const matchScore =
    requiredSkills.length > 0
      ? Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
      )
    : 0;
     const suggestions = [];

     missingSkills.forEach((skill) => {
     suggestions.push(`Consider learning ${skill}`);
     });
     const query = `
INSERT INTO resume_analysis
(resume_text, skills, match_score, missing_skills, suggestions)
VALUES (?, ?, ?, ?, ?)
`;

db.query(
  query,
  [
    resumeText,
    JSON.stringify(skillsFound),
    matchScore,
    JSON.stringify(missingSkills),
    JSON.stringify(suggestions),
  ],
  (err, result) => {
    if (err) {
      console.log("Database Error:", err);
    } else {
      console.log("Analysis Saved Successfully");
    }
  }
);
     res.json({
     message: "Resume parsed successfully",
     text: resumeText,
     skills: skillsFound,
     matchScore,
     missingSkills,
     suggestions
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/history", (req, res) => {
  db.query(
    "SELECT * FROM resume_analysis ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/stats", (req, res) => {
  const query = `
    SELECT
      COUNT(*) AS totalResumes,
      ROUND(AVG(match_score), 0) AS averageScore,
      MAX(match_score) AS highestScore
    FROM resume_analysis
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results[0]);
    }
  });
});

