# コードカバレッジ {#code-coverage}

コードカバレッジレポートは、単体テストで適切にテストされていないコードベースの箇所を示します。

## 前提条件 {#prerequisites}

Vitestでコードカバレッジレポートを生成するには、`@vitest/coverage-v8` パッケージをインストールする必要があります。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## レポートの生成 {#generating-a-report}

カバレッジレポートを生成するには、`ng test` コマンドに `--coverage` フラグを追加します。

```shell
ng test --coverage
```

テストの実行後、コマンドによってプロジェクトに新しい `coverage/` ディレクトリが作成されます。`index.html` ファイルを開くと、ソースコードとコードカバレッジ値を含むレポートが表示されます。

テストを実行するたびにコードカバレッジレポートを作成する場合は、`angular.json` ファイルで `coverage` オプションを `true` に設定できます。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## コードカバレッジのしきい値の強制 {#enforcing-code-coverage-thresholds}

コードカバレッジのパーセンテージは、コードのどの程度がテストされているかを推定できます。チームが単体テストを行う最小限の量を決定した場合、構成でその最小限を強制できます。

たとえば、コードベースのコードカバレッジを最低80%にしたいとします。これを有効にするには、`angular.json` ファイルに `coverageThresholds` オプションを追加します。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

これで、テストを実行したときにカバレッジが80%を下回ると、コマンドは失敗します。

## 高度な設定 {#advanced-configuration}

`angular.json` ファイルで、他にもいくつかのカバレッジオプションを設定できます。

- `coverageInclude`: カバレッジレポートに含めるファイルのglobパターン。
- `coverageReporters`: 使用するレポーターの配列（例: `html`、`lcov`、`json`）。
- `coverageWatermarks`: HTMLレポーターの `[low, high]` ウォーターマークを指定するオブジェクト。レポートの色分けに影響を与える可能性があります。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
