# シグナルクエリ

コンポーネントまたはディレクティブは、子要素を見つけ、インジェクターから値を読み取るクエリを定義できます。

開発者は、クエリを使って、コンポーネント、ディレクティブ、DOM要素などの参照を取得することがよくあります。

クエリには、ビュークエリとコンテンツクエリの2つのカテゴリーがあります。

シグナルクエリは、クエリ結果をリアクティブなシグナルプリミティブとして提供します。クエリ結果を `computed` や `effect` で使用し、これらの結果を他のシグナルと組み合わせることができます。

IMPORTANT: シグナルクエリは [開発者プレビュー](reference/releases#developer-preview) です。APIは、Angularの非推奨サイクルを経ることなく、フィードバックに基づいて変更される可能性があります。

Angularのクエリに既に詳しい場合は、[シグナルベースのクエリとデコレーターベースのクエリの比較](#comparing-signal-based-queries-to-decorator-based-queries) に直接進むことができます。

## ビュークエリ

ビュークエリは、コンポーネント自身のテンプレート（ビュー）内の要素から結果を取得します。

### `viewChild`

`viewChild` 関数を使って、単一の結果をターゲットとするクエリを宣言できます。

```angular-ts
@Component({
  template: `
    <div #el></div>
    <my-component />
  `
})
export class TestComponent {
  // query for a single result by a string predicate  
  divEl = viewChild<ElementRef>('el')  // Signal<ElementRef|undefined>
  // query for a single result by a type predicate
  cmp = viewChild(MyComponent);        // Signal<MyComponent|undefined>
}
```

### `viewChildren`

`viewChildren` 関数を使って、複数の結果をクエリできます。

```angular-ts
@Component({
  template: `
    <div #el></div>
    @if (show) {
      <div #el></div>
    }
  `
})
export class TestComponent {
  show = true;

  // query for multiple results
  divEls = viewChildren<ElementRef>('el');    // Signal<ReadonlyArray<ElementRef>>
}
```

### ビュークエリオプション

`viewChild` と `viewChildren` のクエリ宣言関数は、2つの引数を受け取る似たようなシグネチャを持っています。

* クエリターゲットを指定する**ロケーター** - これは、`string` または注入可能なトークンです。
* 指定されたクエリの動作を調整する**オプション**のセット。

シグナルベースのビュークエリは、`read` という1つのオプションのみを受け付けます。`read` オプションは、一致したノードから注入して最終結果で返す結果の型を示します。

```angular-ts
@Component({
  template: `<my-component/>`
})
export class TestComponent {
  // query for a single result with options
  cmp = viewChild(MyComponent, {read: ElementRef});   // Signal<ElementRef|undefined>
}
```

## コンテンツクエリ

コンテンツクエリは、コンポーネントのコンテンツ、つまりコンポーネントが使用されるテンプレート内のコンポーネントタグ内にネストされた要素から結果を取得します。

### `contentChild`

`contentChild` 関数を使って、単一の結果をクエリできます。

```ts
@Component({...})
  export class TestComponent {
  // query by a string predicate  
  headerEl = contentChild<ElementRef>('h');   // Signal<ElementRef|undefined>

  // query by a type predicate
  header = contentChild(MyHeader);            // Signal<MyHeader|undefined>
}
```

 ### `contentChildren`

`contentChildren` 関数を使って、複数の結果をクエリできます。

```ts
@Component({...})
export class TestComponent {
  // query for multiple results
  divEls = contentChildren<ElementRef>('h');  // Signal<ReadonlyArray<ElementRef>>
}
```

### コンテンツクエリオプション

`contentChild` と `contentChildren` のクエリ宣言関数は、2つの引数を受け取る似たようなシグネチャを持っています。

* クエリターゲットを指定する**ロケーター** - これは、`string` または注入可能なトークンです。
* 指定されたクエリの動作を調整する**オプション**のセット。

コンテンツクエリは、次のオプションを受け付けます。

* `descendants` デフォルトでは、コンテンツクエリはコンポーネントの直接の子のみを見つけ、子孫にはトラバースしません。このオプションが `true` に変更された場合、クエリ結果は要素のすべての子孫を含みます。ただし、`true` でも、クエリは*決して*コンポーネント内に降りていきません。
* `read` は、一致したノードから取得して最終結果で返す結果の型を示します。

### 必須の子クエリ

子クエリ (`viewChild` または `contentChild`) が結果を見つけられない場合、その値は `undefined` になります。これは、`@if` や `@for` などの制御フローステートメントによってターゲット要素が非表示になっている場合に発生する可能性があります。

このため、子クエリは `undefined` の値を持つ可能性があるシグナルを返します。ほとんどの場合、特にビューの子クエリの場合、開発者はコードを次のように記述します。
* 少なくとも1つのマッチする結果がある。
* 結果は、テンプレートが処理され、クエリ結果が利用可能となったときにアクセスされる。

このような場合、子クエリを `required` とマークすることで、少なくとも1つのマッチする結果の存在を強制できます。これにより、結果型シグネチャから `undefined` が削除されます。`required` クエリが結果を見つけられない場合、Angularはエラーをスローします。

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div #requiredEl></div>
  `,
})
export class App {
  existingEl = viewChild.required('requiredEl');     // required and existing result
  missingEl = viewChild.required('notInATemplate');  // required but NOT existing result
  
  ngAfterViewInit() {
    console.log(this.existingEl()); // OK :-)
    console.log(this.missingEl());  // Runtime error: result marked as required by not available! 
  }
}
```

## 結果の利用可能性タイミング

シグナルクエリを作る関数は、ディレクティブインスタンスの構築の一部として実行されます。これは、クエリインスタンスを作成して、テンプレートの作成モードを実行して一致するものを収集する前に発生します。結果として、シグナルインスタンスが作成され（読み取ることが可能）、クエリ結果が収集できない期間があります。デフォルトでは、Angularは結果が利用可能となる前に `undefined`（子クエリの場合）または空の配列（子クエリの場合）を返します。必須クエリは、この時点でアクセスされるとスローします。

Angularは、シグナルベースのクエリ結果を必要に応じて遅延評価します。つまり、クエリ結果が収集されるのは、シグナルを読み取るコードパスがある場合のみです。

クエリ結果は、ビューの操作によって時間の経過とともに変化する可能性があります。これは、Angularの制御フロー（`@if`、`@for` など）または `ViewContainerRef` APIへの直接呼び出しのいずれかによって行われます。クエリ結果のシグナルから値を読み取ると、時間の経過とともに異なる値を受け取る可能性があります。

注: テンプレートがレンダリングされている間に不完全なクエリ結果を返さないよう、Angularは指定されたテンプレートのレンダリングが完了するまでクエリ解決を遅らせます。

## クエリ宣言関数と関連するルール

`viewChild`、`contentChild`、`viewChildren`、`contentChildren` 関数は、Angularコンパイラによって認識される特別な関数です。これらの関数を使って、コンポーネントまたはディレクティブプロパティを初期化することでクエリを宣言できます。これらの関数をコンポーネントとディレクティブのプロパティイニシャライザー以外で呼び出すことはできません。

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div #el></div>
  `,
})
export class App {
  el = viewChild('el'); // 問題なし!

  constructor() {
    const myConst = viewChild('el'); // サポートされていません
  }
}
```

## シグナルベースのクエリとデコレーターベースのクエリの比較

シグナルクエリは、`@ContentChild`、`@ContentChildren`、`@ViewChild` または `@ViewChildren` デコレーターを使って宣言されたクエリに対する代替アプローチです。新しいアプローチでは、クエリ結果がシグナルとして公開されるため、クエリ結果を他のシグナル（`computed` または `effect` を使用して）と組み合わせ、変更検知を駆動できます。さらに、シグナルベースのクエリシステムは、次のような利点も提供します。

* **より予測可能なタイミング。** クエリ結果が利用可能になったらすぐにアクセスできます。
* **よりシンプルなAPIサーフェス。** すべてのクエリがシグナルを返し、複数の結果を持つクエリでは標準の配列を操作できます。
* **改善された型安全性。** より少ないクエリのユースケースで、`undefined` が可能な結果に含まれます。
* **より正確な型推論。** TypeScriptは、型述語を使用する場合や、明示的な `read` オプションを指定する場合に、より正確な型を推論できます。
* **より遅延した更新。** Angularは、シグナルベースのクエリ結果を遅延して更新します。フレームワークは、コードが明示的にクエリ結果を読み取らない限り、何も動作しません。

クエリのメカニズムは本質的にほとんど変わりません。概念的には、Angularは依然としてテンプレート（ビュー）またはコンテンツ内の要素をターゲットとする単一の「子」クエリまたは複数の「子」クエリを作成します。違いは、結果の型と結果の利用可能性のタイミングです。シグナルベースのクエリを宣言するための記述形式も変更されました。クラスメンバーのイニシャライザーとして使用される `viewChild`、`viewChildren`、`contentChild`、`contentChildren` 関数は、Angularによって自動的に認識されます。
