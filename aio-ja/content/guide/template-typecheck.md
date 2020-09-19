# テンプレート型チェック

## テンプレート型チェックの概要

TypeScript がコードの型エラーをキャッチするのと同じように、Angular はアプリケーションのテンプレート内の式とバインディングをチェックし、見つかった型エラーを報告できます。
現在 Angular には、[TypeScript 構成ファイル](guide/typescript-configuration) の `fullTemplateTypeCheck` フラグと `strictTemplates` フラグの値に応じて、これを行う3つのモードがあります。

### 基本モード

もっとも基本的な型チェックモードでは、`fullTemplateTypeCheck` フラグを `false` に設定すると、Angular はテンプレートの最上位の式のみを検証します。

`<map [city]="user.address.city">` と記述した場合、コンパイラーは以下を検証します。

* `user` はコンポーネントクラスのプロパティです。
* `user` は、アドレスプロパティをもつオブジェクトです。
* `user.address` は、cityプロパティをもつオブジェクトです。

コンパイラーは、`user.address.city` の値が `<map>` コンポーネントの city インプットに割り当て可能であることを確認しません。

このモードでは、コンパイラーにもいくつかの大きな制限があります。

* 重要なのは、`*ngIf`、`*ngFor`、その他の `<ng-template>` 埋め込みビューなどの埋め込みビューはチェックしないことです。
* `#refs` の型、パイプの結果、イベントバインディングの `$event` の型などはわかりません。

多くの場合、これらは最終的に `any` 型になり、式の後続部分がチェックされなくなる可能性があります。



### フルモード

`fullTemplateTypeCheck` フラグが `true` に設定されている場合、Angular はテンプレート内の型チェックでより積極的です。
特に：

* 埋め込みビュー ( `*ngIf` または `*ngFor` 内のビューなど ) がチェックされます。
* パイプは正しい戻り型を持っています。
* ディレクティブとパイプへのローカル参照は正しい型です ( `any` と夏任意のジェネリックパラメーターを除く ) 。

次の型はまだ `any` です

* DOM 要素へのローカル参照。
* `$event` オブジェクト。
* セーフナビゲーション式

{@a strict-mode}

### 厳格モード

Angular バージョン 9 は、`fullTemplateTypeCheck` フラグの動作を維持し、3番目の「厳格モード」を導入します。
厳格モードはフルモードのスーパーセットであり、`strictTemplates` フラグを true に設定することでアクセスできます。このフラグは、`fullTemplateTypeCheck` フラグより優先されます。
厳格モードでは、Angular バージョン 9 はバージョン 8 の型チェッカーを超えるチェックを追加します。
厳格モードは Ivy を使用している場合にのみ使用できることに注意してください。

フルモードの動作に加えて、Angular バージョン 9 には次の機能があります。

* コンポーネント/ディレクティブのバインディングが `@Input()` に割り当て可能であることを検証します。
* 上記の検証時に TypeScript の `strictNullChecks` フラグに従います。
* ジェネリックを含むコンポーネント/ディレクティブの正しい型を推測します。
* 設定されているテンプレートコンテキストタイプを推測します ( たとえば、`NgFor` の正しい型チェックを許可します ) 。
* コンポーネント/ディレクティブ、DOM、アニメーションイベントバインディングで正しい `$event` の型を推測します。
* タグ名に基づいて、DOM 要素へのローカル参照の正しい型を推測します ( たとえば、そのタグに対して `document.createElement` が返す型 ) 。


## `*ngFor` のチェック

型チェックの3つのモードでは、埋め込みビューの扱いが異なります。次の例を考えてみましょう。


<code-example language="ts" header="User interface">

interface User {
  name: string;
  address: {
    city: string;
    state: string;
  }
}

</code-example>


```html
  <div *ngFor="let user of users">
    <h2>{{config.title}}</h2>
    <span>City: {{user.address.city}}</span>
  </div>
```

