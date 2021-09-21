# エントリーコンポーネント

<div class="alert is-helpful">

Entry components have been deprecated with the [Ivy rendering engine](guide/ivy).
For more information, see [entryComponents deprecation](guide/deprecations#entrycomponents-and-analyze_for_entry_components-no-longer-required) in the [Deprecated APIs and features](guide/deprecations).

</div>

エントリーコンポーネントは、Angularが型に基づいて命令的にロードするコンポーネント(つまり、そのコンポーネントはテンプレートで参照していないことを意味します)です。 エントリーコンポーネントは、NgModuleでブートストラップするか、ルーティング定義に含めることで指定します。

<div class="alert is-helpful">

2つのコンポーネントのタイプについて対比してみましょう。テンプレートに含まれるコンポーネントは宣言的なコンポーネントになります。さらに、命令的にロードされるコンポーネントがあり、それがエントリーコンポーネントになります。

</div>


エントリーコンポーネントは主に2つ種類に分かれます:

* ブートストラップするルートコンポーネント.
* ルーティング定義で指定されたコンポーネント


## ブートストラップするエントリーコンポーネント


次は、
基本的な`app.module.ts`で`AppComponent`をブートストラップするコンポーネントとして指定する例です:

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent] // ブートストラップするエントリーコンポーネント
})
```

ブートストラップするコンポーネントはエントリーコンポーネントの1つで、
ブートストラッププロセス(アプリケーションの起動)中にAngularによってDOMにロードされます。
他のエントリーコンポーネントは、ルーターなどの他の手段によって動的にロードされます。

ルートの`AppComponent`が`@NgModule.bootstrap`に型でリストされているため、Angularはそれを動的にロードします。

<div class="alert is-helpful">

コンポーネントは、モジュールの`ngDoBootstrap()`メソッドで命令的にブートストラップすることもできます。
`@NgModule.bootstrap`プロパティは、これがエントリーコンポーネントであることと、
このコンポーネントを使用してアプリケーションをブートストラップするコードを生成する必要があることをコンパイラに知らせます。

</div>


ブートストラップは命令的なプロセスなので、ブートストラップするコンポーネントは必然的にエントリーコンポーネントになり、結果として、エントリーコンポーネントが一個は必要になります。

## ルーティング定義で指定されたエントリーコンポーネント


2つ目の種類のエントリーコンポーネントは、
次のようなルーティング定義で見ることができます:

```typescript
const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent
  }
];
```

ルーティング定義は、`component: CustomerListComponent`にあるその型に基づいてコンポーネントを参照します。

すべてのルーターコンポーネントはエントリーコンポーネントでなければなりません。あなたはコンポーネントを2つの場所(ルーターと`entryComponents`)に追加する必要がありそうですが、コンパイラは十分賢いのでこれがルーティング定義であることを認識して、自動的にルーターコンポーネントを`entryComponents`に追加してくれます。


## `entryComponents`配列
<div class="alert is-helpful">

   Ivyを使う9.0.0からは、`entryComponents`プロパティはもはや必要ありません。[非推奨ガイド](guide/deprecations#entryComponents)を参照してください。

</div>

`@NgModule`デコレーターは`entryComponents`配列を持っていますが、
Angularが`@NgModule.bootstrap`にリストされたコンポーネントと、ルーティング定義内のコンポーネントをエントリーコンポーネントとして自動的に追加するので、ほとんどの場合エントリーコンポーネントを明示的に設定する必要はありません。これらの2つのメカニズムによって追加されたエントリーコンポーネントがほとんどを占めますが、アプリケーションからブートストラップを行ったり、コンポーネントを型に基づいて命令的に動的ロードしたりする場合は、
`entryComponents`に明示的に追加する必要があります。

### `entryComponents`とコンパイラ

プロダクション用のアプリケーションのために、あなたはできるだけコードサイズを減らしたいと思っています。
コードには実際に必要なクラスだけが含まれていて、使用されていないコンポーネントは除外すべきです。
そういうわけで、Angularコンパイラは、`entryComponents`から到達可能なコンポーネントだけのコードを生成します(これはつまり、`@NgModule.declarations`に参照を追加しても、必ずしも最終的なバンドルには含まれないことを意味します)。

事実、多くのライブラリはまったく使用されないかもしれないコンポーネントを宣言しエクスポートしています。
たとえば、マテリアルデザインライブラリはあなたが使用するコンポーネントを知らないため、すべてのコンポーネントをエクスポートしますが、全部を使用することはそうそうないでしょう。
参照していないコンポーネントは、ツリーシェーカーが最終的なコードパッケージから削除します。

あるコンポーネントが_エントリーコンポーネント_ではなく、なおかつテンプレート内に見つからない場合は、
ツリーシェーカーはそれを投げ捨てるでしょう。
なので、アプリケーションのサイズをできるだけ小さく保つためには、本当に必要なエントリーコンポーネントだけを追加することをお勧めします。


## Angularのモジュールについてのさらに詳しい情報

あなたは次の記事に興味があるかもしれません:
* [NgModuleの種類](guide/module-types)
* [Angularルーターによるモジュールの遅延ロード](guide/lazy-loading-ngmodules)
* [プロバイダー](guide/providers)
* [NgModules FAQ](guide/ngmodule-faq)
