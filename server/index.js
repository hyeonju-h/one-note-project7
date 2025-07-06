// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate', async (req, res) => {
  const { name, activity, age } = req.body;
  const prompt = `
원노트 알림장 자동 생성:
- 아이 이름: ${name}
- 활동명: ${activity}
- 연령: ${age}

요구사항:
1) 번호 없이 순수 7~8문장
2) 도입→활동→관찰→질문-답변 1회→상호작용 2회 이상→마무리
3) “안녕하세요”, “부모님께” 등 모든 인사말 제거
4) “교사:”, “현주:” 같은 레이블 제거
5) 서명(교사 드림 등) 제거
6) 마지막 문장은 반드시 “다음에도 즐거운 활동 기대해 주세요!”
`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });
    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: '문장 생성에 실패했습니다.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
