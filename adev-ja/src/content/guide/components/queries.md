# クエリによるコンポーネントの子要素への参照

TIP: このガイドでは、[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使う場合は、まずこちらをお読みください。

コンポーネントは、子要素を見つけてそのインジェクターから値を読み取る**クエリ**を定義できます。

開発者は、クエリを使用して、子コンポーネント、ディレクティブ、DOM要素などの参照を取得することがほとんどです。

すべてのクエリ関数は、最新の結果を反映するシグナルを返します。
`computed`や`effect`などのリアクティブなコンテキストでも、シグナル関数を呼び出すことで結果を読み取れます。

クエリには、**ビュークエリ**と**コンテンツクエリ**の2つのカテゴリーがあります。

## ビュークエリ

ビュークエリは、コンポーネントの_ビュー_（コンポーネント自身のテンプレートで定義された要素）内の要素から結果を取得します。`viewChild`関数を使用して単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 15]">
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
</docs-code>

この例では、`CustomCard`コンポーネントは子`CustomCardHeader`をクエリし、`computed`で結果を使用しています。

クエリが結果を見つけられない場合、その値は`undefined`になります。これは、ターゲット要素が`@if`によって非表示になっている場合に発生する可能性があります。Angularは、アプリケーションの状態が変化するにつれて`viewChild`の結果を最新の状態に保ちます。

`viewChildren`関数を使用して、複数結果をクエリできます。

<docs-code language="angular-ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map(action => action.text);
}
</docs-code>

`viewChildren`は、クエリ結果の`Array`を含むシグナルを作成します。

**クエリはコンポーネントの境界を貫通することはありません。**ビュークエリは、コンポーネントのテンプレートからの結果のみを取得できます。

## コンテンツクエリ

コンテンツクエリは、コンポーネントの_コンテンツ_（コンポーネントが使用されているテンプレート内でコンポーネントの中にネストされた要素）内の要素から結果を取得します。`contentChild`関数を使用して単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 15]">
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({ 
  /* ... */
  // CustomToggle is used inside CustomExpando as content.  
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

この例では、`CustomExpando`コンポーネントは子`CustomToggle`をクエリし、`computed`で結果にアクセスしています。

クエリが結果を見つけられない場合、その値は`undefined`になります。これは、ターゲット要素が存在しないか、`@if`によって非表示になっている場合に発生する可能性があります。Angularは、アプリケーションの状態が変化するにつれて`contentChild`の結果を最新の状態に保ちます。

デフォルトでは、コンテンツクエリはコンポーネントの_直接_の子のみを見つけ、子孫にはトラバースしません。

`contentChildren`関数を使用して、複数結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map(item => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
</docs-code>

`contentChildren`は、クエリ結果の`Array`を含むシグナルを作成します。

**クエリはコンポーネントの境界を貫通することはありません。**コンテンツクエリは、コンポーネント自体と同じテンプレートからの結果のみを取得できます。

## 必須クエリ

子クエリ（`viewChild`または`contentChild`）が結果を見つけられない場合、その値は`undefined`になります。これは、ターゲット要素が`@if`や`@for`などの制御フロー文によって非表示になっている場合に発生する可能性があります。このため、子クエリは`undefined`を含む値型を持つシグナルを返します。

場合によっては、特に`viewChild`を使用する場合、特定の子が常に利用可能であることが確実な場合があります。他の場合では、特定の子が存在することを厳格に適用したい場合があります。これらの場合、*必須クエリ*を使用できます。

```angular-ts
@Component({/* ... */})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

必須クエリが一致する結果を見つけられない場合、Angularはエラーを報告します。これは結果が利用可能であることを保証するため、必須クエリは自動的にシグナルの値型に`undefined`を含めません。

## クエリロケーター

各クエリデコレーターの最初の引数は、その**ロケーター**です。

ほとんどの場合、ロケーターとしてコンポーネントまたはディレクティブを使用することをお勧めします。

[テンプレート参照変数](guide/templates/variables#template-reference-variables)に対応する
文字列ロケーターも指定できます。

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

複数の要素が同じテンプレート参照変数を定義している場合、クエリは最初に一致する要素を取得します。

Angularは、CSSセレクターをクエリロケーターとしてサポートしていません。

### クエリとインジェクターツリー

TIP: プロバイダーとAngularのインジェクションツリーについては、[依存性の注入](guide/di)を参照してください。

より高度なケースでは、ロケーターとして任意の`ProviderToken`を使用できます。これにより、コンポーネントとディレクティブのプロバイダーに基づいて要素を見つけることができます。

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }

@Component({/*...*/})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

上記の例では、ロケーターとして`InjectionToken`を使用していますが、任意の`ProviderToken`を使用して特定の要素を見つけることができます。

## クエリオプション

すべてのクエリ関数は、第2引数としてオプションオブジェクトを受け取ります。これらのオプションは、クエリが結果を見つける方法を制御します。

### 要素のインジェクターからの特定の値の読み取り

デフォルトでは、クエリロケーターは、検索対象の要素と取得される値の両方を示します。代わりに、`read`オプションを指定して、ロケーターによって一致した要素から別の値を取得できます。

```ts
@Component({/*...*/})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

上記の例では、`ExpandoContent`ディレクティブを持つ要素を見つけて、
その要素に関連付けられた`TemplateRef`を取得します。

開発者は、`read`を使用して`ElementRef`と`TemplateRef`を取得することが最も一般的です。

### コンテンツの子孫

デフォルトでは、`contentChildren`クエリはコンポーネントの直接の子要素のみを検索し、子孫要素にはトラバースしません。  
一方、`contentChild`クエリはデフォルトで子孫要素も検索します。

<docs-code language="angular-ts" highlight="[13, 14, 15, 16]">
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // none found
  // toggle = contentChild(CustomToggle); // found
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

上記の例では、`CustomExpando` は `<custom-expando>` の直接の子要素ではないため、`contentChildren` を用いると `<custom-toggle>` を検出できません。`descendants: true` を設定することで、同じテンプレート内のすべての子孫を対象にクエリを実行するように設定できます。ただし、クエリはコンポーネントの境界を越えて、他のテンプレートの要素にアクセスすることは _決して_ ありません。

ビュークエリにはこのオプションはありません。これは、常に子孫をトラバースするためです。

## デコレーターベースのクエリ
TIP: Angularチームは新規プロジェクトにはシグナルベースのクエリ関数の使用を推奨していますが、
元のデコレーターベースのクエリAPIは引き続き完全にサポートされています。

代わりに、対応するデコレーターをプロパティに追加することでもクエリを宣言できます。デコレーターベースのクエリは、下記で説明する点を除いて、シグナルベースのクエリと同じように動作します。

### ビュークエリ

`@ViewChild`デコレーターを使用して、単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18]">
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
</docs-code>

この例では、`CustomCard`コンポーネントは子`CustomCardHeader`をクエリし、`ngAfterViewInit`で結果にアクセスしています。

Angularは、アプリケーションの状態が変化するにつれて`@ViewChild`の結果を最新の状態に保ちます。

**ビュークエリの結果は`ngAfterViewInit`ライフサイクルメソッドで使用可能になります。**この時点より前では、値は`undefined`です。コンポーネントライフサイクルの詳細については、[ライフサイクル](guide/components/lifecycle)セクションを参照してください。

`@ViewChildren`デコレーターを使用して、複数の結果をクエリできます。

<docs-code language="angular-ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach(action => {
      console.log(action.text);
    });
  }
}
</docs-code>

