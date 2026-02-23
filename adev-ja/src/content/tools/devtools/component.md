# コンポーネントツリーの検査 {#inspect-the-component-tree}

## アプリケーションのデバッグ {#debug-your-application}

**Components**タブでは、アプリケーションの構造を探索できます。
DOM内のコンポーネントとディレクティブのインスタンスを視覚化し、それらの状態を検査または変更できます。

### アプリケーション構造の探索 {#explore-the-application-structure}

コンポーネントツリーは、アプリケーション内の*コンポーネントとディレクティブ*の階層的な関係を表示します。

<img src="assets/images/guide/devtools/component-explorer.png" alt="アプリケーションのルートから始まるAngularコンポーネントとディレクティブのツリーを示す「Components」タブのスクリーンショット。">

コンポーネントエクスプローラ内の個々のコンポーネントまたはディレクティブをクリックして選択し、それらのプロパティをプレビューします。
Angular DevToolsは、コンポーネントツリーの右側で、プロパティとメタデータを表示します。

コンポーネントツリーの上にある検索ボックスを使用して、名前でコンポーネントまたはディレクティブを検索します。

<img src="assets/images/guide/devtools/search.png" alt="「Components」タブのスクリーンショット。タブのすぐ下にあるフィルタバーは「todo」を検索しており、「todo」が名前にあるすべてのコンポーネントがツリー内で強調表示されています。`app-todos`が現在選択されており、右側のサイドバーにコンポーネントのプロパティに関する情報が表示されます。これには、`@Output`フィールドのセクションと、他のプロパティのセクションが含まれます。">

### ホストノードに移動 {#navigate-to-the-host-node}

特定のコンポーネントやディレクティブのホスト要素に移動するには、コンポーネントエクスプローラでダブルクリックします。
Angular DevToolsはChromeのElementsタブまたはFirefoxのInspectorタブを開き、関連するDOMノードを選択します。

### ソースに移動 {#navigate-to-source}

コンポーネントの場合、Angular DevToolsはSourcesタブ（Chrome）とDebuggerタブ（Firefox）でコンポーネント定義に移動できます。
特定のコンポーネントを選択したら、プロパティビューの右上にあるアイコンをクリックします。

<img src="assets/images/guide/devtools/navigate-source.png" alt="「Components」タブのスクリーンショット。右側にコンポーネントのプロパティビューが表示され、マウスがビューの右上隅にある`<>`アイコンの上にあります。隣接するツールチップには「Open component source」と表示されます。">

### プロパティ値の更新 {#update-property-value}

ブラウザのDevToolsと同様に、プロパティビューでは入力と出力、またはその他のプロパティの値を編集できます。
プロパティ値を右クリックし、この値の種類で編集機能が利用可能な場合は、テキスト入力フィールドが表示されます。
新しい値を入力して`Enter`キーを押すと、この値がプロパティに適用されます。

<img src="assets/images/guide/devtools/update-property.png" alt="コンポーネントのプロパティビューが開いている「Components」タブのスクリーンショット。`todo`という`@Input`には、現在選択されており、値が「牛乳を買う」に手動で更新されている`label`プロパティが含まれています。">

### コンソールで選択したコンポーネントまたはディレクティブにアクセス {#access-selected-component-or-directive-in-console}

コンソールのショートカットとして、Angular DevToolsは、最近選択したコンポーネントやディレクティブのインスタンスへのアクセスを提供します。
現在選択されているコンポーネントやディレクティブのインスタンスを参照するには`$ng0`と入力し、以前に選択したインスタンスを参照するには`$ng1`と入力し、さらに前に選択したインスタンスを参照するには`$ng2`と入力するなどします。

<img src="assets/images/guide/devtools/access-console.png" alt="ブラウザコンソールの下にある「Components」タブのスクリーンショット。コンソールで、ユーザーは3つのコマンド、`$ng0`、`$ng1`、`$ng2`を入力して、最近選択した3つの要素を表示しています。各ステートメントの後、コンソールは異なるコンポーネント参照を出力します。">

### ディレクティブまたはコンポーネントの選択 {#select-a-directive-or-component}

ブラウザのDevToolsと同様にページを検査して、特定のコンポーネントやディレクティブを選択できます。
Angular DevToolsの左上隅にある ***Inspect element*** アイコンをクリックし、ページ上のDOM要素の上にマウスを置きます。
拡張機能は関連するディレクティブやコンポーネントを認識し、コンポーネントツリーで対応する要素を選択できます。

<img src="assets/images/guide/devtools/inspect-element.png" alt="Angular todoアプリケーションが表示されている「Components」タブのスクリーンショット。Angular DevToolsの左上隅にある画面にマウスアイコンが表示されたアイコンが選択されています。マウスはAngularアプリケーションのUIのtodo要素の上にあります。要素は`<TodoComponent>`ラベルで強調表示され、隣接するツールチップに表示されます。">

### Inspect Deferrable views {#inspect-deferrable-views}

Alongside the directives, the directive tree also includes [`@defer` blocks](/guide/templates/defer).

<img src="assets/images/guide/devtools/defer-block.png" />

Clicking a defer block shows more details in the properties sidebar: the different optional blocks (for example `@loading`, `@placeholder`, and `@error`), the configured triggers (defer triggers, prefetch triggers, and hydrate triggers), and timing options such as the `minimum` and `after` values.

### Hydration {#hydration}

When [hydration](/guide/hydration) is enabled on your SSR/SSG application, the directive tree shows the hydration status of each component.

In case of errors, an error message is displayed on the affected component.

<img src="assets/images/guide/devtools/hydration-status.png" />

The hydration status can also be visualized on the application itself by enabling the overlay.

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

Here is an illustration of the hydration overlays on a Angular e-shop example app.
