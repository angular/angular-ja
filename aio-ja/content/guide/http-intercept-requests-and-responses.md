# HTTP - Intercept requests and responses

With interception, you declare *interceptors* that inspect and transform HTTP requests from your application to a server.
The same interceptors can also inspect and transform a server's responses on their way back to the application.
Multiple interceptors form a *forward-and-backward* chain of request/response handlers.

Interceptors can perform a variety of  *implicit* tasks, from authentication to logging, in a routine, standard way, for every HTTP request/response.

Without interception, developers would have to implement these tasks *explicitly* for each `HttpClient` method call.

## Write an interceptor

To implement an interceptor, declare a class that implements the `intercept()` method of the `HttpInterceptor` interface.

Here is a do-nothing `noop` interceptor that passes the request through without touching it:

<code-example header="app/http-interceptors/noop-interceptor.ts" path="http/src/app/http-interceptors/noop-interceptor.ts" region="noop"></code-example>

The `intercept` method transforms a request into an `Observable` that eventually returns the HTTP response.
In this sense, each interceptor is fully capable of handling the request entirely by itself.

Most interceptors inspect the request on the way in and forward the potentially altered request to the `handle()` method of the `next` object which implements the [`HttpHandler`](api/common/http/HttpHandler) interface.

<code-example format="javascript" language="javascript">

export abstract class HttpHandler {
  abstract handle(req: HttpRequest&lt;any&gt;): Observable&lt;HttpEvent&lt;any&gt;&gt;;
}

</code-example>

