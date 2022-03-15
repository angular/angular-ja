# Angularをアップデートする

このガイドには、Angularをバージョン13にアップデートするための情報が含まれています。

## AngularCLIアプリケーションをアップデートする

Angularの最新リリースへのアップデートと、Angular自動移行ツールの活用方法の詳細な手順については、次のインタラクティブなアップデートガイドを使用してください。 [Angularアップデートガイド][AngularUpdateMain]

## バージョン13での変更と廃止事項

<div class="alert is-helpful">

Angularの廃止と削除事項のプラクティスに関する情報については、[Angularのリリースプラクティス][AioGuideReleasesDeprecationPractices]を参照してください。

</div>

*   **View Engineの削除**

    すべてのアプリケーションとライブラリにIvyを使用してビルドすることが求められます。
    [Angularライブラリの配布に関する今後の改善予定][AngularBlog76c02f782aa4]のブログを参照してください。

*   **Angular Package Format \(APF\)の最新化**

    View Engine固有のメタデータを含む古い出力形式を削除しました。

*   **IE11サポートの削除**

    Microsoft Internet Explorer 11 \(IE11\)のサポートをすべて削除します。
    [Issue&nbsp;#41840][GithubAngularAngularIssues41840]を参照してください。

*   **TestBedモジュールのティアダウン**

    アプリケーションからテスト環境を完全に分離する `initTestEnvironment` オプションを追加します。
    [Angularテストモジュールのティアダウンを有効にしてAngularのテストを改善する][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh]の記事を参照してください。

*   **`$localize`タグ付きメッセージ文字列**

    Angular `$localize` APIとタグ付きメッセージ文字列のドキュメントを追加します。

*   **ディスクキャッシュ**

    すべてのアプリケーションに対してデフォルトで、永続的なビルドキャッシュを有効にします。
    [Issue&nbsp;#21545][GithubAngularAngularCliIssues21545]を参照してください。

### Angularバージョン13における破壊的変更

{@a breaking-changes}

|                                                     | 詳細                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|:---                                                 |:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [**PR&nbsp;#43642**][GithubAngularAngularPull43642] | TypeScriptの `4.4.2` より古いバージョンはサポートされなくなりました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [**PR&nbsp;#43740**][GithubAngularAngularPull43740] | NodeJSの `v12.20.0` より古いバージョンはサポートされなくなりました。Angularパッケージは、サブパスパターンをもつNodeJSのパッケージエクスポート機能を使用するようになり、 `14.15.0` または `16.10.0` 以上のNodeJSバージョンを必要とします。                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [PR&nbsp;#31187][GithubAngularAngularPull31187]     | 以前は、デフォルトのURLシリアライザーは、クエリパラメーターの疑問符（?）以降のすべてを削除していました。つまり、 `/path?q=hello?&other=123` へのナビゲーションの場合、クエリパラメータは単に `{q: 'hello'}` として解析されます。URI仕様ではクエリデータに疑問符（?）を含めることが許可されているため、これは正しくありません。この変更により、 `/path?q=hello?&other=123` のクエリパラメータが `{v: 'hello?', other: '123'}` として正しく解析されるようになりました。                                                                                                                                                                                                                                         |
| [PR&nbsp;#41730][GithubAngularAngularPull41730]     |  `RouterTestingModule` によって使用される `SpyLocation` の動作は、ブラウザの動作と一致するように変更されました。これにより、 `Location.go` が呼び出されたときに `popstate` イベントを発行しなくなりました。さらに、 `simulateHashChange` は、 `hashchange` イベントと `popstate` イベントの両方をトリガーするようになりました。 `location.go` を使用し、ルーターによって変更が取得されることを期待するテストは、`simulateHashChange` に移行する必要があります。各テストは、アサートしようとする内容が異なるため、すべてのテストで機能する単一の変更はありません。 `SpyLocation` を使用してブラウザのURLの変更をシミュレートする各テストは、ケースバイケースで評価する必要があります。                             |
| [PR&nbsp;#42952][GithubAngularAngularPull42952]     |  `FormControlStatus` と呼ばれる新しい型が導入されました。これは、フォームコントロールのすべての可能なステータス文字列の組み合わせです。 `AbstractControl.status` は `string` から `FormControlStatus` に絞り込まれ、 `statusChanges` は `Observable<any>` から`Observable<FormControlStatus>` に絞り込まれました。ほとんどのアプリケーションは、新しいタイプをシームレスに利用できるはずです。この変更によって発生する不具合は、次の2つの問題のいずれかが原因である可能性があります：<ol><li>アプリケーションが、 <code>AbstractControl.status</code> を有効なステータスではない文字列と比較している。</li><li>アプリケーションが、 `statusChanges` イベントを文字列以外のものとして使用している。 |
| [PR&nbsp;#43087][GithubAngularAngularPull43087]     | 以前は、 `routerLink` の `null` および `undefined` の入力は空の文字列と同等であり、リンクのナビゲーションを無効にする方法はありませんでした。さらに、 `href` は、プロパティ `HostBinding()` から属性バインディング \(`HostBinding('attr.href')`\) に変更されています。この変更により、 `DebugElement.properties['href']` は、 `RouterLink` `href` プロパティの内部値ではなく、完全なURLであるネイティブ要素によって返される `href` の値を返すようになりました。                                                                                                                                                                              |
| [PR&nbsp;#43496][GithubAngularAngularPull43496]     | 新しいナビゲーションが進行中のナビゲーションをキャンセルしたときに、ルーターがブラウザのURLを置き換えることはなくなりました。ブラウザのURLを置き換えると、URLのちらつきが発生することが多く、一部のAngularJSハイブリッドアプリケーションをサポートするためにのみ使用されていました。 Angularルーターによって処理される各初期ナビゲーションで `navigationId` の存在に依存するハイブリッドアプリケーションは、代わりに `NavigationCancel` イベントをサブスクライブし、手動で `location.replaceState` を実行して、 `navigationId` をルーター状態に追加する必要があります。 <br />さらに、 `SpyLocation` で `urlChanges` をアサートするテストは、 `replaceState` トリガーがないことを考慮して調整する必要があります。                      |
| [PR&nbsp;#43507][GithubAngularAngularPull43507]     | `WrappedValue` クラスは `@angular/core` からインポートされなくなりました。 `WrappedValue` に依存する古いライブラリが使用されている場合、この変更により、コンパイルエラーや実行時に失敗が発生する可能性があります。 `WrappedValue` への依存は、代替手段がないため削除する必要があります。                                                                                                                                                                                                                                                                                                                                                                                                      |
| [PR&nbsp;#43591][GithubAngularAngularPull43591]     | 文字列値で `Route.loadChildren` を使用することはできなくなりました。次のサポートクラスが `@angular/core` から削除されました：<ul><li><code>NgModuleFactoryLoader</code></li><li><code>SystemJsNgModuleFactoryLoader</code></li></ul> `@angular/router` パッケージは、次のシンボルをエクスポートしなくなりました：<ul><li><code>SpyNgModuleFactoryLoader</code></li><li><code>DeprecatedLoadChildren</code></li></ul> `@angular/core/testing` の `setupTestingRouter` 関数のシグネチャーが変更され、 `NgModuleFactoryLoader` は、パラメーターの値を作成できないため、削除されました。                                                        |
| [PR&nbsp;#43668][GithubAngularAngularPull43668]     |  `SwUpdate#activateUpdate` および `SwUpdate#checkForUpdate` の戻り値の型が `Promise<boolean>` に変更されました。<br />可能性は低いですが、この変更により、TypeScriptの型チェックに失敗する場合があります。必要であれば、新しい戻り値の型を考慮し、型を更新してください。                                                                                                                                                                                                                                                                                                                                                                                                              |
| [Issue&nbsp;#22159][GithubAngularAngularCliIssues22159]     | 動的な `import()` で読み込むスクリプトは、ESモジュールとして扱われるようになりました（つまり、Strictモードと互換性がある必要があります）。 |

### 新しい非推奨事項

{@a deprecations}

| 削除                                                                                                             | 代替手段                                                                                             | 詳細                                                                                                                                                                         |
|:---                                                                                                                 |:---                                                                                                     |:---                                                                                                                                                                             |
| [`getModuleFactory`][AioApiCoreGetmodulefactory]                                                                    | [`getNgModuleById`][AioApiCoreGetngmodulebyid]                                                          |                                                                                                                                                                                 |
| ファクトリーベースのシグネチャー [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap]                          | 型ベースのシグネチャー [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap]                 | ファクトリーベースのシグネチャーの代わりに型ベースのシグネチャーを使用します。                                                                                                           |
| [`PlatformRef.bootstrapModuleFactory`][AioApiCorePlatformrefBootstrapmodulefactory]                                 | [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule]                                   |                                                                                                                                                                                 |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories]                                            | なし                                                                                                    |                                                                                                                                                                                 |
| [`Compiler`][AioApiCoreCompiler]                                                                                    | なし                                                                                                    |                                                                                                                                                                                 |
| [`CompilerFactory`][AioApiCoreCompilerfactory]                                                                      | なし                                                                                                    |                                                                                                                                                                                 |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory]                                                                      | 非ファクトリーベースのフレームワークAPI                                                                        | [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] や [`createNgModuleRef`][AioApiCoreCreatengmoduleref] などの非ファクトリーベースのフレームワークAPIを使用します。 |
| ファクトリーベースのシグネチャー [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent]          | 型ベースのシグネチャー [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | ファクトリーベースのシグネチャーの代わりに型ベースのシグネチャーを使用します。                                                                                                             |
| [`TestBed.initTestEnvironment` メソッド][AioApiCoreTestingTestbedInittestenvironment] の `aotSummaries` パラメータ | なし                                                                                                    |                                                                                                                                                                                 |
| [`TestModuleMetadata` 型][AioApiCoreTestingTestmodulemetadata] の `aotSummaries` パラメータ                    | なし                                                                                                    |                                                                                                                                                                                 |
| [`renderModuleFactory`][AioApiPlatformServerRendermodulefactory]                                                    | [`renderModule`][AioApiPlatformServerRendermodule]                                                      |                                                                                                                                                                                 |
| [`SwUpdate#activated`][AioApiServiceWorkerSwupdateActivated]                                                        | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate]                                | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate] の戻り値を使用します。                                                                               |
| [`SwUpdate#available`][AioApiServiceWorkerSwupdateAvailable]                                                        | [`SwUpdate#versionUpdates`][AioApiServiceWorkerSwupdateVersionupdates]                                  |                                                                                                                                                                                 |
| `bind-input="value"`                                                                                                | `[input]="value"`                                                                                       |                                                                                                                                                                                 |
| `bind-animate-trigger="value"`                                                                                      | `[@trigger]="value"`                                                                                    |                                                                                                                                                                                 |
| `on-click="onClick()"`                                                                                              | `(click)="onClick()"`                                                                                   |                                                                                                                                                                                 |
| `bindon-ngModel="value"`                                                                                            | `[(ngModel)]="value"`                                                                                   |                                                                                                                                                                                 |
| `ref-templateRef`                                                                                                   | `#templateRef`                                                                                          |                                                                                                                                                                                 |

<!-- links -->

[AioApiCoreApplicationrefBootstrap]: api/core/ApplicationRef#bootstrap "bootstrap - ApplicationRef | Core - API | Angular"
[AioApiCoreCompiler]: api/core/Compiler "Compiler | Core - API | Angular"
[AioApiCoreCompilerfactory]: api/core/CompilerFactory "CompilerFactory | Core - API | Angular"
[AioApiCoreCreatengmoduleref]: api/core/createNgModuleRef "createNgModuleRef | Core - API | Angular"
[AioApiCoreGetmodulefactory]: api/core/getModuleFactory "getModuleFactory | Core - API | Angular"
[AioApiCoreGetngmodulebyid]: api/core/getNgModuleById "getNgModuleById | Core - API | Angular"
[AioApiCoreModulewithcomponentfactories]: api/core/ModuleWithComponentFactories "ModuleWithComponentFactories | Core - API | Angular"
[AioApiCoreNgmodulefactory]: api/core/NgModuleFactory "NgModuleFactory | Core - API | Angular"
[AioApiCorePlatformrefBootstrapmodulefactory]: api/core/PlatformRef#bootstrapModuleFactory "bootstrapModuleFactory - PlatformRef | Core - API | Angular"
[AioApiCorePlatformrefBootstrapmodule]: api/core/PlatformRef#bootstrapModule "bootstrapModule - PlatformRef | Core - API | Angular"
[AioApiCoreTestingTestbedInittestenvironment]: api/core/testing/TestBed#inittestenvironment "inittestenvironment - TestBed | Testing - Core - API | Angular"
[AioApiCoreTestingTestmodulemetadata]: api/core/testing/TestModuleMetadata "TestModuleMetadata | Testing - Core - API | Angular"
[AioApiCoreViewcontainerrefCreatecomponent]: api/core/ViewContainerRef#createComponent "createComponent - ViewContainerRef | Core - API | Angular"

[AioApiPlatformServerRendermodulefactory]: api/platform-server/renderModuleFactory "renderModuleFactory | Platform server - API | Angular"
[AioApiPlatformServerRendermodule]: api/platform-server/renderModule "renderModule | Platform server - API | Angular"

[AioApiServiceWorkerSwupdateActivated]: api/service-worker/SwUpdate#activated "activated - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateActivateupdate]: api/service-worker/SwUpdate#activateUpdate "activateUpdate - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateAvailable]: api/service-worker/SwUpdate#available "available - SwUpdate | Service worker - API | Angular"
[AioApiServiceWorkerSwupdateVersionupdates]: api/service-worker/SwUpdate#versionUpdates "versionUpdates - SwUpdate | Service worker - API | Angular"

[AioGuideReleasesDeprecationPractices]: guide/releases#deprecation-practices "Deprecation practices - Angular versioning and releases | Angular"

<!-- external links -->

[AngularBlog76c02f782aa4]: https://blog.angular.io/76c02f782aa4 "Upcoming improvements to Angular library distribution | Angular Blog"

[AngularUpdateMain]: https://update.angular.io " Angular Update Guide"

[DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh]: https://dev.to/this-is-angular/improving-angular-tests-by-enabling-angular-testing-module-teardown-38kh "Improving Angular tests by enabling Angular testing module teardown | This is Angular | DEV Community"

[GithubAngularAngularIssues41840]: https://github.com/angular/angular/issues/41840 "RFC: Internet Explorer 11 support deprecation and removal #41840 | angular/angular | GitHub"

[GithubAngularAngularPull31187]: https://github.com/angular/angular/pull/31187 "fix(router): Allow question marks in query param values #31187 | angular/angular | GitHub"
[GithubAngularAngularPull41730]: https://github.com/angular/angular/pull/41730 "fix(common): synchronise location mock behavior with the navigators #41730 | angular/angular | GitHub"
[GithubAngularAngularPull42952]: https://github.com/angular/angular/pull/42952 "feat(forms): Give form statuses a more specific type #42952 | angular/angular | GitHub"
[GithubAngularAngularPull43087]: https://github.com/angular/angular/pull/43087 "fix(router): null/undefined routerLink should disable navigation #43087 | angular/angular | GitHub"
[GithubAngularAngularPull43496]: https://github.com/angular/angular/pull/43496 "fix(router): Prevent URL flicker when new navigations cancel ongoing ... #43496 | angular/angular | GitHub"
[GithubAngularAngularPull43507]: https://github.com/angular/angular/pull/43507 "perf(core): remove support for the deprecated WrappedValue #43507 | angular/angular | GitHub"
[GithubAngularAngularPull43591]: https://github.com/angular/angular/pull/43591 "refactor(router): remove support for loadChildren string syntax #43591 | angular/angular | GitHub"
[GithubAngularAngularPull43642]: https://github.com/angular/angular/pull/43642 "feat(core): drop support for TypeScript 4.2 and 4.3 #43642 | angular/angular | GitHub"
[GithubAngularAngularPull43668]: https://github.com/angular/angular/pull/43668 "feat(service-worker): improve ergonomics of the SwUpdate APIs #43668 | angular/angular | GitHub"
[GithubAngularAngularPull43740]: https://github.com/angular/angular/pull/43740 "feat(bazel): expose esm2020 and es2020 conditions in APF package exports #43740 | angular/angular | GitHub"

[GithubAngularAngularCliIssues21545]: https://github.com/angular/angular-cli/issues/21545 "[RFC] Persistent build cache by default #21545 | angular/angular-cli | GitHub"
[GithubAngularAngularCliIssues22159]: https://github.com/angular/angular-cli/issues/22159 "Script imports are modules by default #22159 | angular/angular-cli | GitHub"

<!-- end links -->

@reviewed 2021-11-01
