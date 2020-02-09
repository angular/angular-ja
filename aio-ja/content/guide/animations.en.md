# Introduction to Angular animations

Animation provides the illusion of motion: HTML elements change styling over time. Well-designed animations can make your application more fun and easier to use, but they aren't just cosmetic. Animations can improve your app and user experience in a number of ways:

* Without animations, web page transitions can seem abrupt and jarring.

* Motion greatly enhances the user experience, so animations give users a chance to detect the application's response to their actions.

* Good animations intuitively call the user's attention to where it is needed.

Typically, animations involve multiple style *transformations* over time. An HTML element can move, change color, grow or shrink, fade, or slide off the page. These changes can occur simultaneously or sequentially. You can control the timing of each transformation.

Angular's animation system is built on CSS functionality, which means you can animate any property that the browser considers animatable. This includes positions, sizes, transforms, colors, borders, and more. The W3C maintains a list of animatable properties on its [CSS Transitions](https://www.w3.org/TR/css-transitions-1/) page.


## About this guide

This guide covers the basic Angular animation features to get you started on adding Angular animations to your project.

The features described in this guide &mdash; and the more advanced features described in the related Angular animations guides &mdash; are demonstrated in an example app available as a <live-example></live-example>.

#### Prerequisites

The guide assumes that you're familiar with building basic Angular apps, as described in the following sections:

* [Tutorial](tutorial)
* [Architecture Overview](guide/architecture)


## Getting started

The main Angular modules for animations are `@angular/animations` and `@angular/platform-browser`. When you create a new project using the CLI, these dependencies are automatically added to your project.

To get started with adding Angular animations to your project, import the animation-specific modules along with standard Angular functionality.

### Step 1: Enabling the animations module

Import `BrowserAnimationsModule`, which introduces the animation capabilities into your Angular root application module.

<code-example path="animations/src/app/app.module.1.ts" header="src/app/app.module.ts" language="typescript"></code-example>

<div class="alert is-helpful">

**Note:** When you use the CLI to create your app, the root application module `app.module.ts` is placed in the `src/app` folder.
</div>

### Step 2: Importing animation functions into component files

If you plan to use specific animation functions in component files, import those functions from `@angular/animations`.

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="imports" language="typescript">
</code-example>

<div class="alert is-helpful">

