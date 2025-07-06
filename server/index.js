// 1) dotenv 설정
import dotenv from 'dotenv';
dotenv.config();


// 2) core 모듈 및 라이브러리 import
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';


// 3) __dirname 세팅 (ESM에서는 따로 처리)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 4) 앱 초기화
const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());


// 5) 빌드된 프론트엔드 정적 제공
//    (client에서 `npm run build`로 생성된 dist 폴더를 server/dist로 복사했다고 가정)
app.use(express.static(path.join(__dirname, 'dist')));


// 6) OpenAI 인스턴스
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// 7) 알림장 생성 API
app.post('/api/generate', async (req, res) => {
  const { name, activity, age } = req.body;

  // 만약 빠뜨렸다면 max_tokens 를 800으로!
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '당신은 따뜻한 유치원 교사입니다. 알림장 형식으로 응답하세요.' },
        { role: 'user', content:
          `- 아이 이름: ${name}
- 활동명: ${activity}
- 연령: ${age}

위 정보를 바탕으로 7~8문장 분량의 알림장 문장을 작성해 주세요.
• 질문-답변 (교사 ↔ 아이) 상호작용 1회
• 교사와 아이의 대화/응답 2회 이상 포함
• 마지막에 “다음에도 즐거운 활동 기대해 주세요!” 로 마무리
` }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const message = completion.choices[0].message.content.trim();
    res.json({ result: message });

  } catch (err) {
    console.error('🔥 GPT 에러:', err);
    res.status(500).json({ result: '문장 생성에 실패했습니다.' });
  }
});


// 8) SPA 라우팅 지원: 나머지 경로는 index.html로
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// 9) 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
