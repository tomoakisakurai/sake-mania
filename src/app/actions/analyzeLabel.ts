'use server';
import Anthropic from '@anthropic-ai/sdk';

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
スキーマ: { "name": "銘柄名", "brewery": "酒蔵名", "pref": "都道府県", "cls": "分類 例: 純米大吟醸", "polish": "精米歩合 例: 50%", "rice": "使用酒米", "description": "味わいの短い紹介文(40〜70字)" }
余計な文章やコードフェンスは付けず、JSON オブジェクトだけを出力してください。`;

export async function analyzeLabel(dataUrl: string): Promise<LabelAnalysisResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/);
  if (!match) return null;
  const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  const base64Data = match[2];

  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
          { type: 'text', text: 'このラベルから読み取れる情報を JSON で返してください。' },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') return null;
  const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<LabelAnalysisResult>;
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