**Note:** See a [summary of available animation functions](guide/animations#animation-api-summary) at the end of this guide.
</div>

### Step 3: Adding the animation metadata property

In the component file, add a metadata property called `animations:` within the `@Component()` decorator. You put the trigger that defines an animation within the `animations` metadata property.

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="decorator" language="typescript">
</code-example>

## Animating a simple transition

Let's animate a simple transition that changes a single HTML element from one state to another. For example, you can specify that a button displays either **Open** or **Closed** based on the user's last action. When the button is in the `open` state, it's visible and yellow. When it's the `closed` state, it's transparent and green.

In HTML, these attributes are set using ordinary CSS styles such as color and opacity. In Angular, use the `style()` function to specify a set of CSS styles for use with animations. You can collect a set of styles in an animation state, and give the state a name, such as `open` or `closed`.

<div class="lightbox">
  <img src="generated/images/guide/animations/open-closed.png" alt="open and closed states">
</div>

### Animation state and styles

Use Angular's `state()` function to define different states to call at the end of each transition. This function takes two arguments: a unique name like `open` or `closed` and a `style()` function.

Use the `style()` function to define a set of styles to associate with a given state name. Note that the style attributes must be in [*camelCase*](guide/glossary#case-conventions).

Let's see how Angular's `state()` function works with the `style⁣­(⁠)` function to set CSS style attributes. In this code snippet, multiple style attributes are set at the same time for the state. In the `open` state, the button has a height of 200 pixels, an opacity of 1, and a background color of yellow.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="state1" language="typescript">
</code-example>

In the `closed` state, shown below, the button has a height of 100 pixels, an opacity of 0.5, and a background color of green.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="state2" language="typescript">
</code-example>

### Transitions and timing

In Angular, you can set multiple styles without any animation. However, without further refinement, the button instantly transforms with no fade, no shrinkage, or other visible indicator that a change is occurring.

To make the change less abrupt, we need to define an animation *transition* to specify the changes that occur between one state and another over a period of time. The `transition()` function accepts two arguments: the first argument accepts an expression that defines the direction between two transition states, and the second argument accepts one or a series of `animate()` steps.


Use the `animate()` function to define the length, delay, and easing of a transition, and to designate the style function for defining styles while transitions are taking place. You can also use the `animate()` function to define the `keyframes()` function for multi-step animations. These definitions are placed in the second argument of the `animate()` function.

#### Animation metadata: duration, delay, and easing

The `animate()` function (second argument of the transition function) accepts the `timings` and `styles` input parameters.

The `timings` parameter takes a string defined in three parts.

>`animate ('duration delay easing')`

The first part, `duration`, is required. The duration can be expressed in milliseconds as a simple number without quotes, or in seconds with quotes and a time specifier. For example, a duration of a tenth of a second can be expressed as follows:

* As a plain number, in milliseconds: `100`

* In a string, as milliseconds: `'100ms'`

* In a string, as seconds: `'0.1s'`

The second argument, `delay`, has the same syntax as `duration`. For example:

* Wait for 100ms and then run for 200ms: `'0.2s 100ms'`

The third argument, `easing`, controls how the animation [accelerates and decelerates](http://easings.net/) during its runtime. For example, `ease-in` causes the animation to begin slowly, and to pick up speed as it progresses.

* Wait for 100ms, run for 200ms. Use a deceleration curve to start out fast and slowly decelerate to a resting point: `'0.2s 100ms ease-out'`

* Run for 200ms, with no delay. Use a standard curve to start slow, accelerate in the middle, and then decelerate slowly at the end: `'0.2s ease-in-out'`

* Start immediately, run for 200ms. Use an acceleration curve to start slow and end at full velocity: `'0.2s ease-in'`

<div class="alert is-helpful">

**Note:** See the Material Design website's topic on [Natural easing curves](https://material.io/design/motion/speed.html#easing) for general information on easing curves.
</div>

This example provides a state transition from `open` to `closed` with a one second transition between states.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript"
region="transition1">
</code-example>

In the code snippet above, the `=>` operator indicates unidirectional transitions, and `<=>` is bidirectional. Within the transition, `animate()` specifies how long the transition takes. In this case, the state change from `open` to `closed` takes one second, expressed here as `1s`.

This example adds a state transition from the `closed` state to the `open` state with a 0.5 second transition animation arc.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript"
region="transition2">
</code-example>

<div class="alert is-helpful">

**Note:** Some additional notes on using styles within `state` and `transition` functions.

* Use `state()` to define styles that are applied at the end of each transition, they persist after the animation has completed.

* Use `transition()` to define intermediate styles, which create the illusion of motion during the animation.

* When animations are disabled, `transition()` styles can be skipped, but `state()` styles can't.

* You can include multiple state pairs within the same `transition()` argument:<br/> `transition( 'on => off, off => void' )`.
</div>

### Triggering the animation

An animation requires a *trigger*, so that it knows when to start. The `trigger()` function collects the states and transitions, and gives the animation a name, so that you can attach it to the triggering element in the HTML template.

The `trigger()` function describes the property name to watch for changes. When a change occurs, the trigger initiates the actions included in its definition. These actions can be transitions or other functions, as we'll see later on.

In this example, we'll name the trigger `openClose`, and attach it to the `button` element. The trigger describes the open and closed states, and the timings for the two transitions.

<div class="lightbox">
  <img src="generated/images/guide/animations/triggering-the-animation.png" alt="triggering the animation">
</div>

<div class="alert is-helpful">

**Note:** Within each `trigger()` function call, an element can only be in one state at any given time. However, it's possible for multiple triggers to be active at once.
</div>

### Defining animations and attaching them to the HTML template

Animations are defined in the metadata of the component that controls the HTML element to be animated. Put the code that defines your animations under the `animations:` property within the `@Component()` decorator.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript" region="component"></code-example>

When you've defined an animation trigger for a component, you can attach it to an element in that component's template by wrapping the trigger name in brackets and preceding it with an `@` symbol. Then, you can bind the trigger to a template expression using standard Angular property binding syntax as shown below, where `triggerName` is the name of the trigger, and `expression` evaluates to a defined animation state.

```
<div [@triggerName]="expression">...</div>;
```

The animation is executed or triggered when the expression value changes to a new state.

The following code snippet binds the trigger to the value of the `isOpen` property.

<code-example path="animations/src/app/open-close.component.1.html" header="src/app/open-close.component.html"
region="compare">
</code-example>

In this example, when the `isOpen` expression evaluates to a defined state of `open` or `closed`, it notifies the trigger `openClose` of a state change. Then it's up to the `openClose` code to handle the state change and kick off a state change animation.

For elements entering or leaving a page (inserted or removed from the DOM), you can make the animations conditional. For example, use `*ngIf` with the animation trigger in the HTML template.

<div class="alert is-helpful">

**Note:** In the component file, set the trigger that defines the animations as the value of the `animations:` property in the `@Component()` decorator.

In the HTML template file, use the trigger name to attach the defined animations to the HTML element to be animated.

</div>

### Code review

Here are the code files discussed in the transition example.

<code-tabs>

<code-pane header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" language="typescript"
region="component">
</code-pane>

<code-pane header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html"
region="trigger">
</code-pane>

<code-pane header="src/app/open-close.component.css" path="animations/src/app/open-close.component.css">
</code-pane>

</code-tabs>

### Summary

You learned to add animation to a simple transition between two states, using `style()` and `state()` along with `animate()` for the timing.

You can learn about more advanced features in Angular animations under the Animation section, beginning with advanced techniques in [transition and triggers](guide/transition-and-triggers).

{@a animation-api-summary}
## Animations API summary

The functional API provided by the `@angular/animations` module provides a domain-specific language (DSL) for creating and controlling animations in Angular applications. See the [API reference](api/animations) for a complete listing and syntax details of the core functions and related data structures.

<table>

<tr>
<th style="vertical-align: top">
Function name
</th>

<th style="vertical-align: top">
What it does
</th>
</tr>

<tr>
<td><code>trigger()</code></td>
<td>Kicks off the animation and serves as a container for all other animation function calls. HTML template binds to <code>triggerName</code>. Use the first argument to declare a unique trigger name. Uses array syntax.</td>
</tr>

<tr>
<td><code>style()</code></td>
<td>Defines one or more CSS styles to use in animations. Controls the visual appearance of HTML elements during animations. Uses object syntax.</td>
</tr>

<tr>
<td><code><a href="api/animations/state" class="code-anchor">state()</a></code></td>
<td>Creates a named set of CSS styles that should be applied on successful transition to a given state. The state can then be referenced by name within other animation functions.</td>
</tr>

<tr>
<td><code>animate()</code></td>
<td>Specifies the timing information for a transition. Optional values for <code>delay</code> and <code>easing</code>. Can contain <code>style()</code> calls within.</td>
</tr>

<tr>
<td><code>transition()</code></td>
<td>Defines the animation sequence between two named states. Uses array syntax.</td>
</tr>

<tr>
<td><code>keyframes()</code></td>
<td>Allows a sequential change between styles within a specified time interval. Use within <code>animate()</code>. Can include multiple <code>style()</code> calls within each <code>keyframe()</code>. Uses array syntax.</td>
</tr>

<tr>
<td><code><a href="api/animations/group" class="code-anchor">group()</a></code></td>
<td>Specifies a group of animation steps (<em>inner animations</em>) to be run in parallel. Animation continues only after all inner animation steps have completed. Used within <code>sequence()</code> or <code>transition().</code></td>
</tr>

<tr>
<td><code>query()</code></td>
<td>Use to find one or more inner HTML elements within the current element. </td>
</tr>

<tr>
<td><code>sequence()</code></td>
<td>Specifies a list of animation steps that are run sequentially, one by one.</td>
</tr>

<tr>
<td><code>stagger()</code></td>
<td>Staggers the starting time for animations for multiple elements.</td>
</tr>

<tr>
<td><code>animation()</code></td>
<td>Produces a reusable animation that can be invoked from elsewhere. Used together with <code>useAnimation()</code>.</td>
</tr>

<tr>
<td><code>useAnimation()</code></td>
<td>Activates a reusable animation. Used with <code>animation()</code>.</td>
</tr>

<tr>
<td><code>animateChild()</code></td>
<td>Allows animations on child components to be run within the same timeframe as the parent.</td>
</tr>

</table>

## More on Angular animations

You may also be interested in the following:

* [Transition and triggers](guide/transition-and-triggers)
* [Complex animation sequences](guide/complex-animation-sequences)
* [Reusable animations](guide/reusable-animations)
* [Route transition animations](guide/route-animations)

<div class="alert is-helpful">

Check out this full animation [demo](http://animationsftw.in/#/) with accompanying [presentation](https://www.youtube.com/watch?v=JhNo3Wvj6UQ&feature=youtu.be&t=2h47m53s), shown at the AngularConnect conference in November 2017.
</div>
