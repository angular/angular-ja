import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    // ここにサーバー専用のプロバイダーを追加します
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
