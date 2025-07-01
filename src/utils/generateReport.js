export async function generateReport({ activity, name, ageGroup }) {
  try {
    const prompt = `${ageGroup} 아이인 ${name}가 "${activity}" 활동에 참여했어요. 활동 과정, 아이의 반응, 교사의 시선, 질문-답변 형식을 포함해서 5~6문장으로 감성적이고 따뜻하게 작성해줘. 마지막 문장은 '편지'가 아니라 교사가 전달하는 형식으로 마무리해줘.`;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "내용을 불러오지 못했어요.";
  } catch (error) {
    console.error("문장 생성 오류:", error);
    return null;
  }
}
