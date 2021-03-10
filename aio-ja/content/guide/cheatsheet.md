<div class="center-layout-wide">

<h1 class="no-toc">チートシート</h1>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ブートストラップ</th>
<th><p><code>import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>platformBrowserDynamic().bootstrapModule</b>(AppModule);</code></td>
<td><p>指定された<code>NgModule</code>のルートコンポーネントを使って、アプリケーションをブートストラップします。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>NgModules</th>
<th><p><code>import { NgModule } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code>@<b>NgModule</b>({
  declarations: ..., imports: ..., exports: ...,
  providers: ..., bootstrap: ...
})
class MyModule {}
</code></td>
<td><p>コンポーネント、ディレクティブ、パイプおよびプロバイダーを含むモジュールを定義します。</p>
</td>
</tr><tr>
<td><code><b>declarations:</b> [MyRedComponent, MyBlueComponent, MyDatePipe]</code></td>
<td><p>このモジュールに属するコンポーネント、ディレクティブおよびパイプのリスト。</p>
</td>
</tr><tr>
<td><code><b>imports:</b> [BrowserModule, SomeOtherModule]</code></td>
<td><p>このモジュールにインポートするモジュールのリスト。
インポートされたモジュールのすべては、このモジュールの<code>declarations</code>で使用できます。</p>
</td>
</tr><tr>
<td><code><b>exports:</b> [MyRedComponent, MyDatePipe]</code></td>
<td><p>このモジュールをインポートするモジュールに公開されるコンポーネント、ディレクティブ、およびパイプのリスト。</p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide: ... }]</code></td>
<td><p>このモジュールと、このモジュールをインポートするモジュールの両方に公開される依存性注入のプロバイダーのリスト。</p>
</td>
</tr><tr>
<td><code><b>entryComponents:</b> [SomeComponent, OtherComponent]</code></td>
<td><p>到達可能なテンプレートで参照されていないコンポーネントのリスト。たとえば、コードから動的に作成されたもの。</p></td>
</tr><tr>
<td><code><b>bootstrap:</b> [MyAppComponent]</code></td>
<td><p>このモジュールがブートストラップされたときにブートストラップされるコンポーネントのリスト。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>テンプレートシンタックス</th>
<th></th>
</tr>
<tr>
<td><code>&lt;input <b>[value]</b>="firstName"&gt;</code></td>
<td><p><code>firstName</code>式の結果に<code>value</code>プロパティをバインドします。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[attr.role]</b>="myAriaRole"&gt;</code></td>
<td><p><code>myAriaRole</code>式の結果に<code>role</code>属性をバインドします。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[class.extra-sparkle]</b>="isDelightful"&gt;</code></td>
<td><p>要素の<code>extra-sparkle</code>のCSSクラスの有無を、<code>isDelightful</code>式の真偽値にバインドします。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[style.width.px]</b>="mySize"&gt;</code></td>
<td><p><code>mySize</code>式の結果にスタイルプロパティ<code>width</code>をピクセル単位でバインドします。単位はオプションです。</p>
</td>
</tr><tr>
<td><code>&lt;button <b>(click)</b>="readRainbow($event)"&gt;</code></td>
<td><p>このボタン要素（またはその子要素）でクリックイベントがトリガーされ、イベントオブジェクトに渡されるときに、メソッド<code>readRainbow</code>を呼び出します。</p>
</td>
</tr><tr>
<td><code>&lt;div title="Hello <b>{{ponyName}}</b>"&gt;</code></td>
<td><p>プロパティを補間された文字列にバインドします（例： "Hello Seabiscuit"）。次と同等です：
<code>&lt;div [title]="'Hello ' + ponyName"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Hello <b>{{ponyName}}</b>&lt;/p&gt;</code></td>
<td><p>テキストコンテンツを補間された文字列にバインドします（例： "Hello Seabiscuit"）。</p>
</td>
</tr><tr>
<td><code>&lt;my-cmp <b>[(title)]</b>="name"&gt;</code></td>
<td><p>双方向データバインディングを設定します。次と同等です: <code>&lt;my-cmp [title]="name" (titleChange)="name=$event"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;video <b>#movieplayer</b> ...&gt;&lt;/video&gt;
&lt;button <b>(click)</b>="movieplayer.play()"&gt;Play&lt;/button&gt;
</code></td>
<td><p>現在のテンプレートのデータバインディング式およびイベントバインディング式の中で、<code>video</code>要素のインスタンスへのアクセスを提供するローカル変数<code>movieplayer</code>を作成します。</p>
</td>
</tr><tr>
<td><code>&lt;p <b>*myUnless</b>="myExpression"&gt;...&lt;/p&gt;</code></td>
<td><p><code>*</code>シンボルは、現在の要素を埋め込みテンプレートに変換します。次と同等です:
<code>&lt;ng-template [myUnless]="myExpression"&gt;&lt;p&gt;...&lt;/p&gt;&lt;/ng-template&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Card No.: <b>{{cardNumber | myCardNumberFormatter}}</b>&lt;/p&gt;</code></td>
<td><p><code>cardNumber</code>式の現在の値を<code>myCardNumberFormatter</code>というパイプで変換します。</p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Employer: <b>{{employer?.companyName}}</b>&lt;/p&gt;</code></td>
<td><p>セーフナビゲーション演算子（<code>?</code>）は、<code>employer</code>フィールドがオプションでもし値が<code>undefined</code>の場合、残りの式を無視することを意味します。</p>
</td>
</tr><tr>
<td><code>&lt;<b>svg:</b>rect x="0" y="0" width="100" height="100"/&gt;</code></td>
<td><p>SVG要素をHTML要素から曖昧さを取り除くために、SVGスニペットテンプレートにはルート要素に<code>svg:</code>というプレフィックスが必要です。</p>
</td>
</tr><tr>
<td><code>&lt;<b>svg</b>&gt;
  &lt;rect x="0" y="0" width="100" height="100"/&gt;