`<h2>` と `<span>` は `* ngFor` 埋め込みビューにあります。
基本モードでは、Angular はどちらもチェックしません。
ただし、フルモードでは、Angular は `config` と `user` が存在することを確認し、`any` 型を想定します。
厳格モードでは、Angular は `<span>` の `user` の堅が `User` であり、`address` が `string` 型の `city` プロパティをもつオブジェクトであることを認識しています。

{@a troubleshooting-template-errors}

## テンプレートエラーのトラブルシューティング

バージョン 9 で新しい厳格モードを有効にすると、以前のモードのいずれでも発生しなかったテンプレートエラーが発生する可能性があります。
これらのエラーは、多くの場合、以前のツールでは検出されなかった、テンプレート内の正真正銘の型の不一致を表しています。
この場合、エラーメッセージにより、テンプレートのどこで問題が発生したかが明確になります。

Angular ライブラリの入力が不完全または正しくない場合、または次の場合のように入力が期待どおりにならない場合にも、誤検知が発生する可能性があります。

* ライブラリの入力が間違っているか不完全な場合 ( たとえば、ライブラリが `strictNullChecks` を考慮して作成されておらず、`null | undefined` がない場合など ) 。
* ライブラリの入力型が狭すぎて、Angular がこれを解決するための適切なメタデータをライブラリが追加していない場合。これは通常、属性として使用される無効なまたは他の一般的なブール入力で発生します ( 例：`<input disabled>` ) 。
* DOM イベントに `$event.target` を使用する場合 ( イベントバブリングの可能性があるため、DOM入力の `$event.target` には期待どおりの型がありません ) 。

このような誤検知の場合、いくつかのオプションがあります。

