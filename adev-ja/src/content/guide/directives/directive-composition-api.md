## ディレクティブ合成API

Angularディレクティブは、再利用可能な動作をカプセル化する素晴らしい方法を提供します。
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
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
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
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```

入力と出力を明示的に指定することで、`hostDirective` を持つコンポーネントのコンシューマーは
テンプレートでそれらにバインドできます。

```angular-html

<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```

さらに、`hostDirective` から入力と出力をエイリアスして、
コンポーネントのAPIをカスタマイズできます。

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```

```angular-html

<admin-menu id="top-menu" (closed)="logMenuClosed()">
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

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip は、他の複数のディレクティブから動作を構成できます
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget は、すでに構成されている MenuWithTooltip からの動作を適用できます
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## ホストディレクティブのセマンティクス

### ディレクティブの実行順序

ホストディレクティブは、テンプレートで直接使用されるコンポーネントやディレクティブと同じライフサイクルを経ます。
ただし、ホストディレクティブは常に適用されているコンポーネントまたはディレクティブの*前*に、コンストラクターやライフサイクルフックおよびバインディングを実行します。

次の例は、ホストディレクティブの最小限の使用を示しています。

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
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
