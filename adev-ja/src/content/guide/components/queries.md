# クエリによるコンポーネントの子要素への参照

Tip: このガイドでは、[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使う場合は、まずこちらをお読みください。

コンポーネントは、子要素を見つけてそのインジェクターから値を読み取る**クエリ**を定義できます。

開発者は、クエリを使用して、子コンポーネント、ディレクティブ、DOM要素などの参照を取得することがほとんどです。

クエリには、**ビュークエリ**と**コンテンツクエリ**の2種類があります。

## ビュークエリ

ビュークエリは、コンポーネントの*ビュー*（コンポーネント自身のテンプレートで定義されている要素）にある要素から結果を取得します。`@ViewChild` デコレーターを使用して、単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18]">
@Component({
  selector: 'custom-card-header',
  ...
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

この例では、`CustomCard`コンポーネントは子要素の`CustomCardHeader`をクエリし、`ngAfterViewInit`で結果にアクセスしています。

クエリが結果を見つけられない場合、その値は`undefined`になります。これは、ターゲット要素が`NgIf`によって非表示になっている場合に発生する可能性があります。Angularは、アプリケーションの状態が変化すると、`@ViewChild`の結果を最新の状態に保ちます。

**ビュークエリの結果は、`ngAfterViewInit`ライフサイクルメソッドで利用可能になります**。この時点以前は、値は`undefined`です。コンポーネントライフサイクルの詳細については、[ライフサイクル](guide/components/lifecycle)セクションをご覧ください。

`@ViewChildren` デコレーターを使用して、複数の結果をクエリできます。

<docs-code language="angular-ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  ...,
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

`@ViewChildren`は、クエリの結果を含む`QueryList`オブジェクトを作成します。`changes`プロパティを使用して、クエリの結果が時間とともに変化した場合に購読できます。

**クエリはコンポーネントの境界を越えることは決してありません。** ビュークエリは、コンポーネントのテンプレートからのみ結果を取得できます。

## コンテンツクエリ

コンテンツクエリは、コンポーネントの_コンテンツ_（コンポーネントが使用されているテンプレート内でコンポーネントにネストされた要素）にある要素から結果を取得します。`@ContentChild` デコレーターを使用して、単一の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 25]">
@Component({
  selector: 'custom-toggle',
  ...
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  ...
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

この例では、`CustomExpando`コンポーネントは子要素の`CustomToggle`をクエリし、`ngAfterContentInit`で結果にアクセスしています。

クエリが結果を見つけられない場合、その値は`undefined`になります。これは、ターゲット要素が存在しないか、`NgIf`によって非表示になっている場合に発生する可能性があります。Angularは、アプリケーションの状態が変化すると、`@ContentChild`の結果を最新の状態に保ちます。

デフォルトでは、コンテンツクエリはコンポーネントの*直接*の子要素のみを見つけ、子孫にトラバースすることはありません。

**コンテンツクエリの結果は、`ngAfterContentInit`ライフサイクルメソッドで利用可能になります**。この時点以前は、値は`undefined`です。コンポーネントライフサイクルの詳細については、[ライフサイクル](guide/components/lifecycle)セクションをご覧ください。

`@ContentChildren` デコレーターを使用して、複数の結果をクエリできます。

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  ...
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  ...,
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

`@ContentChildren`は、クエリの結果を含む`QueryList`オブジェクトを作成します。`changes`プロパティを使用して、クエリの結果が時間とともに変化した場合に購読できます。

**クエリはコンポーネントの境界を越えることは決してありません。** コンテンツクエリは、コンポーネント自身と同じテンプレートからのみ結果を取得できます。

## クエリロケーター

各クエリのデコレーターの最初の引数は、**ロケーター**です。

ほとんどの場合、コンポーネントまたはディレクティブをロケーターとして使用します。

代わりに、[テンプレート参照変数](guide/templates/variables#template-reference-variables)
に対応する文字列ロケーターを指定できます。

```angular-ts
@Component({
  ...,
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  @ViewChild('save') saveButton: ElementRef<HTMLButtonElement>;
}
```

同じテンプレート参照変数を定義している要素が複数ある場合、クエリは最初に一致する要素を取得します。

Angularは、CSSセレクターをクエリのロケーターとしてサポートしていません。

### クエリとインジェクターツリー

Tip: プロバイダーとAngularのインジェクションツリーの詳細については、[依存性注入](guide/di)を参照してください。

より高度なケースでは、`ProviderToken`をロケーターとして使用できます。これにより、コンポーネントとディレクティブのプロバイダーに基づいて要素を特定できます。

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  ...,
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }

@Component({...})
export class CustomList {
  @ContentChild(SUB_ITEM) subItemType: string;
}
```

上記の例では、`InjectionToken`をロケーターとして使用していますが、特定の要素を特定するために、任意の`ProviderToken`を使用できます。

## クエリオプション

すべてのクエリデコレーターは、2番目のパラメーターとしてオプションオブジェクトを受け取ります。これらのオプションは、クエリが結果をどのように見つけるかを制御します。

### 静的クエリ

`@ViewChild`および`@ContentChild`クエリは、`static`オプションを受け取ります。

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

`static: true`を設定することで、Angularにこのクエリのターゲットが*常に*存在し、条件付きでレンダリングされていないことを保証します。これにより、結果はより早い段階で、`ngOnInit`ライフサイクルメソッドで利用可能になります。

静的クエリの結果は、初期化後に更新されません。

`static`オプションは、`@ViewChildren`および`@ContentChildren`クエリでは使用できません。

### コンテンツ子孫

デフォルトでは、コンテンツクエリはコンポーネントの_直接_の子要素のみを見つけ、子孫にトラバースすることはありません。

<docs-code language="angular-ts" highlight="[13, 14, 15, 16]">
@Component({
  selector: 'custom-expando',
  ...
})
export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <!-- custom-toggle will not be found! -->
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

上記の例では、`CustomExpando`は、`<custom-toggle>`が`<custom-expando>`の直接の子要素ではないため、`<custom-toggle>`を見つけることができません。`descendants: true`を設定することで、クエリが同じテンプレート内のすべての子孫をトラバースするように構成できます。ただし、クエリは、_決して_コンポーネントに侵入して他のテンプレート内の要素をトラバースすることはありません。

ビュークエリには、子孫を_常に_トラバースするため、このオプションはありません。

### 要素のインジェクターからの特定の値の読み取り

デフォルトでは、クエリロケーターは、検索する要素と取得する値の両方を示します。代わりに、`read`オプションを指定して、ロケーターによって一致する要素から別の値を取得できます。

```ts
@Component({...})
export class CustomExpando {
  @ContentChild(ExpandoContent, {read: TemplateRef}) toggle: TemplateRef;
}
```

上記の例では、`ExpandoContent`ディレクティブを持つ要素を特定し、
その要素に関連付けられた`TemplateRef`を取得します。

開発者は、`read`を使用して、`ElementRef`と`TemplateRef`を取得することがほとんどです。

## QueryList の使用

`@ViewChildren`と`@ContentChildren`はどちらも、結果のリストを含む`QueryList`オブジェクトを提供します。

`QueryList`は、`map`、`reduce`、`forEach`などの配列のような方法で結果を操作するための便利なAPIをいくつか提供します。`toArray`を呼び出すことで、現在の結果の配列を取得できます。

`changes`プロパティを購読して、結果が変更されるたびに何かを行うことができます。

## クエリの一般的な落とし穴

クエリを使用する際に、コードの理解と保守を難しくする一般的な落とし穴があります。

複数のコンポーネント間で共有される状態には、常に単一の真実の源を維持します。これにより、異なるコンポーネントで状態が繰り返し使用され、同期が乱れるシナリオを防ぐことができます。

子コンポーネントに直接状態を書き込まないでください。このパターンは、理解が難しく、[ExpressionChangedAfterItHasBeenChecked](errors/NG0100)エラーが発生しやすい、もろいコードにつながる可能性があります。

親または祖先コンポーネントに直接状態を書き込まないでください。このパターンは、理解が難しく、[ExpressionChangedAfterItHasBeenChecked](errors/NG0100)エラーが発生しやすい、もろいコードにつながる可能性があります。
