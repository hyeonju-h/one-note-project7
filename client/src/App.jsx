import React, { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [activity, setActivity] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // 문장 생성 요청 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");

    try {
      // 아래 주소는 예시! 실제 서버 엔드포인트로 바꿔야 동작
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, activity, age }),
      });

      if (!response.ok) throw new Error("서버 오류");

      const data = await response.json();
      if (data && data.result) {
        setResult(data.result);
      } else {
        setError("문장 생성에 실패했습니다.");
      }
    } catch (err) {
      setError(err.message || "문장 생성에 실패했습니다.");
    }
  };

  return (
    <div className="App" style={{ minHeight: "100vh", background: "linear-gradient(#eefbee 60%, #fdfff2 100%)" }}>
      <header style={{ paddingTop: 60, marginLeft: 120 }}>
        {/* 로고 경로 주의! public/images/one-note-logo.png */}
        <img
          src="/images/one-note-logo.png"
          alt="로고"
          style={{ height: 42, marginRight: 12, verticalAlign: "middle" }}
        />
        <span style={{ fontSize: 48, color: "#1fc2e7", fontWeight: 700, verticalAlign: "middle" }}>
          원노트 알림장 생성기
        </span>
      </header>

      <main>
        <form
          className="form-box"
          onSubmit={handleSubmit}
          style={{
            margin: "60px auto 0 auto",
            maxWidth: 850,
            padding: 48,
            background: "#fff",
            borderRadius: 38,
            boxShadow: "0 10px 48px 0 #b6ebe6a9",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="아이 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "95%",
              height: 40,
              marginBottom: 18,
              fontSize: 22,
              border: "1.5px solid #ddd",
              borderRadius: 6,
              paddingLeft: 14,
            }}
          />
          <br />
          <input
            type="text"
            placeholder="활동명 (예: 쌓기 아이스크림 가게 만들기)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            style={{
              width: "95%",
              height: 40,
              marginBottom: 18,
              fontSize: 22,
              border: "1.5px solid #ddd",
              borderRadius: 6,
              paddingLeft: 14,
            }}
          />
          <br />
          <input
            type="text"
            placeholder="연령 (예: 만 2세)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{
              width: "95%",
              height: 40,
              marginBottom: 32,
              fontSize: 22,
              border: "1.5px solid #ddd",
              borderRadius: 6,
              paddingLeft: 14,
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              width: "97%",
              height: 80,
              background: "linear-gradient(90deg,#41e1b0,#4ff781)",
              color: "#fff",
              fontSize: 42,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            문장 생성
          </button>
        </form>

        {/* 결과/에러 출력 */}
        {result && (
          <div
            style={{
              margin: "44px auto 0 auto",
              width: 800,
              background: "#e9ffe8",
              color: "#145c31",
              fontSize: 24,
              borderRadius: 18,
              padding: 30,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {result}
          </div>
        )}
        {error && (
          <div
            style={{
              margin: "44px auto 0 auto",
              width: 800,
              background: "#e6f8ff",
              color: "#2e3b52",
              fontSize: 24,
              borderRadius: 18,
              padding: 30,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
