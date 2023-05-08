# 静的ページの事前レンダリング

Angular Universalを使用すると、アプリケーションのページを事前にレンダリングできます。
事前レンダリングとは、動的なページをビルド時に処理して静的なHTMLを生成するプロセスです。

## ページを事前レンダリングする方法

静的ページを事前レンダリングするには、アプリケーションにServer-Side Rendering (SSR)機能を追加する必要があります。
詳細については、[Universalガイド](guide/universal)を参照してください。 
SSR機能を追加したら、次のコマンドを実行します。

<code-example format="shell" language="shell">

npm run prerender

</code-example>

### 事前レンダリングのビルドオプション

アプリケーションに事前レンダリングを追加すると、次のビルドオプションが利用可能になります。

| Options         | Details |
|:---             |:---     |
| `browserTarget` | ビルドするターゲットを指定します。                                                                                                       |
| `serverTarget`  | アプリケーションの事前レンダリングに使用するサーバーターゲットを指定します。                                                                          |
| `routes`        | 事前レンダリングする追加ルートの配列を定義します。                                                                                                 |
| `guessRoutes`   | ビルダーがルートを抽出し、レンダリングするパスを推測する必要があるかどうか。デフォルトは、`true`です。                                                          |
| `routesFile`    | 改行で区切られた、事前レンダリングするすべてのルートのリストを含むファイルを指定します。このオプションは、ルートが多数ある場合に役立ちます。 |
| `numProcesses`  | 事前レンダリングコマンドの実行中に使用するCPUの数を指定します。                                                                      |

### 動的ルートの事前レンダリング

動的ルートを事前レンダリングできます。
動的ルートの例としては、`product/:id`です。ここでの`id`は動的に提供されます。

動的ルートを事前レンダリングするには、次のオプションから1つを選択します。

*   コマンドラインで追加のルートを指定する
*   ファイルを使用してルートを指定する
*   特定のルートを事前レンダリングする

#### コマンドラインで追加のルートを指定する

事前レンダリングコマンドの実行中に、追加のルートを指定できます。
これがその例です。

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --routes /product/1 /product/2

</code-example>

#### ファイルを使用して追加ルートを指定する

ファイルを使用してルートを指定し、静的ページを生成できます。
この方法は、データベースやContent Management System (CMS)のような外部ソースから取得される可能性のある、eコマースアプリケーションの製品詳細など、生成するルートが多数ある場合に役立ちます。

ファイルを使用してルートを指定するには、`--routes-file`オプションを使用し、ルートを含む`.txt`ファイルの名前を指定します。

たとえば、スクリプトを使用してデータベースからIDを抽出し、それらを`routes.txt`ファイルに保存することで、このファイルを生成できます。

<code-example language="none" header="routes.txt">

/products/1
/products/555

</code-example>

`.txt`ファイルの準備ができたら、次のコマンドを実行して、静的ファイルを動的な値で事前レンダリングします。

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --routes-file routes.txt

</code-example>

#### 特定のルートを事前レンダリングする

コマンドに特定のルートを渡すこともできます。
このオプションを選択する場合は、必ず`guessRoutes`オプションを無効にしてください。

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --no-guess-routes --routes /product/1 /product/2

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
