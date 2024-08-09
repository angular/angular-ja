# コンポーネントのインポートと使用

Tip: このガイドでは、すでに[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

Angularでは、他のコンポーネントでコンポーネントを使用可能にするために、2つの方法がサポートされています。スタンドアロンコンポーネントとして、または `NgModule` で。

## スタンドアロンコンポーネント

**スタンドアロンコンポーネント** は、コンポーネントメタデータで `standalone: true` を設定したコンポーネントです。
スタンドアロンコンポーネントは、テンプレートで使用されている他のコンポーネント、
ディレクティブ、パイプを直接インポートします。

<docs-code language="angular-ts" highlight="[2, [8, 9]]">
@Component({
  standalone: true,
  selector: 'profile-photo',
})
export class ProfilePhoto { }

@Component({
  standalone: true,
  imports:[ProfilePhoto],
  template: `<profile-photo />`
})
export class UserProfile { }
</docs-code>

スタンドアロンコンポーネントは、他のスタンドアロンコンポーネントに直接インポートできます。

Angularチームでは、新規開発にはスタンドアロンコンポーネントを使用することを推奨しています。

## NgModules

スタンドアロンコンポーネントが導入される前のAngularコードでは、`NgModule` を使用して、他のコンポーネントをインポートし、使用していました。
詳細については、[`NgModule` ガイド](guide/ngmodules) を参照してください。
