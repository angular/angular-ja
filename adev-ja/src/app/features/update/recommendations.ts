/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

export enum ApplicationComplexity {
  Basic = 1,
  Medium = 2,
  Advanced = 3,
}

export interface Step {
  step: string;
  action: string;
  possibleIn: number;
  necessaryAsOf: number;
  level: ApplicationComplexity;
  angularCLI?: boolean;
  ngUpgrade?: boolean;
  pwa?: boolean;
  material?: boolean;
  renderedStep?: string;
  windows?: boolean;
}

export const RECOMMENDATIONS: Step[] = [
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Extends OnInit',
    action:
      '`OnInit`を継承しない、あるいはライフサイクルイベントを使用する場合は`implements <lifecycle event>`を使用してください。',
  },
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'Deep Imports',
    action:
      'ディープインポートの使用をやめてください。これらのシンボルは現在ɵでマークされており、公開APIの一部ではありません。',
  },
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'invokeElementMethod',
    action:
      '`Renderer.invokeElementMethod`は削除されたため、使用を中止してください。現在、代替メソッドはありません。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Non Animations Module',
    action:
      'アプリケーションでアニメーションを使用する場合は、App `NgModule`で`@angular/platform-browser/animations`から`BrowserAnimationsModule`をインポートする必要があります。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Medium,
    step: 'Native Form Validation',
    action:
      'Angularは`FormsModule`を含めると、フォーム要素に`novalidate`属性を追加するようになりました。ネイティブフォームの動作を再度有効にするには、`ngNoForm`を使用するか、`ngNativeValidate`を追加してください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'RootRenderer',
    action: '`RootRenderer`を`RendererFactoryV2`に置き換えてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    ngUpgrade: true,
    step: 'downgradeInjectable',
    action: '`upgrade/static/downgradeInjectable`の戻り値が変更されました。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'Animations Tests',
    action:
      'アニメーションとテストを使用する場合は、`TestBed.initTestEnvironment`の呼び出しに`mods[1].NoopAnimationsModule`を追加してください。',
  },
  {
    possibleIn: 200,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'DefaultIterableDiffer',
    action:
      '`DefaultIterableDiffer`、`KeyValueDiffers#factories`、または`IterableDiffers#factories`の使用をやめてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Basic,
    step: 'Template Tag',
    action: '`template`タグを`ng-template`にリネームしてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Medium,
    step: 'OpaqueToken',
    action: '`OpaqueToken`を`InjectionToken`に置き換えてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'DifferFactory',
    action: '`DifferFactory.create(...)`を呼び出す場合は、`ChangeDetectorRef`引数を削除してください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'ErrorHandler Parameter',
    action: '`ErrorHandler`のコンストラクターに引数を渡すのをやめてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'ngProbeToken',
    action:
      '`ngProbeToken`を使用する場合は、`@angular/platform-browser`ではなく`@angular/core`からインポートするようにしてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'TrackByFn',
    action: '`TrackByFn`を使用する場合は、代わりに`TrackByFunction`を使用してください。',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Basic,
    step: 'i18n Pipe Change',
    action:
      '日付、通貨、小数点、またはパーセントのパイプに依存している場合、バージョン5ではフォーマットにわずかな変更があります。`en-us`以外のロケールを使用するアプリケーションでは、`@angular/common/i18n_data/locale_fr`からインポートし、必要に応じて`locale_extended_fr`をインポートして`registerLocaleData(local)`を呼び出す必要があります。',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'gendir',
    action:
      '`gendir`に依存せず、代わりに`skipTemplateCodeGen`の使用を検討してください。<a href=https://github.com/angular/angular/issues/19339#issuecomment-332607471" target="_blank">詳細はこちら</a>',
  },
  {
    possibleIn: 220,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    ngUpgrade: true,
    step: 'Dynamic ngUpgrade',
    action:
      '`@angular/upgrade`からインポートされた`downgradeComponent`、`downgradeInjectable`、`UpgradeComponent`、および`UpgradeModule`を置き換えてください。代わりに、`@angular/upgrade/static`にある新しいバージョンを使用してください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'Animations in Core',
    action:
      '`@angular/core`からアニメーションサービスやツールをインポートしている場合は、`@angular/animations`からインポートする必要があります。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'ngOutletContext',
    action: '`ngOutletContext`を`ngTemplateOutletContext`に置き換えてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'collectionChangeRecord',
    action: '`CollectionChangeRecord`を`IterableChangeRecord`に置き換えてください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'Renderer',
    action: '`Renderer`を使用している箇所はすべて`Renderer2`を使用してください。',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'Router Query Params',
    action: '`preserveQueryParams`を使用する場合は、代わりに`queryParamsHandling`を使用してください。',
  },
  {
    possibleIn: 430,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'Http',
    action:
      'レガシーな`HttpModule`と`Http`サービスを使用している場合は、`HttpClientModule`と`HttpClient`サービスに切り替えてください。`HttpClient`はデフォルトの人間工学を簡素化し（JSONにマップする必要がなくなりました）、型付きの戻り値とインターセプターをサポートしています。詳細については、[angular.dev](https://angular.io/guide/http)を参照してください。',
  },
  {
    possibleIn: 430,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'DOCUMENT in @angular/platform-browser',
    action:
      '`@angular/platform-browser`から`DOCUMENT`を使用している場合は、`@angular/common`からインポートを開始する必要があります。',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'ReflectiveInjector',
    action: '`ReflectiveInjector`を使用している箇所はすべて`StaticInjector`を使用してください。',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 550,
    level: ApplicationComplexity.Medium,
    step: 'Whitespace',
    action:
      '`tsconfig.json`の`angularCompilerOptions`キーの下にある`preserveWhitespaces`に`off`の値を設定して、この設定の利点を活用してください。この設定はv6でデフォルトで`off`になりました。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    step: 'node 8',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 8以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'Update to CLI v6',
    action:
      'Angular CLIを更新し、次のコマンドを実行して設定を<a href="https://github.com/angular/angular-cli/wiki/angular-workspace" target="_blank">新しいangular.json形式</a>に移行してください。<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/cli@6`<br/>',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'Update to CLI v6',
    action:
      'Angular CLIを更新し、次のコマンドを実行して設定を<a href="https://github.com/angular/angular-cli/wiki/angular-workspace" target="_blank">新しいangular.json形式</a>に移行してください。<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/cli@6 @angular/core@6"`<br/>',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'cli v6 scripts',
    action:
      '`package.json`にある`scripts`を最新のAngular CLIコマンドを使用するように更新してください。すべてのCLIコマンドは、POSIX準拠のため、フラグに2つのダッシュを使用するようになりました（例: `ng build --prod --source-map`）。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'Update to Angular v6',
    action:
      'すべてのAngularフレームワークパッケージをv6に、そしてRxJSとTypeScriptを正しいバージョンに更新してください。<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/core@6`<br/><br/>更新後、TypeScriptとRxJSはアプリケーション全体で型をより正確にフローさせるため、アプリケーションの型定義に既存のエラーが露呈する可能性があります。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'Update to Angular v6',
    action:
      'すべてのAngularフレームワークパッケージをv6に、そしてRxJSとTypeScriptを正しいバージョンに更新してください。<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/cli@6 @angular/core@6"`<br/><br/>更新後、TypeScriptとRxJSはアプリケーション全体で型をより正確にフローさせるため、アプリケーションの型定義に既存のエラーが露呈する可能性があります。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'forms v6',
    action:
      'Angular Formsでは、`AbstractControl#markAsPending`を呼び出すと、`AbstractControl#statusChanges`が`PENDING`イベントを発行するようになりました。`statusChanges`からのイベントをフィルタリングまたはチェックしている場合は、`markAsPending`を呼び出す際に新しいイベントを考慮するようにしてください。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'animations timing',
    action:
      '無効なZone内で`AnimationEvent`の`totalTime`を使用した場合、0を報告しなくなります。アニメーションイベントが無効なアニメーションを報告しているかどうかを検出するには、代わりに`event.disabled`プロパティを使用できます。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Advanced,
    step: 'ngModel on form control',
    action:
      'リアクティブフォームディレクティブで`ngModel`入力プロパティと`ngModelChange`イベントを使用するサポートは、v6で非推奨となり、v7で削除されました。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'ngModelChange order',
    action:
      '`ngModelChange`は、期待により合致するように、コントロールの値/有効性が更新された後に発行されるようになりました。これらのイベントの順序に依存している場合は、コンポーネントで古い値を追跡し始める必要があります。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'Update Dependencies for v6',
    action:
      'Angular Materialを最新バージョンに更新してください。<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/material@6`<br/><br/>これにより、非推奨のAPIも自動的に移行されます。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'Update Dependencies for v6',
    action:
      'Angular Materialを最新バージョンに更新してください。<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/material@6"`<br/><br/>これにより、非推奨のAPIも自動的に移行されます。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'strictPropertyInitializer',
    action:
      'TypeScriptが厳格に設定されている場合（`tsconfig.json`ファイルで`strict`を`true`に設定している場合）、`tsconfig.json`を更新して`strictPropertyInitialization`を無効にするか、プロパティの初期化を`ngOnInit`からコンストラクターに移動してください。このフラグの詳細については、<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#strict-class-initialization">TypeScript 2.7リリースノート</a>を参照してください。',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'update to RxJS 6',
    action:
      '<a href="https://github.com/ReactiveX/rxjs-tslint" target="_blank">rxjs-tslint自動更新ルール</a>を使用して、非推奨のRxJS 5機能を削除してください。<br/><br/>ほとんどのアプリケーションでは、次の2つのコマンドを実行することになります。<br/><br/>`npx rxjs-tslint`<br/>`rxjs-5-to-6-migrate -p src/tsconfig.app.json`',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Medium,
    step: 'remove rxjs-compat',
    action: 'あなたとすべての依存関係がRxJS 6に更新されたら、`rxjs-compat`を削除してください。',
  },
  {
    possibleIn: 610,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Medium,
    step: 'use files instead of versionedFiles',
    action:
      'Angular Service Workerを使用している場合は、`versionedFiles`を`files`配列に移行してください。動作は同じです。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 3.1',
    action:
      'AngularはTypeScript 3.1を使用するようになりました。潜在的な破壊的変更については、https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.htmlを参照してください。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'Node 10',
    action:
      'AngularはNode 10のサポートを追加しました: https://nodejs.org/en/blog/release/v10.0.0/',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'v7 update',
    action:
      'ターミナルで`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/cli@7 @angular/core@7`を実行して、コアフレームワークとCLIをv7に更新してください。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'v7 update',
    action:
      'ターミナルで`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/cli@7 @angular/core@7"`を実行して、コアフレームワークとCLIをv7に更新してください。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'v7 material update',
    action:
      'ターミナルで`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/material@7`を実行して、Angular Materialをv7に更新してください。アプリケーションのサイズとレイアウトの変更をテストする必要があります。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'v7 material update',
    action:
      'ターミナルで`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/material@7"`を実行して、Angular Materialをv7に更新してください。アプリケーションのサイズとレイアウトの変更をテストする必要があります。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Medium,
    material: true,
    step: 'v7 material changes',
    action:
      'スクリーンショットテストを使用している場合、多くの軽微な視覚的調整が加えられたため、スクリーンショットのゴールデンファイルを再生成する必要があります。',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v7 material deprecations',
    action:
      'リップルの`matRippleSpeedFactor`と`baseSpeedFactor`の使用をやめ、代わりにアニメーション設定を使用してください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'v8 update',
    action:
      'ターミナルで`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/cli@8 @angular/core@8`を実行して、コアフレームワークとCLIをバージョン8に更新し、変更を確認してコミットしてください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'v8 update',
    action:
      'ターミナルで`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"`を実行して、コアフレームワークとCLIをバージョン8に更新し、変更を確認してコミットしてください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'use ::ng-deep instead of /deep/',
    action:
      'スタイル内の`/deep/`を`::ng-deep`に置き換えてください。<a href="https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep">Angularコンポーネントスタイルと`::ng-deep`について詳しくはこちら</a>。`/deep/`と`::ng-deep`はどちらも非推奨ですが、シャドウピアシング子孫コンビネーターが<a href="https://www.chromestatus.com/features/6750456638341120">ブラウザとツールから完全に削除される</a>までは`::ng-deep`の使用が推奨されます。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 3.4',
    action:
      'AngularはTypeScript 3.4を使用するようになりました。<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html">型チェックの改善によって発生する可能性のあるエラーについて詳しくはこちら</a>。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'node 10',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 10以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'Differential Loading',
    action:
      'CLIのビルドコマンドは、最小限のポリフィルを含むモダンなES2015ビルドと、古いブラウザ用の互換性のあるES5ビルドを自動的に作成し、ブラウザに基づいて適切なファイルをロードするようになりました。この変更をオプトアウトするには、`tsconfig.json`で`target`を`es5`に戻してください。<a href="https://angular.io/guide/deployment#differential-loading">詳細については、angular.ioを参照してください</a>。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'CLI Telemetry',
    action:
      'CLIの新しいバージョンを使用すると、CLIの使用状況データを共有することにオプトインするかどうか尋ねられます。独自のGoogle Analyticsアカウントを追加することもできます。これにより、どのCLI機能を優先するか、改善の影響を測定するかについて、より良い決定を下すことができます。<a href="https://angular.io/analytics">詳細については、angular.ioを参照してください</a>。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'static query timing',
    action:
      '`ViewChild`または`ContentChild`を使用する場合、開発者により多くの制御を提供するために、これらのクエリの解決方法を更新しています。結果が設定される前に変更検知が実行されることを指定する必要があります。例: `@ContentChild('foo', {static: false}) foo !: ElementRef;`。`ng update`はクエリを自動的に更新しますが、互換性のためにクエリを`static`にする傾向があります。<a href="https://angular.io/guide/static-query-migration">詳細については、angular.ioを参照してください</a>。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'v8 material update',
    action:
      'ターミナルで`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/material@8`を実行して、Angular Materialをバージョン8に更新してください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'v8 material update',
    action:
      'ターミナルで`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/material@8"`を実行して、Angular Materialをバージョン8に更新してください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'deep imports',
    action:
      '`@angular/material`からインポートする代わりに、特定のコンポーネントから深くインポートする必要があります。例: `@angular/material/button`。`ng update`がこれを自動的に行います。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'new loadChildren',
    action:
      'ルーターを介した遅延読み込みモジュールの場合、<a href="https://angular.io/guide/deprecations#loadchildren-string-syntax">動的インポートを使用していることを確認してください</a>。文字列によるインポートはv9で削除されます。`ng update`がこれを自動的に処理するはずです。<a href="https://angular.io/guide/deprecations#loadchildren-string-syntax">詳細については、angular.ioを参照してください</a>。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'platform deprecated',
    action:
      '`@angular/platform-webworker`のサポートは非推奨となります。CLIとの互換性がなかったためです。Web WorkerでAngularのレンダリングアーキテクチャを実行することは、開発者のニーズを満たしませんでした。AngularでWeb Workerを使用することは引き続き可能です。<a href="https://v9.angular.io/guide/web-worker">Web Workerガイド</a>で詳細を参照してください。これが必要なユースケースがある場合は、devrel@angular.ioまでお知らせください！',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    step: 'node-sass',
    action:
      'ネイティブのSassコンパイラからJavaScriptコンパイラに切り替えました。ネイティブバージョンに戻すには、`devDependency`として`npm install node-sass --save-dev`をインストールしてください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    step: 'schematics async',
    action:
      '独自のSchematicsを構築している場合、以前は*潜在的に*非同期でした。8.0以降、すべてのSchematicsは非同期になります。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'node 10.13',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 10.13以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'cli v8 latest',
    action:
      'ワークスペースディレクトリで`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/core@8 @angular/cli@8`を実行して、`@angular/core`と`@angular/cli`の最新の8.xバージョンに更新し、これらの変更をコミットしてください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'cli v8 latest',
    action:
      'ワークスペースディレクトリで`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"`を実行して、`@angular/core`と`@angular/cli`の最新の8.xバージョンに更新し、これらの変更をコミットしてください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'create commits',
    action:
      '[ng update](https://angular.io/cli/update)コマンドに`--create-commits` (または `-C`) フラグを渡すことで、個々のマイグレーションごとにGitコミットを作成できます。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'ng update v9',
    action:
      '`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/core@9 @angular/cli@9`を実行すると、Angularのバージョン9に更新されます。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'ng update v9',
    action:
      '`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/cli@9 @angular/core@9"`を実行すると、Angularのバージョン9に更新されます。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'typescript 3.8',
    action:
      'プロジェクトがTypeScript 3.8に更新されました。新しいコンパイラチェックと、コードの修正が必要になる可能性のあるエラーについては、[TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html)または[TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)の発表を参照してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'update @angular/material',
    action: '`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/material@9`を実行してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'update @angular/material',
    action:
      '`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/material@9"`を実行してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    windows: false,
    step: 'update @nguniversal/hapi-engine',
    action:
      'Angular Universalを使用している場合、使用しているエンジンに応じて`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/hapi-engine@9`または`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/express-engine@9`を実行してください。このステップでは、サードパーティの依存関係がピア依存関係のAngularバージョンを更新していない場合、`--force`フラグが必要になることがあります。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    windows: true,
    step: 'update @nguniversal/hapi-engine',
    action:
      'Angular Universalを使用している場合、使用しているエンジンに応じて`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/hapi-engine@9"`または`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/express-engine@9"`を実行してください。このステップでは、サードパーティの依存関係がピア依存関係のAngularバージョンを更新していない場合、`--force`フラグが必要になることがあります。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'dependencies update',
    action:
      'プロジェクトが他のAngularライブラリに依存している場合、それらを最新バージョンに更新することを検討することをお勧めします。場合によっては、APIの非互換性を解決するためにこの更新が必要になることがあります。古くなったライブラリについては、`ng update`または`npm outdated`を参照してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'ivy update',
    action:
      'バージョン9への更新中に、コードベースから互換性のないAPI呼び出しや非推奨のAPI呼び出しを削除するために、必要に応じてコードマイグレーションによってプロジェクトが変換されました。これらの変更を確認し、[バージョン9への更新ガイド](https://v9.angular.io/guide/updating-to-version-9)を参照して変更の詳細を確認できます。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'stylesUpdate',
    action:
      '以前はバインドされたCSSスタイルとクラスは「最後の変更が優先される」戦略で適用されていましたが、現在は定義された優先順位に従います。[スタイルの優先順位](https://angular.io/guide/attribute-binding#styling-precedence)について詳しくはこちらを参照してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'ModuleWithProviders',
    action:
      'ライブラリの作者で、`ModuleWithProviders`を返すメソッド（通常`forRoot()`という名前のメソッド）を持っていた場合、ジェネリック型を指定する必要があります。[angular.io](https://v9.angular.io/guide/deprecations#modulewithproviders-type-without-a-generic)で詳細を参照してください。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'wtf',
    action:
      'AngularでのWebトレーシングフレームワークのサポートはバージョン8で非推奨になりました。`wtf*` APIの使用をやめるべきです。パフォーマンス追跡を行うには、[ブラウザのパフォーマンスツール](https://developers.google.com/web/tools/lighthouse/audits/user-timing)の使用をお勧めします。',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'es5browser',
    action:
      '`angular.json`内の`es5BrowserSupport`フラグを削除し、`tsconfig.json`内の`target`を`es2015`に設定してください。Angularは、ES5ビルドが必要かどうかを判断するためにbrowserslistを使用するようになりました。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'ngForm selector',
    action:
      'Angular Formsを作成するために`ngForm`要素セレクターを使用している場合、代わりに`ng-form`を使用してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'typings compilation',
    action:
      '`tsconfig.app.json`を更新し、コンパイルされるファイルを制限しました。`typings.d.ts`ファイルなど、他のファイルがコンパイルに含まれることに依存している場合は、手動でコンパイルに追加する必要があります。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'debug',
    action:
      'Angular 9ではIvyがデフォルトのレンダリングエンジンになりました。発生する可能性のある互換性の問題については、[Ivy互換性ガイド](https://v9.angular.io/guide/ivy-compatibility)を参照してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'express-universal-server',
    action:
      '`@nguniversal/express-engine`または`@nguniversal/hapi-engine`でAngular Universalを使用している場合、いくつかのバックアップファイルが作成されます。そのうちの1つは`server.ts`用です。このファイルがデフォルトのものと異なる場合、`server.ts.bak`から`server.ts`に手動で変更をコピーする必要があるかもしれません。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'ivy i18n',
    action:
      'Angular 9ではグローバルな`$localize()`関数が導入され、Angularの国際化（i18n）に依存している場合はロードする必要があります。`ng add @angular/localize`を実行して、必要なパッケージとコードの変更を追加してください。変更の詳細については、[$localizeグローバルインポートマイグレーションガイド](https://v9.angular.io/guide/migration-localize)を参照してください。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'entryComponents',
    action:
      'アプリケーションプロジェクトでは、`entryComponents` NgModulesと`ANALYZE_FOR_ENTRY_COMPONENTS`の使用を削除できます。これらはIvyコンパイラとランタイムでは不要になりました。ただし、View Engineアプリケーションで使用されるライブラリを構築する場合は、これらを保持する必要があるかもしれません。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'testbed-get',
    action:
      '`TestBed.get`を使用している場合、代わりに`TestBed.inject`を使用してください。この新しいメソッドは同じ動作をしますが、型安全です。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: '$localize',
    action:
      '[Angularのi18nサポート](http://angular.io/guide/i18n)を使用している場合、`@angular/localize`の使用を開始する必要があります。[$localizeグローバルインポートマイグレーション](https://v9.angular.io/guide/migration-localize)について詳しくはこちらを参照してください。',
  },

  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'v10 NodeJS 12',
    action:
      '<a href="https://nodejs.org/dist/latest-v12.x/" target="_blank">Node 12以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'ng update v10',
    action:
      '`npx @angular/cli@10 update @angular/core@10 @angular/cli@10`を実行すると、Angularのバージョン10に更新されます。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`npx @angular/cli@10 update @angular/material@10`を実行してください。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'browserlist',
    action:
      '新しいプロジェクトでは、`browserslist`の代わりに`.browserslistrc`というファイル名を使用します。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'v10-versions',
    action:
      'Angularは現在、`tslint` v6、`tslib` v2、および[TypeScript 3.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html)を必要とします。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'styleext',
    action:
      'Angular schematicsで`styleext`または`spec`の使用をやめてください。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'classes-without-decorators',
    action:
      'バージョン10では、Angular機能を使用し、Angularデコレーターを持たないクラスはサポートされなくなりました。[詳細はこちら](https://v10.angular.io/guide/migration-undecorated-classes)。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'injectable-definitions',
    action:
      'Angular 9以降、DIにおける`@Injectable`デコレーターの強制がより厳しくなり、不完全なプロバイダー定義の動作が異なります。[詳細はこちら](https://v9.angular.io/guide/migration-injectable)。`ng update`は自動的に移行します。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'closure-jsdoc-comments',
    action:
      'AngularのNPMパッケージには、Closure Compiler（非常に稀）で使用するために必要なjsdocコメントが含まれなくなりました。このサポートは実験的であり、一部のユースケースでのみ機能しました。代替の推奨パスがまもなく発表されます。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'forms-number-input',
    action:
      'Angularフォームを使用している場合、`number`型のinput要素は[changeイベント](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event)をリッスンしなくなりました（このイベントは値の変更ごとに必ずしも発生するわけではありません）。代わりに[inputイベント](https://developer.mozilla.org/docs/Web/API/HTMLElement/input_event)をリッスンしてください。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'forms-length-input',
    action:
      'Angularフォームのバリデーションにおいて、`minLength`および`maxLength`バリデーターは、フォームコントロールの値が数値の`length`プロパティを持っていることを確認し、その場合にのみ長さをバリデーターします。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'esm5-bundles',
    action:
      '[Angular Package Format](https://g.co/ng/apf)が更新され、`esm5`および`fesm5`形式が削除されました。これらはnpmパッケージでは配布されなくなりました。CLIを使用しない場合、Angularコードを自分でES5にダウンレベルする必要があるかもしれません。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'console-errors',
    action:
      '不明な要素に関する警告がエラーとしてログに記録されるようになりました。これによりアプリケーションが壊れることはありませんが、`console.error`を介して何もログに記録されないことを期待するツールを混乱させる可能性があります。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'router-resolver-empty',
    action:
      '`EMPTY`を返すリゾルバーはナビゲーションをキャンセルします。ナビゲーションを続行させたい場合は、リゾルバーを更新して何らかの値をemitするようにしてください（例: `defaultIfEmpty(...)`、`of(...)`など）。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'sw-vary-headers',
    action:
      'Angular Service Workerを使用し、[Vary](https://developer.mozilla.org/docs/Web/HTTP/Headers/Vary)ヘッダーを持つリソースに依存している場合、ブラウザ間での予測不能な動作を避けるために、これらのヘッダーは無視されるようになりました。これを避けるには、Service Workerを[設定](https://angular.io/guide/service-worker-config)してこれらのリソースをキャッシュしないようにしてください。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'expression-changed-after-checked-new',
    action:
      '`async`パイプを使用している場合、以前は検出されなかった`ExpressionChangedAfterItHasBeenChecked`エラーが発生する可能性があります。以前は、2つの`WrappedValues`が、それぞれのアンラップされた値が異なっていても、チェックの目的で常に「等しい」と見なされていたため、エラーが検出されなかった可能性があります。バージョン10で`WrappedValue`は削除されました。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'property-binding-change-detection',
    action:
      '`[val]=(observable | async).someProperty`のようなプロパティバインディングがある場合、`someProperty`の値が以前のemitと同一であれば、変更検知はトリガーされなくなります。これに依存している場合は、必要に応じて手動で購読し`markForCheck`を呼び出すか、参照が変更されるようにバインディングを更新してください。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'day-periods-crossing-midnight',
    action:
      '`formatDate()`または`DatePipe`と`b`または`B`フォーマットコードのいずれかを使用している場合、ロジックが更新され、深夜をまたぐ日中の期間内の時刻に一致するようになりました。これにより、英語の場合の`night`のように正しい出力がレンダリングされます。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'urlmatcher-null',
    action:
      '`UrlMatcher`を使用している場合、その型は常に`null`を返す可能性があることを反映するようになりました。',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'v10-more-details',
    action:
      '非推奨、自動マイグレーション、および変更の詳細については、[angular.ioのガイド](https://v10.angular.io/guide/updating-to-version-10)を参照してください。',
  },
  {
    possibleIn: 1020,
    necessaryAsOf: 1020,
    level: ApplicationComplexity.Medium,
    step: 'universal-baseurl',
    action:
      'Angular Universalユーザーの場合、`platform-server`を設定するために`useAbsoluteUrl`を使用している場合、`baseUrl`も指定する必要があります。',
  },

  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 ng update',
    action:
      '`ng update @angular/core@11 @angular/cli@11`を実行すると、Angularのバージョン11に更新されます。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@11`を実行してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 versions',
    action:
      'Angularは[TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/)を必要とするようになりました。`ng update`が自動的に移行します。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 browser support',
    action:
      'IE9、IE10、およびIEモバイルのサポートは削除されました。これは[v10アップデート](http://blog.angular.dev/version-10-of-angular-now-available-78960babd41#c357)で発表されました。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'webpack5 optin',
    action:
      'Yarnを使用し、`package.json`に`"resolutions": {"webpack": "^5.0.0"}`を追加することで、webpack 5の使用をオプトインできるようになりました。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'ng new strict prompt',
    action:
      '新しいプロジェクトを生成する際、厳格モードを有効にするか尋ねられます。これにより、TypeScriptとAngularコンパイラがより厳格な型チェックのために設定され、デフォルトでより小さなバンドル予算が適用されます。`--strict=true`または`--strict=false`を使用してプロンプトをスキップできます。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 router relativeLinkResolution',
    action:
      'ルーターを使用している場合、`relativeLinkResolution`のデフォルト値が`legacy`から`corrected`に変更されました。アプリケーションが以前に`ExtraOptions`で値を指定せずにデフォルトを使用し、空のパスルートの子からナビゲートする際に相対リンクを使用していた場合、`RouterModule`の設定を更新して`relativeLinkResolution`に`legacy`を明示的に指定する必要があります。詳細については、[ドキュメント](https://v11.angular.io/api/router/ExtraOptions#relativeLinkResolution)を参照してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'router initialNavigation',
    action:
      'Angularルーターでは、`initialNavigation`のv4で非推奨になったオプションが削除されました。以前`enabled`または`true`を使用していた場合は、`enabledNonBlocking`または`enabledBlocking`を選択してください。以前`false`または`legacy_disabled`を使用していた場合は、`disabled`を使用してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'routerlink preserveQueryParams',
    action:
      'Angularルーターの`routerLink`では、`preserveQueryParams`が削除されました。代わりに`queryParamsHandling="preserve"`を使用してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'routerlink queryParams typing',
    action:
      '`routerLink`の`queryParams`、`fragment`、または`queryParamsHandling`の値にアクセスしていた場合、`undefined`と`null`も受け入れるように型を緩める必要があるかもしれません。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'viewencapsulation native removed',
    action:
      'コンポーネントのビューカプセル化オプション`ViewEncapsulation.Native`は削除されました。代わりに`ViewEncapsulation.ShadowDom`を使用してください。`ng update`が自動的に移行します。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'ICU expressions typechecked',
    action:
      'i18nを使用している場合、International Components for Unicode (ICUs) 式内の式が再度型チェックされるようになりました。これにより、ICU内に現れる式でエラーが見つかった場合、コンパイルエラーが発生する可能性があります。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'forms validators asyncValidators typing',
    action:
      '`@angular/forms`パッケージのディレクティブは、以前はコンストラクターの`validators`および`asyncValidators`引数の型として`any[]`を持っていました。現在、これらの引数は適切に型付けされているため、コードがフォームのディレクティブコンストラクターの型に依存している場合、型安全性を向上させるためにいくつかの更新が必要になるかもしれません。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'forms AbstractFormControl',
    action:
      'Angular Formsを使用している場合、`AbstractFormControl.parent`の型に`null`が含まれるようになりました。`ng update`が自動的に移行しますが、コードが厳密な等価性で親を`undefined`と比較していたという稀なケースでは、親が`undefined`のままではなく明示的に`null`で初期化されるようになったため、これを`=== null`に変更する必要があります。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'platform-webworker',
    action:
      'ほとんど使用されなかった`@angular/platform-webworker`と`@angular/platform-webworker-dynamic`はv8で非推奨となり、削除されました。Web WorkerでAngularの一部を実行することは、一般的なユースケースではうまく機能しなかった実験でした。Angularは引き続き[Web Workers](https://angular.io/guide/web-worker)を強力にサポートしています。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 slice pipe typing',
    action:
      '`slice`パイプは、未定義の入力値に対して`null`を返すようになりました。これはほとんどのパイプの動作と一貫しています。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 keyvalue typing',
    action:
      '`keyvalue`パイプは、数値キーを持つ入力オブジェクトの場合、結果の型がキーの文字列表現を含むように修正されました。これは以前からそうでしたが、コードがこれを反映するように更新されただけです。パイプ出力のコンシューマーが誤った型に依存していた場合は、更新してください。この変更は、入力値が`Map`であるユースケースには影響しないため、`number`を保持する必要がある場合は、これが効果的な方法であることに注意してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 number pipe typing',
    action:
      '数値パイプ（`decimal`、`percent`、`currency`など）は、受け入れられる型を明示的に示すようになりました。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 date pipe typing',
    action: '`date`パイプは、受け入れられる型を明示的に示すようになりました。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 datetime rounding',
    action:
      'ミリ秒の小数部を含む形式で日付時刻形式の文字列を`DatePipe`に渡す場合、ミリ秒は常に最も近いミリ秒ではなく切り捨てられるようになりました。ほとんどのアプリケーションはこの変更の影響を受けません。これが望ましい動作でない場合は、`DatePipe`に渡す前に文字列を前処理してミリ秒部分を丸めることを検討してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 async pipe typing',
    action:
      '`async`パイプは、`undefined`として型付けされた入力に対して`undefined`を返すと主張しなくなりました。コードは実際には`undefined`入力に対して`null`を返していたことに注意してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 case pipe update',
    action:
      '`uppercase`および`lowercase`パイプは、falsy値を通過させなくなりました。これらは現在、`null`と`undefined`の両方を`null`にマップし、無効な入力（`0`、`false`、`NaN`）に対して例外を発生させます。これは他のAngularパイプと一致します。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 router NavigationExtras typing',
    action:
      '`NavigationExtras`でルーターを使用している場合、新しい型定義により`NavigationExtras`型の変数を渡すことができるようになりましたが、既知のプロパティのみを指定できるため、オブジェクトリテラルは許可されません。また、`Pick`内のプロパティと共通のプロパティを持たない型も受け入れません。この変更の影響を受ける場合は、それぞれの関数呼び出しで実際に使用される`NavigationExtras`のプロパティのみを指定するか、オブジェクトまたは変数に型アサーション（例: `as NavigationExtras`）を使用してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 TestBed.overrideProvider',
    action:
      'テストで`TestBed`の初期化後に`TestBed.overrideProvider`を呼び出すと、プロバイダーのオーバーライドが適用されなくなりました。この動作は他のオーバーライドメソッド（`TestBed.overrideDirective`など）と一貫していますが、それらはエラーをスローしてそれを示します。以前は`TestBed.overrideProvider`関数にこのチェックが欠けていました。このエラーが表示された場合は、`TestBed.overrideProvider`の呼び出しを`TestBed`の初期化が完了する前に移動する必要があります。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 router RouteReuseStrategy',
    action:
      'ルーターの`RouteReuseStrategy`を使用している場合、引数の順序が変更されました。以前、子ルートを評価する際に`RouteReuseStrategy#shouldReuseRoute`を呼び出すと、`future`と`current`の引数が入れ替わって呼び出されていました。`RouteReuseStrategy`が将来または現在のスナップショット状態のみに特化して依存している場合、`shouldReuseRoute`の実装における`future`と`current`の`ActivateRouteSnapshots`の使用を更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 locale data readonly',
    action:
      'ロケールデータ配列を使用している場合、このAPIは読み取り専用配列を返すようになりました。それらを変更していた場合（例: `sort()`、`push()`、`splice()`などを呼び出していた場合）、コードはコンパイルされなくなります。配列を変更する必要がある場合は、コピーを作成し（例: `slice()`を呼び出す）、そのコピーを変更する必要があります。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 CollectionChangeRecord',
    action:
      '変更検知において、`CollectionChangeRecord`は削除されました。代わりに`IterableChangeRecord`を使用してください。',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 forms async validators',
    action:
      '`FormControl`、`FormGroup`、または`FormArray`のクラスインスタンスで初期化時に定義された非同期バリデーターを持つAngular Formsを使用している場合、以前は非同期バリデーターが完了してもステータス変更イベントが発行されませんでした。これが変更され、ステータスイベントが`statusChanges`オブザーバブルに発行されるようになりました。コードが古い動作に依存している場合、この追加のステータス変更イベントをフィルタリング/無視できます。',
  },

  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 ng update',
    action:
      '`ng update @angular/core@12 @angular/cli@12`を実行すると、Angularのバージョン12に更新されます。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@12`を実行してください。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 versions',
    action:
      'Angularは[TypeScript 4.2](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/)を必要とするようになりました。`ng update`が自動的に更新します。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 browser support',
    action:
      'IE11のサポートは非推奨になりました。[IE11削除に関するRFC](https://github.com/angular/angular/issues/41840)で詳細を確認してください。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 minimum  Node.js version',
    action: 'Node.jsバージョン10以前ではAngularを使用できなくなりました。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 `XhrFactory` relocation',
    action: '`XhrFactory`のインポートを`@angular/common/http`から`@angular/common`に変更してください。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 i18n message ids',
    action:
      'レガシーなi18nメッセージIDに依存している場合は、`localize-migrate`ツールを使用して[それらから移行してください](https://angular.io/guide/migration-legacy-message-id)。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 deprecates `emitDistinctChangesOnly`',
    action:
      '`@ContentChildren`および`@ViewChildren`クエリを設定するために`emitDistinctChangesOnly`を使用している場合、以前の動作に合わせるためにその値を`false`に更新する必要があるかもしれません。v12では`emitDistinctChangesOnly`のデフォルト値は`true`であり、将来のリリースでは不要な変更のトリガーを防ぐためにこの設定オプションを削除する予定です。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 prod by default',
    action:
      'プロダクションビルドをデフォルトで有効にするためのオプションのマイグレーションを`ng update @angular/cli@12 --migrate-only production-by-default`で実行できます。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 min and max form attributes',
    action:
      'Angularフォームを使用している場合、`<input type="number">`の`min`および`max`属性がバリデーションロジックをトリガーするようになりました。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `emitEvent` in `FormArray` and `FormGroup`',
    action:
      'アプリケーションに`FormArray`または`FormGroup`クラスを拡張し、上記のメソッドをオーバーライドするカスタムクラスがある場合、実装を更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 zone.js minimum version',
    action:
      'zone.jsをバージョン0.11.4に更新してください。`ng update`がこの依存関係を自動的に更新します。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `HttpParams` method params update',
    action:
      '`HttpParams`クラスを拡張している場合、パラメータ型の変更を反映するためにそのメソッドのシグネチャを更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `routerLinkActiveOptions`',
    action:
      '`RouterLinkActive`の`routerLinkActiveOptions`プロパティがより具体的な型を持つようになりました。このプロパティにアクセスするコードを、変更に合わせて更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `APP_INITIALIZER` callback types',
    action:
      '初期化コールバックがより具体的な戻り値の型を持つようになりました。`Injector.get`または`TestBed.inject`を介して`APP_INITIALIZER`インスタンスを取得している場合、コードの更新が必要になるかもしれません。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 fragment typings',
    action:
      'ルーターのフラグメントが`null`になる可能性があります。TypeScriptが型エラーで失敗するのを避けるために、`null`チェックを追加してください。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `ng.getDirectives`',
    action:
      '特定のDOMノードに関連付けられたディレクティブが見つからない場合に`ng.getDirectives`がエラーをスローすることに依存しないようにしてください。',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `optimization.styles.inlineCritical`',
    action:
      '`angular.json`ファイルの`optimization.styles.inlineCritical`オプションを確認してください。これはデフォルトで`true`になりました。`optimization`オプション全体をブール値として設定すると、すべてのサブオプションがデフォルトに設定されることに注意してください。',
  },

  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'v13 ng update',
    action:
      '`ng update @angular/core@13 @angular/cli@13`を実行すると、Angularのバージョン13に更新されます。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@13`を実行してください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 4.4',
    action:
      'AngularはTypeScript 4.4を使用するようになりました。潜在的な破壊的変更については、https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.htmlを参照してください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'v13 node',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 12.20.0以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 routerLink',
    action:
      '`undefined`と`null`を渡すことで、`routerLink`のナビゲーションを無効にできるようになりました。以前は、`routerLink`ディレクティブはこれら2つの値を空文字列と同等として受け入れていました。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 router loadChildren',
    action:
      '`loadChildren`に文字列値を設定して遅延読み込みルートを指定することはできなくなりました。動的なESMインポートステートメントに移行するようにしてください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 service worker activated',
    action:
      '`SwUpdate`の`activated`オブザーバブルは非推奨になりました。Service Workerのアクティベーションステータスを確認するには、代わりに`activatedUpdate`メソッドを使用してください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 service worker available',
    action:
      '`SwUpdate`の`available`オブザーバブルは非推奨になりました。同じ情報を取得するには、`versionUpdates`を使用し、`VersionReadyEvent`イベントのみをフィルタリングしてください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 renderModuleFactory',
    action:
      '`@angular/platform-server`の`renderModuleFactory`はIvyでは不要になりました。代わりに`renderModule`を使用してください。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 forms status',
    action:
      '`AbstractControl.status`の型を`FormControlStatus`に、`AbstractControl.status`を`Observable<FormControlStatus>`に絞り込みました。`FormControlStatus`は、フォームコントロールのすべての可能なステータス文字列のユニオンです。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 router serializer',
    action:
      'URI仕様に合わせるため、URLシリアライザーはクエリパラメータ内の疑問符を尊重するようになりました。例えば、`/path?q=hello?&q2=2`は`{ q: `hello?`, q2: 2 }`としてパースされます。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 host binding',
    action:
      '`href`は属性バインディングになりました。これは、`DebugElement.properties[\'href\']`が、`routerLink`の`href`プロパティの内部値ではなく、ネイティブ要素によって返される`href`値を返すことを意味します。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 spy location',
    action:
      '`SpyLocation`は`location.go`が呼び出されても`popstate`イベントを発行しなくなりました。さらに、`simulateHashChange`は`hashchange`と`popstate`の両方をトリガーするようになりました。`location.go`に依存するテストは、`popstate`を捕捉するために`simulateHashChange`を使用する必要がある可能性が高いです。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    ngUpgrade: true,
    step: 'v13 router URL replacement',
    action:
      '新しいナビゲーションが進行中のナビゲーションをキャンセルした場合、ルーターはブラウザのURLを置き換えなくなります。Angularルーターによって処理された初期ナビゲーションで`navigationId`が存在することに依存するハイブリッドアプリケーションは、`NavigationCancel`イベントを購読し、`location.replaceState`を実行して`navigationId`を`Router`の状態に追加する必要があります。さらに、`SpyLocation`で`urlChanges`をアサートするテストは、トリガーされなくなった`replaceState`を考慮するように調整する必要があるかもしれません。',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 removed symbols',
    action:
      'ルートパッケージは`SpyNgModuleFactoryLoader`と`DeprecatedLoadChildren`をエクスポートしなくなりました。これらを使用している場合は、対応するインポートステートメントを削除してください。',
  },

  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'v14 ng update',
    action:
      '`ng update @angular/core@14 @angular/cli@14`を実行すると、Angularのバージョン14に更新されます。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@14`を実行してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 4.6',
    action:
      'AngularはTypeScript 4.6を使用するようになりました。潜在的な破壊的変更については、https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/を参照してください。',
  },

  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'v14 node',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 14.15.0以降</a>を使用していることを確認してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 strict forms',
    action:
      'フォームモデルはジェネリック型パラメータを必要とするようになりました。段階的な移行のために、フォームモデルクラスの型なしバージョンを使用してオプトアウトできます。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 aotSummaries',
    action: 'AngularはIvyで`aotSummaries`を必要としなくなったため、`TestBed`から`aotSummaries`を削除してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    material: true,
    step: 'v14 MatVertical and Horizontal Stepper',
    action:
      '`MatVerticalStepper`または`MatHorizontalStepper`を使用している場合は、`MatStepper`に切り替えるようにしてください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 JSONP',
    action:
      'JSONPリクエストからヘッダーを削除してください。JSONPはヘッダーをサポートしておらず、指定された場合、HTTPモジュールはそれらを無視するのではなくエラーをスローするようになりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 resolvers',
    action:
      'リゾルバーは、オブザーバブルによって最初に発行された値を受け取り、その後ナビゲーションに進むようになりました。これは、最後に発行された値を受け取るのではなく、他のガードとよりよく整合するためです。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 deprecate protractor entry',
    action: '非推奨の`angular/cdk/testing/protractor`エントリポイントは削除されました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 chipInput',
    action: '`MatChipInputEvent`の`chipInput`は必須になったため、必ず指定してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 mixinErrorState',
    action:
      '`mixinErrorState`を使用する抽象化では、ミキシンが`stateChanges`クラスメンバーを提供しなくなったため、これを実装する必要があります。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 CdkStepper orientation',
    action: '`CdkStepper._orientation`の代わりに`CdkStepper.orientation`を使用してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 CdkStepper and MatStepper',
    action:
      'コンストラクターで`CdkStepper`または`MatStepper`を拡張または使用している場合、`_document`パラメータは削除されたため、渡すべきではありません。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 mat-list-item-avatar',
    action: '`mat-list-item-avatar` CSSクラスを`mat-list-item-with-avatar`にリネームしてください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 MatSelectionListChange.option',
    action: '`MatSelectionListChange.option`の代わりに`MatSelectionListChange.options`を使用してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 getHarnessLoaderForContent',
    action:
      '`getHarnessLoaderForContent`の代わりに`getChildLoader(MatListItemSection.CONTENT)`を使用してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 MatSelectionList',
    action:
      '`MatSelectionList`を使用している場合、コンストラクターで`_focusMonitor`を渡すようにしてください。これは必須になりました。さらに、このクラスは`tabIndex`プロパティと`tabIndex`コンストラクターパラメータを持たなくなりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 initialNavigation',
    action: '`initialNavigation: \'enabled\'`を`initialNavigation: \'enabledBlocking\'`に更新してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 Route.pathMatch',
    action:
      '`pathMatch`でルートを定義している場合、明示的に`Route`または`Routes`にキャストする必要があるかもしれません。`Route.pathMatch`は`string`型と互換性がなくなりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 stricter LoadChildrenCallback',
    action:
      '`LoadChildrenCallback`によって返されるPromiseは、`any`ではなく、より厳密な型パラメータ`Type<any>|NgModuleFactory<any>`を持つようになりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 router scheduling',
    action:
      'ルーターは`setTimeout`内でリダイレクトナビゲーションをスケジュールしなくなりました。テストがこの動作に依存しないようにしてください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 LocationStrategy',
    action:
      '`LocationStrategy`インターフェースを実装するには、`getState()`の定義が必要になりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 http queries',
    action:
      'クエリの一部として`+`を送信する際に、`+`がスペースを送信しなくなったため、回避策は不要になりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 AnimationDriver.getParentElement',
    action: '`AnimationDriver`を実装するには、`getParentElement`メソッドが必要になりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 invalid config',
    action:
      '遅延読み込みモジュールの無効なルート設定は、無視されるのではなくエラーをスローするようになりました。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 router resolver',
    action:
      'ファクトリーリゾルバーが不要になったため、`RouterOutletContract.activateWith`関数から`resolver`を、`OutletContext`クラスから`resolver`を削除してください。',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 initialUrl',
    action:
      '`Router.initialUrl`は、`string`値を割り当てることによるAPIの誤用を防ぐため、`UrlTree`のみを受け入れるようになりました。',
  },

  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 node support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのNode.jsを使用していることを確認してください。Angular v15はNode.jsバージョン14.20.x、16.13.x、18.10.xをサポートしています。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-01" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ts support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのTypeScriptを使用していることを確認してください。Angular v15はTypeScriptバージョン4.8以降をサポートしています。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-02" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ng update',
    action:
      'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@15 @angular/cli@15`を実行して、アプリケーションをAngular v15に更新してください。',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'V15 update @angular/material',
    action: 'Materialコンポーネントを更新するには、`ng update @angular/material@15`を実行してください。',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 keyframe',
    action:
      'v15では、AngularコンパイラはCSSの`@keyframes`にコンポーネントのスコープをプレフィックスとして追加します。これは、`keyframes`名に依存するTypeScriptコードがv15では動作しなくなることを意味します。そのようなインスタンスを更新して、キーフレームをプログラムで定義するか、グローバルスタイルシートを使用するか、コンポーネントのビューカプセル化を変更してください。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-03" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 no-ivy',
    action:
      'アプリケーションの`tsconfig.json`ファイルから`enableIvy`を削除してください。v15では、Ivyが唯一のレンダリングエンジンであるため、`enableIvy`は不要です。',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 base-decorators',
    action:
      'コンストラクターを継承し、依存性の注入を使用する子クラスを持つ基底クラスでは、デコレーターを使用するようにしてください。そのような基底クラスは`@Injectable`または`@Directive`のいずれかで装飾されている必要があります。そうでない場合、コンパイラはエラーを返します。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-05" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 setDisabledState',
    action:
      'v15では、`ControlValueAccessor`がアタッチされると常に`setDisabledState`が呼び出されます。この動作をオプトアウトするには、`FormsModule.withConfig`または`ReactiveFormsModule.withConfig`を使用してください。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-06" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Advanced,
    step: 'v15 canParse',
    action:
      '`canParse`を使用するアプリケーションは、代わりに`@angular/localize/tools`の`analyze`を使用すべきです。v15では、`canParse`メソッドは`@angular/localize/tools`のすべての翻訳パーサーから削除されました。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-07" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ActivatedRoutSnapshot',
    action:
      'すべての`ActivatedRouteSnapshot`オブジェクトに`title`プロパティがあることを確認してください。v15では、`title`プロパティは`ActivatedRouteSnapshot`の必須プロパティです。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-08" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Advanced,
    step: 'v15 RouterOutlet',
    action:
      '`RouterOutlet`を使用するテストが壊れた場合、変更検知に対する対応するコンポーネントのインスタンス化順序に依存していないことを確認してください。v15では、`RouterOutlet`は変更検知後にコンポーネントをインスタンス化します。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-09" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 relativeLinkResolution',
    action:
      'v15では、`relativeLinkResolution`はルーターで設定できません。これは、以前のバグ修正からオプトアウトするために使用されていましたが、現在は標準となっています。<a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-10" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 DATE_PIPE_DEFAULT_OPTIONS',
    action:
      'タイムゾーンを設定するために、`DATE_PIPE_DEFAULT_TIMEZONE`トークンのインスタンスを`DATE_PIPE_DEFAULT_OPTIONS`を使用するように変更してください。v15では、`DATE_PIPE_DEFAULT_TIMEZONE`トークンは非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-01" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 iframe',
    action:
      '既存の`<iframe>`インスタンスには、属性またはプロパティバインディングとしてセキュリティに敏感な属性が適用されている可能性があります。これらのセキュリティに敏感な属性は、テンプレートまたはディレクティブのホストバインディングで発生する可能性があります。このような発生は、`<iframe>`バインディングに関する新しいより厳格なルールへの準拠を確実にするために更新が必要です。詳細については、[エラーページ](https://v15.angular.io/errors/NG0910)を参照してください。',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 Injector.get',
    action:
      '`InjectFlags`パラメータを使用する`Injector.get()`のインスタンスを、`InjectOptions`パラメータを使用するように更新してください。`Injector.get()`の`InjectFlags`パラメータはv15で非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-02" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 TestBed.inject',
    action:
      '`InjectFlags`パラメータを使用する`TestBed.inject()`のインスタンスを、`InjectOptions`パラメータを使用するように更新してください。`TestBed.inject()`の`InjectFlags`パラメータはv15で非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-01" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 ngModule in providedIn',
    action:
      '`@Injectable`および`InjectionToken`に対して`providedIn: ngModule`を使用することはv15で非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-04" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 providedIn any',
    action:
      '`@Injectable`または`InjectionToken`に対して`providedIn: \'any\'`を使用することはv15で非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-05" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 RouterLinkWithHref',
    action:
      '`RouterLinkWithHref`ディレクティブのインスタンスを`RouterLink`ディレクティブを使用するように更新してください。`RouterLinkWithHref`ディレクティブはv15で非推奨です。<a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-06" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'v15 mat refactor',
    action:
      'Angular Material v15では、多くのコンポーネントが公式のMaterial Design Components for Web (MDC) に基づくようにリファクタリングされました。この変更は、多くのコンポーネントのDOMとCSSクラスに影響を与えました。<a href="https://rc.material.angular.dev/guide/mdc-migration" alt="Link to more information about this change">詳細はこちら</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 visual review',
    action:
      'アプリケーションをv15に更新した後、アプリケーションとそのインタラクションを視覚的に確認し、すべてが正常に動作していることを確認してください。',
  },

  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 node support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのNode.jsを使用していることを確認してください。Angular v16はNode.jsバージョンv16およびv18をサポートしています。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ts support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのTypeScriptを使用していることを確認してください。Angular v16はTypeScriptバージョン4.9.3以降をサポートしています。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ng update',
    action:
      'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@16 @angular/cli@16`を実行して、アプリケーションをAngular v16に更新してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@16`を実行してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 zone.js support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのZone.jsを使用していることを確認してください。Angular v16はZone.jsバージョン0.13.x以降をサポートしています。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 RouterEvent',
    action:
      'Eventユニオンに`RouterEvent`が含まれなくなりました。これは、Event型を使用している場合、型定義を`(e: Event)`から`(e: Event|RouterEvent)`に変更する必要があるかもしれないことを意味します。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 routerEvent prop type',
    action:
      '`NavigationEnd`に加えて、`routerEvent`プロパティは`NavigationSkipped`型も受け入れるようになりました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 RendererType2',
    action:
      '`RendererType2.styles`にはフラットな配列のみを渡してください。ネストされた配列は受け入れられなくなりました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 BrowserPlatformLocation',
    action:
      '`MockPlatformLocation`がテストでデフォルトで提供されるようになったため、`BrowserPlatformLocation`を使用するテストを更新する必要があるかもしれません。<a href="https://github.com/angular/angular/blob/main/CHANGELOG.md#common-9">詳細はこちら</a>。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ngcc',
    action:
      'v16でAngular Compatibility Compiler (ngcc) が削除されたため、v16以降のプロジェクトではView Engineライブラリがサポートされなくなりました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 createUrlTree',
    action:
      '`Router.createUrlTree`のバグ修正後、`ActivatedRoute`をモックするテストを再調整する必要があるかもしれません。<a href="https://github.com/angular/angular/blob/main/CHANGELOG.md#1600-2023-05-03">詳細はこちら</a>。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ApplicationConfig imports',
    action: '`ApplicationConfig`のインポートを`@angular/core`から行うように変更してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 renderModule',
    action:
      '`renderModuleFactory`は削除されたため、`renderModule`を使用するようにコードを修正してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 XhrFactory',
    action:
      '`@angular/common/http`からの`XhrFactory`エクスポートではなく、`@angular/common`からの`XhrFactory`を使用するようにコードを修正してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 withServerTransition',
    action:
      '同じページで複数のAngularアプリケーションを実行していて、`BrowserModule.withServerTransition({ appId: \'serverApp\' })`を使用している場合、`withServerTransition`が非推奨になったため、代わりに`APP_ID`を設定するようにしてください。<a href="https://github.com/angular/angular/blob/main/CHANGELOG.md#platform-browser-4">詳細はこちら</a>。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 EnvironmentInjector',
    action:
      '`EnvironmentInjector.runInContext`を`runInInjectionContext`に変更し、環境インジェクターを最初のパラメータとして渡してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ViewContainerRef.createComponent',
    action:
      'ファクトリーリゾルバーなしで`ViewContainerRef.createComponent`を使用するようにコードを更新してください。`ComponentFactoryResolver`はルーターAPIから削除されました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 APP_ID',
    action: '同じページで複数のアプリケーションをブートストラップする場合、一意の`APP_ID`を設定するようにしてください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 server renderApplication',
    action:
      '`renderApplication`メソッドを修正するようにコードを更新してください。このメソッドは、最初の引数としてルートコンポーネントを受け入れなくなり、代わりにアプリケーションをブートストラップするコールバックを受け入れるようになりました。<a href="https://github.com/angular/angular/blob/main/CHANGELOG.md#platform-server-3">詳細はこちら</a>。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 PlatformConfig.baseUrl',
    action:
      '`PlatformConfig.baseUrl`および`PlatformConfig.useAbsoluteUrl`プラットフォームサーバー設定オプションへの参照は非推奨になったため、コードから削除してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 moduleid',
    action:
      '`@Directive`/`@Component`の`moduleId`プロパティへの参照は効果がなく、v17で削除されるため、コードから削除してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 transfer state imports',
    action:
      '`import {makeStateKey, StateKey, TransferState} from \'@angular/platform-browser\'`からのインポートを`import {makeStateKey, StateKey, TransferState} from \'@angular/core\'`に変更してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ComponentRef',
    action:
      '`Object.is`の等価性チェックに基づいて同じであっても、コンポーネント入力の設定に`ComponentRef.setInput`に依存している場合、その値をコピーするようにしてください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ANALYZE_FOR_ENTRY_COMPONENTS',
    action:
      '`ANALYZE_FOR_ENTRY_COMPONENTS`注入トークンは削除されたため、コードからその参照を削除してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 entry components',
    action:
      '`entryComponents`は利用できなくなり、`@NgModule`および`@Component`の公開APIからその参照を削除できます。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ngTemplateOutletContext',
    action:
      '`ngTemplateOutletContext`はより厳密な型チェックを行うようになり、対応するオブジェクト内のすべてのプロパティを宣言する必要があります。<a href="https://github.com/angular/angular/blob/main/CHANGELOG.md#common-1">詳細はこちら</a>。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 APF',
    action:
      'AngularパッケージにはFESM2015が含まれなくなり、配布されるECMAScriptは2020から2022に更新されました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 EventManager',
    action:
      '非推奨の`EventManager`メソッド`addGlobalEventListener`は、Ivyで使用されないため削除されました。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 BrowserTransferStateModule',
    action:
      '`BrowserTransferStateModule`は利用できなくなり、アプリケーションからその参照を削除できます。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ReflectiveInjector',
    action:
      '`ReflectiveInjector`は削除されたため、`ReflectiveInjector`の代わりに`Injector.create`を使用するようにコードを更新してください。',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 QueryList',
    action:
      '`QueryList.filter`は型ガード関数をサポートするようになりました。型が絞り込まれるため、古い動作に依存するアプリケーションコードを更新する必要があるかもしれません。',
  },

  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 node support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのNode.jsを使用していることを確認してください。Angular v17はNode.jsバージョンv18.13.0以降をサポートしています。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 ts support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのTypeScriptを使用していることを確認してください。Angular v17はTypeScriptバージョン5.2以降をサポートしています。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 zone.js support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのZone.jsを使用していることを確認してください。Angular v17はZone.jsバージョン0.14.x以降をサポートしています。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 ng update',
    action:
      'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@17 @angular/cli@17`を実行して、アプリケーションをAngular v17に更新してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@17`を実行してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 style removal',
    action:
      'Angularは破棄されたコンポーネントのスタイルを自動的に削除するようになりました。これにより、スタイルリークに依存している既存のアプリに影響を与える可能性があります。これを変更するには、`REMOVE_STYLES_ON_COMPONENT_DESTROY`プロバイダーの値を`false`に更新してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 router removals',
    action:
      '`setupTestingRouter`、`canceledNavigationResolution`、`paramsInheritanceStrategy`、`titleStrategy`、`urlUpdateStrategy`、`urlHandlingStrategy`、および`malformedUriErrorHandler`は`Router`の公開APIの一部ではなくなったため、`provideRouter`または`RouterModule.forRoot`でこれらを設定するようにしてください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 ngDoCheck dynamic components',
    action:
      '動的にインスタンス化されたコンポーネントの場合、コンポーネントがダーティとしてマークされている場合、変更検知中に`ngDoCheck`を実行するようになりました。動的にインスタンス化されたコンポーネントのテストまたは`ngDoCheck`内のロジックを更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 malformedUriErrorHandler',
    action:
      'URL解析エラーは`malformedUriErrorHandler`ではなく`UrlSerializer.parse`で処理してください。これは現在公開APIの一部です。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 zone deep imports',
    action:
      '`zone.js/bundles/zone-testing.js`や`zone.js/dist/zone`のようなZone.jsのディープインポートを`zone.js`と`zone.js/testing`に変更してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 absolute redirects',
    action:
      '絶対リダイレクト後に無限リダイレクトを防ぐために、ルーター設定を調整する必要があるかもしれません。v17では、絶対リダイレクト後の追加のリダイレクトは防止されなくなりました。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 AnimationDriver',
    action:
      '`AnimationDriver.NOOP`は非推奨になったため、`AnimationDriver.NOOP`への参照を`NoopAnimationDriver`を使用するように変更してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 switch strictness',
    action:
      '`NgSwitch`の等価性チェックを調整する必要があるかもしれません。これは現在、`==`ではなく`===`によるより厳密なチェックがデフォルトになったためです。Angularは、調整が必要な使用箇所に対して警告メッセージをログに記録します。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 mutate in signals',
    action:
      'Angular Signalsでは`mutate`の代わりに`update`を使用してください。例えば、`items.mutate(itemsArray => itemsArray.push(newItem));`は`items.update(itemsArray => [itemsArray, …newItem]);`となります。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 withNoDomReuse',
    action:
      'ハイドレーションを無効にするには、`ngSkipHydration`を使用するか、`withNoDomReuse`が公開APIの一部ではなくなったため、プロバイダーリストから`provideClientHydration`の呼び出しを削除してください。',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 paramsInheritanceStrategy',
    action:
      '`loadComponent`ルートの子ルートが親からデータを継承するようにしたい場合は、`paramsInheritanceStrategy`を`always`に指定してください。v17では、これが`emptyOnly`に設定されています。',
  },

  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: 'v18 node support',
    action:
      'アプリケーションをアップグレードする前に、サポートされているバージョンのNode.jsを使用していることを確認してください。Angular v18はNode.jsのv18.19.0以降のバージョンをサポートしています。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: 'v18 ng update',
    action:
      'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@18 @angular/cli@18` を実行して、アプリケーションをAngular v18にアップデートします。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@18` を実行します。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: '18.0.0 Upgrade TypeScript',
    action: 'TypeScriptをバージョン5.4以降にアップデートしてください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: async has been removed, use `waitForAsync` instead',
    action: '`angular/core`の `async` を `waitForAsync` に置き換えてください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Deprecated matchesElement method removed from AnimationDriver',
    action: '`matchesElement` の呼び出しを削除してください。これは `AnimationDriver` の一部ではなく なりました。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Use `@angular/core` StateKey and TransferState',
    action:
      '`StateKey` と `TransferState` を `@angular/platform-browser` ではなく `@angular/core` からインポートしてください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Opt-out of caching for HTTP requests with auth headers',
    action:
      '`withHttpTransferCache` で `includeRequestsWithAuthHeaders: true` を使用すると、認証が必要な HTTP リクエストのキャッシュをオプトアウトすることができます。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0.REMOVE_OBSOLETE_IS_WORKER',
    action:
      '`isPlatformWorkerUi`と`isPlatformWorkerApp`はWebWorkerプラットフォームの一部であり、現在はAngularの一部ではないため、アプリケーションを更新して削除してください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0.FORCE_ZONE_CHANGE_DETECTION',
    action:
      'テストは、テストの状態を DOM に完全に反映させるために、追加の変更検出を実行するかもしれません。最後の手段として、以前の挙動に戻すには、TestBed プロバイダーに `provideZoneChangeDetection({ignoreChangesOutsideZone: true})` を追加します。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Remove two-way binding expressions in writable bindings',
    action: 'テンプレート内で `[(ngModel)]` を使ってプロパティに書き込む式を削除してください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Use zones to track pending requests',
    action:
      '`Testability` のメソッド `increasePendingRequestCount`、`decreasePendingRequestCount`、`getPendingRequestCount` の呼び出しを削除してください。この情報は ZoneJS によって追跡されます。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Move shared providers to the routed component',
    action:
      '`RouterOutlet` を定義するコンポーネントから `bootstrapApplication` または `Route` config のプロバイダーに、ルーティングされたコンポーネントが利用できる環境プロバイダーを移動させてください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0 Use RedirectCommand or new NavigationBehaviorOptions',
    action:
      'ガードが `UrlTree` をリダイレクトとして返すとき、最初のナビゲーションが `replaceUrl` オプションも使用していた場合、リダイレクト先のナビゲーションは `replaceUrl` を使用するようになりました。以前の挙動を好む場合は、新しい `NavigationBehaviorOptions` を使用してリダイレクトを設定し、`UrlTree` の代わりに必要なオプションを指定して `RedirectCommand` を返してください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Remove deprecated resource cache providers',
    action:
      '`RESOURCE_CACHE_PROVIDER`の依存オブジェクトを削除しました。これは Angular ランタイムの一部ではなくなったためです。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Update Node.js URL parsing in `ServerPlatformLocation`',
    action:
      '`angular/platform-server`では、パス名の末尾に常に `/` が付くようになり、http: と https: のデフォルトポートはそれぞれ 80 と 443 になりました。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Use absolute URLs',
    action:
      '`PlatformConfig` から `useAbsoluteUrl` と `baseUrl` を使用する代わりに、絶対 `url` を提供しましょう。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. Switch from `platformDynamicServer` to `platformServer`.',
    action:
      '`platformDynamicServer` の使い方を `platformServer` に置き換えてください。また、`import @angular/compiler` を追加してください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Remove `ServerTransferStateModule` from app imports',
    action:
      'アプリケーションから `ServerTransferStateModule` のインポートをすべて削除します。これはもう必要ありません。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. Update `Route.redirectTo` to accept functions',
    action:
      '`Route.redirectTo`に文字列の他に関数を含めることができるようになりました。`Route` オブジェクトを直接読み込み、`redirectTo` が文字列であることを期待するコードは、関数にも対応するように更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Guards can return `RedirectCommand`',
    action:
      '`Route` ガードとリゾルバーは `UrlTree` と `boolean` に加えて `RedirectCommand` オブジェクトを返すことができるようになりました。`Route` オブジェクトを直接読み込んで `boolean` または `UrlTree` だけを期待するコードは、`RedirectCommand` も考慮するように更新する必要があるかもしれません。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Mark `OnPush` views dirty',
    action:
      '`OnPush` 変更検出を使用しているコンポーネントについては、ホストバインディングの更新を有効にするために、適切にダーティマークされていることを確認してください。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0-Refresh-Newly-Created-Views',
    action:
      '新しく作成されたビューや、変更検出中にチェックマークが付けられ、再度アタッチされたビューは、同じ変更検出サイクルでリフレッシュされることが保証されるようになりました。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: `ComponentFixture.whenStable` matches `ApplicationRef.isStable`',
    action:
      '`ComponentFixture.whenStable` と `ApplicationRef.isStable` のセマンティクスを調整した結果、`whenStable` を使用するとテストの待ち時間が長くなることがあります。',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. `ComponentFixture.autoDetect` behavior more closely matches Application behavior',
    action:
      '`ComponentFixture.autoDetect` が `ApplicationRef.tick` 内のフィクスチャの変更検出を実行するようになったため、`ComponentFixture.autoDetect` を使用しているときに変更検出の実行順序に依存しているテストがあると、テストに失敗することがあります。たとえば、これによってテストフィクスチャは、これまではその逆であったかもしれませんが、作成するダイアログの前にリフレッシュされます。',
  },
  {
    action:
      'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@19 @angular/cli@19` を実行し、アプリケーションをAngular v19に更新してください。',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_ng_update',
  },
  {
    possibleIn: 1900,
    necessaryAsOf: 1900,
    level: ApplicationComplexity.Basic,
    material: true,
    step: '@angular/material をアップデートしてください。',
    action: '`ng update @angular/material@19` を実行します。',
  },
  {
    action:
      'Angularディレクティブ、コンポーネント、パイプはデフォルトでスタンドアロンになりました。現在NgModuleで宣言されている宣言には "standalone: false" を指定してください。Angular CLIは自動的にコードを更新します。',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-standalone-declarations',
  },
  {
    action:
      'テンプレート参照変数にアクセスする際にthis.プレフィックスを削除してください。例えば、`<div #foo></div>{{ this.foo }}`を`<div #foo></div>{{ foo }}`にリファクタリングしてください。',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-this',
  },
  {
    action:
      '`BrowserModule.withServerTransition()`の使用を、アプリケーションの`id`を設定するための`APP_ID`トークンの注入に置き換えてください。',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-browser-module-with-server-transition',
  },
  {
    action: '`KeyValueDiffers`の`factories`プロパティは削除されました。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-key-value-differs-factories',
  },
  {
    action:
      'angular.jsonで、`@angular/localize`ビルダーの"name"オプションを"project"に置き換えてください。',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_localize_builder_project_option',
  },
  {
    action: '`ExperimentalPendingTasks`を`PendingTasks`に名前変更します。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_rename_experimental_pending_tasks',
  },
  {
    action:
      '`Promise` のタイミングに依存していたエフェクトのテストを更新し、`await whenStable()` を使用するか、`.detectChanges()` を呼び出してエフェクトをトリガーするようにします。変更検出中にトリガーされるエフェクトについては、アプリケーションが完全にレンダリングされることに依存していないことを確認するか、`afterRenderEffect()` の使用を検討してください。フェイククロックを使用するテストでは、クロックを高速化/フラッシュする必要がある場合があります。',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0.1',
  },
  {
    action: 'TypeScriptバージョン5.5以降に更新してください。',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0.2',
  },
  {
    action:
      '`fakeAsync` を使用したテストを更新します。変更がAngularゾーン外で発生した場合（ハイブリッドモードのスケジュール）、ゾーンの連結とスケジュールの特定のタイミングに依存するテストは、これらのタイマーが現在`tick`と`flush`の影響を受けるためです。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-timers-in-zone',
  },
  {
    action:
      '`createComponent` API を使用し、最初の `ng-content` にコンテンツを渡さない場合、デフォルトのフォールバックコンテンツのレンダリングを防ぐために、`projectableNode` として `document.createTextNode('')` を指定してください。',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-render-default-fallback',
  },
  {
    action:
      'カスタム要素周辺の変更検知の特定のタイミングまたは順序に依存するテストを更新します。ハイブリッドスケジューラへの切り替えにより、タイミングが変更されている可能性があるためです。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-hybrid-scheduler-timing',
  },
  {
    action:
      '`Router.errorHandler`から`provideRouter`の`withNavigationErrorHandler`または`RouterModule.forRoot`の`errorHandler`へ移行します。',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-router-error-handler',
  },
  {
    action:
      '`ApplicationRef.tick`実行中に発生したエラーを、変更検知を同期的にトリガーするか、未処理の`ComponentFixture.whenStable` のPromiseを拒否することで処理するように、テストを更新します。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-testbed-error-handling',
  },
  {
    action: '`Resolve`インターフェースの使用を更新して、戻り値の型に`RedirectCommand`を含めます。',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-update-resolve-interface-return-type',
  },
  {
    action:
      '`fakeAsync`はデフォルトで保留中のタイマーをフラッシュします。以前の動作が必要なテストでは、オプションパラメーターに明示的に`{flush: false}`を渡してください。',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-update-fakeasync-to-flush-pending-timers',
  },
  {
      action:
        'アプリケーションのプロジェクトディレクトリで、`ng update @angular/core@20 @angular/cli@20` を実行して、アプリケーションをAngular v20に更新します。',
      level: ApplicationComplexity.Basic,
      necessaryAsOf: 2000,
      possibleIn: 2000,
      step: '20.0.0_ng_update',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Basic,
      material: true,
      step: 'update @angular/material',
      action: '`ng update @angular/material@20` を実行します。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Basic,
      step: '20.0.0_rename_afterRender_to_afterEveryRender',
      action: '`afterRender`ライフサイクルフックを`afterEveryRender`に名前変更します。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Medium,
      step: '20.0.0_replace_TestBed_flushEffects_with_tick',
      action:
        '`TestBed.flushEffects()`の使用を、エフェクトを同期的にフラッシュする最も近い同等である`TestBed.tick()`に置き換えてください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_provideCheckNoChangesConfig',
      action:
        '`provideExperimentalCheckNoChangesForDebug`を`provideCheckNoChangesConfig`に名前変更します。その動作はすべての`checkNoChanges`実行に適用されるようになりました。`useNgZoneOnStable`オプションは利用できなくなりました。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_refactor_ng_reflect_attributes_usage',
      action:
        '`ng-reflect-*`属性に依存しないようにアプリケーションとテストコードをリファクタリングしてください。一時的に移行のために必要な場合は、開発モードでのみそれらを再度有効にするために、ブートストラッププロバイダーで`@angular/core`から`provideNgReflectAttributes()`を使用してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_adjust_RedirectFn_return_type_handling',
      action:
        '`RedirectFn`を返す関数を直接呼び出すコードを調整してください。これらの関数は`Observable`または`Promise`も返すことができるようになりました。ロジックがこれらの非同期戻り値を正しく処理することを確認してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_rename_provideExperimentalZonelessChangeDetection',
      action:
        '`provideExperimentalZonelessChangeDetection`を`provideZonelessChangeDetection`に名前変更します。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_template_expressions_using_in_property',
      action:
        'テンプレートで`{{ in }}`または`in`を式で使用して`in`という名前のコンポーネントプロパティを参照している場合、`in`がJavaScriptの`in`演算子を参照するようになったため、`{{ this.in }}`または`this.in`に変更してください。`in`をテンプレート参照として使用している場合は、参照の名前を変更する必要があります。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_router_method_array_parameters_to_readonly',
      action:
        'ルーターメソッド（`createUrlTree`、`navigate`、`createUrlTreeFromSnapshot`）に渡されるコマンド配列の型は、配列が変更されないため`readonly T[]`を使用するように更新されました。これらの型を抽出するコード（例: `typeof`を使用）は、可変配列を期待している場合、調整が必要になるかもしれません。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_animation_tests_for_guaranteed_flushing',
      action:
        'アニメーションに関わるDOM要素をアサートするテストを見直し、更新してください。アニメーションは変更検知または`ApplicationRef.tick`でフラッシュされることが保証されるようになり、以前のテスト結果が変わる可能性があります。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Medium,
      step: '20.0.0_handle_uncaught_listener_errors_in_tests',
      action:
        'テストでは、イベントリスナーでの捕捉されないエラーはデフォルトで再スローされるようになりました。以前は、これらはデフォルトでコンソールにログされるだけでした。テストケースで意図的な場合は捕捉するか、最終手段として`configureTestingModule`で`rethrowApplicationErrors: false`を使用してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_route_guards_array_types',
      action:
        'ルートガード配列（canActivate、canDeactivateなど）から`any`型が削除されました。ガードが関数、`ProviderToken<T>`、または（非推奨の）文字列であることを確認してください。文字列ガードは`ProviderToken<T>`または関数にリファクタリングしてください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Basic,
      step: '20.0.0_update_nodejs_version',
      action:
        'Angular v20に更新する前に、Node.jsのバージョンが20.11.1以上であり、v18またはv22.0-v22.10ではないことを確認してください。サポートされているNode.jsバージョンの完全なリストはhttps://angular.dev/reference/versionsで確認してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Basic,
      step: '20.0.0_replace_TestBed_get_with_TestBed_inject',
      action:
        '依存性の注入のためにAngularテストで非推奨の`TestBed.get()`メソッドのすべての出現箇所を`TestBed.inject()`に置き換えてください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Medium,
      step: '20.0.0_remove_InjectFlags_usage',
      action:
        '`InjectFlags` enumとその`inject`、`Injector.get`、`EnvironmentInjector.get`、`TestBed.inject`呼び出しからの使用を削除してください。`inject`には`{optional: true}`のようなオプションを使用するか、`*.get`メソッドには`null`を処理してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_injector_get_calls_to_use_ProviderToken',
      action:
        '`injector.get()`呼び出しを、削除された`any`オーバーロードに依存するのではなく、特定の`ProviderToken<T>`を使用するように更新してください。文字列トークン（v4以降非推奨）を使用している場合は、それらを`ProviderToken<T>`に移行してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Basic,
      step: '20.0.0_update_typescript_version',
      action:
        '互換性を確保するために、Angular v20に更新する前にプロジェクトのTypeScriptバージョンを少なくとも5.8に更新してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_review_AsyncPipe_error_handling_in_tests',
      action:
        '`AsyncPipe`の購読/Promiseにおける未処理のエラーは、`ErrorHandler`に直接報告されるようになりました。これによりテスト結果が変わる可能性があるため、テストがこれらの報告されたエラーを正しく処理することを確認してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_refactor_PendingTasks_run_usage',
      action:
        '`PendingTasks.run`の戻り値に依存している場合、`PendingTasks.add`を使用するようにリファクタリングしてください。特にSSRの場合、未処理の拒否によるNodeプロセスのシャットダウンを防ぐために、Promiseの結果/拒否を手動で処理してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_update_template_expressions_using_void_property',
      action:
        'テンプレートで`void`という名前のコンポーネントプロパティを参照するために式で`{{ void }}`または`void`を使用している場合、`void`がJavaScriptの`void`演算子を参照するようになったため、`{{ this.void }}`または`this.void`に変更してください。',
    },
    {
      possibleIn: 2000,
      necessaryAsOf: 2000,
      level: ApplicationComplexity.Advanced,
      step: '20.0.0_review_date_pipe_formatter_Y_usage',
      action:
        '`DatePipe`の使用を見直してください。`Y`（週番号付け年）フォーマッターを`w`（週番号）を含めずに使用すると、疑わしいと検出されるようになりました。意図がそうであった場合は`y`（年）を使用するか、`Y`と一緒に`w`を含めてください。',
    },
];
