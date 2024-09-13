# テンプレート内の空白

デフォルトで、Angularテンプレートはフレームワークが不要とみなす空白を保持しません。これは、要素間の空白と、テキスト内の折り畳み可能な空白の2つの状況で一般的に発生します。

## 要素間の空白

ほとんどの開発者は、テンプレートを読みやすくするために、改行とインデントでテンプレートをフォーマットすることを好みます。

```angular-html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input>
  </label>
</section>
```

このテンプレートには、すべての要素間に空白が含まれています。次のスニペットは、同じHTMLで、存在する空白をすべてハッシュ（`#`）文字に置き換えたもので、どのくらいの空白が存在するかを示しています。

```angular-html
<!-- 全体の空白: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

テンプレートに書かれた空白をそのまま保持すると、多くの不要な[テキストノード](https://developer.mozilla.org/en-US/docs/Web/API/Text)が生成され、ページのレンダリングオーバーヘッドが増加します。Angularは、要素間のこの空白を無視することで、ページにテンプレートをレンダリングする際の作業量を減らし、全体的なパフォーマンスを向上させています。

## テキスト内の折り畳み可能な空白

WebブラウザがページにHTMLをレンダリングする場合、連続する複数の空白文字を1つの文字に折り畳みます。

```angular-html
<!-- テンプレートでの表示 -->
<p>Hello         world</p>
```

この例では、ブラウザは「Hello」と「world」の間にスペースを1つだけ表示します。

```angular-html
<!-- ブラウザに表示される内容 -->
<p>Hello world</p>
```

この仕組みの詳細については、[HTML、CSS、およびDOMでの空白の処理方法](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace)を参照してください。

Angularは、テンプレートをコンパイルする際に、これらの不要な空白文字を1つの文字に折り畳むことで、ブラウザに送信しないようにします。

## 空白を保持する

`@Component`デコレーターで`preserveWhitespaces: true`を指定することで、Angularにテンプレート内の空白を保持するように指示できます。

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

絶対に必要な場合を除いて、このオプションを設定しないでください。空白を保持すると、Angularがレンダリング中に大幅に多くのノードを生成し、アプリケーションが遅くなる可能性があります。

また、Angular独自の特別なHTMLエンティティ`&ngsp;`も使用できます。このエンティティは、コンパイルされた出力で保持される単一のスペース文字を生成します。
