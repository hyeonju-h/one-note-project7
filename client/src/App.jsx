import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [activity, setActivity] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, activity, age }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult('문장 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>원노트 알림장 생성기</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="아이 이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="활동명 (예: 쌓기 아이스크림 가게 만들기)"
          value={activity}
          onChange={e => setActivity(e.target.value)}
          required
        />
        <input
          placeholder="연령 (예: 만 2세)"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '문장 생성'}
        </button>
      </form>

      {result && (
        <div className="result-box">
          {result.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
