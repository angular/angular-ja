# コンテンツ投影

このトピックでは、柔軟で再利用可能なコンポーネントを作るための、コンテンツ投影の使い方について説明します。

<div class="alert is-helpful">

このトピックで使われているサンプルコードを表示またはダウンロードするには、<live-example></live-example>を参照しましょう。

</div>

コンテンツ投影は、使いたいコンテンツを別のコンポーネント内に挿入または*投影*するというパターンです。たとえば、別のコンポーネントによって提供されるコンテンツを受け取る`Card`コンポーネントがあるでしょう。

次のセクションでは、Angularでのコンテンツ投影の一般的な実装について説明します:

* [シングルスロットのコンテンツ投影](#single-slot)。このタイプのコンテンツ投影では、コンポーネントは単一のソースからコンテンツを受け取ります。
* [マルチスロットのコンテンツ投影](#multi-slot)。このシナリオでは、コンポーネントは複数のソースからコンテンツを受け取ります。
* [条件付きのコンテンツ投影](#conditional)。条件付きのコンテンツ投影を使うコンポーネントは、特定の条件が満たされた場合のみコンテンツをレンダリングします。

{@a single-slot }
## シングルスロットのコンテンツ投影

コンテンツ投影のもっとも基本的な形式は*シングルスロットのコンテンツ投影*です。シングルスロットのコンテンツ投影とは、1つのコンポーネントを中に投影できるコンポーネントを作ることを意味します。

シングルスロットのコンテンツ投影を使うコンポーネントを作るには:

1. [コンポーネントを作ります](guide/component-overview)。

1. コンポーネントのテンプレートにおいて、投影コンテンツを表示したい場所に`<ng-content>`要素を追加します。

たとえば、次のコンポーネントは`<ng-content>`要素を使ってメッセージを表示します。

<code-example path="content-projection/src/app/zippy-basic/zippy-basic.component.ts" header="content-projection/src/app/zippy-basic/zippy-basic.component.ts"></code-example>

`<ng-content>`要素のある場所で、このコンポーネントのユーザーは独自のメッセージをコンポーネントへ投影できるようになります。たとえば:

<code-example path="content-projection/src/app/app.component.html" header="content-projection/src/app/app.component.html"
region="single-slot"></code-example>

<div class="alert is-helpful">

`<ng-content>`要素はプレースホルダーであり実際のDOM要素を作成しません。`<ng-content>`に適用されたカスタム属性は無視されます。

</div>

{@a multi-slot}
## マルチスロットのコンテンツ投影

コンポーネントは複数のスロットを持てます。各スロットは、どのコンテンツがそのスロットに入るかを決定するCSSセレクターを指定できます。このパターンは*マルチスロットのコンテンツ投影*と呼ばれます。このパターンでは、投影コンテンツを表示したい場所を指定する必要があります。この作業は`<ng-content>`の`select`属性を使って行います。

マルチスロットのコンテンツ投影を使うコンポーネントを作るには:

1. [コンポーネントを作ります](guide/component-overview)。

1. コンポーネントのテンプレートにおいて、投影コンテンツを表示したい場所に`<ng-content>`要素を追加します。

1. `<ng-content>`要素に`select`属性を追加します。Angularは、タグ名、属性、CSSクラス、`:not`疑似クラスの、あらゆる組み合わせによる[セレクター](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)をサポートしています。

たとえば、次のコンポーネントは2つの`<ng-content>`要素を使っています。

 <code-example path="content-projection/src/app/zippy-multislot/zippy-multislot.component.ts" header="content-projection/src/app/zippy-multislot/zippy-multislot.component.ts"></code-example>

この`question`属性を使うコンテンツは、`select=[question]`属性をもつ`<ng-content>`要素へ投影されます。

<code-example path="content-projection/src/app/app.component.html" header="content-projection/src/app/app.component.html"
region="multi-slot"></code-example>

<div class="callout is-helpful">

<header>select属性をもたないng-content</header>

コンポーネントが`select`属性をもたない`<ng-content>`要素を含んでいる場合、そのインスタンスは、他の`<ng-content>`要素のいずれにも一致しない、投影されるコンポーネントの全部を受け取ります。

前の例では、2番目の`<ng-content>`要素のみが`select`属性を定義しています。その結果、最初の`<ng-content>`要素はコンポーネントへ投影されるその他のコンテンツを受け取ります。

</div>

{@a conditional }

## 条件付きのコンテンツ投影

コンポーネントが_条件付きで_コンテンツをレンダリングするかコンテンツを複数回レンダリングする必要がある場合は、条件付きでレンダリングしたいコンテンツを含んでいる`<ng-template>`要素を受け取るように、コンポーネントを構成する必要があります。

これらのケースでは`<ng-content>`要素を使うことは推奨されません。なぜなら、コンポーネントの使用者がコンテンツを提供するとき、そのコンテンツは_常に_初期化されるからです。それは、コンポーネントが`<ng-content>`要素を定義していない場合や、その`<ng-content>`要素が`ngIf`文の中にある場合でもです。

`<ng-template>`要素を使えば、コンポーネントに、必要な条件に基づいて必要な回数だけコンテンツを明示的にレンダリングさせることができます。 Angularは、`<ng-template>`要素のコンテンツをその要素が明示的にレンダリングされるまでは初期化しません。

次の手順は、`<ng-template>`を使う条件付きのコンテンツ投影の一般的な実装を示しています。

1. [コンポーネントを作ります](guide/component-overview)。

1. `<ng-template>`要素を受け取るそのコンポーネントにおいて、そのテンプレートをレンダリングするために`ng-container`要素を使います。このように:

   <code-example path="content-projection/src/app/example-zippy.template.html" header="content-projection/src/app/example-zippy.template.html" region="ng-container">
   </code-example>

   この例では、`ngTemplateOutlet`ディレクティブを使って、後の手順で定義する予定の与えられた`<ng-template>`要素をレンダリングします。`ngTemplateOutlet`ディレクティブは任意のタイプの要素に適用できます。この例では、このディレクティブを`ng-container`要素に割り当てます。そのコンポーネントは実際のDOM要素をレンダリングする必要がないからです。

1. `ng-container`要素を`div`要素などの別の要素でラップし、条件付きのロジックを適用します。

      <code-example path="content-projection/src/app/example-zippy.template.html"  header="content-projection/src/app/example-zippy.template.html" region="ngif">
      </code-example>

1. コンテンツを投影したいテンプレートにおいて、投影コンテンツを`<ng-template>`要素でラップします。このように:

      <code-example path="content-projection/src/app/app.component.html" region="ng-template">
      </code-example>

   `<ng-template>`要素は、コンポーネントが独自のロジックに基づいてレンダリングできるコンテンツのブロックを定義します。コンポーネントは、 `@ContentChild`か`@ContentChildren`デコレーターを使って、このテンプレートのコンテンツや`TemplateRef`への参照を取得できます。前の例ではカスタムディレクティブ`appExampleZippyContent`を作成しており、それはそのコンポーネントのコンテンツのための`<ng-template>`をマークするAPIとしてです。`TemplateRef`を使って、コンポーネントは`ngTemplateOutlet`ディレクティブか、 `ViewContainerRef`の`createEmbeddedView()`メソッドで、参照されたコンテンツをレンダリングできます。

1. テンプレートのために、カスタム属性に一致するセレクターをもつ[属性ディレクティブを作成](guide/attribute-directives#building-an-attribute-directive)します。このディレクティブにTemplateRefインスタンスを挿入します。

   <code-example path="content-projection/src/app/app.component.ts" header="content-projection/src/app/app.component.ts" region="zippycontentdirective">
   </code-example>

   前の手順で、カスタム属性`appExampleZippyContent`をもつ`<ng-template>`要素を追加しました。このコードは、Angularがそのカスタム属性に遭遇したときに使うことになるロジックを提供します。この場合、そのロジックはAngularにテンプレート参照をインスタンス化するように指示します。

1. コンテンツを投影したいコンポーネントで、`@ContentChild`を使って投影コンテンツのテンプレートを取得します。

   <code-example path="content-projection/src/app/app.component.ts" header="content-projection/src/app/app.component.ts" region="contentchild">
   </code-example>

   このステップ以前に、アプリケーションには、特定の条件が満たされたときにテンプレートをインスタンス化するコンポーネントがあります。また、そのテンプレートへの参照を提供するディレクティブを作成しました。この最後のステップでは、`@ContentChild`デコレーターが、指定されたコンポーネントでテンプレートをインスタンス化するようにAngularに指示します。

   <div class="alert is-helpful">

   マルチスロットのコンテンツ投影の場合、`@ContentChildren`を使って投影要素のQueryListを取得できます。

   </div>

{@a ngprojectas }

## より複雑な環境でのコンテンツ投影

[マルチスロットのコンテンツ投影](#multi-slot)に記載のように、通常は、属性、要素、CSSクラス、またはこれら3つのいくつかの組み合わせを使って、コンテンツを投影する場所を識別します。たとえば次のHTMLテンプレートでは、段落タグがカスタム属性の`question`を使ってコンテンツを`app-zippy-multislot`コンポーネントへ投影しています。

<code-example path="content-projection/src/app/app.component.html" header="content-projection/src/app/app.component.html"
region="multi-slot"></code-example>

場合によっては、別の要素としてのコンテンツを投影したいことがあります。たとえば、投影したいコンテンツは別の要素の子かもしれません。
これは`ngProjectAs`属性を使って達成できます。

たとえば、次のHTMLスニペットについて考えてみましょう:

<code-example path="content-projection/src/app/app.component.html" header="content-projection/src/app/app.component.html" region="ngprojectas">
</code-example>

この例では、`ng-container`の属性を使ってコンポーネントをより複雑な構造へ投影することをシミュレートしています。

<div class="callout is-helpful">

<header>確認しましょう!</header>

`ng-container`要素は、他のDOM要素をグループ化するために使用できる論理構造です。しかし、`ng-container`自体はそのDOMツリーにレンダリングされません。

</div>

この例では、投影したいコンテンツは別の要素の中に存在します。このコンテンツを意図するとおりに投影するために、テンプレートは`ngProjectAs`属性を使っています。`ngProjectAs`を用いて、`<ng-container>`要素全体が`[question]`セレクターを使っているコンポーネントへ投影されます。

@reviewed 2021-09-17
