/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { setTimeout } from 'node:timers/promises';
import { renderMarkdown, splitMarkdown } from './markdown';

export class GeminiTranslator {
  readonly #genAI: GoogleGenerativeAI;
  readonly #fileManager: GoogleAIFileManager;

  constructor(apiKey: string) {
    this.#genAI = new GoogleGenerativeAI(apiKey);
    this.#fileManager = new GoogleAIFileManager(apiKey);
  }

  async translate(content: string, prh: string): Promise<string> {
    const systemInstruction = `
あなたはオープンソースライブラリの開発者向けドキュメントの翻訳者です。
これから次のMarkdownファイルを日本語に翻訳します。

${content}

あなたはこのMarkdownファイルを段落ごとに分割したテキストを受け取ります。
次のルールに従って、受け取ったテキストを翻訳してください。

- 入出力の形式 入力: { text: "## Hello" } 出力: { text: "## こんにちは" }
- 見出しのレベルを維持する。
- 改行やインデントの数を維持する。
- 英単語の前後にスペースを入れない。
- Note/Tip/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL から始まる特殊なプレフィックスは保持する。
- 表現の一貫性を保つため、同じ単語には同じ訳語を使う。

翻訳作業は、次のYAMLで定義されている日本語の校正ルールに従ってください。

${prh}

`.trim();

    const model = this.#genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
      systemInstruction,
    });

    const chatSession = model.startChat({});

    const blocks = splitMarkdown(content);
    const translated = [];

    for (const block of blocks) {
      const { response } = await chatSession.sendMessage([
        {
          text: '次のテキストに含まれる英語を日本語に翻訳してください。\n\n',
        },
        {
          text: JSON.stringify({ text: block }),
        },
      ]);
      const { text: translatedText } = JSON.parse(response.text());
      translated.push(translatedText);
      await setTimeout(3000);
    }
    return renderMarkdown(translated);
  }
}
