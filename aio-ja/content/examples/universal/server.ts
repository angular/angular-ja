// これらは重要であり、先頭に記述する必要があります
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// 本番用のより高速なサーバーレンダリング（開発用では必要ありません）
enableProdMode();

// Expressサーバー
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * 注意 :: このファイルはwebpackから動的に生成されるため、require()のままにしておきます
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Expressエンジン
import { ngExpressEngine } from '@nguniversal/express-engine';
// 遅延読み込み用モジュールマップをインポート
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// #docregion ngExpressEngine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
// #enddocregion ngExpressEngine

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// #docregion data-request
// TODO: データのリクエストをセキュアに実装する必要があります
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});
// #enddocregion data-request

// #docregion static
// ブラウザーからの静的なサーバーファイル
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
// #enddocregion static

// #docregion navigation-request
// すべての通常のルートはUniversalエンジンを使用します
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});
// #enddocregion navigation-request

// Nodeサーバーの立ち上げ
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
