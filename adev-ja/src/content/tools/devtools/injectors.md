## インジェクターの検査 {#inspect-your-injectors}

NOTE: インジェクターツリーは、バージョン17以降を使ってビルドされたAngularアプリケーションで使用できます。

### アプリケーションのインジェクター階層を表示 {#view-the-injector-hierarchy-of-your-application}

**Injector Tree**タブでは、アプリケーションに構成されたインジェクターの構造を探索できます。ここでは、アプリケーションの[インジェクタ階層](guide/di/hierarchical-dependency-injection)を表す2つのツリーが表示されます。1つのツリーは環境階層、もう1つのツリーは要素階層です。

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="例となるアプリケーションのインジェクタグラフを視覚化しているAngular Devtoolsの「Profiler」タブのスクリーンショットで、インジェクタツリータブが表示されています。">

### 解決パスを視覚化する {#visualize-resolution-paths}

特定のインジェクターが選択されると、そのインジェクターからルートへのAngularの依存性の注入アルゴリズムがたどるパスが強調表示されます。要素インジェクターの場合、これには、依存関係が要素階層で解決できない場合に依存性の注入アルゴリズムがジャンプする環境インジェクターの強調表示も含まれます。

Angularが解決パスをどのように解決するかについての詳細は、[解決ルール](guide/di/hierarchical-dependency-injection#resolution-rules)を参照してください。

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="インジェクタツリーがインジェクタが選択されたときに解決パスをどのように強調表示するかを示す「Profiler」タブのスクリーンショット。">

### インジェクタープロバイダーを表示 {#view-injector-providers}

プロバイダーが構成されているインジェクターをクリックすると、右側にあるインジェクターツリービューにプロバイダーのリストが表示されます。ここでは、提供されたトークンとそのタイプを表示できます。各プロバイダーの右側のボタンを使用すると、コンソールにプロバイダーをログ出力できます。

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="インジェクタが選択されたときにプロバイダがどのように表示されるかを示す「Profiler」タブのスクリーンショット。">
