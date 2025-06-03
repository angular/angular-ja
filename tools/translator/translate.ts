/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { GoogleGenAI } from '@google/genai';
import { setTimeout } from 'node:timers/promises';
import { renderMarkdown, splitMarkdown } from './markdown';

export class GeminiTranslator {
  readonly #client: GoogleGenAI;
  readonly #model: string;

  constructor(apiKey: string, model: string) {
    this.#client = new GoogleGenAI({ apiKey });
    this.#model = model;
    console.log(`Using model: ${model}`);
  }

  async translate(content: string, prh: string): Promise<string> {
    const systemInstruction = `
あなたはオープンソースライブラリの開発者向けドキュメントの翻訳者です。
入力として与えられたテキストに含まれる英語を日本語に翻訳します。

## Rules
翻訳は次のルールに従います。

- 見出しレベル（"#"）の数を必ず維持する。
  - 例: "# How to use Angular" → "# Angularの使い方"
- 見出しを翻訳する場合、元の見出しをlower caseでハイフン結合したアンカーIDとして使用する
  - 例: "# How to use Angular" → "# Angularの使い方 {#how-to-use-angular}"
- 改行やインデントの数を必ず維持する。
- 英単語の前後にスペースを入れない。
  - bad: "Angular の使い方"
  - good: "Angularの使い方"
- 特別なプレフィックスは翻訳せずにそのまま残す。
  - 例: NOTE/TIP/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL
- 表現の一貫性を保つため、同じ単語には同じ訳語を使う。
- 冗長な表現を避け、自然な日本語にする。
  - 例: 「することができます」→「できます」

表記揺れや不自然な日本語を避けるため、YAML形式で定義されているPRH(proofreading helper)ルールを使用して、翻訳後のテキストを校正します。
次のPRHルールを使用してください。
---
${prh}
---

## Task

ユーザーはテキスト全体を分割し、断片ごとに翻訳を依頼します。
あなたは与えられた断片を日本語に翻訳し、Markdown形式で出力します。
前回の翻訳結果を参照しながら、テキスト全体での表現の一貫性を保つようにしてください。

入力例:

---
# Security

This topic describes Angular's built-in protections against common web application vulnerabilities and attacks such as cross-site scripting attacks.
It doesn't cover application-level security, such as authentication and authorization.
---

出力例:

---
# セキュリティ

このトピックでは、クロスサイトスクリプティング攻撃などの一般的なWebアプリケーションの脆弱性や攻撃に対する、Angularの組み込みの保護について説明します。
認証や認可など、アプリケーションレベルのセキュリティは扱いません。
---


`.trim();

    const chat = this.#client.chats.create({
      model: this.#model,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    chat.sendMessage({
      message: [
        `これから翻訳作業を開始します。テキスト断片を入力するので、日本語に翻訳して出力してください。`,
      ],
    });

    const blocks = splitMarkdown(content);
    const translated = [];

    for (const block of blocks) {
      const prompt = block.trim();
      const response = await chat.sendMessage({
        message: [prompt],
      });

      if (response.text) {
        translated.push(response.text);
      } else {
        translated.push(''); // Fallback in case of no response
      }

      await setTimeout(3000); // Rate limiting
    }
    return renderMarkdown(translated);
  }
}
