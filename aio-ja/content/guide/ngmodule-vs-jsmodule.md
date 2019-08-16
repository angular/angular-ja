# JavaScriptモジュールとNgModule

JavaScriptとAngularにはコードを整理するためのモジュールという仕組みがあります。
両者は別々の方法でモジュールを管理しますが、Angularアプリケーションは両方に依存しています。


## JavaScriptモジュール

JavaScriptモジュールはJavaScriptコードが含まれる単一のファイルです。モジュール内のものを利用するためには、次のようにエクスポート文を記述して、大抵はそのあとに関連するコードを書きます:

```typescript
export class AppComponent { ... }
```

それから、他のファイルからそのファイルのコードが必要になったときには次のようにインポートします:

```typescript
import { AppComponent } from './app.component';
```

JavaScriptモジュールは名前空間や、グローバル変数名が競合することを防ぐのに役立ちます。

For more information on JavaScript modules, see [JavaScript/ECMAScript modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/).

## NgModule

<!-- KW-- perMisko: let's discuss. This does not answer the question why it is different. Also, last sentence is confusing.-->
NgModuleは`@NgModule`デコレーターで装飾されたクラスです。`@NgModule`デコレーターの`imports`配列はAngularに現在のモジュールが他のどのようなモジュールが必要かを教えてくれます。`imports`配列内のモジュールは通常のJavaScriptモジュールではなくNgModuleです。`@NgModule`デコレーターをもつクラスは慣例によりそれを定義したファイルが持っていますが、そのクラスを`NgModule`にしているのはJavaScriptモジュールのようなファイルではなく、`@NgModule`とそのメタデータによるものです。

[Angular CLI](cli)に生成された`AppModule`では両方のモジュールが使用されていることを確認できます:

```typescript
/* これはJavaScriptのインポート文です。Angularはこれについては何も知りません。 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* @NgModuleデコレーターは、このクラスがNgModuleであることをAngularに知らせます。 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [     /* ここでNgModuleをインポートしています。 */
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


NgModuleクラスはJavaScriptモジュールとは次のような点で異なります:

* NgModuleは[宣言クラス](guide/ngmodule-faq#q-declarable)のみを束縛します。
宣言クラスは単なるクラス([Angularコンパイラ](guide/ngmodule-faq#q-angular-compiler)にとっては重要)です。
* JavaScriptモジュールのようにすべてのメンバークラスを1つの巨大なファイルに定義するかわりに、
モジュールのクラスを`@NgModule.declarations`リストに記述します。
* NgModuleは自身が持っている、または他のモジュールからインポートした[宣言クラス](guide/ngmodule-faq#q-declarable)のみエクスポートすることができます。
他の種類のクラスを宣言したりエクスポートすることはしません。
* JavaScriptモジュールとは異なり、
NgModuleはプロバイダーを`@NgModule.providers`リストに追加することでアプリケーション_全体_をサービスで拡張することができます。

<hr />

## NgModule についてのさらに詳しい情報

NgModule についてのさらに詳しい情報については次の記事を参照してください:
* [ブートストラップ](guide/bootstrapping)
* [よく使用されるモジュール](guide/frequent-ngmodules)
* [プロバイダー](guide/providers)
