# ディレクティブ合成API

Angularディレクティブは、再利用可能な動作をカプセル化するすばらしい方法を提供します。
ディレクティブは、属性、CSSクラス、およびイベントリスナーを要素に適用できます。

*ディレクティブ合成API* を使用すると、
コンポーネントのTypeScriptクラスの*内部*からコンポーネントのホスト要素にディレクティブを適用できます。

## コンポーネントにディレクティブを追加する

コンポーネントにディレクティブを適用するには、コンポーネントのデコレーターに `hostDirectives` プロパティを追加します。
このようなディレクティブを*ホストディレクティブ*と呼びます。

この例では、`MenuBehavior` ディレクティブを `AdminMenu` のホスト要素に適用します。
これは、テンプレートの `<admin-menu>` 要素に `MenuBehavior` を適用するのと同じように機能します。

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

フレームワークがコンポーネントをレンダリングすると、Angularは各ホストディレクティブのインスタンスも作成します。
ディレクティブのホストバインディングは、コンポーネントのホスト要素に適用されます。
デフォルトでは、ホストディレクティブの入力と出力は、コンポーネントの公開APIの一部として公開されません。
詳細については、以下の[入力と出力を含める](#including-inputs-and-outputs)を参照してください。

**Angularはコンパイル時に静的にホストディレクティブを適用します。** 
ランタイム時には動的にディレクティブを追加できません。

**`hostDirectives` で使用されるディレクティブは `standalone: false` を指定できません。**

**Angularは `hostDirectives` プロパティで適用されたディレクティブの `selector` を無視します。**

## 入力と出力を含める {#including-inputs-and-outputs}

コンポーネントに `hostDirectives` を適用すると、
ホストディレクティブからの入力と出力は、デフォルトではコンポーネントのAPIには含まれません。
`hostDirectives` のエントリを拡張することで、コンポーネントのAPIに入力と出力を明示的に含めることができます。

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId'],
      outputs: ['menuClosed'],
    },
  ],
})
export class AdminMenu {}
```

入力と出力を明示的に指定することで、`hostDirective` を持つコンポーネントのコンシューマーは
テンプレートでそれらにバインドできます。

```angular-html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()"></admin-menu>
```

さらに、`hostDirective` から入力と出力をエイリアスして、
コンポーネントのAPIをカスタマイズできます。

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenu {}
```

```angular-html
<admin-menu id="top-menu" (closed)="logMenuClosed()"></admin-menu>
```

## 別のディレクティブにディレクティブを追加する

コンポーネントに加えて、他のディレクティブにも `hostDirectives` を追加できます。
これにより、複数の動作を推移的に集約できます。

次の例では、`Menu` と `Tooltip` の2つのディレクティブを定義しています。
次に、`MenuWithTooltip` でこれらの2つのディレクティブの動作を構成します。
最後に、`SpecializedMenuWithTooltip` に `MenuWithTooltip` を適用します。

`SpecializedMenuWithTooltip` がテンプレートで使用されると、
`Menu`、`Tooltip`、`MenuWithTooltip` のすべてをインスタンス化します。
これらのディレクティブの各ホストバインディングは、`SpecializedMenuWithTooltip` のホスト要素に適用されます。

```ts
@Directive({
  /* ... */
})
export class Menu {}

@Directive({
  /* ... */
})
export class Tooltip {}

// MenuWithTooltip は、他の複数のディレクティブから動作を構成できます
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip {}

// CustomWidget は、すでに構成されている MenuWithTooltip からの動作を適用できます
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip {}
```

## ホストディレクティブのセマンティクス

### ディレクティブの実行順序

ホストディレクティブは、テンプレートで直接使用されるコンポーネントやディレクティブと同じライフサイクルを経ます。
ただし、ホストディレクティブは常に適用されているコンポーネントまたはディレクティブの*前*に、コンストラクターやライフサイクルフックおよびバインディングを実行します。

次の例は、ホストディレクティブの最小限の使用を示しています。

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

ここでの実行順序は次のとおりです。

1. `MenuBehavior` がインスタンス化される
2. `AdminMenu` がインスタンス化される
3. `MenuBehavior` が入力を受信する (`ngOnInit`)
4. `AdminMenu` が入力を受信する (`ngOnInit`)
5. `MenuBehavior` がホストバインディングを適用する
6. `AdminMenu` がホストバインディングを適用する

