// #docplaster
// #docregion
import { Injectable } from '@angular/core';
// #docregion import-httpclient
import { HttpClient, HttpHeaders } from '@angular/common/http';
// #enddocregion import-httpclient

import { Observable, of } from 'rxjs';
// #docregion import-rxjs-operators
import { catchError, map, tap } from 'rxjs/operators';
// #enddocregion import-rxjs-operators

import { Hero } from './hero';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class HeroService {

  // #docregion heroesUrl
  private heroesUrl = 'api/heroes';  // Web APIのURL
  // #enddocregion heroesUrl

  // #docregion http-options
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // #enddocregion http-options

  // #docregion ctor
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  // #enddocregion ctor

  // #docregion getHeroes, getHeroes-1
  /** サーバーからヒーローを取得する */
  // #docregion getHeroes-2
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
  // #enddocregion getHeroes-1
      .pipe(
        // #enddocregion getHeroes-2
        tap(heroes => this.log('fetched heroes')),
        // #docregion getHeroes-2
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  // #docregion getHeroes-1
  }
  // #enddocregion getHeroes, getHeroes-1, getHeroes-2

  /** IDによりヒーローを取得する。idが見つからない場合は`undefined`を返す。 */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // {0|1} 要素の配列を返す
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  // #docregion getHero
  /** IDによりヒーローを取得する。見つからなかった場合は404を返却する。 */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  // #enddocregion getHero

  // #docregion searchHeroes
  /* 検索語を含むヒーローを取得する */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // 検索語がない場合、空のヒーロー配列を返す
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  // #enddocregion searchHeroes

  //////// Save methods //////////

  // #docregion addHero
  /** POST: サーバーに新しいヒーローを登録する */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  // #enddocregion addHero

  // #docregion deleteHero
  /** DELETE: サーバーからヒーローを削除 */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  // #enddocregion deleteHero

  // #docregion updateHero
  /** PUT: サーバー上でヒーローを更新 */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  // #enddocregion updateHero

  // #docregion handleError
  /**
   * 失敗したHttp操作を処理します。
   * アプリを持続させます。
   *
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }
  // #enddocregion handleError

  // #docregion log
  /** HeroServiceのメッセージをMessageServiceを使って記録 */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  // #enddocregion log
}
