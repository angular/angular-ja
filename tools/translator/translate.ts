/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { SingleBar } from 'cli-progress';
import { setTimeout } from 'node:timers/promises';
import { renderMarkdown, splitMarkdown } from './utils';
import { createTranslationAgent } from './agent';

export class MarkdownTranslator {
  constructor(
    private readonly googleApiKey: string,
    private readonly geminiModel: string | undefined
  ) {}

  async translate(content: string): Promise<string> {
    const agent = await createTranslationAgent({
      googleApiKey: this.googleApiKey,
      translationModelName: this.geminiModel,
      proofreaderModelName: this.geminiModel,
    });

    const progress = new SingleBar({});
    const chunks = splitMarkdown(content);

    progress.start(chunks.length, 0);
    const rpm = 10; // Requests per minute
    const waitTime = Math.floor((60 * 1000) / rpm);

    const translatedChunks = [];
    for (const chunk of chunks) {
      const delay = setTimeout(waitTime);

      const translated = await agent.invoke({ text: chunk.trim() });
      translatedChunks.push(translated);

      progress.increment();
      await delay;
    }

    progress.stop();
    return renderMarkdown(translatedChunks);
  }
}
