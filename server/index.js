require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'dist')));

// GPT 문장 생성 API
app.post('/api/generate', async (req, res) => {
  const { name, activity, age } = req.body;
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // 프롬프트 예시
    const prompt = `${name}(${age})가 참여한 "${activity}" 활동 알림장을 상호작용과 감정 중심 6문장으로 써줘.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: prompt}
      ],
      max_tokens: 400,
    });

    const message = completion.data.choices[0].message.content.trim();
    res.json({ result: message });
  } catch (error) {
    // 상세 에러 로그 추가
    console.error("🔥 GPT 에러:", error.response?.data || error.message, error);
    res.status(500).json({ result: '문장 생성에 실패했습니다.' });
  }
});

// SPA 라우팅
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});
