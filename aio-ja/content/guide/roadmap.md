# Angularのロードマップ

<p class="roadmap-last-updated">Last updated: 2023-10-24</p>

Angularは、Google内からも、より広範なオープンソースコミュニティからも、多くの機能リクエストを受け取ります。
同時に、私たちのプロジェクトのリストには、メンテナンスタスク、コードのリファクタリング、潜在的なパフォーマンスの向上などがたくさん含まれています。 
私たちは、Dev Relや製品管理、エンジニアリングの代表者を集めて、このリストに優先順位を付けます。 
新しいプロジェクトがキューに入ると、他のプロジェクトに対する相対的な優先順位に基づいて、それらを定期的に配置します。 
作業が完了すると、プロジェクトはキューの上位に移動します。

次のプロジェクトは、特定のAngularバージョンに関連付けられていません。 
完了したときにリリースされ、セマンティックバージョニングにしたがって、リリーススケジュールに基づいて特定のバージョンの一部になります。 
たとえば、機能追加は完成後に次のマイナーでリリースされますが、破壊的な変更が含まれている場合は次のメジャーでリリースされます。

## 進行中

### 新しいリアクティビティモデルによる、ランタイムパフォーマンスとデベロッパーエクスペリエンスの改善

This project rethinks the Angular reactivity model by introducing Signals as a reactivity primitive.
Fully implemented the project will make Zone.js optional. The initial planning resulted in hundreds of discussions, conversations with developers, feedback sessions, user experience studies, and a series of [RFCs](https://github.com/angular/angular/discussions/49685), which received over 1,000 comments.

As part of the v17 release, we graduated the Angular Signals library from developer preview. Next we’ll continue implementing the proposals from the RFC. The first steps will be introducing signal-based inputs and queries.

### Ergonomic deferred loading

In v17 we shipped deferrable views in developer preview, which provide an ergonomic API for deferred code loading. As the next step we'll be iterating on community feedback before officially making this feature stable.

### Built-in control flow

In v17 we shipped a developer preview version of a new control flow. It brings significant performance improvements and better ergonomics for template authoring. We also provided a migration of existing `*ngIf`, `*ngFor`, and `*ngSwitch` which you can run to move your project to the new implementation. As the next steps we'll be working on addressing community feedback before officially completing this project and graduating it from developer preview.

### iframe support in Angular DevTools

We are working on making it possible to debug and profile Angular apps embedded within an iframe on the page. This feature will allow you to select an iframe and inspect it directly within Angular DevTools.

### Enabling hybrid rendering by default

We are working on more developer experience improvements which will allow us to enable hybrid (server-side rendering and static site generation) rendering by default for new projects. In particular, we're focused on route-level rendering strategy configuration and improving developer experience for i18n support.

### Automation for transition of existing hybrid rendering projects to esbuild and vite

In v17 we shipped a vite and esbuild-based application builder and enabled it for new projects by default. It improves build time for projects using hybrid rendering with up to 87%. Next, we'll be working on developing schematics that migrate existing projects using hybrid rendering to the new build pipeline.

### Language Service によるスタンドアロンインポートの効率化

この取り組みの一環として、スタンドアロンおよびNgModuleベースのアプリケーションにおいて、Language Service がコンポーネントとパイプを自動的にインポートするようにします。さらに、より小さなアプリケーションバンドルが可能になるように、Language Service が未使用のインポートの自動削除を提案できるように取り組みます。

### 新しいCDKプリミティブ

We are working on new CDK primitives to facilitate creating custom components based on the WAI-ARIA design patterns for [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox). Angular v14 introduced stable [menu and dialog primitives](https://material.angular.io/cdk/categories) as part of this project, and in v15 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).

### Angularコンポーネントのアクセシビリティ

Angular MaterialのコンポーネントをWCAGなどのアクセシビリティ基準に照らして評価し、そこから発生する問題の修正に取り組んでいます。

### Investigate micro frontend architecture for scalable development processes

We understood and defined the problem space for the past couple of quarters. As the most widely adopted solution we identified is module federation and we suggest it as an option in the rare cases when micro frontend architecture is a feasible solution. Currently, we're working with the community on providing a third-party extension for the Angular CLI via import maps that work with the new application builder, enabling a solution comparable to module federation in webpack.

### Token-based theming APIs

To provide better customization of our Angular material components and enable Material 3 capabilities, we'll be collaborating with Google's Material Design team on defining token-based theming APIs. As of Q2 2023, we're refactoring components to use the new API, finalizing the comprehensive set of tokens, and updating the Sass API based on the new tokens.

### Modernize Angular's unit testing tooling

In v12, we revisited the Angular end-to-end testing experience by replacing Protractor with modern alternatives such as Cypress, Nightwatch, and Webdriver.io. Next, we'd like to tackle `ng test` to modernize Angular's unit testing experience. In Q2, we introduced experimental [Jest](https://jestjs.io/) support and [announced](https://blog.angular.io/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca) the transition from Karma to the [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

## 将来

### Signal debugging in Angular DevTools

With the evolution of Signals in Angular, we'll be also working on a better tooling for debugging them. High on the priority list is a UI for inspecting and debugging Signal-based components.

### Improved hot-module replacement support (HMR)

In v11 we launched initial support for HMR in Angular. Having the new implementation of `ng serve` based on vite and esbuild, we'll explore more advanced HMR for templates, styles, and TypeScript code.

### Exploration of streamed server-side rendering

Over the past few releases we've been working on making Angular's server-side rendering story more robust. On our priority list is to explore streamed server-side rendering for zoneless application.

### Exploration of partial hydration

In v17 we graduated hydration from developer preview and we've been consistently observing 40-50% improvements in LCP. As the next step, we'll explore how we can partially hydrate applications using deferrable views.

As part of this effort, we'll be also evaluating the trade-offs of more fine-grained hydration and resumability. We'll share updates as we progress.

### Investigation for authoring format improvements

Based on our developer surveys' results we saw there are opportunities for improving the ergonomics of the component authoring format. The first step of the process will be to gather requirements and understand the problem space in advanced to an RFC. We'll share updates as we make progress. High priority in the future work will be backward compatibility and interoperability.

### Ensure smooth adoption for future RxJS changes (version 8 and beyond)

We want to ensure Angular developers are taking advantage of the latest capabilities of RxJS and have a smooth transition to the subsequent major releases of the framework.
For this purpose, we will explore and document the scope of the changes in v7 and beyond RxJS and plan an update strategy.

### Support two-dimensional drag-and-drop

As part of this project, we'd like to implement mixed orientation support for the Angular CDK drag and drop. This is one of the repository's most highly [requested features](https://github.com/angular/components/issues/13372).

<details class="completed-details" open="true">
 <summary>
   <h2>Completed</h2>
   <span class="actions">
     <span class="action-expand">Show all</span>
     <span class="action-collapse">Hide all</span>
     <i class="material-icons expand">expand_more</i>
   </span>
 </summary>
 <div class="details-content">

### Update getting started tutorial

*Completed Q4 2023*

Over the past two quarters, we developed a new video and textual tutorial based on standalone components. They are now launched and available on https://angular.io/start.

### Investigate modern bundlers

*Completed Q4 2023*

In Angular v16, we released a developer preview of an esbuild-based builder with support for `ng build` and `ng serve`. The `ng serve` development server uses Vite and a multi-file compilation by esbuild and the Angular compiler. In v17 we graduated the build tooling from developer preview and enabled it by default for new projects.

### Introduce dependency injection debugging APIs

*Completed Q4 2023*

To improve the debugging utilities of Angular and Angular DevTools, we'll work on APIs that provide access to the dependency injection runtime. As part of the project, we'll expose debugging methods that allow us to explore the injector hierarchy and the dependencies across their associated providers. As of v17, we shipped a feature that enables us to plug into the dependency injection life-cycle. We also launched a visualization of the injector tree and inspection of the providers declared inside each individual node,

### Improve documentation and schematics for standalone components

*Completed Q4 2023*

We released a developer preview of the `ng new --standalone` schematics collection, allowing you to create apps free of NgModules. In v17 we switched the new application authoring format to standalone APIs and changed the documentation to reflect the recommendation. Additionally, we shipped schematics which support updating existing applications to standalone components, directives, and pipes. Even though NgModules will stick around for foreseeable future, we recommend you to explore the benefits of the new APIs to improve developer experience and benefit from the new features we build for them.

### Explore hydration and server-side rendering improvements

*Completed Q4 2023*

In v16, we released a developer preview of non-destructive full hydration, see the [hydration guide](guide/hydration) and the [blog post](https://blog.angular.io/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) for additional information. We're already seeing significant improvements to Core Web Vitals, including [LCP](https://web.dev/lcp) and [CLS](https://web.dev/cls). In lab tests, we consistently observed 45% better LCP of a real-world app.

In v17 we launched hydration outside developer preview and did a series of improvements in the server-side rendering story, including: route discovery at runtime for SSG, up to 87% faster build times for hybrid rendered applications, prompt that enables hybrid rendering for new projects.

### Non-destructive full app hydration

*Completed Q2 2023*

In v16, we released a developer preview of non-destructive full hydration, which allows Angular to reuse existing DOM nodes on a server-side rendered page, instead of re-creating an app from scratch. See additional information in the [hydration guide](guide/hydration).

### Improvements in the image directive

*Completed Q1 2023*

We released the Angular [image directive](https://developer.chrome.com/blog/angular-image-directive/) as stable in v15. We introduced a new fill mode feature that enables images to fit within their parent container rather than having explicit dimensions. Over the past two months, the Chrome Aurora team backported the directive to v12 and newer.

### Documentation refactoring

*Completed Q1 2023*

Ensure all existing documentation fits into a consistent set of content types. Update excessive use of tutorial-style documentation into independent topics. We want to ensure the content outside the main tutorials is self-sufficient without being tightly coupled to a series of guides. In Q2 2022, we refactored the [template content](https://github.com/angular/angular/pull/45897) and dependency injection. In Q1 2023, we improved the HTTP guides, and with this, we're putting the documentation refactoring project on hold.


### Improve image performance

*Completed Q4 2022*

The [Aurora](https://web.dev/introducing-aurora/) and the Angular teams are working on the implementation of an image directive that aims to improve [Core Web Vitals](https://web.dev/vitals). We shipped a stable version of the image directive in v15.

### Modern CSS

*Completed Q4 2022*

The Web ecosystem evolves constantly and we want to reflect the latest modern standards in Angular. In this project we aim to provide guidelines on using modern CSS features in Angular to ensure developers follow best practices for layout, styling, etc. We shared official guidelines for layout and as part of the initiative stopped publishing flex layout. Learn [more on our blog](https://blog.angular.io/modern-css-in-angular-layouts-4a259dca9127).

### Support adding directives to host elements

*Completed Q4 2022*

A [long-standing feature request](https://github.com/angular/angular/issues/8785) is to add the ability to add directives to host elements. The feature lets developers augment their own components with additional behaviors without using inheritance. In v15 we shipped our directive composition API, which enables enhancing host elements with directives.

### Better stack traces

*Completed Q4 2022*

The Angular and the Chrome DevTools are working together to enable more readable stack traces for error messages. In v15 we [released improved](https://twitter.com/angular/status/1578807563017392128) relevant and linked stack traces. As a lower priority initiative, we'll be exploring how to make the stack traces friendlier by providing more accurate call frame names for templates.

### Enhanced Angular Material components by integrating MDC Web

*Completed Q4 2022*

[MDC Web](https://material.io/develop/web) is a library created by the Google Material Design team that provides reusable primitives for building Material Design components.
The Angular team is incorporating these primitives into Angular Material.
Using MDC Web aligns Angular Material more closely with the Material Design specification, expands accessibility, improves component quality, and improves the velocity of our team.

### Implement APIs for optional NgModules

*Completed Q4 2022*

In the process of making Angular simpler, we are working on [introducing APIs](/guide/standalone-components) that allow developers to initialize apps, instantiate components, and use the router without NgModules. Angular v14 introduces developer preview of the APIs for standalone components, directives, and pipes. In the next few quarters we'll collect feedback from developers and finalize the project making the APIs stable. As the next step we will work on improving use cases such as `TestBed`, Angular elements, etc.

### Allow binding to protected fields in templates

*Completed Q2 2022*

To improve the encapsulation of Angular components we enabled binding to protected members of the component instance. This way you'll no longer have to expose a field or a method as public to use it inside your templates.

### Publish guides on advanced concepts

*Completed Q2 2022*

Develop and publish an in-depth guide on change detection.
Develop content for performance profiling of Angular apps.
Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.

### Rollout strict typings for `@angular/forms`

In Q4 2021 we designed a solution for introducing strict typings for forms and in Q1 2022 we concluded the corresponding [request for comments](https://github.com/angular/angular/discussions/44513).
Currently, we are implementing a rollout strategy with an automated migration step that will enable the improvements for existing projects.
We are first testing the solution with more than 2,500 projects at Google to ensure a smooth migration path for the external community.

### Remove legacy [View Engine](guide/glossary#ve)

*Completed Q1 2022*

After the transition of all our internal tooling to Ivy is completed, we will remove the legacy View Engine for reduced Angular conceptual overhead, smaller package size, lower maintenance cost, and lower codebase complexity.

### Simplified Angular mental model with optional NgModules

*Completed Q1 2022*

To simplify the Angular mental model and learning journey, we will be working on making NgModules optional.
This work lets developers develop standalone components and implement an alternative API for declaring the compilation scope of the component.
We kicked this project off with high-level design discussions that we captured in an [RFC](https://github.com/angular/angular/discussions/43784).

### Design strict typing for `@angular/forms`

*Completed Q1 2022*

We will work on finding a way to implement stricter type checking for reactive forms with minimal backward incompatible implications.
This way, we let developers catch more issues during development time, enable better text editor and IDE support, and improve the type checking for reactive forms.

### Improve integration of Angular DevTools with framework

*Completed Q1 2022*

To improve the integration of Angular DevTools with the framework, we are working on moving the codebase to the [angular/angular](https://github.com/angular/angular) monorepository.
This includes transitioning Angular DevTools to Bazel and integrating it into the existing processes and CI pipeline.

### Launch advanced compiler diagnostics

*Completed Q1 2022*

Extend the diagnostics of the Angular compiler outside type checking.
Introduce other correctness and conformance checks to further guarantee correctness and best practices.

### E2Eテスト戦略のアップデート

将来を見据えたe2eテスト戦略を確実に提供するために、Protractorの現状、コミュニティによるイノベーション、e2eのベストプラクティスを評価し、新しい可能性を模索したいと考えています。As first steps of the effort, we shared an [RFC](https://github.com/angular/protractor/issues/5502) and worked with partners to ensure smooth integration between the Angular CLI and state of the art tooling for e2e testing. As the next step, we need to finalize the recommendations and compile a list of resources for the transition.

### Ivyを利用したAngularライブラリ

2020年の初め、私たちはIvyライブラリ配布のための[RFC](https://github.com/angular/angular/issues/38366)を共有しました。コミュニティからの貴重なフィードバックの後、私たちはプロジェクトのデザインを開発しました。
We are now investing in the development of Ivy library distribution, including an update of the library package format to use Ivy compilation, unblock the deprecation of the View Engine library format, and ngcc.

### テスト環境の自動ティアダウンによるテスト時間とデバッグの改善

_Completed Q3 2021_

テスト時間を改善し、テスト間の分離を改善するために、<code>[TestBed](api/core/testing/TestBed)</code> を変更して、各テスト実行後にテスト環境を自動的にクリーンアップしたり、分解したりするようにしたいと思います。

### Deprecate and remove IE11 support

_Completed Q3 2021_

IE11 has been preventing Angular from taking advantage of some of the modern features of the Web platform. As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide. We ran an [RFC](https://github.com/angular/angular/issues/41840) to collected feedback from the community and decide on next steps to move forward.

### Leverage ES2017+ as the default output language

_Completed Q3 2021_

Supporting modern browsers will allow us to leverage the more compact, expressive, and performant new syntax of JavaScript. As part of this project we’ll investigate what are the blockers to move forward with this effort and take the steps forward to enable it.

### Accelerated debugging and performance profiling with Angular DevTools

*Completed Q2 2021*

We are working on development tooling for Angular that provides utilities for debugging and performance profiling.
This project aims to help developers understand the component structure and the change detection in an Angular app.

### 統合されたAngularのバージョニングとブランチでリリースを効率化

_Completed Q2 2021_

Angularの複数のGitHubリポジトリ（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli)、および[angular/components](https://github.com/angular/components)）間でリリース管理ツールを統合したいと考えています。この取り組みにより、インフラストラクチャの再利用、プロセスの統一と簡素化、リリースプロセスの信頼性の向上が可能になります。

### コミットメッセージの標準化による開発者の一貫性の向上

_Completed Q2 2021_

開発プロセスに一貫性を持たせ、インフラストラクチャツールを再利用するために、Angularリポジトリ全体（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components)、および[angular/angular-cli](https://github.com/angular/angular-cli)）でコミットメッセージの要件と準拠を統一したいと考えています。

### Angularの言語サービスをIvyに移行する

_Completed Q2 2021_

このプロジェクトの目標は、言語サービスをIvyに移行することでエクスペリエンスを向上させ、レガシーな依存関係を取り除くことです。現在、言語サービスは Ivy アプリケーションでも View Engine コンパイラと型チェックを使用しています。私たちは、アプリケーションの動作に合わせてAngular LanguageサービスにIvyのテンプレートパーサーと改良された型チェックを使用したいと考えています。また、今回の移行はView Engineの削除のブロック解除に向けた一歩となり、Angularの簡素化、npmのパッケージサイズの縮小、フレームワークの保守性の向上につながります。

### ネイティブな[Trusted Types](https://web.dev/trusted-types/)でAngularのセキュリティを強化する

_Completed Q2 2021_

Googleのセキュリティチームと協力して、新しいTrusted Types APIのサポートを追加します。 このWebプラットフォームAPIは、開発者がより安全なWebアプリケーションを構築するのに役立ちます。

### Angular CLI webpack 5でビルド速度とバンドルサイズを最適化

_Completed Q2 2021_

v11リリースの一環として、Angular CLIでwebpack 5のオプトインプレビューを導入しました。安定性を確保するために、ビルド速度とバンドルサイズの改善を可能にするための実装を引き続きイテレーションしていきます。

### ユニバーサルアプリケーションにおける重要なスタイルのインライン化によるアプリケーション高速化

_Completed Q1 2021_

外部スタイルシートの読み込みはブロッキング操作であり、ブラウザは参照されているすべての CSS を読み込むまでアプリケーションのレンダリングを開始できないことを意味します。ページのヘッダーにレンダーブロッキングリソースがあると、そのロードパフォーマンスに大きな影響を与える可能性があり、たとえば、[First contentful paint](https://web.dev/first-contentful-paint/)などです。アプリケーションを高速化するために、Google Chrome チームと協力して、重要な CSS をインライン化し、残りのスタイルを非同期にロードします。

### よりよいAngularエラーメッセージでデバッグを改善

_Completed Q1 2021_

エラーメッセージは、開発者がそれらを解決するのに役立つ実用的な情報が限られていることがよくあります。私たちは、よりスムーズなデバッグ体験を保証するために、関連するコード、開発ガイド、およびその他の資料を追加することで、エラーメッセージをより発見しやすくするために取り組んでいます。

### 刷新された入門ドキュメントによる開発者のオンボーディングの改善

_Completed Q1 2021_

ユーザーの学習ジャーニーを再定義し、入門ドキュメントを更新します。 Angularの利点とその機能を探る方法を明確に述べ、開発者が可能な限り短時間でフレームワークに習熟できるようにガイダンスを提供します。

### Expand component harnesses best practices

_Completed Q1 2021_

Angular CDK introduced the concept of [component test harnesses](https://material.angular.io/cdk/test-harnesses) to Angular in version 9. Test harnesses allow component authors to create supported APIs for testing component interactions. We're continuing to improve this harness infrastructure and clarifying the best practices around using harnesses. We're also working to drive more harness adoption inside of Google.

### Author a guide for content projection

_Completed Q2 2021_

Content projection is a core Angular concept that does not have the presence it deserves in the documentation. As part of this project we want to identify the core use cases and concepts for content projection and document them.

### Migrate to ESLint

_Completed Q4 2020_

With the deprecation of TSLint we will be moving to ESLint. As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular applications and introduce new tooling to the Angular CLI toolchain.

### Operation Bye Bye Backlog (aka Operation Byelog) 

_Completed Q4 2020_

We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs. After that, we'll commit up to 20% of our engineering capacity to keep up with new submissions promptly.

 </div>
</details>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-05-03
