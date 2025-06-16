import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  Runnable,
  RunnableBranch,
  RunnableLambda,
  RunnableSequence,
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createLinter, loadLinterFormatter, loadTextlintrc } from 'textlint';

const defaultGeminiModel = 'gemini-2.5-flash-preview-05-20';

export type TranslationAgentInput = {
  text: string;
};

export async function createTranslationAgent(input: {
  googleApiKey: string;
  translationModelName?: string;
  proofreaderModelName?: string;
}): Promise<Runnable<TranslationAgentInput, string>> {
  const { googleApiKey, translationModelName, proofreaderModelName } = input;

  // 翻訳用モデル
  const translator = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: translationModelName ?? defaultGeminiModel,
    temperature: 0.5, // 翻訳の一貫性を重視
  });
  const translatorPrompt = PromptTemplate.fromTemplate(
    translatorPromptTemplate
  );

  // 校正用モデル
  const proofreader = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: proofreaderModelName ?? defaultGeminiModel,
    temperature: 0.8, // エラー修正への柔軟性を持たせる
  });
  const proofreaderPrompt = PromptTemplate.fromTemplate(
    proofreaderPromptTemplate
  );

  const textlint = await createTextlintRunnable();

  return RunnableSequence.from([
    // { text: string } -> PromptTemplate<'text'> -> AIMessageChunk -> string
    translatorPrompt.pipe(translator).pipe(new StringOutputParser()),
    // string -> { fixedText: string, diagnostics: string }
    textlint,
    RunnableBranch.from([
      // Textlintがエラーを検出した場合は校正を行う
      [
        (result) => !!result.diagnostics,
        // { fixedText: string, diagnostics: string } -> PromptTemplate<'text' | 'diagnostics'> -> AIMessageChunk -> string
        proofreaderPrompt.pipe(proofreader).pipe(new StringOutputParser()),
      ],
      // エラーがない場合はそのままテキストを返す
      // { fixedText: string, diagnostics: string } -> string
      RunnableLambda.from((result) => result.text),
    ]),
  ]);
}

type TextlintRunnableOutput = { text: string; diagnostics: string | null };

export async function createTextlintRunnable(): Promise<
  Runnable<string, TextlintRunnableOutput>
> {
  const descriptor = await loadTextlintrc();
  const linter = await createLinter({ descriptor });
  const linterFormatter = await loadLinterFormatter({ formatterName: 'unix' });

  return RunnableLambda.from(async (text: string) => {
    // 1. 自動修正可能なエラーを修正する
    const { output: fixedText } = await linter.fixText(text, 'temp.md');
    // 2. 修正後のテキストを再度lintして診断結果を取得す
    const result = await linter.lintText(fixedText, 'temp.md');
    // 3. 診断結果を整形する
    if (result.messages.length === 0) {
      return { text: fixedText, diagnostics: null };
    }
    return { text: fixedText, diagnostics: linterFormatter.format([result]) };
  });
}

const translatorPromptTemplate =
  `あなたは技術文書の翻訳専門家です。以下のマークダウンテキストを日本語に翻訳してください。

## 重要な注意事項

- **マークダウンの構造を絶対に変更しないでください**
- **行数を絶対に変更しないでください** - 入力と出力の行数は必ず同じにしてください
- **コードブロック内の内容は翻訳しないでください**
- **URL、ファイル名、識別子は翻訳しないでください**
- **HTML タグや特殊な記号は保持してください**
- **リストの階層構造とマーカー（\\*, -, +, 1.など）を維持してください**
- **見出しレベル（#の数）は変更しないでください**
- **空行は空行のまま保持してください**
- **インデントやスペースを保持してください**
- **技術用語は適切な日本語に翻訳してください**
- **特別なプレフィックスは絶対に変更しないでください**
  - 例: NOTE/TIP/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL
  - OK: "NOTE: これは重要な情報です。"
  - NG: "注: これは重要な情報です。"
- "<h2>" より下位の見出しは、**原文の見出しをlower-caseにしたアンカーIDを付与してください**
  - 例: "# Security" → "# セキュリティ" （"<h1>" の場合はアンカーIDなし）
  - 例: "## How to use Angular" → "## Angularの使い方 {{#how-to-use-angular}}"
  - 例: "### How to use Angular" → "### Angularの使い方 {{#how-to-use-angular}}"
- **英単語の前後にスペースを入れないでください**
  - bad: "Angular の使い方"
  - good: "Angularの使い方"

翻訳されたテキストのみを返してください。他の説明や追加のテキストは含めないでください。テキスト全体をコードブロックとしてラップしないでください。

## 翻訳対象テキスト

===
{text}
===
` as const;

const proofreaderPromptTemplate =
  `あなたは日本語で書かれた文書の校正専門家です。以下のマークダウンテキストに校正エラーが検出されました。エラーで指摘された部分を修正したテキストを返してください。

## 重要な注意事項

1. **マークダウンの構造を絶対に変更しないでください**
2. **行数を絶対に変更しないでください** - 入力と出力の行数は必ず同じにしてください
3. **コードブロック内の内容は変更しないでください**
4. **URL、ファイル名、識別子は変更しないでください**
5. **HTML タグや特殊な記号は保持してください**
6. **リストの階層構造とマーカー（*, -, +, 1.など）を維持してください**
7. **見出しレベル（#の数）を変更しないでください**
8. **空行は空行のまま保持してください**
9. **インデントやスペースを保持してください**
10. **指摘されたエラーのみを修正してください**

修正されたテキストのみを返してください。他の説明や追加のテキストは含めないでください。テキスト全体をコードブロックとしてラップしないでください。

## 校正エラー

{diagnostics}

## 修正対象テキスト (\`temp.md\`)

===
{text}
===
` as const;