Like `intercept()`, the `handle()` method transforms an HTTP request into an `Observable` of [`HttpEvents`](#interceptor-events) which ultimately include the server's response.
The `intercept()` method could inspect that observable and alter it before returning it to the caller.

This `no-op` interceptor calls `next.handle()` with the original request and returns the observable without doing a thing.

## The `next` object

The `next` object represents the next interceptor in the chain of interceptors.
The final `next` in the chain is the `HttpClient` backend handler that sends the request to the server and receives the server's response.

Most interceptors call `next.handle()` so that the request flows through to the next interceptor and, eventually, the backend handler.
An interceptor *could* skip calling `next.handle()`, short-circuit the chain, and [return its own `Observable`](guide/http-interceptor-use-cases#caching) with an artificial server response.

This is a common middleware pattern found in frameworks such as Express.js.

## Provide the interceptor

The `NoopInterceptor` is like a service managed by Angular's [dependency injection (DI)](guide/dependency-injection) system.
As with other services, you must provide the interceptor class before the app can use it.

Write a provider for it like this one:
<code-example path="http/src/app/http-interceptors/noop-interceptor.ts" region="noop-provider"></code-example>

Notice the `multi: true` option.
This required setting tells Angular that `HTTP_INTERCEPTORS` is a token for a *multiprovider* that injects an array of values, rather than a single value.

Because interceptors are optional dependencies of the `HttpClient` service, you must provide them in the same injector or a parent of the injector that provides `HttpClient`.
Interceptors provided *after* DI creates the `HttpClient` are ignored.

This app provides `HttpClient` in the app's root injector by adding the `HttpClientModule` to the `providers` array of the `bootstrapApplication()` in `main.ts`.
You should provide interceptors there as well.

<code-example path="http/src/main.ts" region="noop-provider"></code-example>

## Providing many interceptors

There's a good chance that you'll create more interceptors.

You *could* add each provider to the `providers` array of the `bootstrapApplication()` as you did for the `NoopInterceptor`.

That's rather verbose and there's a good chance that you'll make a bookkeeping mistake trying to remember to add each one.

You must also pay [close attention to the order](#interceptor-order) in which you provide these interceptors.

Consider creating a "barrel" file that gathers _all the interceptor providers_ into a single `httpInterceptorProviders` array.

<code-example header="app/http-interceptors/index.ts" path="http/src/app/http-interceptors/index.ts" region="interceptor-providers"></code-example>

<div class="alert is-helpful">

These interceptors are defined in the complete sample code.

</div>

Then import this array and add it to the `bootstrapApplication()` `providers` in `main.ts` like this:

<code-example header="main.ts (interceptor providers)" path="http/src/main.ts" region="interceptor-providers"></code-example>

As you create new interceptors, add them to the `httpInterceptorProviders` array and you won't have to revisit `main.ts`.

## Interceptor order

Angular applies interceptors in the order that you provide them.
For example, consider a situation in which you want to handle the authentication of your HTTP requests and log them before sending them to a server.
To accomplish this task, you could provide an `AuthInterceptor` service and then a `LoggingInterceptor` service.
Outgoing requests would flow from the `AuthInterceptor` to the `LoggingInterceptor`.
Responses from these requests would flow in the other direction, from `LoggingInterceptor` back to `AuthInterceptor`.
The following is a visual representation of the process:

<div class="lightbox">

<img alt="Interceptor in order of HttpClient, AuthInterceptor, AuthInterceptor, HttpBackend, Server, and back in opposite order to show the two-way flow" src="generated/images/guide/http/interceptor-order.svg">

</div>

<div class="alert is-helpful">

The last interceptor in the process is always the `HttpBackend` that handles communication with the server.

</div>

You cannot change the order or remove interceptors later.
If you need to enable and disable an interceptor dynamically, you'll have to build that capability into the interceptor itself.

<a id="interceptor-events"></a>

## Handle interceptor events

Most `HttpClient` methods return observables of `HttpResponse<any>`.
The `HttpResponse` class itself is actually an event, whose type is `HttpEventType.Response`.
A single HTTP request can, however, generate multiple events of other types, including upload and download progress events.
The methods `HttpInterceptor.intercept()` and `HttpHandler.handle()` return observables of `HttpEvent<any>`.

Many interceptors are only concerned with the outgoing request and return the event stream from `next.handle()` without modifying it.
Some interceptors, however, need to examine and modify the response from `next.handle()`; these operations can see all of these events in the stream.

<a id="immutability"></a>

Although interceptors are capable of modifying requests and responses, the `HttpRequest` and `HttpResponse` instance properties are `readonly`, rendering them largely immutable.
They are immutable for a good reason:
An app might retry a request several times before it succeeds, which means that the interceptor chain can re-process the same request multiple times.
If an interceptor could modify the original request object, the re-tried operation would start from the modified request rather than the original.
Immutability ensures that interceptors see the same request for each try.

<div class="alert is-helpful">

Your interceptor should return every event without modification unless it has a compelling reason to do otherwise.

</div>

TypeScript prevents you from setting `HttpRequest` read-only properties.

<code-example format="javascript" language="javascript">

// Typescript disallows the following assignment because req.url is readonly
req.url = req.url.replace('http://', 'https://');

</code-example>

If you must alter a request, clone it first and modify the clone before passing it to `next.handle()`.
You can clone and modify the request in a single step, as shown in the following example.

<code-example header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)" path="http/src/app/http-interceptors/ensure-https-interceptor.ts" region="excerpt"></code-example>

The `clone()` method's hash argument lets you mutate specific properties of the request while copying the others.

### Modify a request body

The `readonly` assignment guard can't prevent deep updates and, in particular, it can't prevent you from modifying a property of a request body object.

<code-example format="javascript" language="javascript">

req.body.name = req.body.name.trim(); // bad idea!

</code-example>

If you must modify the request body, follow these steps.

1.  Copy the body and make your change in the copy.
1.  Clone the request object, using its `clone()` method.
1.  Replace the clone's body with the modified copy.

<code-example header="app/http-interceptors/trim-name-interceptor.ts (excerpt)" path="http/src/app/http-interceptors/trim-name-interceptor.ts" region="excerpt"></code-example>

### Clear the request body in a clone

Sometimes you need to clear the request body rather than replace it.
To do this, set the cloned request body to `null`.

<div class="alert is-helpful">

**TIP**: <br />
If you set the cloned request body to `undefined`, Angular assumes you intend to leave the body as is.

</div>

<code-example format="javascript" language="javascript">

newReq = req.clone({ &hellip; }); // body not mentioned =&gt; preserve original body
newReq = req.clone({ body: undefined }); // preserve original body
newReq = req.clone({ body: null }); // clear the body

</code-example>

@reviewed 2023-08-16
