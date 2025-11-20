# Angular コーディングスタイルガイド

## はじめに {#introduction}

このガイドでは、Angularアプリケーションコードのさまざまなスタイル規約について説明します。これらの推奨事項は
Angularが機能するために必須ではありませんが、Angularエコシステム全体で一貫性を促進する一連のコーディングプラクティスを確立します。
一貫したプラクティスセットにより、コードの共有やプロジェクト間の移動が容易になります。

このガイドは、TypeScriptやAngularに無関係な一般的なコーディングプラクティスは_対象としていません_。
TypeScriptについては、
[GoogleのTypeScriptスタイルガイド](https://google.github.io/styleguide/tsguide.html)を確認してください。

### 迷ったときは一貫性を優先する {#when-in-doubt-prefer-consistency}

これらのルールが特定のファイルのスタイルと矛盾する状況に遭遇した場合は、
ファイル内の一貫性を維持することを優先してください。単一のファイル内で異なるスタイル規約を混在させることは、
このガイドの推奨事項から逸脱するよりも多くの混乱を生み出します。

## 命名 {#naming}

### ファイル名では単語をハイフンで区切る {#separate-words-in-file-names-with-hyphens}

ファイル名内の単語はハイフン (`-`) で区切ります。例えば、`UserProfile`という名前のコンポーネントは
`user-profile.ts`というファイル名を持ちます。

### ファイルのテストには末尾に`.spec`を付けて同じ名前を使用する {#use-the-same-name-for-a-files-tests-with-spec-at-the-end}

単体テストの場合、ファイル名の末尾を`.spec.ts`にします。例えば、
`UserProfile`コンポーネントの単体テストファイルは`user-profile.spec.ts`というファイル名を持ちます。

### ファイル名を内部のTypeScript識別子と一致させる {#match-file-names-to-the-typescript-identifier-within}

ファイル名は一般的にファイル内のコードの内容を記述するべきです。ファイルが
TypeScriptクラスを含む場合、ファイル名はそのクラス名を反映するべきです。例えば、
`UserProfile`という名前のコンポーネントを含むファイルは`user-profile.ts`という名前を持ちます。

ファイルが複数の主要な名前を付けられる識別子を含む場合、内部のコードの
共通のテーマを記述する名前を選択します。ファイル内のコードが共通のテーマや機能領域に
収まらない場合、コードを異なるファイルに分割することを検討してください。
`helpers.ts`、`utils.ts`、`common.ts`のような過度に一般的なファイル名は避けてください。

### コンポーネントのTypeScript、テンプレート、スタイルに同じファイル名を使用する {#use-the-same-file-name-for-a-components-typescript-template-and-styles}

コンポーネントは通常、1つのTypeScriptファイル、1つのテンプレートファイル、
1つのスタイルファイルで構成されます。これらのファイルは異なるファイル拡張子を持つ
同じ名前を共有するべきです。例えば、`UserProfile`コンポーネントは
`user-profile.ts`、`user-profile.html`、`user-profile.css`というファイルを持つことができます。

コンポーネントが複数のスタイルファイルを持つ場合、そのファイルに固有のスタイルを
記述する追加の単語を名前に付加します。例えば、`UserProfile`は
`user-profile-settings.css`と`user-profile-subscription.css`というスタイルファイルを持つかもしれません。

## プロジェクト構造 {#project-structure}

### アプリケーションのすべてのコードは`src`という名前のディレクトリに配置する {#all-the-applications-code-goes-in-a-directory-named-src}

すべてのAngular UIコード（TypeScript、HTML、スタイル）は、
`src`という名前のディレクトリ内に配置する必要があります。
設定ファイルやスクリプトなど、UIに関連しないコードは`src`ディレクトリの外に配置する必要があります。

これにより、ルートアプリケーションディレクトリが異なるAngularプロジェクト間で一貫性を保ち、
プロジェクト内のUIコードとその他のコードとの明確な分離が生まれます。

### アプリケーションを`src`直下の`main.ts`という名前のファイルでブートストラップする {#bootstrap-your-application-in-a-file-named-maints-directly-inside-src}

Angularアプリケーションを起動、つまり**ブートストラップ**するためのコードは、
常に`main.ts`という名前のファイルに配置する必要があります。これはアプリケーションの主要なエントリポイントを表します。

### 密接に関連するファイルを同じディレクトリにまとめる {#group-closely-related-files-together-in-the-same-directory}

Angularコンポーネントは、TypeScriptファイルと、オプションでテンプレートおよび1つ以上のスタイルファイルで構成されます。
これらは同じディレクトリにまとめる必要があります。

単体テストは、テスト対象のコードと同じディレクトリに配置する必要があります。
関連性のないテストを単一の`tests`ディレクトリに集めるのは避けてください。

### プロジェクトを機能領域ごとに整理する {#organize-your-project-by-feature-areas}

アプリケーションの機能や、それらのディレクトリ内のコードに共通するテーマに基づいて、
プロジェクトをサブディレクトリに整理します。
例えば、映画館サイトMovieReelのプロジェクト構造は次のようになるでしょう。

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

それらのディレクトリに存在するコードのタイプに基づいてサブディレクトリを作成するのは避けてください。
例えば、`components`、`directives`、`services`のようなディレクトリを作成するのは避けてください。

1つのディレクトリにあまりにも多くのファイルを配置して、読み取りやナビゲーションが困難になるのは避けてください。
ディレクトリ内のファイル数が増えるにつれて、さらに追加のサブディレクトリに分割することを検討してください。

### 1ファイル1コンセプト {#one-concept-per-file}

ソースファイルは単一の_コンセプト_に焦点を当てることを推奨します。
特にAngularクラスの場合、これは通常、1ファイルにつき1つのコンポーネント、ディレクティブ、またはサービスを意味します。
ただし、クラスが比較的小さく、単一のコンセプトの一部として結びついている場合は、
1つのファイルに複数のコンポーネントやディレクティブが含まれていても問題ありません。

迷った場合は、より小さなファイルになるアプローチを選択してください。

## 依存性の注入 {#dependency-injection}

### コンストラクターパラメーターインジェクションよりも`inject`関数を推奨 {#prefer-the-inject-function-over-constructor-parameter-injection}

コンストラクターパラメーターインジェクションよりも`inject`関数を使用することを推奨します。`inject`関数はコンストラクターパラメーターインジェクションと同じように機能しますが、いくつかのスタイルの利点があります。

- `inject`は、特にクラスが多くの依存性を注入する場合に、一般的に読みやすくなります。
- 注入された依存性へのコメント追加が、構文的に見てより簡単です。
- `inject`はより優れた型推論を提供します。
- [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields)を使用してES2022+をターゲットにする場合、注入された依存性でフィールドを読み取る際に、フィールド宣言と初期化を分離することを回避できます。

[既存のコードを自動ツールで`inject`にリファクタリングできます](reference/migrations/inject-function)。

## コンポーネントとディレクティブ {#components-and-directives}

### コンポーネントセレクターの選択 {#choosing-component-selectors}

コンポーネントセレクターの選択に関する詳細は
[コンポーネントガイド](guide/components/selectors#choosing-a-selector)を参照してください。

### コンポーネントとディレクティブのメンバーの命名 {#naming-component-and-directive-members}

入力プロパティの[命名](guide/components/inputs#choosing-input-names)
および出力プロパティの[命名](guide/components/outputs#choosing-event-names)に関する詳細は
コンポーネントガイドを参照してください。

### ディレクティブセレクターの選択 {#choosing-directive-selectors}

ディレクティブはコンポーネントと同様に
[アプリケーション固有のプレフィックス](guide/components/selectors#selector-prefixes)
を使用すべきです。

ディレクティブに属性セレクターを使用する場合、camelCaseの属性名を使用してください。
例えば、アプリケーション名が「MovieReel」で、要素にツールチップを追加するディレクティブを構築する場合、
セレクターとして`[mrTooltip]`を使用できます。

### メソッドの前にAngular固有のプロパティをグループ化する {#group-angular-specific-properties-before-methods}

コンポーネントとディレクティブは、通常クラス宣言の先頭近くにAngular固有のプロパティをまとめてグループ化すべきです。
これには、注入された依存関係、入力、出力、およびクエリが含まれます。
これらやその他のプロパティは、クラスのメソッドの前に定義してください。

この慣行により、クラスのテンプレートAPIと依存関係を見つけやすくなります。

### コンポーネントとディレクティブをプレゼンテーションに集中させる {#keep-components-and-directives-focused-on-presentation}

コンポーネントとディレクティブ内のコードは、
一般的にページに表示されるUIに関連するものであるべきです。
UIから切り離され、それ自体で意味をなすコードについては、他のファイルへのリファクタリングを推奨します。
例えば、フォームの検証ルールやデータ変換を個別の関数やクラスに分割できます。

### テンプレート内の過度に複雑なロジックを避ける {#avoid-overly-complex-logic-in-templates}

Angularテンプレートは
[JavaScriptのような式](guide/templates/expression-syntax)
に対応するように設計されています。
これらの式を活用して、比較的単純なロジックをテンプレート式に直接記述すべきです。

ただし、テンプレート内のコードが複雑になりすぎた場合は、ロジックをTypeScriptコード（通常は[computed](guide/signals#computed-signals)を使用）にリファクタリングしてください。

何が「複雑」であるかを決定する厳格なルールはありません。
最善の判断を使用してください。

### コンポーネントのテンプレートのみで使用されるクラスメンバーには`protected`を使用する {#use-protected-on-class-members-that-are-only-used-by-a-components-template}

コンポーネントクラスのpublicメンバーは、
依存性の注入と[クエリ](guide/components/queries)を介してアクセス可能なpublic APIを本質的に定義します。
コンポーネントのテンプレートから読み取られることを意図したメンバーには、`protected`アクセスを推奨します。

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` is not part of the component's public API, but is used in the template.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### 変更されるべきでないプロパティには`readonly`を使用する {#use-readonly-for-properties-that-shouldnt-change}

Angularによって初期化されるコンポーネントとディレクティブのプロパティを`readonly`としてマークします。
これには、`input`、`model`、`output`、およびクエリによって初期化されるプロパティが含まれます。
readonlyアクセス修飾子は、Angularによって設定された値が上書きされないことを保証します。

```ts
@Component({/* ... */})
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

デコレーターベースの`@Input`、`@Output`、およびクエリAPIを使用するコンポーネントおよびディレクティブの場合、
このアドバイスは出力プロパティとクエリに適用されますが、入力プロパティには適用されません。

```ts
@Component({/* ... */})
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### `ngClass`と`ngStyle`よりも`class`と`style`を推奨する {#prefer-class-and-style-over-ngclass-and-ngstyle}

`class`および`style`バインディングを、[`NgClass`](/api/common/NgClass)および[`NgStyle`](/api/common/NgStyle)ディレクティブの使用よりも推奨します。

```html
<!-- PREFER -->
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
<!-- OR -->
<div [class]="{admin: isAdmin, dense: density === 'high'}">


<!-- AVOID -->
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
```

`class`および`style`バインディングはどちらも、
標準のHTML属性と密接に連携する、より直接的な構文を使用します。
これにより、特に基本的なHTMLに慣れている開発者にとって、テンプレートが読みやすく理解しやすくなります。

さらに、`NgClass`および`NgStyle`ディレクティブは、組み込みの`class`および`style`バインディング構文と比較して、
追加のパフォーマンスコストが発生します。

詳細については、[バインディングガイド](/guide/templates/binding#css-class-and-style-property-bindings)を参照してください。

### イベントハンドラーはトリガーイベントではなく、*実行する内容*で命名する {#name-event-handlers-for-what-they-do-not-for-the-triggering-event}

イベントハンドラーは、トリガーイベントではなく、実行するアクションで命名することを推奨します。

```html
<!-- PREFER -->
<button (click)="saveUserData()">Save</button>

<!-- AVOID -->
<button (click)="handleClick()">Save</button>
```

このように意味のある名前を使用すると、
テンプレートを読むだけでイベントが何をするのかを簡単に判断できます。

キーボードイベントの場合、Angularのキーイベント修飾子を特定のハンドラー名とともに使用できます。

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

イベント処理ロジックが特に長く複雑な場合、単一の適切な名前のハンドラーを宣言するのは非現実的です。
このような場合、「handleKeydown」のような名前に戻し、
イベントの詳細に基づいてより具体的な動作に委譲しても問題ありません。

```ts

@Component({/* ... */})
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
// ...
    }
  }
}
```

### ライフサイクルメソッドをシンプルに保つ {#keep-lifecycle-methods-simple}

`ngOnInit`のようなライフサイクルフック内に長く複雑なロジックを配置することは避けてください。
代わりに、そのロジックを含む適切な名前のメソッドを作成し、ライフサイクルフック内で _それらのメソッドを呼び出す_ ことを推奨します。
ライフサイクルフック名は、それらが _いつ_ 実行されるかを記述するため、
内部のコードには、そのコードが何をしているかを記述する意味のある名前がありません。

```typescript
// PREFER
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}

// AVOID
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...and all the rest of the code that would be unrolled from these methods.
}
```

### ライフサイクルフックインターフェースを使用する {#use-lifecycle-hook-interfaces}

Angularは、各ライフサイクルメソッドに対応するTypeScriptインターフェースを提供します。
クラスにライフサイクルフックを追加する際は、これらのインターフェースをインポートして`implement`し、メソッドが正しく命名されていることを確認してください。

```ts
import {Component, OnInit} from '@angular/core';

@Component({/* ... */})
export class UserProfile implements OnInit {

  // The `OnInit` interface ensures this method is named correctly.
  ngOnInit() { /* ... */ }
}
```
