import React, { useState } from "react";
import promptTemplates from "./promptTemplates";

function App() {
  const [childName, setChildName] = useState("");
  const [activity, setActivity] = useState("");
  const [ageGroup, setAgeGroup] = useState("만2세");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSentence = async () => {
    setLoading(true);

    const promptData = {
      name: childName,
      activity: activity,
      age: ageGroup,
    };

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promptData),
      });

      const data = await response.json();
      setGeneratedText(data.result);
    } catch (error) {
      console.error("에러 발생:", error);
      setGeneratedText("문장 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>원노트 알림장 생성기</h1>
      <input
        type="text"
        placeholder="단오"
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      <br />
      <input
        type="text"
        placeholder="친구와 심곡천을 산책"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      <br />
      <input
        type="text"
        placeholder="만2세"
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      <br />
      <button onClick={handleGenerateSentence} disabled={loading}>
        문장 생성
      </button>
      <div style={{ marginTop: "30px", whiteSpace: "pre-wrap", padding: "20px" }}>
        {loading ? "생성 중입니다..." : generatedText}
      </div>
    </div>
  );
}

export default App;