&lt;/<b>svg</b>&gt;
</code></td>
<td><p><code>&lt;svg&gt;</code>ルート要素は接頭辞なしで自動的にSVG要素として検出されます。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ビルトインディレクティブ</th>
<th><p><code>import { CommonModule } from '@angular/common';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;section <b>*ngIf</b>="showSection"&gt;</code></td>
<td><p><code>showSection</code>式に基づいてDOMツリーの一部を削除または再作成します。</p>
</td>
</tr><tr>
<td><code>&lt;li <b>*ngFor</b>="let item of list"&gt;</code></td>
<td><p>li要素とその内容をテンプレートに変換し、それを使用してlist内の各項目のビューをインスタンス化します。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngSwitch]</b>="conditionExpression"&gt;
  &lt;ng-template <b>[<b>ngSwitchCase</b>]</b>="case1Exp"&gt;...&lt;/ng-template&gt;
  &lt;ng-template <b>ngSwitchCase</b>="case2LiteralString"&gt;...&lt;/ng-template&gt;
  &lt;ng-template <b>ngSwitchDefault</b>&gt;...&lt;/ng-template&gt;
&lt;/div&gt;
</code></td>
<td><p><code>conditionExpression</code>の現在の値に基づいて埋め込みテンプレートの1つを選択することによって、divの内容を条件にしたがって入れ替えます。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngClass]</b>="{'active': isActive, 'disabled': isDisabled}"&gt;</code></td>
<td><p>要素のCSSクラスの有無を、関連付けられたマップ値の真偽値にバインドします。 右側の式は {class-name: true/false } なマップを返さなければなりません。</p>
</td>
</tr>
<tr>
<td><code>&lt;div <b>[ngStyle]</b>="{'property': 'value'}"&gt;
&lt;div <b>[ngStyle]</b>="dynamicStyles()"&gt;
</code></td>
<td><p>CSSを使ってスタイルをHTML要素に適用します。最初の例のようにCSSを直接使うこともできますし、コンポーネントのメソッドを呼び出すこともできます。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>フォーム</th>
<th><p><code>import { FormsModule } from '@angular/forms';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;input <b>[(ngModel)]</b>="userName"&gt;</code></td>
<td><p>フォームコントロールの双方向データバインディング、パース、およびバリデーションを行います。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>クラスデコレーター</th>
<th><p><code>import { Directive, ... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Component({...})</b>
class MyComponent() {}
</code></td>
<td><p>クラスがコンポーネントであることを宣言し、コンポーネントに関するメタデータを提供します。</p>
</td>
</tr><tr>
<td><code><b>@Directive({...})</b>
class MyDirective() {}
</code></td>
<td><p>クラスがディレクティブであることを宣言し、ディレクティブに関するメタデータを提供します。</p>
</td>
</tr><tr>
<td><code><b>@Pipe({...})</b>
class MyPipe() {}
</code></td>
<td><p>クラスがパイプであることを宣言し、パイプに関するメタデータを提供します。</p>
</td>
</tr><tr>
<td><code><b>@Injectable()</b>
class MyService() {}
</code></td>
<td><p>Declares that a class can be provided and injected by other classes. Without this decorator, the compiler won't generate enough metadata to allow the class to be created properly when it's injected somewhere.</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ディレクティブの設定</th>
<th><p><code>@Directive({ property1: value1, ... })</code>
</p>
</th>
</tr>
<tr>
<td><code><b>selector:</b> '.cool-button:not(a)'</code></td>
<td><p>テンプレート内でこのディレクティブを識別するCSSセレクタを指定します。 サポートされるセレクタには、<code>element</code>、
<code>[attribute]</code>、<code>.class</code>および<code>:not()</code>です。
<p>親子関係セレクタはサポートしていません。</p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide: ... }]</code></td>
<td><p>このディレクティブとその子孫に対する依存性注入プロバイダのリスト。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>コンポーネントの設定</th>
<th><p>
<code>@Component</code>は<code>@Directive</code>を継承するので、
<code>@Directive</code>の設定はコンポーネントにも同様に適用されます。</p>
</th>
</tr>
<tr>
<td><code><b>moduleId:</b> module.id</code></td>
<td><p>設定されている場合、<code>templateUrl</code>と<code>styleUrl</code>はコンポーネントに対して相対パスとして解決されます。</p>
</td>
</tr><tr>
<td><code><b>viewProviders:</b> [MyService, { provide: ... }]</code></td>
<td><p>このコンポーネントのビューにスコープされた依存性注入プロバイダのリスト。</p>
</td>
</tr><tr>
<td><code><b>template:</b> 'Hello {{name}}'
<b>templateUrl:</b> 'my-component.html'
</code></td>
<td><p>コンポーネントのビューのインラインテンプレートまたは外部テンプレートURL。</p>
</td>
</tr><tr>
<td><code><b>styles:</b> ['.primary {color: red}']
<b>styleUrls:</b> ['my-component.css']
</code></td>
<td><p>コンポーネントのビューをスタイリングするためのインラインCSSスタイルまたは外部スタイルシートURLのリスト。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ディレクティブとコンポーネントのクラスフィールドデコレータ</th>
<th><p><code>import { Input, ... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Input()</b> myProperty;</code></td>
<td><p>プロパティバインディングを使用して更新できる入力プロパティを宣言します。 (例:
<code>&lt;my-cmp [myProperty]="someExpression"&gt;</code>).</p>
</td>
</tr><tr>
<td><code><b>@Output()</b> myEvent = new EventEmitter();</code></td>
<td><p>購読可能なイベントを発生させる出力プロパティをイベントバインディングで宣言します。 (例: <code>&lt;my-cmp (myEvent)="doSomething()"&gt;</code>)</p>
</td>
</tr><tr>
<td><code><b>@HostBinding('class.valid')</b> isValid;</code></td>
<td><p>ディレクティブ/コンポーネントのプロパティ（<code>isValid</code>）にホスト要素のプロパティ（ここではCSSクラス<code>valid</code>）をバインドします。</p>
</td>
</tr><tr>
<td><code><b>@HostListener('click', ['$event'])</b> onClick(e) {...}</code></td>
<td><p>ホスト要素のイベント（<code>click</code>）を、オプショナルな引数（<code>$event</code>）を渡してディレクティブ/コンポーネントのメソッド（<code>onClick</code>）で購読します。</p>
</td>
</tr><tr>
<td><code><b>@ContentChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>コンポーネントのコンテンツクエリ（<code>myPredicate</code>）の最初の結果をクラスのプロパティ（<code>myChildComponent</code>）にバインドします。</p>
</td>
</tr><tr>
<td><code><b>@ContentChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>コンポーネントのコンテンツクエリ（<code>myPredicate</code>）の結果をクラスのプロパティ（<code>myChildComponents</code>）にバインドします。</p>
</td>
</tr><tr>
<td><code><b>@ViewChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>コンポーネントビューのクエリ（<code>myPredicate</code>）の最初の結果をクラスのプロパティ（<code>myChildComponent</code>）にバインドします。 ディレクティブでは使用できません。</p>
</td>
</tr><tr>
<td><code><b>@ViewChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>コンポーネントビューのクエリ（<code>myPredicate</code>）の結果をクラスのプロパティ（<code>myChildComponents</code>）にバインドします。 ディレクティブでは使用できません。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ディレクティブとコンポーネントの変更検知とライフサイクルフック</th>
<th><p>(クラスメソッドとして実装されます)
</p>
</th>
</tr>
<tr>
<td><code><b>constructor(myService: MyService, ...)</b> { ... }</code></td>
<td><p>他のライフサイクルフックの前に呼び出されます。 これを使用して依存を注入しますが、ここで複雑な処理をするのは避けてください。</p>
</td>
</tr><tr>
<td><code><b>ngOnChanges(changeRecord)</b> { ... }</code></td>
<td><p>コンテンツビューまたは子ビューを処理する前と、入力プロパティが変更されるたびに呼び出されます。</p>
</td>
</tr><tr>
<td><code><b>ngOnInit()</b> { ... }</code></td>
<td><p>コンストラクタと入力プロパティの初期化、最初の<code>ngOnChanges</code>の後に呼び出されます。</p>
</td>
</tr><tr>
<td><code><b>ngDoCheck()</b> { ... }</code></td>
<td><p>コンポーネントまたはディレクティブの入力プロパティがチェックされるたびに呼び出されます。 これを使用して、カスタムチェックを実行して変更検出を拡張します。</p>
</td>
</tr><tr>
<td><code><b>ngAfterContentInit()</b> { ... }</code></td>
<td><p>コンポーネントまたはディレクティブのコンテンツの初期化が完了したときに<code>ngOnInit</code>の後に呼び出されます。</p>
</td>
</tr><tr>
<td><code><b>ngAfterContentChecked()</b> { ... }</code></td>
<td><p>コンポーネントまたはディレクティブのすべてのチェックの後に呼び出されます。</p>
</td>
</tr><tr>
<td><code><b>ngAfterViewInit()</b> { ... }</code></td>
<td><p>コンポーネントのビューとと子のビュー、あるいはディレクティブがあるビューの初期化が完了したときに<code>ngAfterContentInit</code>の後に呼び出されます。</p>
</td>
</tr><tr>
<td><code><b>ngAfterViewChecked()</b> { ... }</code></td>
<td><p>コンポーネントのビューとと子のビュー、あるいはディレクティブがあるビューをチェックするたびに呼び出されます。 </p>
</td>
</tr><tr>
<td><code><b>ngOnDestroy()</b> { ... }</code></td>
<td><p>インスタンスが破棄される前に一度呼び出されます。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>依存性の注入の設定</th>
<th></th>
</tr>
<tr>
<td><code>{ <b>provide</b>: MyService, <b>useClass</b>: MyMockService }</code></td>
<td><p><code>MyService</code>のプロバイダを<code>MyMockService</code>クラスに設定またはオーバーライドします。</p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyService, <b>useFactory</b>: myFactory }</code></td>
<td><p><code>MyService</code>のプロバイダを<code>myFactory</code>ファクトリ関数に設定またはオーバーライドします。</p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyValue, <b>useValue</b>: 41 }</code></td>
<td><p><code>MyValue</code>のプロバイダを<code>41</code>の値に設定またはオーバーライドします。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>ルーティングとナビゲーション</th>
<th><p><code>import { Routes, RouterModule, ... } from '@angular/router';</code>
</p>
</th>
</tr>
<tr>
<td><code>const routes: <b>Routes</b> = [
  { path: '', component: HomeComponent },
  { path: 'path/:routeParam', component: MyComponent },
  { path: 'staticPath', component: ... },
  { path: '**', component: ... },
  { path: 'oldPath', redirectTo: '/staticPath' },
  { path: ..., component: ..., data: { message: 'Custom' } }
]);

