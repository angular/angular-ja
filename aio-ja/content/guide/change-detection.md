# Angular の変更検知と実行時の最適化

**変更検知**は、Angular がアプリケーションの状態が変更されたかどうか、DOM を更新する必要があるかどうかを確認するプロセスです。簡単にいうと、Angular はコンポーネントを上から下へと走査し、変更を探します。Angular は定期的に変更検知メカニズムを実行し、データモデルへの変更がアプリケーションのビューに反映されるようにします。変更検知は手動または非同期イベント（たとえばユーザー操作や XHR の完了など）を通じてトリガーできます。

変更検知は極めて効率よく最適化されていますが、アプリケーションが頻繁に実行すると速度低下の原因になることがあります。

このガイドでは、アプリケーションの一部をスキップし、必要な場合にのみ変更検知を実行することで、変更検知メカニズムを制御および最適化する方法を学習します。

メディア形式でパフォーマンスの最適化について詳しく知りたい場合は、このビデオをご覧ください。

<div class="video-container">

<iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" src="https://www.youtube.com/embed/f8sA-i6gkGQ"></iframe>

</div>

@reviewed 2022-05-04