* 特定のコンテキストで [`$any()` 型キャスト関数](guide/template-expression-operators#any-type-cast-function) を使用して、式の一部の型チェックをオプトアウトします。
* アプリケーションの TypeScript 設定ファイルで `strictTemplates: false` を設定することにより、厳密なチェックを完全に無効にすることができます。
* _strictness flag_ を `false` に設定することにより、特定の型チェック操作を個別に無効にしながら、他の面では厳密性を維持できます。
* `strictTemplates` と `strictNullChecks` を一緒に使用したい場合は、`strictNullInputTypes` による入力バインディング専用の厳密な null 型チェックをオプトアウトできます。

|厳密性フラグ|効果|
|-|-|
|`strictInputTypes`|`@Input()` フィールドへのバインディング式の割り当て可能性がチェックされるかどうか。ディレクティブジェネリック型の推論にも影響します。|
|`strictNullInputTypes`|( `strictInputTypes` ごとに ) `@Input()` バインディングをチェックするときに、`strictNullChecks` が受け入れられるかどうか。これをオフにすると、`strictNullChecks` を考慮せずにビルドされたライブラリを使用するときに役立ちます。|
|`strictAttributeTypes`|テキスト属性を使用して作成された `@Input()` バインディングをチェックするかどうか ( たとえば、`<mat-tab label="Step 1">` と `<mat-tab [label]="'Step 1'">` ) 。
|`strictSafeNavigationTypes`|安全なナビゲーション操作の戻り値の型 ( たとえば、`user?.name` ) が、`user` の型に基づいて正しく推測されるかどうか。無効にすると、`user?.name` の型は `any` になります。
|`strictDomLocalRefTypes`|DOM 要素へのローカル参照が正しい型をもつかどうか。無効にすると、`ref` は `<input #ref>` の型が `any` になります。|
|`strictOutputEventTypes`|`$event` がコンポーネント/ディレクティブ `@Output()` へのイベントバインディング、またはアニメーションイベントに正しい型をもつかどうか。無効にすると、`any` になります。|
|`strictDomEventTypes`|`$event` が DOM イベントへのイベントバインディングに適切な型をもつかどうか。無効にすると、`any` になります。|
|`strictContextGenerics`|ジェネリックコンポーネントの型パラメータが正しく推論されるかどうか ( ジェネリック境界を含む ) 。無効にすると、すべての型パラメーターは `any` になります。|
|`strictLiteralTypes`|テンプレートで宣言されたオブジェクトおよび配列リテラルの型が推論されるかどうか。無効にすると、そのようなリテラルの型は `any` になります。|


これらのフラグを使用してトラブルシューティングを行っても問題が解決しない場合は、`strictTemplates` を無効にすることでフルモードにフォールバックできます。

これが機能しない場合、最後の手段として、`fullTemplateTypeCheck: false` を使用してフルモードを完全にオフにすることです。この場合、Angular バージョン 9 に後方互換性を持たせるために特別な努力を行っているためです。

推奨される方法で解決できない型チェックエラーは、テンプレート型チェッカー自体のバグが原因である可能性があります。
基本モードにフォールバックする必要のあるエラーが発生した場合は、そのようなバグである可能性があります。
これが発生した場合は、ぜひ[問題を報告](https://github.com/angular/angular/issues) して、開発チームが対処できるようにしてください。。

## 入力と型チェック

Angular バージョン 9 では、テンプレート型チェッカーが、バインディング式の型が対応するディレクティブ入力の型と互換性があるかどうかをチェックします。
例として、次のコンポーネントを考えます。

```typescript
export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  @Input() user: User;
}
```

`AppComponent` テンプレートはこのコンポーネントを次のように使用します：

```ts
@Component({
  selector: 'my-app',
  template: '<user-detail [user]="selectedUser" />',
})
export class AppComponent {
  selectedUser: User | null = null;
}
```

ここでは、`AppComponent` のテンプレートの型チェック中に、`[user]="selectedUser"` バインディングが `UserDetailComponent.user` 入力に対応しています。
したがって、Angularは `selectedUser` プロパティを `UserDetailComponent.user` に割り当てます。これにより、それらの型に互換性がない場合にエラーが発生します。
TypeScript は、アプリケーションで設定されている `strictNullChecks` などのフラグに沿って、型システムにしたがって割り当てをチェックします。

テンプレート型チェッカーに、より具体的なテンプレート内の型要件を提供することで、実行時の型エラーを回避できます。ディレクティブ定義でテンプレートガード関数を提供することにより、独自のディレクティブの入力型要件をできるだけ具体的にします。このガイドの [カスタムディレクティブのテンプレート型チェックの改善](guide/structural-directives#directive-type-checks) および [入力セッターの強制](#input-setter-coercion) を参照してください。


### 厳密な null チェック

`strictTemplates` および TypeScript フラグ `strictNullChecks` を有効にすると、簡単に回避できない特定の状況で型チェックエラーが発生する場合があります。たとえば：

  * `strictNullChecks` が有効になっていないライブラリからのディレクティブにバインドされているnull許容値。

  `strictNullChecks` を使用せずにコンパイルされたライブラリの場合、その宣言ファイルは、フィールドを `null` にできるかどうかを示しません。
  ライブラリが `null` を正しく処理する状況では、コンパイラが `null` 型を省略した宣言ファイルに対してnull許容値をチェックするため、これは問題があります。
  そのため、コンパイラーは `strictNullChecks` に準拠しているため、型チェックエラーを生成します。

  * 同期的に発行することがわかっている Observable で `async` パイプを使用する。

  現在、`async` パイプは、それが購読する Observable が非同期である可能性があることを前提としています。つまり、まだ利用可能な値がない可能性があります。
  その場合でも、何かを返す必要があります &mdash; これは `null` です。
  つまり、`async` パイプの戻り値の型には `null` が含まれているため、Observableが null 以外の値を同期的に発行することがわかっている状況では、エラーが発生する可能性があります。

上記の問題に対する2つの潜在的な回避策があります。

  1. テンプレートで、`<user-detail [user]="user!" />` のように null 許容式の最後に null 以外のアサーション演算子 `！` を含めます。

  この例では、コンパイラーは、TypeScript コードの場合と同様に、null可能性における型の非互換性を無視します。
  `async` パイプの場合は、`<user-detail [user]="(user$ | async)!" />` のように、式を括弧で囲む必要があることに注意してください。

  1. Angular テンプレートの厳密な null チェックを完全に無効にします。

  `strictTemplates` が有効な場合でも、型チェックの特定の面を無効にすることが可能です。
  オプション `strictNullInputTypes` を `false` に設定すると、Angular テンプレート内の厳密な null チェックが無効になります。
  このフラグは、アプリケーションの一部であるすべてのコンポーネントに適用されます。

### ライブラリ作成者へのアドバイス

ライブラリの作成者は、いくつかの方法でユーザーに最適なエクスペリエンスを提供できます。
まず、`strictNullChecks` を有効にし、必要に応じて入力の型に `null` を含めると、null値を提供できるかどうかがコンシューマーに通知されます。
さらに、テンプレート型チェッカーに固有の型ヒントを提供することもできます。 次の [カスタムディレクティブのテンプレート型チェックの改善](guide/structural-directives#directive-type-checks) と [入力セッターの強制](#input-setter-coercion) を参照してください。


{@a input-setter-coercion}

## 入力セッターの強制

ディレクティブまたはコンポーネントの `@Input()` がそれにバインドされている値を変更することが望ましい場合があります。通常、入力にはゲッター/セッターのペアを使用します。
例として、次のカスタムボタンコンポーネントを考えます。

次のディレクティブを検討してください。

```typescript
@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>'
    </div>
  `,
})
class SubmitButton {
  private _disabled: boolean;

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }
}
```

ここでは、コンポーネントの `disabled` 入力がテンプレートの `<button>` に渡されています。`boolean` 値が入力にバインドされている限り、これはすべて期待どおりに機能します。ただし、コンシューマがテンプレートでこの入力を属性として使用すると仮定します。

```html
<submit-button disabled></submit-button>
```

これはバインディングと同じ効果があります。

```html
<submit-button [disabled]="''"></submit-button>
```

実行時に、入力は空の文字列に設定されますが、これは `boolean` の値ではありません。この問題を処理する Angular コンポーネントライブラリは、多くの場合、値をセッターの正しい型に「強制」します。

```typescript
set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}
```

ここで `value` の型を `boolean` から `boolean|''`に変更して、セッターが実際に受け入れる値のセットと一致させるのが理想的です。
TypeScript では、ゲッターとセッターの両方が同じ型である必要があるため、ゲッターが `boolean` を返す必要がある場合、セッターはより狭義の型で固定されます。

コンシューマーでテンプレートの Angular のもっとも厳密な型チェックが有効になっている場合、これにより問題が発生します。空の文字列 `''` は、実際には `disabled` フィールドに割り当てられず、属性フォームが使用されると型エラーが発生します。

この問題の回避策として、Angular は `@Input()` に対して、入力フィールド自体に対して宣言されているよりも広くより寛容な型のチェックをサポートしています。これを有効にするには、`ngAcceptInputType_` 接頭辞を含む静的プロパティをコンポーネントクラスに追加します。

```typescript
class SubmitButton {
  private _disabled: boolean;

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }

  static ngAcceptInputType_disabled: boolean|'';
}
```

このフィールドに値を入力する必要はありません。その存在は、Angular 型チェッカーと通信して、`disabled` 入力は型 `boolean|''` に一致するバインディングを受け入れると見なされるべきであることを伝えます。接尾辞は `@Input` _field_ の名前にする必要があります。

`ngAcceptInputType_` オーバーライドが与えられた入力に存在する場合、セッターはオーバーライドされた型の値を処理できるように注意する必要があります。

## `$any()` を使用して型チェックを無効にする

[`$any()` キャスト疑似関数](guide/template-expression-operators) の呼び出しで式を囲むことにより、バインディング式のチェックを無効にします。
コンパイラーは、`<any>` または `as any` キャストが使用される場合、TypeScript と同様に、`any` 型へのキャストとしてそれを扱います。

次の例では、`person` を `any` 型にキャストすると、`Property address does not exist` エラーが抑制されます。

```typescript
  @Component({
    selector: 'my-component',
    template: '{{$any(person).addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
```