const routing = RouterModule.forRoot(routes);
</code></td>
<td><p>アプリケーションのルートを構成します。 静的なもの、パラメータ化されたもの、リダイレクトおよびワイルドカードのルートをサポートします。 また、カスタムのdataおよびresolveをサポートします。</p>
</td>
</tr><tr>
<td><code>&lt;<b>router-outlet</b>&gt;&lt;/<b>router-outlet</b>&gt;
&lt;<b>router-outlet</b> name="aux"&gt;&lt;/<b>router-outlet</b>&gt;
</code></td>
<td><p>アクティブなルートのコンポーネントをロードする場所をマークします。</p>
</td>
</tr><tr>
<td><code>&lt;a <b>routerLink</b>="/path"&gt;
&lt;a <b>[routerLink]</b>="[ '/path', routeParam ]"&gt;
&lt;a <b>[routerLink]</b>="[ '/path', { matrixParam: 'value' } ]"&gt;
&lt;a <b>[routerLink]</b>="[ '/path' ]" [queryParams]="{ page: 1 }"&gt;
&lt;a <b>[routerLink]</b>="[ '/path' ]" fragment="anchor"&gt;
</code></td>
<td><p>ルートパス、必須もしくはオプショナルのパラメータ、クエリパラメータおよびフラグメントで構成されるルートの設定に基づいて、別のビューへのリンクを作成します。 rootとなるルートに移動するには、<code>/</code>接頭辞を使用します。 子ルートの場合は、<code>./</code>接頭辞を使用します。 兄弟または親の場合は、<code>../</code>接頭辞を使用します。</p>
</td>
</tr><tr>
<td><code>&lt;a [routerLink]="[ '/path' ]" <b>routerLinkActive</b>="active"&gt;</code></td>
<td><p><code>routerLink</code>が現在のアクティブなルートになると、指定されたクラスが要素に追加されます。</p>
</td>
</tr><tr>
<td><code>class <b>CanActivate</b>Guard implements <b>CanActivate</b> {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canActivate: [<b>CanActivate</b>Guard] }
</code></td>
<td><p>このコンポーネントをアクティブにすべきかを判断するためにルータが最初に呼び出すクラスを定義するためのインタフェース。 boolean|UrlTree、もしくはboolean|UrlTreeを解決するObservableかPromiseを返す必要があります。</p>
</td>
</tr><tr>
<td><code>class <b>CanDeactivate</b>Guard implements <b>CanDeactivate</b>&lt;T&gt; {
  canDeactivate(
    component: T,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canDeactivate: [<b>CanDeactivate</b>Guard] }
</code></td>
<td><p>ナビゲーション後にルータがこのコンポーネントを非アクティブ化すべきかを判断するためにルータが最初に呼び出すべきクラスを定義するためのインタフェース。 boolean|UrlTree、もしくはboolean|UrlTreeを解決するObservableかPromiseを返す必要があります。</p>
</td>
</tr><tr>
<td><code>class <b>CanActivateChild</b>Guard implements <b>CanActivateChild</b> {
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canActivateChild: [CanActivateGuard],
  children: ... }
</code></td>
<td><p>子ルートをアクティブにすべかを判断するためにルータが最初に呼び出すクラスを定義するためのインタフェース。boolean|UrlTree、もしくはboolean|UrlTreeを解決するObservableかPromiseを返す必要があります。</p>
</td>
</tr><tr>
<td><code>class <b>Resolve</b>Guard implements <b>Resolve</b>&lt;T&gt; {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;any&gt;|Promise&lt;any&gt;|any { ... }
}

{ path: ..., resolve: [<b>Resolve</b>Guard] }
</code></td>
<td><p>ルートをレンダリングする前にルートデータを解決するためにルータが最初に呼び出すべきクラスを定義するためのインタフェース。 値か、その値を解決するObservableおよびPromiseを返す必要があります。</p>
</td>
</tr><tr>
<td><code>class <b>CanLoad</b>Guard implements <b>CanLoad</b> {
  canLoad(
    route: Route
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canLoad: [<b>CanLoad</b>Guard], loadChildren: ... }
</code></td>
<td><p>遅延ロードされたモジュールがロードされるべきかを判断するためにルータが最初に呼び出すべきクラスを定義するためのインタフェース。boolean|UrlTree、もしくはboolean|UrlTreeを解決するObservableかPromiseを返す必要があります。</p>
</td>
</tr>
</tbody></table>

</div>
