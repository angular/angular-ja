# モデル入力

**モデル入力** は、コンポーネントが新しい値を別のコンポーネントに伝播できるようにする、
特殊な入力です。

HELPFUL: モデル入力は現在 [開発者プレビュー](/reference/releases#developer-preview) です。

コンポーネントを作成するときは、普通の入力を作成する方法と同様に、
モデル入力を定義できます。

```angular-ts
import {Component, model, input} from '@angular/core';

@Component({...})
export class CustomCheckbox {
  // これはモデル入力です。
  checked = model(false);

  // これは普通の入力です。
  disabled = input(false);
}
```

2種類の入力はどちらも、値をプロパティにバインドすることを可能にします。
ただし、**モデル入力を使用すると、コンポーネントの作者はプロパティに値を書き込むことができます**。

その他の点では、モデル入力を普通の入力と同じように使用できます。
`computed` や `effect` などのリアクティブコンテキストを含め、シグナル関数を呼び出して値を読み取ることができます。

```angular-ts
import {Component, model, input} from '@angular/core';

@Component({
  selector: 'custom-checkbox',
  template: '<div (click)="toggle()"> ... </div>',
})
export class CustomCheckbox {
  checked = model(false);
  disabled = input(false);

  toggle() {
    // 普通の入力は読み取り専用ですが、モデル入力には直接書き込むことができます。
    this.checked.set(!this.checked());
  }
}
```

コンポーネントがモデル入力に新しい値を書き込むと、
Angularはその入力に値をバインドしているコンポーネントに新しい値を伝播できます。
これは、値が双方向に流れるため、**双方向バインディング** と呼ばれます。

## シグナルによる双方向バインディング

書き込み可能なシグナルをモデル入力にバインドできます。

```angular-ts
@Component({
  ...,
  // `checked` はモデル入力です。
  // 括弧内角括弧構文（別名「バナナインボックス」）は、双方向バインディングを作成します。
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = signal(false);
}
```

上記の例では、`CustomCheckbox` は `checked` モデル入力に値を書き込むことができ、
その値は `UserProfile` の `isAdmin` シグナルに伝播されます。
このバインディングにより、`checked` と `isAdmin` の値が同期されます。
バインディングは `isAdmin` シグナル自体を渡し、シグナルの _値_ は渡さないことに注意してください。

## プレーンなプロパティによる双方向バインディング

プレーンなJavaScriptプロパティをモデル入力にバインドできます。

```angular-ts
@Component({
  ...,
  // `checked` はモデル入力です。
  // 括弧内角括弧構文（別名「バナナインボックス」）は、双方向バインディングを作成します。
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = false;
}
```

上記の例では、`CustomCheckbox` は `checked` モデル入力に値を書き込むことができ、
その値は `UserProfile` の `isAdmin` プロパティに伝播されます。
このバインディングにより、`checked` と `isAdmin` の値が同期されます。

## 暗黙的な `change` イベント

コンポーネントまたはディレクティブでモデル入力を宣言すると、
Angularはそのモデルに対応する [出力](guide/components/outputs) を自動的に作成します。
出力の名前は、モデル入力の名前の後に「Change」が付加されたものです。

```angular-ts
@Directive({...})
export class CustomCheckbox {
  // これは、自動的に「checkedChange」という名前の出力を作成します。
  // テンプレートで `(checkedChange)="handler()"` を使用して購読できます。
  checked = model(false);
}
```

`set` または `update` メソッドを呼び出してモデル入力に新しい値を書き込むたびに、
Angularはこの変更イベントを発行します。

## モデル入力のカスタマイズ

普通の入力と同様に、モデル入力を必須としてマークしたり、
別名を提供したりできます。

モデル入力は、入力の変換をサポートしていません。

## `model()` と `input()` の違い

`input()` と `model()` の両方の関数は、Angularで信号ベースの入力を定義する方法ですが、
いくつかの違いがあります。
1. `model()` は、**入力と出力の両方** を定義します。
出力の名前は常に、双方向バインディングをサポートするために、入力名に `Change` が付加されたものです。
ディレクティブの利用者は、入力のみ、出力のみ、または両方を使用するかを決定します。
2. `ModelSignal` は `WritableSignal` であり、
`set` メソッドと `update` メソッドを使用して、どこからでも値を変更できます。
新しい値が割り当てられると、`ModelSignal` は出力にイベントを発行します。
これは、読み取り専用で、テンプレートを通じてのみ変更できる `InputSignal` とは異なります。
3. モデル入力は入力変換をサポートしませんが、信号入力はサポートします。

## いつモデル入力を使用すべきか

ユーザーの操作に基づいて値を変更するために存在するコンポーネントでモデル入力を使用します。
日付ピッカーやコンボボックスなどのカスタムフォームコントロールは、
主要な値にモデル入力を使用する必要があります。

ローカルな状態を保持するための追加のクラスプロパティを導入することを避けるための便宜として、
モデル入力を使用しないでください。
