// src/components/ActivitySelector.jsx
import { useState } from "react";

function ActivitySelector({ age, setAge, activity, setActivity, customActivity, setCustomActivity }) {
  const ageOptions = ["만 0세", "만 1세", "만 2세", "만 3세", "만 4세", "만 5세"];
  const [activityOptions, setActivityOptions] = useState([
    "색칠하기", "블록쌓기", "산책", "동시 감상", "요리 활동", "음률 활동"
  ]);

  // ➕ 사용자 입력 추가 함수
  const handleAddCustomActivity = () => {
    const trimmed = customActivity.trim();
    if (trimmed !== "" && !activityOptions.includes(trimmed)) {
      setActivityOptions([...activityOptions, trimmed]); // 목록에 추가
      setActivity(trimmed); // 자동 선택
      setCustomActivity(""); // 입력창 초기화 ✅
    } else if (trimmed !== "") {
      setActivity(trimmed); // 이미 있으면 선택만
      setCustomActivity(""); // 초기화
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* 👶 연령 선택 */}
      <label>
        연령 선택:
        <select value={age} onChange={(e) => setAge(e.target.value)}>
          <option value="">선택하세요</option>
          {ageOptions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>

      {/* 🎨 활동명 선택 */}
      <label style={{ marginLeft: "1rem" }}>
        활동명 선택:
        <select value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">선택하세요</option>
          {activityOptions.map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </label>

      {/* ✍ 사용자 직접 입력 */}
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="활동명 직접 입력"
          value={customActivity}
          onChange={(e) => setCustomActivity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddCustomActivity(); // ⏎ 엔터로도 추가 가능
          }}
        />
        <button onClick={handleAddCustomActivity} style={{ marginLeft: "0.5rem" }}>
          추가
        </button>
      </div>
    </div>
  );
}

export default ActivitySelector;
