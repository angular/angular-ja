# コンポーネントセレクター

TIP: このガイドは、[基本概念のガイド](essentials) を既にお読みになっていることを前提としています。Angularを初めて使用する場合は、まずこちらをお読みください。

各コンポーネントは、
コンポーネントの使用方法を決定する
[CSS セレクター](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) を定義します。

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

コンポーネントを使用するには、*他の*コンポーネントのテンプレートに一致するHTML要素を作成します。

<docs-code language="angular-ts" highlight="[3]">
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

**Angularはコンパイル時にセレクターを静的にマッチングします。**
AngularバインディングやDOM APIを介して実行時にDOMを変更しても、レンダリングされるコンポーネントには影響しません。

**1つの要素は、1つのコンポーネントセレクターにのみマッチングできます。**
複数のコンポーネント セレクターが1つの要素にマッチングする場合、Angularはエラーを報告します。

**コンポーネント セレクターは大文字と小文字を区別します。**

## セレクターの種類

Angularは、コンポーネントセレクターで
[基本的なCSSセレクターの種類](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
の一部をサポートしています。

| **セレクターの種類**  | **説明**                                                                                                 | **例**                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| タイプセレクター      | HTML タグ名またはノード名に基づいて要素をマッチングします。                                                    | `profile-photo`               |
| 属性セレクター | HTML 属性の存在に基づいて要素をマッチングし、オプションでその属性の正確な値を指定します。 | `[dropzone]` `[type="reset"]` |
| クラスセレクター     | CSS クラスの存在に基づいて要素をマッチングします。                                                          | `.menu-item`                  |

属性値の場合、Angularは等号 (`=`) 演算子を使用して、正確な属性値をマッチングすることをサポートしています。
Angularは他の属性値の演算子をサポートしていません。

Angularコンポーネントセレクターは、
[子孫結合子](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator) や
[子結合子](https://developer.mozilla.org/docs/Web/CSS/Child_combinator) を含む結合子をサポートしていません。

Angularコンポーネントセレクターは、
[名前空間](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course) を指定することをサポートしていません。

### `:not` 擬似クラス

Angularは [`:not` 擬似クラス](https://developer.mozilla.org/docs/Web/CSS/:not) をサポートしています。
他のセレクターにこの擬似クラスを追加することで、コンポーネントのセレクターがマッチングする要素を絞り込むことができます。
たとえば、`[dropzone]` 属性セレクターを定義して、
`textarea` 要素のマッチングを防ぐことができます。

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
</docs-code>

Angularは、コンポーネント セレクターで他の擬似クラスまたは擬似要素をサポートしていません。

### セレクターの組み合わせ

複数のセレクターを連結することで、組み合わせられます。
たとえば、`type="reset"` を指定した `<button>` 要素をマッチングできます。

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
</docs-code>

カンマ区切りのリストで、複数のセレクターを定義できます。

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
</docs-code>

Angularは、リスト内の_いずれか_のセレクターにマッチングする要素ごとにコンポーネントを作成します。

## セレクターの選択

ほとんどのコンポーネントは、カスタム要素名をセレクターとして使用する必要があります。
すべてのカスタム要素名は、
[HTML 仕様](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) に従ってハイフンを含める必要があります。
デフォルトでは、Angularは、使用可能なコンポーネントと一致しないカスタムタグ名に出会うとエラーを報告し、
誤ったコンポーネント名によるバグを防ぎます。

Angularテンプレートで
[ネイティブ カスタム要素](https://developer.mozilla.org/docs/Web/Web_Components) を使用する方法の詳細については、
[コンポーネントの高度な設定](guide/components/advanced-configuration) を参照してください。

### セレクターのプレフィックス

Angularチームは、プロジェクト内で定義されているすべてのカスタムコンポーネントに
短い一貫性のあるプレフィックスを使用することをお勧めします。
たとえば、AngularでYouTubeを構築する場合、コンポーネントに `yt-` プレフィックスを付け、`yt-menu`、`yt-player` などのコンポーネントを作成できます。
このようにセレクターに名前空間を付けると、特定のコンポーネントの出所がすぐにわかります。
デフォルトでは、Angular CLIは `app-` を使用します。

Angularは、独自のフレームワークAPIに対して `ng` セレクタープレフィックスを使用します。
独自の カスタム コンポーネントのセレクター プレフィックスとして `ng` を使用しないでください。

### 属性セレクターを使用する場合

標準のネイティブ要素にコンポーネントを作成する場合は、属性セレクターを検討する必要があります。
たとえば、カスタムボタンコンポーネントを作成する場合、
属性セレクターを使用して、標準の `<button>` 要素を活用できます。

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
</docs-code>

この方法により、コンポーネントの利用者は、追加の作業なしで要素のすべての標準APIを直接使用できます。
これは、`aria-label` などのARIA属性に特に役立ちます。

Angularは、使用可能なコンポーネントと一致しないカスタム属性に出会ってもエラーを報告しません。
属性セレクターを使用してコンポーネントを使用する場合、
利用者はコンポーネントまたはそのNgModuleをインポートし忘れることがあり、その結果、コンポーネントがレンダリングされません。
詳細については、[コンポーネントのインポートと使用](guide/components/importing) を参照してください。

属性セレクターを定義するコンポーネントは、小文字、ダッシュ区切りの属性を使用する必要があります。
上記で説明したプレフィックスの推奨事項に従うことができます。
