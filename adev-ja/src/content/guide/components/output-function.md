# 関数ベースの出力

`output()` 関数は、ディレクティブまたはコンポーネントで出力を宣言します。
出力を使用すると、親コンポーネントに出力を送信できます。

役に立つ情報: `output()` 関数は現在、[開発プレビュー](/reference/releases#developer-preview)です。

<docs-code language="ts" highlight="[[5], [8]]">
import {Component, output} from '@angular/core';

@Component({...})
export class MyComp {
  onNameChange = output<string>()    // OutputEmitterRef<string>

  setNewName(newName: string) {
    this.onNameChange.emit(newName);
  }
}
</docs-code>

出力は、`output` 関数をクラスメンバーのイニシャライザーとして使用すると、Angularによって自動的に認識されます。
親コンポーネントは、イベントバインディング構文を使用して、テンプレート内の出力を購読できます。

```html
<my-comp (onNameChange)="showNewName($event)" />
```

## 出力のエイリアス

Angularは、クラスメンバーの名前を出力の名前として使用します。
出力にエイリアスを付けることで、公開名を変更できます。

```typescript
class MyComp {
  onNameChange = output({alias: 'ngxNameChange'});
}
```

これにより、ユーザーは `(ngxNameChange)` を使用して出力にバインドできます。コンポーネント内では、`this.onNameChange` を使用して出力エミッターにアクセスできます。

## プログラムによる購読

コンシューマーは、`ComponentRef` への参照を使用して、コンポーネントを動的に作成できます。
そのような場合、親は `OutputRef` タイプのプロパティに直接アクセスすることで出力に購読できます。

```ts
const myComp = viewContainerRef.createComponent(...);

myComp.instance.onNameChange.subscribe(newName => {
  console.log(newName);
});
```

`myComp` が破棄されると、Angularは自動的に購読をクリーンアップします。
または、より早く購読を解除するための関数を含むオブジェクトが返されます。

## RxJS Observableをソースとして使用

場合によっては、RxJS Observableに基づいて出力値を送信したいことがあります。
Angularは、RxJS Observableをアウトプットのソースとして使用する方法を提供します。

`outputFromObservable` 関数は、`output()` 関数と同様にコンパイラのプリミティブであり、RxJS Observableによって駆動される出力を宣言します。

<docs-code language="ts" highlight="[7]">
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive(...)
class MyDir {
  nameChange$ = this.dataService.get(); // Observable<Data>
  nameChange = outputFromObservable(this.nameChange$);
}
</docs-code>

AngularはObservableへの購読を転送しますが、所有するディレクティブが破棄されると値の転送を停止します。
上記の例では、`MyDir` が破棄されると、`nameChange` は値を送信しなくなります。

役に立つ情報: ほとんどの場合、`output()` を使用すれば十分で、値を命令的に送信できます。

## 出力をObservableに変換する

`OutputRef` の `.subscribe` メソッドを呼び出すことで、出力に購読できます。
他のケースでは、Angularは `OutputRef` をObservableに変換するヘルパー関数を提供します。

<docs-code language="ts" highlight="[11]">
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(...)
class MyComp {
  onNameChange = output<string>();
}

// `MyComp` へのインスタンス参照。
const myComp: MyComp;

outputToObservable(this.myComp.instance.onNameChange) // Observable<string>
  .pipe(...)
  .subscribe(...);
</docs-code>

## なぜデコレーターベースの `@Output()` よりも `output()` を使用する必要があるのか？

`output()` 関数は、デコレーターベースの `@Output` と `EventEmitter` に比べて、多くの利点があります。

1. よりシンプルなメンタルモデルとAPI:
  <br/>• RxJSのエラーチャネル、完了チャネル、またはその他のAPIの概念はありません。
  <br/>• 出力は単純なエミッターです。 `.emit` 関数を使用して値を送信できます。
2. より正確な型。
  <br/>• `OutputEmitterRef.emit(value)` は、正しく型付けされていますが、`EventEmitter` の型は壊れており、ランタイムエラーが発生する可能性があります。
