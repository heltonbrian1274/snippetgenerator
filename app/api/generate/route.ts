import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tone = formData.get('tone')?.toString() || 'professional';
  const blog = formData.get('blog');
  const video = formData.get('video') as File | null;

  let baseText = '';
  if (blog) {
    baseText = blog.toString();
  } else if (video) {
    const buffer = Buffer.from(await video.arrayBuffer());
    const response = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large', {
      method: 'POST',
      headers: {
        Authorization: `Bearer hf_your_huggingface_key`,
        'Content-Type': 'audio/mpeg',
      },
      body: buffer,
    });
    const json = await response.json();
    baseText = json.text || '';
  }

  const prompt = `Summarize this content in a ${tone} tone and create:
- A 280-character tweet
- An Instagram caption
- A 60-second TikTok script

Content:
"""
${baseText}
"""`;

  const aiResponse = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const completion = aiResponse.data.choices[0].message?.content || '';
  const [tweet, instagram, tiktok] = completion.split(/Instagram caption:|TikTok script:/).map(x => x.trim());

  return NextResponse.json({ tweet, instagram, tiktok });
}
