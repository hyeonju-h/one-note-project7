// index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI API 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 연령별 스타일 프롬프트 템플릿
const promptTemplates = {
  "만 0세": "이 활동을 진행한 만 0세 아이의 관찰 중심 문장을 구성해줘. 문장은 짧고 간단한 감각 묘사 위주로 구성해. 총 5문장. 편지형 말투는 사용하지 마.",
  "만 1세": "이 활동을 진행한 만 1세 아이의 감각 묘사 중심 문장을 구성해줘. 간단한 동사와 짧은 문장으로 표현해. 총 5~6문장. 교사의 시선으로 작성하고 감성 마무리 포함.",
  "만 2세": "이 활동을 진행한 만 2세 아이의 감정과 교사와의 상호작용 중심 문장을 구성해줘. 질문-답변 형태 2~3문장 포함. 총 5~6문장. 감성적인 교사 서술형 마무리 포함.",
  "만 3세": "이 활동을 진행한 만 3세 아이의 행동과 질문 중심 문장을 구성해줘. 질문-답변 문장 2~3개 포함, 감성적인 교사 관찰 시선 포함. 총 5~6문장으로 구성.",
  "만 4세": "이 활동을 진행한 만 4세 아이의 감정과 사회적 상호작용 중심 문장을 구성해줘. 질문-답변 문장 2~3개 포함. 도입-활동-관찰-질문-반응-감성 마무리 순서로 구성해.",
  "만 5세": "이 활동을 진행한 만 5세 아이의 자율성과 친구와의 협력 중심 문장을 구성해줘. 질문-답변 문장 2~3개 포함. 총 5~6문장. 편지형 말투는 사용하지 말고, 교사의 감성적 마무리로 끝내줘.",
};

// POST 요청으로 문장 생성
app.post("/api/generate", async (req, res) => {
  const { activity, childName, age } = req.body;

  const prompt = `
  활동명: ${activity}
  아이 이름: ${childName}
  연령: ${age}
  
  다음 조건에 맞는 알림장 문장을 작성해줘:
  ${promptTemplates[age]}
  
  문장은 아이의 감정, 참여 행동, 교사의 관찰 시선을 담고 있으며, 질문-답변 구조 2~3문장을 포함해. 총 5~6문장으로 구성하고 마지막은 감성적인 교사 서술형 문장으로 마무리해줘.
  `;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error("OpenAI API 오류:", error.message);
    res.status(500).json({ error: "문장 생성 중 오류가 발생했습니다." });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`✅ 백엔드 서버 실행 중: http://localhost:${port}`);
});
