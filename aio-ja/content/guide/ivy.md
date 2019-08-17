# Angular Ivy へのオプトイン

Ivy は、Angular の [次世代コンパイルおよびレンダリングパイプライン](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7) のコードネームです。Angular バージョン 8 以降、Ivy のプレビューバージョンの使用を開始することを選択でき、継続的な開発とチューニングを支援できます。

<div class="alert is-helpful">

   Ivy をプレビューするには、最新のバグ修正と改善がすべて含まれているため、`@angular/core@latest` (8.0.x)ではなく、`@angular/core@next` バージョンの Angular (8.1.x) を使用します。

</div>


## 新しいプロジェクトで Ivy を使用する

Ivyを有効にして新しいプロジェクトを開始するには、[`ng new`](cli/new) コマンドで `--enable-ivy` フラグを使用します:

```sh
ng new shiny-ivy-app --enable-ivy
```

新しいプロジェクトは、Ivy 用に自動的に構成されます。具体的には、プロジェクトの `tsconfig.app.json` ファイルで enableIvy オプションが `true` に設定されています。


## 既存のプロジェクトで Ivy を使用する

Ivy を使用するよう既存のプロジェクトを更新するには、プロジェクトの `tsconfig.app.json` の `angularCompilerOptions` で `enableIvy` オプションを設定します。
```json
{
  "compilerOptions": { ... },
  "angularCompilerOptions": {
    "enableIvy": true
  }
}
```

Ivy を使用した AOT コンパイルは高速で、デフォルトで使用する必要があります。`angular.json` ワークスペース設定ファイルで、常に AOT コンパイルを使用するようにプロジェクトのデフォルトのビルドオプションを設定します。

```json
{
  "projects": {
    "my-existing-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
```

Ivy コンパイラの使用を停止するには、`tsconfig.app.json` で `enableIvy` を `false` に設定するか、完全に削除します。以前に持っていなかった場合は、デフォルトのビルドオプションから `"aot": true` も削除します。
 
