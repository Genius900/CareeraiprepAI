export default async (req, context) => {
  const { question, answer } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Netlify.env.get('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Tu ek experienced Indian HR interviewer hai. Is interview question ka answer evaluate kar.

Question: ${question}
Answer: ${answer}

Sirf JSON format mein respond kar, koi aur text ya markdown nahi:
{"score": <1 se 10>, "feedback": "<2-3 line Hinglish feedback>"}`,
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.log('Anthropic error:', JSON.stringify(data))
    return Response.json({ score: 5, feedback: 'API error: ' + (data.error?.message || 'unknown') }, { status: 200 })
  }

  try {
    let text = data.content[0].text
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(text)
    return Response.json(parsed)
  } catch (e) {
    console.log('Parse error:', e.message, 'Raw text:', data.content[0]?.text)
    return Response.json({ score: 5, feedback: 'Response parse nahi ho paya. Try again.' }, { status: 200 })
  }
}

export const config = {
  path: '/api/feedback',
}