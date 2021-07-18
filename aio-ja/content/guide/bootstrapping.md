# ルートモジュールによるアプリケーションの起動

#### 前提条件

次の基本的な理解
* [JavaScriptモジュールとNgModule](guide/ngmodule-vs-jsmodule)

<hr />

NgModuleは、アプリケーションパーツがどのように組み合わされるかを記述します。
すべてのアプリケーションには、少なくとも1つのAngularモジュール（_root_モジュール）があり、
起動時にアプリケーションをブートストラップするために存在する必要があります。
慣例により、それは通常`AppModule`と呼ばれます。

[Angular CLI](cli) の `ng new` コマンドを使用してアプリケーションを生成する場合、デフォルトのAppModuleは次のようになります。

```typescript
/* JavaScript imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* the AppModule class with the @NgModule decorator */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

import文の後に、
**`@NgModule`**[デコレータ](guide/glossary#decorator '"Decorator" の説明')をもつクラスがあります。

`@NgModule`デコレーターは`AppModule`を`NgModule`クラスとして識別します。
`@NgModule`はアプリケーションのコンパイルと起動の方法をAngularに伝えるメタデータオブジェクトを受け取ります。

* **_declarations_**&mdash;このアプリケーションの唯一のコンポーネントです。
* **_imports_**&mdash;DOMレンダリング、サニタイズ、およびロケーションなどのブラウザ特定のサービスをもつ`BrowserModule`をインポートします。
* **_providers_**&mdash;サービスプロバイダー
* **_bootstrap_**&mdash;Angularが作成して
ホストWebページである`index.html`に挿入する_ルート_コンポーネント。

Angular CLIで作成されたデフォルトのアプリケーションにはコンポーネントが`AppComponent`1つしかなく、
`declarations`と`bootstrap`配列の両方にあります。

{@a declarations}

## `declarations`配列 {@a the-declarations-array}

モジュールの`declarations`配列は、そのモジュールに属するコンポーネントをAngularに示します。
追加のコンポーネントを作成したら、それらを`declarations`に追加します。

すべてのコンポーネントを厳密に1つの`NgModule`クラスに宣言する必要があります。
コンポーネントを宣言せずに使用すると、
Angularはエラーメッセージを返します。

`declarations`配列は宣言を受け取ります。
宣言とはコンポーネント、[ディレクティブ](guide/attribute-directives)および[パイプ](guide/pipes)です。
モジュールのすべての宣言は`declarations`配列内になければなりません。
宣言は、正確に1つのモジュールに属していなければなりません。
複数のモジュールで同じクラスを宣言しようとすると、コンパイラでエラーが発生します。

これらの宣言されたクラスはモジュール内からは見えますが、このモジュールからエクスポートされ、
他のモジュールがこのモジュールをインポートしない限り、
別のモジュール内のコンポーネントには表示されません。

宣言の配列に入る例を次に示します。

```typescript
  declarations: [
    YourComponent,
    YourPipe,
    YourDirective
  ],
```

宣言は1つのモジュールにしか属せないので、
1つの`@NgModule`だけに宣言します。
必要なときは、必要な宣言をもつモジュールをインポートします。


### `@NgModule`とディレクティブの使用

ディレクティブのために`declarations`配列を使いましょう。
ディレクティブ、コンポーネント、またはパイプをモジュール内で使用するには、いくつかのことをおこなう必要があります。

1. 書き込んだファイルからエクスポートします。
2. それを適切なモジュールにインポートします。
3. `@NgModule`の`declarations`配列で宣言します。


これらの3つのステップは次のようになります。ディレクティブを作成するファイルで、ディレクティブをエクスポートします。
`ItemDirective`という名前の次の例は、CLIが生成する`item.directive.ts`ファイルに生成するデフォルトのディレクティブ構造です。

<code-example path="bootstrapping/src/app/item.directive.ts" region="directive" header="src/app/item.directive.ts"></code-example>

重要な点は、別の場所にインポートできるようにエクスポートする必要があることです。
次に、JavaScriptのimport文を使用して `NgModule` 、この例では`app.module.ts`にインポートします。

<code-example path="bootstrapping/src/app/app.module.ts" region="directive-import" header="src/app/app.module.ts"></code-example>

そして、同じファイルで`@NgModule`の`declarations`配列に追加します。

<code-example path="bootstrapping/src/app/app.module.ts" region="declarations" header="src/app/app.module.ts"></code-example>


これで`ItemDirective`をコンポーネントで使えるようになりました。この例では`AppModule`を使いましたが、フィーチャーモジュールでも同じようにできます。ディレクティブの詳細については、[属性ディレクティブ](guide/attribute-directives)と[構造ディレクティブ](guide/structural-directives)を参照してください。また、[パイプ](guide/pipes)やコンポーネントにも同じテクニックを使用します。

コンポーネント、ディレクティブ、およびパイプは、1つのモジュールにのみ属することを忘れないでください。必要なモジュールをインポートしてシェアするために、アプリケーション中で宣言しなければならないのは一度だけです。これにより時間が節約され、アプリケーションをリーンに保つのに役立ちます。

{@a imports}

## `imports`配列

モジュールの`imports`配列は、`@NgModule`メタデータオブジェクトの中にだけ現れます。
このモジュールが適切に機能するために必要な他のNgModuleについてAngularに伝えます。

<code-example
    path="bootstrapping/src/app/app.module.ts"
    region="imports"
    header="src/app/app.module.ts (excerpt)">
</code-example>

このモジュールのリストは、このモジュール内のコンポーネントのテンプレートが参照するコンポーネント、
ディレクティブ、またはパイプをエクスポートするモジュールです。
この場合、コンポーネントは`AppComponent`であり、`BrowserModule`、
`FormsModule`または`HttpClientModule`の中のコンポーネント、ディレクティブあるいはパイプを参照します。
コンポーネントテンプレートは、参照されたクラスがこのモジュールで宣言されているか、
クラスが別のモジュールからインポートされたときに、
別のコンポーネント、ディレクティブ、またはパイプを参照できます。



{@a bootstrap-array}

## `providers`配列

プロバイダー配列は、アプリケーションが必要とするサービスを並べます。
ここにサービスを並べると、アプリケーション全体で利用できるようになります。
フィーチャモジュールと遅延ロードを使用しているときにはスコープを設定できます。
詳細については、[プロバイダー](guide/providers)を参照してください。

## `bootstrap`配列

アプリケーションは、ルートの`AppModule`をブートストラップすることで起動します、
これは`entryComponent`とも呼ばれます。
とりわけ、ブートストラッププロセスは、`bootstrap`配列にリストされているコンポーネントを作成し、
それぞれをブラウザDOMに挿入します。

ブートストラップされた各コンポーネントは、それ自身のコンポーネントツリーのベースです。
通常、ブートストラップされたコンポーネントを挿入すると、
そのツリーを埋めるコンポーネントの作成が次々に起こります。

ホストWebページに複数のコンポーネントツリーを配置することはできますが、
ほとんどのアプリケーションではコンポーネントツリーが1つしかなく、単一のルートコンポーネントをブートストラップします。

この1つのルートコンポーネントは、通常`AppComponent`と呼ばれ、
ルートモジュールの`bootstrap`配列内にあります。

In a situation where you want to bootstrap a component based on an API response,
or you want to mount the `AppComponent` in a different DOM node that doesn't match
the component selector, please refer to `ApplicationRef.bootstrap()`
documentation.

## Angularモジュールについての詳細

アプリケーション中でよく使われるAngularモジュールについては、[よく使用されるモジュール](guide/frequent-ngmodules)を参照してください。
