# 実験的なユニットテストシステム

Angular CLIは、テストランナーとして[Vitest](https://vitest.dev/)を使用できる実験的なユニットテストシステムを提供します。

IMPORTANT: この実験的なユニットテストシステムは、`application`ビルドシステムの使用を必要とします。
`application`ビルドシステムは、新しく作成されるすべてのプロジェクトのデフォルトです。

## テストのセットアップ {#set-up-testing}

Angular CLIは新しいプロジェクト内にテストシステムを含んでいますが、使用する前に設定が必要です。

CLIで作成するプロジェクトは、デフォルトで`karma`テストシステムを使用するように設定されています。
実験的なユニットテストシステムに変更するには、`test`ターゲットを次のように更新します。

<docs-code language="json">
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "runner": "vitest",
    "buildTarget": "::development",
  }
}
</docs-code>

`buildTarget`は、開発サーバーで利用可能なオプションと同様に動作します。
`build`ターゲットは、テストのビルドオプションを設定します。
プロジェクトで`development`ビルド設定が不足している場合や、テスト用に異なるオプションが必要な場合は、
`testing`または同様の名前のビルド設定を作成して使用できます。

アプリケーションのテストを実行するには、これまでと同様に[`ng test`](cli/test)CLIコマンドを実行するだけです。

<docs-code language="shell">

ng test

</docs-code>

`ng test`コマンドは、アプリケーションを*ウォッチモード*でビルドし、設定されたランナーを起動します。

コンソール出力は以下のようになります。

<docs-code language="shell">
 ✓ spec-app-app.spec.js (2 tests) 31ms
   ✓ App > should create the app 22ms
   ✓ App > should render title 8ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:24:15
   Duration  1.16s (transform 628ms, setup 703ms, collect 64ms, tests 31ms, environment 188ms, prepare 33ms)
</docs-code>

ウォッチモードは、対話型ターミナルを使用している場合、およびCIで実行していない場合に、デフォルトで有効になります。

## 設定 {#configuration}

Angular CLIがVitest設定を自動的に処理します。`angular.json`ファイルで指定されたオプションに基づいて、完全な設定をメモリ内で構築します。
基盤となるテストランナー設定を直接カスタマイズすることは現在サポートされていません。

## バグ報告 {#bug-reports}

課題と機能リクエストは[GitHub](https://github.com/angular/angular-cli/issues)で報告してください。

チームが課題に対処できるよう、可能な場合は最小限の再現手順を提供してください。