`@ViewChildren`は、クエリ結果を含む`QueryList`オブジェクトを作成します。`changes`プロパティを使用して、時間の経過とともにクエリ結果の変更を購読できます。

### コンテンツクエリ

`@ContentChild`デコレーターを使用して、単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 25]">
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

この例では、`CustomExpando`コンポーネントは子`CustomToggle`をクエリし、`ngAfterContentInit`で結果にアクセスしています。

Angularは、アプリケーションの状態が変化するにつれて`@ContentChild`の結果を最新の状態に保ちます。

**コンテンツクエリの結果は`ngAfterContentInit`ライフサイクルメソッドで使用可能になります。**この時点より前では、値は`undefined`です。コンポーネントライフサイクルの詳細については、[ライフサイクル](guide/components/lifecycle)セクションを参照してください。

`@ContentChildren`デコレーターを使用して、複数の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach(item => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
</docs-code>

`@ContentChildren`は、クエリ結果を含む`QueryList`オブジェクトを作成します。`changes`プロパティを使用して、時間の経過とともにクエリ結果の変更を購読できます。

### デコレーターベースのクエリオプション

すべてのクエリデコレーターは、第2引数としてオプションオブジェクトを受け取ります。これらのオプションは、シグナルベースのクエリと同じように動作しますが、下記で説明する点を除きます。

### 静的クエリ

`@ViewChild`と`@ContentChild`デコレーターは、`static`オプションを受け取ります。

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

`static: true`を設定することで、このクエリのターゲットは_常に_存在し、条件付きでレンダリングされないことをAngularに保証します。これにより、`ngOnInit`ライフサイクルメソッドで早く結果を利用できます。

静的クエリの結果は、初期化後に更新されません。

`static`オプションは、`@ViewChildren`と`@ContentChildren`クエリでは使用できません。

### QueryListの使用

`@ViewChildren`と`@ContentChildren`はどちらも、結果のリストを含む`QueryList`オブジェクトを提供します。

`QueryList`は、`map`、`reduce`、`forEach`など、配列のような方法で結果を操作するための多くの便利なAPIを提供します。`toArray`を呼び出すことで、現在の結果の配列を取得できます。

`changes`プロパティを購読して、結果が変更されるたびに何かを実行できます。

## 一般的なクエリの落とし穴

クエリを使用する際、一般的な落とし穴により、コードの理解と保守が難しくなる可能性があります。

複数のコンポーネント間で共有される状態については、常に単一の真実の源を維持してください。これにより、異なるコンポーネントで状態が繰り返し同期されなくなるシナリオを回避できます。

子コンポーネントに直接状態を書き込むことは避けてください。このパターンは、理解しにくく、[ExpressionChangedAfterItHasBeenChecked](errors/NG0100)エラーが発生しやすい壊れやすいコードにつながる可能性があります。

親コンポーネントまたは祖先コンポーネントに直接状態を書き込むことは決してしないでください。このパターンは、理解しにくく、[ExpressionChangedAfterItHasBeenChecked](errors/NG0100)エラーが発生しやすい壊れやすいコードにつながる可能性があります。

