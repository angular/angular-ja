# 国際化の共通タスク

プロジェクトを国際化するために、次のAngularタスクを使用します。

*   組み込みのパイプを使用して、日付、数値、パーセンテージ、通貨をローカルフォーマットで表示します。
*   翻訳用にコンポーネントテンプレート内のテキストをマークします。
*   翻訳用に複数形の表現をマークします。
*   翻訳用に代替テキストをマークします。

海外向けのプロジェクトを準備した後、[Angular CLI][AioCliMain]を使ってプロジェクトをローカライズします。
プロジェクトをローカライズするために、次のタスクを完了させます。

*   CLIを使用して、マークされたテキストを*ソース言語*ファイルに抽出します。
*   各言語の*ソース言語*ファイルをコピーし、すべての*翻訳*ファイルを翻訳者または翻訳サービスに送ります。
*   1つまたは複数のロケール向けにプロジェクトをビルドする際、CLIを使用して完成した翻訳ファイルをマージします。

<div class="alert is-helpful">

言語ごとのスペーシングの違いを考慮し、すべてのターゲットロケールに適応するユーザーインターフェースを作成します。
詳しくは、[国際化へのアプローチ][ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview]をご覧ください。

</div>

## 前提

翻訳プロジェクトを準備するために、次のテーマについて基本的な理解を深めておく必要があります。

*   [テンプレート][AioGuideGlossaryTemplate]
*   [コンポーネント][AioGuideGlossaryComponent]
*   [Angular CLI][AioCliMain] Angularの開発サイクルを管理するための[コマンドライン][AioGuideGlossaryCommandLineInterfaceCli]ツール
*   翻訳ファイルに使用される[Extensible Markup Language (XML)][W3Xml]

## Angularの国際化の共通タスクについて学ぶ

<div class="card-container">
    <a href="guide/i18n-common-add-package" class="docs-card" title="Add the localize package">
        <section>ローカライズパッケージの追加</section>
        <p>Angularのローカライズパッケージをプロジェクトへ追加する方法を学びます。</p>
        <p class="card-footer">ローカライズパッケージの追加</p>
    </a>-
    <a href="guide/i18n-common-locale-id" class="docs-card" title="Refer to locales by ID">
        <section>IDでロケールを参照</section>
        <p>プロジェクトのロケールIDを特定し、指定する方法を学びます。</p>
        <p class="card-footer">IDでロケールを参照</p>
    </a>
    <a href="guide/i18n-common-format-data-locale" class="docs-card" title="Format data based on locale">
        <section>ロケールに応じたデータフォーマット</section>
        <p>ローカライズされたデータパイプを実装し、プロジェクトのロケールをオーバーライドする方法を学びます。</p>
        <p class="card-footer">ロケールに応じたデータフォーマット</p>
    </a>
    <a href="guide/i18n-common-prepare" class="docs-card" title="Prepare component for translation">
        <section>翻訳用コンポーネントの準備</section>
        <p>翻訳する原文を指定する方法を学びます。</p>
        <p class="card-footer">翻訳用コンポーネントの準備</p>
    </a>
    <a href="guide/i18n-common-translation-files" class="docs-card" title="Work with translation files">
        <section>翻訳ファイルの作業</section>
        <p>翻訳テキストのレビューと処理方法を学びます。</p>
        <p class="card-footer">翻訳ファイルの作業</p>
    </a>
    <a href="guide/i18n-common-merge" class="docs-card" title="Merge translations into the application">
        <section>アプリケーションに翻訳をマージ</section>
        <p>翻訳をマージし、翻訳されたアプリケーションを構築する方法を学びます。<p>
        <p class="card-footer">アプリケーションに翻訳をマージ</p>
    </a>
    <a href="guide/i18n-common-deploy" class="docs-card" title="Deploy multiple locales">
        <section>複数ロケールのデプロイ</section>
        <p>アプリケーションに複数ロケールをデプロイする方法を学びます。</p>
        <p class="card-footer">複数ロケールのデプロイ</p>
    </a>
</div>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"
[AioGuideGlossaryComponent]: guide/glossary#component "component - Glossary | Angular"
[AioGuideGlossaryTemplate]: guide/glossary#template "template - Glossary | Angular"

<!-- external links -->

[ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview]: https://marketfinder.thinkwithgoogle.com/intl/en_us/guide/how-to-approach-i18n#overview "Overview - How to approach internationalization | Market Finder | Think with Google"

[W3Xml]: https://www.w3.org/XML "Extensible Markup Language (XML) | W3C"

<!-- end links -->

@reviewed 2021-10-07
