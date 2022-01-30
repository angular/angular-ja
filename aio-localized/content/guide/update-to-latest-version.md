# Update Angular

This guide contains information to update to Angular version 13.

## Update Angular CLI applications

For step-by-step instructions on how to update to the latest Angular release and leverage the Angular automated migration tools, use the interactive update guide at [update.angular.io][angularupdatemain].

## Changes and deprecations in version 13

<div class="alert is-helpful">

For information about the deprecation and removal practices of Angular, see [Angular Release Practices][aioguidereleasesdeprecationpractices].

</div>

- **Removal of View Engine**

  Requires all applications and libraries to build using Ivy.
  See the [Upcoming improvements to Angular library distribution][angularblog76c02f782aa4] blog.

- **Modernization of the Angular Package Format \(APF\)**

  Removed older output formats, including View Engine specific metadata.

- **Removal of IE11 Support**

  Removes all support for Microsoft Internet Explorer 11 \(IE11\).
  See [Issue&nbsp;#41840][githubangularangularissues41840].

- **Testbed module teardown**

  Adds the option in `initTestEnvironment` to completely remove test environments from an application.
  See the [Improving Angular tests by enabling Angular testing module teardown][devthisisangularimprovingangulartestsbyenablingangulartestingmoduleteardown38kh] article.

- **`$localize` tagged message strings**

  Adds documentation for the Angular `$localize` API and tagged message strings.

- **Disk Cache**

  Enables the persistent build cache by default for all applications.
  See [Issue&nbsp;#21545][githubangularangularcliissues21545].

### Breaking changes in Angular version 13

{@a breaking-changes}

|                                                         | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**PR&nbsp;#43642**][githubangularangularpull43642]     | TypeScript versions older than `4.4.2` are no longer supported.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [**PR&nbsp;#43740**][githubangularangularpull43740]     | NodeJS versions older than `v12.20.0` are no longer supported. The Angular packages now use the NodeJS package exports feature with subpath patterns and requires a NodeJS version above `14.15.0` or `16.10.0`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [PR&nbsp;#31187][githubangularangularpull31187]         | Previously, the default url serializer dropped everything after and including a question mark in query parameters. That is, for a navigation to `/path?q=hello?&other=123`, the query parameters parsed to just `{q: 'hello'}`. This is incorrect, because the URI spec allows for question mark characers in query data. This change now correctly parses the query parameters for `/path?q=hello?&other=123` as `{v: 'hello?', other: '123'}`.                                                                                                                                                                                                                                         |
| [PR&nbsp;#41730][githubangularangularpull41730]         | The behavior of the `SpyLocation` used by the `RouterTestingModule` has changed to match the behavior of browsers. It no longer emits a `popstate` event when `Location.go` is called. In addition, `simulateHashChange` now triggers _both_ a `hashchange` event and a `popstate` event. Tests that use `location.go` and expect the changes to be picked up by the `Router` should migrate to `simulateHashChange`. Each test is different in what it attempts to assert, so there is no single change that works for all tests. Each test that uses the `SpyLocation` to simulate changes in the browser URL should be evaluated on a case-by-case basis.                             |
| [PR&nbsp;#42952][githubangularangularpull42952]         | A new type called `FormControlStatus` has been introduced, which is a union of all possible status strings for form controls. `AbstractControl.status` has been narrowed from `string` to `FormControlStatus`, and `statusChanges` has been narrowed from `Observable<any>` to `Observable<FormControlStatus>`. Most applications should consume the new types seamlessly. Any breakage caused by this change is likely due to one of the following two problems: <ol><li>The app is comparing <code>AbstractControl.status</code> against a string which is not a valid status.</li><li>The app is using `statusChanges` events as if they were something other than strings.</li></ol> |
| [PR&nbsp;#43087][githubangularangularpull43087]         | Previously ,`null` and `undefined` inputs for `routerLink` were equivalent to empty string and there was no way to disable the navigation of the link. In addition, the `href` is changed from a property `HostBinding()` to an attribute binding \(`HostBinding('attr.href')`\). The effect of this change is that `DebugElement.properties['href']` now returns the `href` value returned by the native element which is the full URL rather than the internal value of the `RouterLink` `href` property.                                                                                                                                                                              |
| [PR&nbsp;#43496][githubangularangularpull43496]         | The router no longer replaces the browser URL when a new navigation cancels an ongoing navigation. The replacement of the browser URL often caused URL flicker and was only in place to support some AngularJS hybrid applications. Hybrid applications which rely on the presence of `navigationId` on each initial navigation handled by the Angular router should instead subscribe to `NavigationCancel` events and manually perform the `location.replaceState` to add `navigationId` to the Router state.<br />In addition, tests that assert `urlChanges` on the `SpyLocation` should be adjusted to account for the lack of the `replaceState` trigger.                          |
| [PR&nbsp;#43507][githubangularangularpull43507]         | The `WrappedValue` class is no longer imported from `@angular/core`. This change may result in compile errors or failures at runtime, if outdated libraries are used that rely on `WrappedValue`. Dependancy on `WrappedValue` should be removed since no replacement is available.                                                                                                                                                                                                                                                                                                                                                                                                      |
| [PR&nbsp;#43591][githubangularangularpull43591]         | It is no longer possible to use `Route.loadChildren` with a string value. The following supporting classes were removed from `@angular/core`: <ul><li><code>NgModuleFactoryLoader</code></li><li><code>SystemJsNgModuleFactoryLoader</code></li></ul> The `@angular/router` package no longer exports the following symbols: <ul><li><code>SpyNgModuleFactoryLoader</code></li><li><code>DeprecatedLoadChildren</code></li></ul> The signature of the `setupTestingRouter` function from `@angular/core/testing` was changed to drop the `NgModuleFactoryLoader` parameter, since an value for that parameter can not be created.                                                        |
| [PR&nbsp;#43668][githubangularangularpull43668]         | The return type of `SwUpdate#activateUpdate` and `SwUpdate#checkForUpdate` changed to `Promise<boolean>`.<br />Although unlikely, this change may cause TypeScript type-checking to fail in some cases. If necessary, update your types to account for the new return type.                                                                                                                                                                                                                                                                                                                                                                                                              |
| [Issue&nbsp;#22159][githubangularangularcliissues22159] | Scripts that load via dynamic `import()` are now treated as ES modules (meaning they must be strict mode-compatible).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### New deprecations

{@a deprecations}

| Removed                                                                                                             | Replacement                                                                                             | Details                                                                                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`getModuleFactory`][aioapicoregetmodulefactory]                                                                    | [`getNgModuleById`][aioapicoregetngmodulebyid]                                                          |                                                                                                                                                                                 |
| Factory-based signature of [`ApplicationRef.bootstrap`][aioapicoreapplicationrefbootstrap]                          | Type-based signature of [`ApplicationRef.bootstrap`][aioapicoreapplicationrefbootstrap]                 | Use the Type-based signature in place of the Factory-based signature.                                                                                                           |
| [`PlatformRef.bootstrapModuleFactory`][aioapicoreplatformrefbootstrapmodulefactory]                                 | [`PlatformRef.bootstrapModule`][aioapicoreplatformrefbootstrapmodule]                                   |                                                                                                                                                                                 |
| [`ModuleWithComponentFactories`][aioapicoremodulewithcomponentfactories]                                            | none                                                                                                    |                                                                                                                                                                                 |
| [`Compiler`][aioapicorecompiler]                                                                                    | none                                                                                                    |                                                                                                                                                                                 |
| [`CompilerFactory`][aioapicorecompilerfactory]                                                                      | none                                                                                                    |                                                                                                                                                                                 |
| [`NgModuleFactory`][aioapicorengmodulefactory]                                                                      | Non-factory based framework APIs                                                                        | Use the non-factory based framework APIs, such as [`PlatformRef.bootstrapModule`][aioapicoreplatformrefbootstrapmodule] and [`createNgModuleRef`][aioapicorecreatengmoduleref]. |
| Factory-based signature of [`ViewContainerRef.createComponent`][aioapicoreviewcontainerrefcreatecomponent]          | Type-based signature of [`ViewContainerRef.createComponent`][aioapicoreviewcontainerrefcreatecomponent] | Use the Type-based signature in place of the Factory-based signature.                                                                                                           |
| `aotSummaries` parameter of the [`TestBed.initTestEnvironment` method][aioapicoretestingtestbedinittestenvironment] | none                                                                                                    |                                                                                                                                                                                 |
| `aotSummaries` parameter of the [`TestModuleMetadata` type][aioapicoretestingtestmodulemetadata]                    | none                                                                                                    |                                                                                                                                                                                 |
| [`renderModuleFactory`][aioapiplatformserverrendermodulefactory]                                                    | [`renderModule`][aioapiplatformserverrendermodule]                                                      |                                                                                                                                                                                 |
| [`SwUpdate#activated`][aioapiserviceworkerswupdateactivated]                                                        | [`SwUpdate#activateUpdate()`][aioapiserviceworkerswupdateactivateupdate]                                | Use the return value of [`SwUpdate#activateUpdate()`][aioapiserviceworkerswupdateactivateupdate].                                                                               |
| [`SwUpdate#available`][aioapiserviceworkerswupdateavailable]                                                        | [`SwUpdate#versionUpdates`][aioapiserviceworkerswupdateversionupdates]                                  |                                                                                                                                                                                 |
| `bind-input="value"`                                                                                                | `[input]="value"`                                                                                       |                                                                                                                                                                                 |
| `bind-animate-trigger="value"`                                                                                      | `[@trigger]="value"`                                                                                    |                                                                                                                                                                                 |
| `on-click="onClick()"`                                                                                              | `(click)="onClick()"`                                                                                   |                                                                                                                                                                                 |
| `bindon-ngModel="value"`                                                                                            | `[(ngModel)]="value"`                                                                                   |                                                                                                                                                                                 |
| `ref-templateRef`                                                                                                   | `#templateRef`                                                                                          |                                                                                                                                                                                 |

<!-- links -->

[aioapicoreapplicationrefbootstrap]: api/core/ApplicationRef#bootstrap 'bootstrap - ApplicationRef | Core - API | Angular'
[aioapicorecompiler]: api/core/Compiler 'Compiler | Core - API | Angular'
[aioapicorecompilerfactory]: api/core/CompilerFactory 'CompilerFactory | Core - API | Angular'
[aioapicorecreatengmoduleref]: api/core/createNgModuleRef 'createNgModuleRef | Core - API | Angular'
[aioapicoregetmodulefactory]: api/core/getModuleFactory 'getModuleFactory | Core - API | Angular'
[aioapicoregetngmodulebyid]: api/core/getNgModuleById 'getNgModuleById | Core - API | Angular'
[aioapicoremodulewithcomponentfactories]: api/core/ModuleWithComponentFactories 'ModuleWithComponentFactories | Core - API | Angular'
[aioapicorengmodulefactory]: api/core/NgModuleFactory 'NgModuleFactory | Core - API | Angular'
[aioapicoreplatformrefbootstrapmodulefactory]: api/core/PlatformRef#bootstrapModuleFactory 'bootstrapModuleFactory - PlatformRef | Core - API | Angular'
[aioapicoreplatformrefbootstrapmodule]: api/core/PlatformRef#bootstrapModule 'bootstrapModule - PlatformRef | Core - API | Angular'
[aioapicoretestingtestbedinittestenvironment]: api/core/testing/TestBed#inittestenvironment 'inittestenvironment - TestBed | Testing - Core - API | Angular'
[aioapicoretestingtestmodulemetadata]: api/core/testing/TestModuleMetadata 'TestModuleMetadata | Testing - Core - API | Angular'
[aioapicoreviewcontainerrefcreatecomponent]: api/core/ViewContainerRef#createComponent 'createComponent - ViewContainerRef | Core - API | Angular'
[aioapiplatformserverrendermodulefactory]: api/platform-server/renderModuleFactory 'renderModuleFactory | Platform server - API | Angular'
[aioapiplatformserverrendermodule]: api/platform-server/renderModule 'renderModule | Platform server - API | Angular'
[aioapiserviceworkerswupdateactivated]: api/service-worker/SwUpdate#activated 'activated - SwUpdate | Service worker - API | Angular'
[aioapiserviceworkerswupdateactivateupdate]: api/service-worker/SwUpdate#activateUpdate 'activateUpdate - SwUpdate | Service worker - API | Angular'
[aioapiserviceworkerswupdateavailable]: api/service-worker/SwUpdate#available 'available - SwUpdate | Service worker - API | Angular'
[aioapiserviceworkerswupdateversionupdates]: api/service-worker/SwUpdate#versionUpdates 'versionUpdates - SwUpdate | Service worker - API | Angular'
[aioguidereleasesdeprecationpractices]: guide/releases#deprecation-practices 'Deprecation practices - Angular versioning and releases | Angular'

<!-- external links -->

[angularblog76c02f782aa4]: https://blog.angular.io/76c02f782aa4 'Upcoming improvements to Angular library distribution | Angular Blog'
[angularupdatemain]: https://update.angular.io ' Angular Update Guide'
[devthisisangularimprovingangulartestsbyenablingangulartestingmoduleteardown38kh]: https://dev.to/this-is-angular/improving-angular-tests-by-enabling-angular-testing-module-teardown-38kh 'Improving Angular tests by enabling Angular testing module teardown | This is Angular | DEV Community'
[githubangularangularissues41840]: https://github.com/angular/angular/issues/41840 'RFC: Internet Explorer 11 support deprecation and removal #41840 | angular/angular | GitHub'
[githubangularangularpull31187]: https://github.com/angular/angular/pull/31187 'fix(router): Allow question marks in query param values #31187 | angular/angular | GitHub'
[githubangularangularpull41730]: https://github.com/angular/angular/pull/41730 'fix(common): synchronise location mock behavior with the navigators #41730 | angular/angular | GitHub'
[githubangularangularpull42952]: https://github.com/angular/angular/pull/42952 'feat(forms): Give form statuses a more specific type #42952 | angular/angular | GitHub'
[githubangularangularpull43087]: https://github.com/angular/angular/pull/43087 'fix(router): null/undefined routerLink should disable navigation #43087 | angular/angular | GitHub'
[githubangularangularpull43496]: https://github.com/angular/angular/pull/43496 'fix(router): Prevent URL flicker when new navigations cancel ongoing ... #43496 | angular/angular | GitHub'
[githubangularangularpull43507]: https://github.com/angular/angular/pull/43507 'perf(core): remove support for the deprecated WrappedValue #43507 | angular/angular | GitHub'
[githubangularangularpull43591]: https://github.com/angular/angular/pull/43591 'refactor(router): remove support for loadChildren string syntax #43591 | angular/angular | GitHub'
[githubangularangularpull43642]: https://github.com/angular/angular/pull/43642 'feat(core): drop support for TypeScript 4.2 and 4.3 #43642 | angular/angular | GitHub'
[githubangularangularpull43668]: https://github.com/angular/angular/pull/43668 'feat(service-worker): improve ergonomics of the SwUpdate APIs #43668 | angular/angular | GitHub'
[githubangularangularpull43740]: https://github.com/angular/angular/pull/43740 'feat(bazel): expose esm2020 and es2020 conditions in APF package exports #43740 | angular/angular | GitHub'
[githubangularangularcliissues21545]: https://github.com/angular/angular-cli/issues/21545 '[RFC] Persistent build cache by default #21545 | angular/angular-cli | GitHub'
[githubangularangularcliissues22159]: https://github.com/angular/angular-cli/issues/22159 'Script imports are modules by default #22159 | angular/angular-cli | GitHub'

<!-- end links -->

@reviewed 2021-11-01
