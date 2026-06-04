# パイプによる変更検知

パイプは、ユーザー操作に基づいて変更される可能性のあるデータバインドされた値と頻繁に使用されます。
データが `String` や `Number` などのプリミティブな入力値、または `Date` や `Array` などの入力としてオブジェクト参照である場合、Angularは値の変更を検出するたびにパイプを実行します。

<docs-code-multifile path="adev/src/content/examples/pipes/src/app/power-booster.component.ts">
  <docs-code header="src/app/exponential-strength.pipe.ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"
             highlight="[16]" visibleRegion="pipe-class" />
  <docs-code header="src/app/power-booster.component.ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>

`exponentialStrength` パイプは、ユーザーが値または指数を変更するたびに実行されます。上の強調表示された行を参照してください。

Angularは各変更を検出し、パイプを直ちに実行します。
これはプリミティブな入力値には適しています。
ただし複合オブジェクト（日付の月、配列の要素またはオブジェクトのプロパティなど）の *内部* で何かを変更する場合は、変更検知の仕組みと`impure` パイプを使用する方法を理解する必要があります。

## 変更検知の仕組み

Angularは、すべてのDOMイベント（キーストローク、マウス移動、タイマーティック、サーバー応答）の後に実行される変更検知プロセスで、データバインドされた値の変更を探します。
パイプを使用しない次の例では、Angularがデフォルトの変更検知戦略を使用して、`heroes` 配列内のすべてのヒーローの表示を監視して更新する方法を示します。
この例では、タブは次の内容を示しています。

| ファイル                               | 詳細 |
|:---                                 |:---     |
| `flying-heroes.component.html (v1)` | `*ngFor` 反復子はヒーローの名前を表示します。                     |
| `flying-heroes.component.ts (v1)`   | ヒーローを提供し、ヒーローを配列に追加し、配列をリセットします。 |

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.component.html (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-1"/>
    <docs-code header="src/app/flying-heroes.component.ts (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="v1"/>
</docs-code-multifile>

ユーザーがヒーローを追加するたびに、Angularは表示を更新します。
ユーザーが **リセット** ボタンをクリックすると、Angularは `heroes` を元のヒーローの新しい配列に置き換え、表示を更新します。
ヒーローの削除または変更機能を追加した場合、Angularはこれらの変更を検出して表示も更新します。

ただし、表示を更新するためにパイプを毎回実行すると、アプリケーションのパフォーマンスが低下します。
そのため、Angularは次のセクションで説明するように、パイプを実行するためのより高速な変更検知アルゴリズムを使用します。

## プリミティブとオブジェクト参照に対する純粋な変更の検知

デフォルトでは、パイプは *純粋* に定義されているため、Angularは入力値またはパラメーターに対する *純粋な変更* を検出した場合にのみパイプを実行します。
純粋な変更とは、プリミティブな入力値（`String`や`Number`、`Boolean`、`Symbol` など）や変更されたオブジェクト参照（`Date`や`Array`、`Function`、`Object` など）に対する変更です。

純粋なパイプは、純粋な関数を使用する必要があります。これは、副作用なしに入力を処理して値を返す関数です。
言い換えれば、同じ入力に対して、純粋な関数は常に同じ出力を返す必要があります。

純粋なパイプを使用すると、Angularはオブジェクトや配列内の変更を無視します。これは、プリミティブな値またはオブジェクト参照の確認は、オブジェクト内の違いを深く確認するよりもはるかに高速であるためです。
Angularは、パイプの実行とビューの更新をスキップできるかどうかをすばやく判断できます。

ただし、配列を入力とする純粋なパイプは、期待通りに動作しない場合があります。
この問題を説明するために、前の例を変更して、ヒーローのリストを飛ぶことができるヒーローのみにフィルターします。

このために、次のコードに示すように、`*ngFor` 反復子に `FlyingHeroesPipe` を使用することを検討します。
この例のタブは次の内容を示しています。

| ファイル                          | 詳細 |
|:---                            |:---     |
| flying-heroes.component.html   | 新しいパイプを使用したテンプレート。 |
| flying-heroes.pipe.ts          | 飛ぶヒーローをフィルターするカスタムパイプを含むファイル。 |

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.component.html" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-flying-heroes"/>
    <docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

アプリケーションは現在、予期しない動作を示しています。ユーザーが飛ぶヒーローを追加しても、「飛ぶヒーロー」の下には表示されません。
これは、ヒーローを追加するコードが、`flyingHeroes` パイプの入力として使用される `heroes` 配列にヒーローを追加するためです。

<docs-code header="src/app/flying-heroes.component.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="push"/>

変更検知器は配列内の要素の変更を無視するため、パイプは実行されません。
Angularが変更された配列要素を無視する理由は、配列への *参照* が変更されていないためです。
配列が同じであるため、Angularは表示を更新しません。

期待通りの動作を実現する1つの方法は、オブジェクト参照自体を変更することです。
変更された要素を含む新しい配列を作成し、その配列をパイプに入力します。
前の例では、新しいヒーローを追加した配列を作成し、それを `heroes` に代入します。
Angularは配列参照の変更を検出し、パイプを実行します。

要約すると、入力配列を変更した場合、純粋なパイプは実行されません。
入力配列を *置き換える* 場合、パイプは実行され、表示が更新されます。
または、次のセクションで説明するように、配列などの複合オブジェクト内の変更を検出するには、*impure* パイプを使用します。

## 複合オブジェクト内の不純な変更の検知

配列の要素の変更など、複合オブジェクト *内* の変更後にカスタムパイプを実行するには、パイプを `impure` に定義して不純な変更を検出する必要があります。
Angularは、変更を検出するたびに（キーストロークやマウスイベントなど）不純なパイプを実行します。

IMPORTANT: 不純なパイプは役立つ場合がありますが、使用には注意してください。
長時間実行される不純なパイプは、アプリケーションのパフォーマンスを大幅に低下させる可能性があります。

パイプを不純にするには、`pure` フラグを `false` に設定します。

<docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts"
           visibleRegion="pipe-decorator" highlight="[19]"/>

次のコードは、`FlyingHeroesPipe` を拡張して特性を継承した `FlyingHeroesImpurePipe` の完全な実装を示しています。
この例では、他に何も変更する必要はありません。違いは、パイプメタデータで `pure` フラグを `false` に設定することだけです。

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesImpurePipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="impure"/>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesPipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

`FlyingHeroesImpurePipe` は、`transform` 関数が簡単で高速であるため、不純なパイプの適切な候補です。

<docs-code header="src/app/flying-heroes.pipe.ts (filter)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="filter"/>

`FlyingHeroesComponent` から `FlyingHeroesImpureComponent` を導出できます。
次のコードに示すように、変更されるのはテンプレート内のパイプだけです。

<docs-code header="src/app/flying-heroes-impure.component.html (excerpt)" path="adev/src/content/examples/pipes/src/app/flying-heroes-impure.component.html" visibleRegion="template-flying-heroes"/>
