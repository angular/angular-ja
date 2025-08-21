# angular.io のオリジナルコンテンツを更新する方法

## 事前準備

- node_modules の準備
- Git submodule の準備

## Workflow

1. 同期する `angular/angular` のコミットハッシュを確認します

GitHub上で `angular/angular` リポジトリのコミットハッシュを入手します。


2. `update-origin` コマンドを実行します

1で入手したコミットハッシュを指定して、`angular/angular` リポジトリを更新します。

```sh
$ pnpm update-origin <commit-hash>
```

コミットハッシュを指定しない場合は、originの更新は行わず、現在のsubmoduleからファイルのコピーを再度実行します。

## マイグレーション

### Pattern 1. オリジナルからオリジナル

- `foobar.md` (not translated)
- `contributors.json`
- `resouces.json`
- `presskit.html`

翻訳済みファイルが存在しないものは、そのまま適用します。

### Pattern 2. 翻訳済みのオリジナルファイル

- `foobar.en.md`
- `index.en.html`

#### 変更が小さい場合

変更点に再翻訳の必要があれば翻訳済みファイルへ反映します。

#### 変更が大きい場合

1. 未翻訳状態のまま、翻訳済みファイルの該当箇所へオリジナルのテキストをコピーし、日英混在の状態にします。
2. 未翻訳の部分について翻訳を募集するIssueを作成します。