この動作順序により、`hostDirectives` を持つコンポーネントは、
ホストディレクティブで指定されたホストバインディングをオーバーライドできます。

この動作順序は次の例のように、
ホストディレクティブのネストされたチェーンにも適用されます。

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

上記の例では、実行順序は次のとおりです。

1. `Tooltip` がインスタンス化される
2. `CustomTooltip` がインスタンス化される
3. `EvenMoreCustomTooltip` がインスタンス化される
4. `Tooltip` が入力を受信する (`ngOnInit`)
5. `CustomTooltip` が入力を受信する (`ngOnInit`)
6. `EvenMoreCustomTooltip` が入力を受信する (`ngOnInit`)
7. `Tooltip` がホストバインディングを適用する
8. `CustomTooltip` がホストバインディングを適用する
9. `EvenMoreCustomTooltip` がホストバインディングを適用する

### 依存性の注入

`hostDirectives` を指定するコンポーネントまたはディレクティブは、
それらのホストディレクティブのインスタンスを注入でき、その逆も可能です。

ホストディレクティブをコンポーネントに適用する場合、
コンポーネントとホストディレクティブの両方でプロバイダーを定義できます。

`hostDirectives` を持つコンポーネントと、それらのホストディレクティブの両方が同じ注入トークンを提供する場合、
`hostDirectives` を持つクラスで定義されたプロバイダーは
ホストディレクティブで定義されたプロバイダーよりも優先されます。

### Host directive de-duplication

When the same directive appears more than once in the resolved host directive tree, it is automatically de-duplicated rather than throwing an error. Two deterministic rules are used to decide which match survives.

#### Template match takes precedence

If a directive matches an element once through a **template selector** and also appears as a
**host directive**, Angular keeps only the template match and discards all host directive matches.

The mental model is that a host directive match represents `Partial<YourDirective>` , a partial
application where only the inputs and outputs explicitly listed in `hostDirectives` are exposed,
while a template match represents the full directive with its complete public API.

```ts
@Directive({selector: '[hoverable]'})
export class Hoverable {}

@Component({
  selector: 'app-button',
  hostDirectives: [Hoverable],
})
export class Button {}
```

```angular-html
<!-- Hoverable is matched by selector AND as a host directive of Button. -->
<!-- Angular keeps only the selector match, which has the full public API. -->
<app-button hoverable></app-button>
```

#### Multiple host directive matches are merged

If the same directive appears **more than once as a host directive** , for example, when two
directives both declare a common dependency in their `hostDirectives` , Angular merges all
instances into a single directive instance. The input and output mappings from all instances are
combined.

This resolves the classic [diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem) in host directive composition:

```ts
// A shared behavior that both triggers need
@Directive({
  host: {
    '[attr.data-trigger-id]': 'triggerId',
  },
})
export class TriggerRef {
  readonly triggerId = `trigger-${crypto.randomUUID()}`;
}

// Two separate triggers, each declaring TriggerRef as a host directive
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [TriggerRef],
})
export class PopoverTrigger {
  readonly triggerRef = inject(TriggerRef);
}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [TriggerRef],
})
export class DropdownTrigger {
  readonly triggerRef = inject(TriggerRef);
}
```

```angular-html
<!-- Angular keeps one TriggerRef instance, shared by both triggers. -->
<button popoverTrigger dropdownTrigger>Actions</button>
```

HELPFUL: Because Angular produces only one instance of the shared directive, both `PopoverTrigger`
and `DropdownTrigger` receive the same `TriggerRef` instance when they inject it.

#### Conflicting aliases

When Angular merges duplicate host directive matches it also merges their input and output mappings.
If two instances of the same host directive expose the **same input or output under different
aliases**, Angular throws an error at compile time ([NG8024](errors/NG8024))

```ts
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [{directive: TriggerRef, inputs: ['triggerId: popoverTriggerId']}],
})
export class PopoverTrigger {}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [
    {directive: TriggerRef, inputs: ['triggerId: dropdownTriggerId']}, // different alias!
  ],
})
export class DropdownTrigger {}
```

```angular-html
<!-- Error: triggerId is exposed as both "popoverTriggerId" and "dropdownTriggerId". -->
<button popoverTrigger dropdownTrigger></button>
```

To resolve this, ensure that both paths expose the shared input or output under the same alias, or
do not expose it at all.
