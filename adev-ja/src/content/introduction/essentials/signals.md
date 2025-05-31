<docs-decorative-header title="シグナル" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
動的なデータを生成して管理します。
</docs-decorative-header>

Angularでは、*シグナル*を使用して状態を作成および管理します。シグナルは、値をラップする軽量なラッパーです。

`signal`関数を用いて、ローカル状態を保持するためのシグナルを作成します。

```typescript
import {signal} from '@angular/core';

// `signal` 関数でシグナルを作成します。
const firstName = signal('Morgan');

// シグナルの値を読み取るには、それを呼び出します。シグナルは関数です。
console.log(firstName());

// 新しい値を指定して `set` メソッドを呼び出すことで、このシグナルの値を変更します。
firstName.set('Jaime');

// `update` メソッドを使用して、
// 前の値に基づいて値を変更することもできます。
firstName.update(name => name.toUpperCase()); 
```

Angularは、シグナルがどこで読み取られ、いつ更新されたかを追跡します。フレームワークはこの情報を使用して、新しい状態をDOMに更新するなど、追加の作業をします。時間の経過とともに変化するシグナル値に応答するこの機能は、*リアクティビティ*として知られています。

## 算出式

`computed`は、他のシグナルに基づいて値を生成するシグナルです。

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
``` 

`computed`シグナルは読み取り専用です。`set`メソッドまたは`update`メソッドはありません。代わりに、`computed`シグナルの値は、読み取るシグナルのいずれかが変更されると自動的に変更されます。

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## コンポーネントでシグナルを使う

`signal`と`computed`をコンポーネント内で使用して、状態を作成および管理します。

```typescript
@Component({/* ... */})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: Angularのシグナルについてもっと知りたいですか？[詳細なシグナルガイド](guide/signals)を参照してください。

## 次の手順

動的なデータの宣言と管理方法を学習したので、テンプレート内でそのデータを使用する方法を学習する時間です。

<docs-pill-row>
  <docs-pill title="テンプレートによる動的なインターフェース" href="essentials/templates" />
  <docs-pill title="詳細なシグナルガイド" href="guide/signals" />
</docs-pill-row>
