require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 허용
app.use(cors());
app.use(express.json());

// 정적 파일 제공 (client/dist에서 빌드된 파일 제공)
app.use(express.static(path.join(__dirname, 'dist')));

// GPT 문장 생성 API (POST 요청)
app.post('/api/generate', async (req, res) => {
  const { name, activity, age } = req.body;
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // 프롬프트 생성
    const prompt = `
      [원노트 알림장 자동 생성]
      - 아이의 이름: ${name}
      - 연령: ${age}
      - 활동명: ${activity}
      - 총 7~8문장, 질문-답변, 상호작용 2개 이상, 감정, 교사의 관찰 모두 반영
      - 도입→활동→관찰→질문-답변→마무리(따뜻한 교사 서술형)
      - 문장은 부드럽고 자연스러운 구어체, 반복/어색한 표현/편지투 금지
      - 마지막 문장은 “다음에도 즐거운 활동 기대해 주세요!” 등으로 마무리
      - 활동명은 표준보육과정 영역명+활동명 조합으로 자연스럽게 활용

      위 조건으로 자연스럽고 세련된 한국어 알림장 문장 전체를 써줘.
    `;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
    });

    const message = completion.data.choices[0].message.content.trim();
    res.json({ result: message });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ result: '문장 생성에 실패했습니다.' });
  }
});

// SPA 라우팅 지원
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
