# LLMプロンプトとAI IDEセットアップ
大規模言語モデル（LLM）によるコード生成は、開発者にとって急速に成長している関心分野です。LLMは動作するコードを生成できることが多い一方で、Angularのような常に進化するフレームワーク向けにコードを生成することは困難な場合があります。

高度な指示とプロンプトは、ドメイン固有の詳細情報を用いた最新のコード生成をサポートするための新たな標準となっています。このセクションには、AngularとLLM向けにより正確なコード生成をサポートする厳選されたコンテンツとリソースが含まれています。

## カスタムプロンプトとシステム指示 {#custom-prompts-and-system-instructions}
LLMでコードを生成する体験を向上させるには、以下のカスタムのドメイン固有ファイルを使用してください。

NOTE: これらのファイルは、Angularの規約に準拠するために定期的に更新されます。

これは、LLMがAngularのベストプラクティスに従った正しいコードを生成するのに役立つ一連の指示です。このファイルは、AIツールへのシステム指示として含めることも、プロンプトとともにコンテキストとして含めることもできます。

<docs-code language="md" path="adev/src/context/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">ここをクリックしてbest-practices.mdファイルをダウンロードしてください。</a>

## ルールファイル {#rules-files}
いくつかのエディター（例: <a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio">Firebase Studio</a>）には、LLMに重要なコンテキストを提供するのに役立つルールファイルがあります。

| 環境/IDE        | ルールファイル                                                  | インストール手順                                                                                                 |
|:----------------|:----------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| Firebase Studio | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>    | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions">`airules.md`を設定</a>         |
| Copilot powered IDEs | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a>  | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">`.github/copilot-instructions.md`を設定</a> |
| Cursor          | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a> | <a href="https://docs.cursor.com/context/rules" target="_blank">`cursorrules.md`を設定</a>                         |
| JetBrains IDEs  | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>  | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">`guidelines.md`を設定</a> |
| VS Code | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>  | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">`.instructions.md`を設定</a> |
| Windsurf | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>  | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">`guidelines.md`を設定</a> |

## Angular CLI MCPサーバーのセットアップ {#angular-cli-mcp-server-setup}
Angular CLIには、開発環境のAIアシスタントがAngular CLIと連携できるようにする実験的な[Model Context Protocol (MCP)サーバー](https://modelcontextprotocol.io/)が含まれています。

[**Angular CLI MCPサーバーのセットアップ方法を学ぶ**](/ai/mcp)

## llms.txtによるコンテキスト提供 {#providing-context-with-llmstxt}
`llms.txt`は、LLMがコンテンツをより良く理解し処理できるよう設計されたウェブサイト向けの提案されている標準です。Angularチームは、LLMおよびコード生成にLLMを使用するツールが、より良いモダンなAngularコードを作成できるようにするため、このファイルの2つのバージョンを開発しました。


* <a href="/llms.txt" target="_blank">llms.txt</a> - 主要なファイルとリソースへのリンクを提供するインデックスファイル。
* <a href="/context/llm-files/llms-full.txt" target="_blank">llms-full.txt</a> - Angularの動作方法とAngularアプリケーションの構築方法を記述した、より堅牢なコンパイル済みリソースセット。

AngularアプリケーションにAIを統合する方法に関する詳細情報については、[概要ページ](/ai)もご確認ください。

## Web Codegen Scorer
Angularチームは[Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)を開発し、オープンソース化しました。これは、AI生成ウェブコードの品質を評価・スコア化するためのツールです。このツールを使用して、Angular向けにLLM生成コードの精度を向上させるプロンプトの微調整など、AI生成コードに関するエビデンスベースの意思決定を行うことができます。これらのプロンプトは、AIツールのシステム指示として含めることも、プロンプトとともにコンテキストとして含めることもできます。また、このツールを使用して、異なるモデルが生成するコードの品質を比較したり、モデルやエージェントの進化に伴う品質の経時変化を監視したりすることもできます。
