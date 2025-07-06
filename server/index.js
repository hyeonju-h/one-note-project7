require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate', async (req, res) => {
  const { name, activity, age } = req.body;

  // ← 여기를 아래 프롬프트로 완전 교체
  const prompt = `
[표준보육과정 영역: 표현(예술경험)]  
활동명: ${activity}  
연령: ${age}  

*도입*: ${name}가 활동 전 설명을 경청하며 궁금한 표정을 보였습니다.  
*활동*: 다양한 재료를 탐색하며 스스로 선택해 사용했고, 친구와 함께 역할을 분담해 작업을 진행했습니다.  
*관찰*: ${name}는 집중하며 만드는 과정을 즐겼고, 세심한 손동작으로 완성도를 높이려 노력했습니다.  
*상호작용①*: 교사 “어떤 모양을 만들고 싶니?” ↔ ${name} “동그란 눈사람요!”  
*상호작용②*: 친구와 “이 색으로 눈사람을 꾸며볼까?”라며 의견을 주고받았습니다.  
*마무리*: 완성된 작품을 스스로 점검하고, 다음 활동에 대한 기대를 표현했습니다.  

위 구조를 바탕으로 **7~8문장**으로 자연스럽게 써주세요.
  `.trim();
  // ————————————————————————————

  try {
    const chat = await openai.chat.completions.create({
     model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 표준보육과정을 바탕으로 유치원·어린이집 알림장을 작성하는 전문 교사입니다. 한국어로, 구체적인 도입·활동·관찰·상호작용·마무리 구조를 지키고, 친근한 어투로 써주세요.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    res.json({ result: chat.choices[0].message.content.trim() });
  } catch (err) {
    console.error('GPT 에러:', err.response?.data || err.message);
    res.status(500).json({ result: '문장 생성에 실패했습니다.' });
  }
});

// SPA 라우팅
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
