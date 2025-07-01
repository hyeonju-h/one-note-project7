export async function generateGPTResponse(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 유치원 선생님처럼 따뜻하고 아기자기하게 알림장을 작성해주는 AI야.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GPT 요청 실패: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
