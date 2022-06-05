# Update Angular

This guide contains information to update to Angular version 14.

## Update Angular CLI applications

For step-by-step instructions on how to update to the latest Angular release and leverage the Angular automated migration tools, use the interactive update guide at [update.angular.io](https://update.angular.io).

## Changes and deprecations in version 14

<div class="alert is-helpful">

For information about the deprecation and removal practices of Angular, see [Angular Release Practices](guide/releases#deprecation-practices).

</div>

*   **Strictly Typed Reactive Forms**

    The Reactive Forms types `AbstractControl`, `FormControl`, `FormGroup`, and `FormArray` now support a generic parameter which allows for strict typing of the controls. An automatic migration will convert existing usages of these types to special `Untyped` aliases which preserve the existing behavior.

    The `initialValueIsDefault` option for `FormControl` construction has been deprecated in favor of the `nonNullable` option (which has identical behavior). This renaming aligns the `FormControl` constructor with other strictly typed APIs related to nullability.

*   **`ComponentFactory` and `NgModuleFactory` cleanup**

    Many APIs which use either `ComponentFactory` or `NgModuleFactory` have been deprecated and replaced with new APIs that use component or NgModule classes directly.

### Breaking changes in Angular version 14

<a id="breaking-changes"></a>

| | Details |
|:--- |:--- |
| [**PR&nbsp;#45729**](https://github.com/angular/angular/pull/45729) | `initialNavigation: 'enabled'` was deprecated in v11 and is replaced by `initialNavigation: 'enabledBlocking'.`. |
| [**PR&nbsp;#42803**](https://github.com/angular/angular/pull/42803) | Forms `email` input coercion: forms `email` input value will be considered as true if it is defined with any value rather than false and 'false'. |
| [**PR&nbsp;#33729**](https://github.com/angular/angular/pull/33729) | Objects with a length key set to zero will no longer validate as empty. This is technically a breaking change, since objects with a key `length` and value `0` will no longer validate as empty. This is a very minor change, and any reliance on this behavior is probably a bug anyway. |
| [**PR&nbsp;#44921**](https://github.com/angular/angular/pull/44921) | Do not run change detection when loading Hammer. This change may cause unit tests that are implicitly asserting on the specific number or the ordering of change detections to fail. |
| [**PR&nbsp;#23020**](https://github.com/angular/angular/pull/23020) | Parameter types of `TransferState` usage have increased type safety, and this may reveal existing problematic calls. |
| [**PR&nbsp;#43863**](https://github.com/angular/angular/pull/43863) | The type of `Navigation#initialUrl` has been narrowed to `UrlTree` from `string|UrlTree`, to reflect reality. |
| [**PR&nbsp;#45114**](https://github.com/angular/angular/pull/45114) | The `AnimationDriver.getParentElement` method has become required, so any implementors of this interface are now required to provide an implementation for this method. |
| [**PR&nbsp;#45176**](https://github.com/angular/angular/pull/45176) | The type of `Route.pathMatch` is now more strict. Places that use `pathMatch` will likely need to be updated to have an explicit `Route`/`Routes` type so that TypeScript does not infer the type as `string`. |
| [**PR&nbsp;#44573**](https://github.com/angular/angular/pull/44573) | The router now takes only the first emitted value by the resolvers and then proceeds with navigation. This is now consistent with `Observables` returned by other guards: only the first value is used.|
| [**PR&nbsp;#45394**](https://github.com/angular/angular/pull/45394) | TypeScript versions older than `4.6.0` are no longer supported. |
| [**PR&nbsp;#45210**](https://github.com/angular/angular/pull/45210) | `HttpClient` will throw an error when headers are set on a JSONP request. |
| [**PR&nbsp;#43834**](https://github.com/angular/angular/pull/43834) | Reactive form types such as `FormControl` and `FormGroup` now have generic type parameters and infer stricter types. A migration will convert existing usages to new `Untyped`-prefixed aliases which preserve the existing behavior. |
| [**PR&nbsp;#45487**](https://github.com/angular/angular/pull/45487) | The deprecated `aotSummaries` field in the `TestBed` configuration has been removed. |
| [**PR&nbsp;#45648**](https://github.com/angular/angular/pull/45648) | A new required class member `LocationStrategy#getState` has been added, that any implementers of this interface will need to provide. |
| [**PR&nbsp;#45735**](https://github.com/angular/angular/pull/45735) | When a guard returns a `UrlTree`, the router would previously schedule the redirect navigation within a `setTimeout`. This timeout is now removed, which can result in test failures due to incorrectly written tests. |

### New deprecations

<a id="deprecations"></a>

| Removed | Replacement | Details |
| :--- | :--- |:--- |
| [`FormControlOptions#initialValueIsDefault`](api/forms/FormControlOptions#initialValueIsDefault) | [`FormControlOptions#nonNullable`](api/forms/FormControlOptions#nonNullable) | The `initialValueIsDefault` option for `FormControl` construction has been deprecated in favor of the `nonNullable` option (which has identical behavior). This renaming aligns the `FormControl` constructor with other strictly typed APIs related to nullability. |
| `ErrorEvent`s passed to [`TestRequest#error`](api/common/http/testing/TestRequest#error] | `ProgressEvent` | Http requests never emit an `ErrorEvent`. Use a `ProgressEvent` instead. |
| [`getModuleFactory`](api/core/getModuleFactory) | `getNgModuleById` | `NgModuleFactory` itself is deprecated. |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`Compiler`](api/core/Compiler) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`CompilerFactory`](api/core/CompilerFactory) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`NgModuleFactory`](api/core/NgModuleFactory) | n/a | This class was mostly used as a part of ViewEngine-based JIT API and is no longer needed in Ivy JIT mode. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. Angular provides APIs that accept NgModule classes directly (such as [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule) and [`createNgModuleRef`](api/core/createNgModuleRef)), consider switching to those APIs instead of using factory-based ones. |
| [`ComponentFactory`](api/core/ComponentFactory) | n/a | Angular no longer requires `ComponentFactory`s. Other APIs allow Component classes to be used directly. |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver) | n/a | Angular no longer requires `ComponentFactory`s. Other APIs allow Component classes to be used directly. |
| `useJit` and `missingTranslation` in [`CompilerOptions`](api/core/CompilerOptions) | n/a | Ivy JIT mode does not support these options. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | n/a | This was previously necessary in some cases to test AOT-compiled components with View Engine, but is no longer since Ivy. |
| `relativeLinkResolution` in the Router [`ExtraOptions`](api/router/ExtraOptions) | Switch to the default of `'corrected'` link resolution | This option was introduced to fix a bug with link resolution in a backwards compatible way. Existing apps which still depend on the buggy legacy behavior should switch to the new corrected behavior and stop passing this flag. |
| `resolver` argument in [`RouterOutletContract.activateWith`](api/router/RouterOutletContract#activateWith) | n/a | `ComponentFactory` and `ComponentFactoryResolver` afre deprecated, and passing an argument for a resolver to retrieve a `ComponentFactory` is no longer required. |
| [`OutletContext#resolver](api/router/OutletContext#resolver) | n/a | `ComponentFactory` and `ComponentFactoryResolver` are deprecated, and using a resolver to retrieve a `ComponentFactory` is no longer required. |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | Return value of [`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate) | The `activated` property is deprecated. Existing usages can migrate to [`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate). |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | The behavior of [`SwUpdate#available`](api/service-worker/SwUpdate#available) can be achieved by filtering for the [`VersionReadyEvent`](api/service-worker/VersionReadyEvent) from [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)

@reviewed 2022-05-31
