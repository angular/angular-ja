
# 永続的ディスクキャッシュ
Angular CLIは、デフォルトで多くのキャッシュ可能な操作をディスクに保存します。

同じビルドを再実行する場合、ビルドシステムは前回のビルドの状態を復元し、以前に実行した操作を再利用するので、アプリケーションやライブラリのビルドとテストにかかる時間を短縮することができます。

デフォルトのキャッシュ設定を変更するには、`cli.cache`オブジェクトを[ワークスペース設定](guide/workspace-config)に追加してください。
このオブジェクトは、ファイルのトップレベルの`cli.cache`の配下、`project`セクションの外側に置かれます。

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "cache": {
      ...
    }
  },
  "projects": {}
}
```

詳しくは、[キャッシュオプション](guide/workspace-config#cache-options)を参照してください。

### キャッシュの有効化と非有効化
キャッシュはデフォルトで有効になっています。キャッシュを無効にするには、次のコマンドを実行します：

```bash
ng config cli.cache.enabled false
```

キャッシュを再び有効にするには、`cli.cache.enabled`を`true`に設定します。

### キャッシュ環境
デフォルトでは、ディスクキャッシュはローカル環境でのみ有効です。

すべての環境でキャッシュを有効にするには、次のコマンドを実行します。

```bash
ng config cli.cache.environment all
```

詳細については、[キャッシュオプション](guide/workspace-config#cache-options)の`environment`を参照してください。

<div class="alert is-helpful">

Angular CLI は、環境変数`CI`の存在と値を確認し、どの環境で動作しているかを判断します。

</div>

### キャッシュパス

デフォルトでは、キャッシュの結果を保存するためのベースディレクトリとして`.angular/cache`が使用されます。このパスを変更するには、次のコマンドを実行します：

```bash
ng config cli.cache.path ".cache/ng"
```

### キャッシュクリア

キャッシュをクリアするには、次のいずれかのコマンドを実行します。

Unix系OSでキャッシュをクリアする場合：

```bash
rm -rf .angular/cache
```

Windowsでキャッシュをクリアする場合：

```bash
rmdir /s /q .angular/cache
```

詳しくは、[rmコマンド](https://man7.org/linux/man-pages/man1/rm.1.html)と[rmdirコマンド](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/rmdir)を参照してください。
