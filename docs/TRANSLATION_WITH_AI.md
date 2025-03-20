# Gemini APIを使ったAI翻訳

まとまった量のテキストの翻訳を省力化するため、Googleの[Gemini API](https://ai.google.dev/gemini-api?hl=ja)を使ったAI翻訳を導入しています。主に未翻訳のガイドの最初の翻訳に利用しています。

## 使い方

AI翻訳スクリプトの実装は `tools/translator` に配置されています。AI翻訳は以下の手順で実行します。

```
$ yarn translate <翻訳元ファイル・ディレクトリ> [--write]
```

`--write` オプションを指定すると、確認なしに翻訳結果をファイルに書き出します。指定しない場合は、翻訳結果が標準出力に表示されたうえで、保存するかどうかを確認します。

例えば、以下のように実行します。

```
$ yarn translate adev-ja/src/content/guide/components/content-projection.en.md
```

入力されたファイルが `*.en.md` である場合、出力されるファイルは `*.md` になります。すでにファイルがある場合は上書きされます。翻訳元ファイルが `*.md` である場合、出力は同じファイルになります。

## APIキーの取得

Gemini APIを利用するためには、APIキーが必要です。APIキーは[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja)で取得できます。

- Google AI Studioにログインします。
- 「APIキーを作成」をクリックします。
- 任意のGoogle Cloudプロジェクトと紐づけて、APIキーを作成します。

APIキーはを環境変数 `GOOGLE_API_KEY` に設定した上で、`tools/translate.ts` を実行すると、APIキーが利用されます。レポジトリルートに `.env` ファイルを作成し、以下のように設定してください。`.env` ファイルは `.gitignore` に含まれているため、APIキーがリポジトリに含まれることはありません。

```
GOOGLE_API_KEY=<APIキー>
```


> [!WARNING]
> `translate.ts` で利用しているモデルは "[Gemini 2.0 Flash][]" です。このモデルは無料で利用できる使用量上限がありますが、ふつうに翻訳しているだけであれば無料枠で十分です。しかし、原理的には従量課金されうることを了承のうえで利用してください。また、発行したAPIキーが漏れないように注意してください。


[Gemini 2.0 Flash]: https://ai.google.dev/gemini-api/docs/models/gemini?hl=ja

## 注意

### 翻訳の品質

生成AIによる翻訳は、同じ入力に対して毎回同じ結果が得られるわけではありません。textlintでも修正できない表記揺れが含まれることもあるため、翻訳結果をそのまま採用せず、目視で確認して修正してください。

### 大きなファイルの翻訳

Gemini APIの出力トークン上限の都合上、大きなファイルを一度に翻訳することができません。そのため、いくつかの断片ごとに結果を出力したあとに結合しています。接合部分に不自然な切れ目が生じることがありますので、その場合は修正してください。

### プロンプトの改善

もし、翻訳結果を確認するためのプロンプトを改善したい場合は、`tools/translator` を修正するプルリクエストを送ってください。
