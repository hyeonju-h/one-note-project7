import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [activity, setActivity] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, activity, age }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setResult("문장 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(120deg, #e0f7fa 0%, #fffde4 100%)",
      minHeight: "100vh",
      fontFamily: "Noto Sans KR, sans-serif",
      padding: "0"
    }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/one-note-logo.png" alt="로고" style={{ height: 32, marginRight: 12 }} />
          <h1 style={{ color: "#17bcd6" }}>원노트 알림장 생성기</h1>
        </div>
        <form onSubmit={handleGenerate} style={{
          background: "#fff", borderRadius: 20, boxShadow: "0 6px 32px #0002",
          padding: 32, marginTop: 40, display: "flex", flexDirection: "column", gap: 18
        }}>
          <input placeholder="아이 이름" value={name} onChange={e => setName(e.target.value)} required />
          <input placeholder="활동명 (예: 쌓기 아이스크림 가게 만들기)" value={activity} onChange={e => setActivity(e.target.value)} required />
          <input placeholder="연령 (예: 만 2세)" value={age} onChange={e => setAge(e.target.value)} required />
          <button type="submit" disabled={loading}
            style={{
              background: "linear-gradient(120deg, #38f9d7 0%, #43e97b 100%)",
              border: "none", color: "#fff", borderRadius: 10, padding: "18px 0",
              fontWeight: "bold", fontSize: 24, cursor: "pointer"
            }}>
            {loading ? "생성 중..." : "문장 생성"}
          </button>
        </form>
        {result && (
          <div style={{
            background: "#e0f7fa", margin: "32px 0 0 0", borderRadius: 16,
            padding: 28, fontSize: 18, lineHeight: 1.8, color: "#333"
          }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
