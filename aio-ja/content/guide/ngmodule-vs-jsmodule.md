# JavaScriptモジュールとNgModule

JavaScriptモジュールとNgModuleはあなたのコードをモジュール化するのに役立ちますが、これらはとても異なっています。
Angularアプリケーションは両方の種類のモジュールに依存しています。

## JavaScriptモジュール: コードを含んでいるファイル

[JavaScriptモジュール](https://javascript.info/modules "JavaScript.Info - Modules")はJavaScriptコードを含む独立したファイルであり、通常はあなたのアプリケーション内の特定の目的のためのクラスや関数のライブラリを含んでいます。
JavaScriptモジュールはあなたの成果を多数のファイルに渡って広げます。

<div class="alert is-helpful">

JavaScriptモジュールの詳細を学ぶために、[ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)をご覧ください。
モジュール仕様については、[6th Edition of the ECMAScript standard](https://www.ecma-international.org/ecma-262/6.0/#sec-modules)をご覧ください。

</div>

JavaScriptモジュールにおけるコードを他のモジュールで有効にするには、次のように、そのモジュールにおいて関連するコードの最後で`export`文を使います。:

```typescript
export class AppComponent { ... }
```

そのモジュールのコードをもう一方のモジュールで必要とするとき、次のように`import`文を使います。:

```typescript
import { AppComponent } from './app.component';
```

各モジュールはそれ自身のトップレベルスコープを持ちます。
すなわち、モジュールにおけるトップレベルの変数や関数は他のスクリプトやモジュールにおいて見えません。
各モジュールは他のモジュールにおける識別子との衝突を防ぐ、識別子のための名前空間を提供します。
多数のモジュールにおいても、唯一のグローバルな名前空間を作ってそこへサブモジュールを加えることで、思いがけないグローバル変数を防止できます。

Angularフレームワークそれ自身はJavaScriptモジュールの集合としてロードされます。

## NgModule: コンパイルのためのメタデータを持ったクラス

[NgModule](guide/glossary#ngmodule "NgModuleの定義")は、アプリケーションの特定の部分がどのように他の部分と一体となるかを表現するメタデータオブジェクトをもつ`@NgModule`デコレーターによってマークされたクラスです。
NgModuleはAngular特有です。
`@NgModule`デコレーターをもつクラスは慣例でそれら自身のファイルに置かれますが、このメタデータを含むのでJavaScriptモジュールとは異なります。

`@NgModule`のメタデータは、あなたが書くアプリケーションのコードを高性能のJavaScriptコードに変換するAngularのコンパイルプロセスをガイドすることで、重要な役割を果たします。
メタデータはコンポーネントのテンプレートのコンパイル方法と実行時の[インジェクター](guide/glossary#injector "インジェクターの定義")の作り方を表現します。
それはNgModuleの[コンポーネント](guide/glossary#component "コンポーネントの定義")と[ディレクティブ](guide/glossary#directive "ディレクティブの定義")、[パイプ](guide/glossary#pipe "パイプの定義)"を認識し、
それらのいくつかを`exports`プロパティを通して公開することで、外部のコンポーネントがそれらを使えるようにします。
あなたは[サービス](guide/glossary#service "サービスの定義")のための[プロパイダー](guide/glossary#provider "プロバイダーの定義")を追加することにもNgModuleを使うことで、サービスをアプリケーションのどこにおいても有効にできます。

JavaScriptモジュールとしての1つの巨大なファイルですべてのメンバークラスを定義するよりも、`@NgModule.declarations`のリストで、どのコンポーネントやディレクティブ、パイプがNgModuleに所属するかを宣言してください。
これらのクラスは[宣言](guide/glossary#declarable "宣言の定義")と呼ばれます。
NgModuleは自身が所有するか他のNgModuleからインポートした宣言クラスのみをエクスポートできます。
それは他の種類のクラスを宣言したりエクスポートしたりしません。
宣言はAngularのコンパイルプロセスに関係する唯一のクラスです。

NgModuleのメタデータのプロパティについての完全な説明は、[NgModuleのメタデータを使う](guide/ngmodule-api "NgModuleのメタデータを使う")をご覧ください。

## 両方を使うサンプル

新しいアプリケーションプロジェクトのために[Angular CLI](cli)によって生成されるルートNgModuleの`AppModule`は、両方の種類のモジュールをどのように使うかを実演します。:

<code-example path="ngmodules/src/app/app.module.1.ts" header="src/app/app.module.ts (default AppModule)"></code-example>

ルートNgModuleはJavaScriptモジュールをインポートするための`import`文から始まります。
それから次の配列とともに`@NgModule`を設定します。:

* `declarations`: このNgModuleに所属するコンポーネントとディレクティブ、パイプ。
  新しいアプリケーションプロジェクトのルートNgModuleは`AppComponent`というただ1つのコンポーネントを持ちます。

* `imports`: あなたが使用する他のNgModule。これによりそれらの宣言を使用できます。
  新しく生成されるルートNgModuleは、ブラウザ特有の[DOM](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html "Definition of Document Object Model")レンダリングやサニタイズ、ロケーションといったサービスを使用するために[`BrowserModule`](api/platform-browser/BrowserModule "BrowserModule NgModule")をインポートします。

* `providers`: 他のNgModuleにおけるコンポーネントが使用できるサービスのプロバイダー。
  新しく生成されるルートNgModuleにおいてプロバイダーはありません。

* `bootstrap`: Angularが作成しホストウェブページの`index.html`へ挿入する[エントリーコンポーネント](guide/entry-components "エントリーコンポーネントを指定する")。それによりアプリケーションをブートストラップします。
  このエントリーコンポーネントの`AppComponent`は`declarations`と`bootstrap`の両方の配列に現れます。

## 次のステップ

* NgModuleの詳細は、[NgModuleでアプリをまとめる](guide/ngmodules "NgModuleでアプリをまとめる")をご覧ください。
* ルートNgModuleについてより学ぶには、[ルートNgModuleによるアプリの起動](guide/bootstrapping "ルートNgModuleによるアプリの起動")をご覧ください。
* よく使用されるAngularのNgModuleとそれらをアプリケーションにインポートする方法について学ぶには、[よく使用されるモジュール](guide/frequent-ngmodules "よく使用されるモジュール")をご覧ください。
