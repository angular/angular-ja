/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { GoogleGenAI } from '@google/genai';
import { SingleBar } from 'cli-progress';
import { consola } from 'consola';
import { setTimeout } from 'node:timers/promises';
import {
  ContentType,
  getContentType,
  renderContent,
  splitMarkdown,
  splitRecommendations,
} from './utils';

export class GeminiTranslator {
  readonly #client: GoogleGenAI;
  readonly #model: string;

  constructor(apiKey: string, model: string) {
    this.#client = new GoogleGenAI({ apiKey });
    this.#model = model;
    console.log(`Using model: ${model}`);
  }

  async translate(
    filename: string,
    content: string,
    prh: string
  ): Promise<string> {
    const contentType = getContentType(filename);
    const systemInstruction = getSystemInstruction(contentType, prh);

    const chat = this.#client.chats.create({
      model: this.#model,
      config: { systemInstruction, temperature: 0.1 },
    });

    consola.start(`Starting translation for ${filename}`);
    await chat
      .sendMessage({
        message: [
          `これから ${filename} の翻訳作業を開始します。次のメッセージからテキスト断片を入力するので、日本語に翻訳して出力してください。今回の翻訳タスクと遵守するルールをおさらいしてください。`,
        ],
      })
      .then((response) => {
        if (response.text) {
          consola.info(`Gemini: ${response.text}`);
        }
      });

    const progress = new SingleBar({});

    const blocks =
      contentType === 'markdown'
        ? splitMarkdown(content)
        : splitRecommendations(content);

    progress.start(blocks.length, 0);
    const rpm = 10; // Requests per minute
    const waitTime = Math.floor((60 * 1000) / rpm);

    const translated = [];
    for (const block of blocks) {
      const prompt = block.trim();
      const delay = setTimeout(waitTime);
      const response = await chat.sendMessage({ message: [prompt] });
      translated.push(response.text ?? ''); // Fallback in case of no response

      progress.increment();
      await delay; // Avoid rate limiting
    }

    progress.stop();
    return renderContent(contentType, translated);
  }
}

function getSystemInstruction(contentType: ContentType, prh: string): string {
  return `
あなたはオープンソースライブラリの開発者向けドキュメントの翻訳者です。
入力として与えられたテキストに含まれる英語を日本語に翻訳します。

## Task

ユーザーはテキスト全体を分割し、断片ごとに翻訳を依頼します。
あなたは与えられた断片を日本語に翻訳し、翻訳結果だけを出力します。
前回までの翻訳結果を参照しながら、テキスト全体での表現の一貫性を保つようにしてください。

${(contentType === 'markdown'
  ? `
## Rules
翻訳は次のルールに従います。

- Markdownの構造の変更は禁止されています。
  - 見出しレベル（"#"）の数を必ず維持する。
    - 例: "# Security" → "# セキュリティ"
  - 改行やインデントの数を必ず維持する。
- トップレベル（"<h1>"）以外の見出しに限り、元の見出しをlower caseでハイフン結合したアンカーIDとして使用する
  - 例: "# Security" → "# セキュリティ"
  - 例: "## How to use Angular" → "## Angularの使い方 {#how-to-use-angular}"
- 英単語の前後にスペースを入れない。
  - bad: "Angular の使い方"
  - good: "Angularの使い方"
- 特別なプレフィックスは翻訳せずにそのまま残す。
  - 例: NOTE/TIP/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL
- 表現の一貫性を保つため、同じ単語には同じ訳語を使う。
- 冗長な表現を避け、自然な日本語にする。
  - 例: 「することができます」→「できます」

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
`
  : contentType === 'recommendations'
  ? `
recommendations.tsは次のような形式のオブジェクトを含むTypeScriptファイルです。

---
export const RECOMMENDATIONS: Step[] = [
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Extends OnInit',
    action:
      "Ensure you don't use \`extends OnInit\`, or use \`extends\` with any lifecycle event. Instead use \`implements <lifecycle event>.\`",
  },
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'Deep Imports',
    action:
      'Stop using deep imports, these symbols are now marked with ɵ and are not part of our public API.',
  },
---

## Rules
翻訳は次のルールに従います。
- **翻訳対象となるのは "action" フィールドの文字列リテラルのみです。**
- 原文に存在しない行を追加することは禁止されています。
- 原文に存在する行を削除することは禁止されています。
- ソースコードの構造の変更は禁止されています。
- コードのロジックや構造の変更は禁止されています。
- ソースコードのキーワードや構文の翻訳は禁止されています。
- 変数名や関数名の翻訳は禁止されています。

入力例:
---
export const RECOMMENDATIONS: Step[] = [
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Extends OnInit',
    action:
      "Ensure you don't use \`extends OnInit\`, or use \`extends\` with any lifecycle event. Instead use \`implements <lifecycle event>.\`",
  },
---

出力例:
---
export const RECOMMENDATIONS: Step[] = [
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Extends OnInit',
    action:
      '\`OnInit\`を継承しない、あるいはライフサイクルイベントを使用する場合は\`implements <lifecycle event>\`を使用してください。',
  },
---

`
  : ``
).trim()};

## 翻訳後の校正

表記揺れや不自然な日本語を避けるため、YAML形式で定義されているPRH(proofreading helper)ルールを使用して、翻訳後のテキストを校正します。
次のPRHルールを使用してください。
---
${prh}
---
`.trim();
}
