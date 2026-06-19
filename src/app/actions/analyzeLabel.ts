'use server';
import OpenAI from 'openai';

export interface LabelAnalysisResult {
  name: string;
  brewery: string;
  pref: string;
  cls: string;
  polish: string;
  rice: string;
  description: string;
}

const SYSTEM_PROMPT = `あなたは日本酒のラベルを構造化するアシスタントです。
画像から読み取れる情報を JSON のみで返してください。読み取れない項目は空文字でかまいません。
スキーマ: { "name": "銘柄名", "brewery": "酒蔵名", "pref": "都道府県", "cls": "分類 例: 純米大吟醸", "polish": "精米歩合 例: 50%", "rice": "使用酒米", "description": "味わいの短い紹介文(40〜70字)" }`;

export async function analyzeLabel(dataUrl: string): Promise<LabelAnalysisResult | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!/^data:image\/(jpeg|png|webp|gif);base64,/.test(dataUrl)) return null;

  const client = new OpenAI();
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'このラベルから読み取れる情報を JSON で返してください。' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) return null;
  try {
    const parsed = JSON.parse(text) as Partial<LabelAnalysisResult>;
    return {
      name: parsed.name || '',
      brewery: parsed.brewery || '',
      pref: parsed.pref || '',
      cls: parsed.cls || '',
      polish: parsed.polish || '',
      rice: parsed.rice || '',
      description: parsed.description || '',
    };
  } catch {
    return null;
  }
}
