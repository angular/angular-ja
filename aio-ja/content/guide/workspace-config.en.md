# Angular Workspace Configuration

A file named `angular.json` at the root level of an Angular [workspace](guide/glossary#workspace) provides workspace-wide and project-specific configuration defaults for build and development tools provided by the Angular CLI.
Path values given in the configuration are relative to the root workspace folder.

## Overall JSON structure

At the top level of `angular.json`, a few properties configure the workspace, and a `projects` section contains the remaining per-project configuration options. CLI defaults set at the workspace level can be overridden by defaults set at the project level, and defaults set at the project level can be overridden on the command line.

The following properties, at the top level of the file, configure the workspace.

* `version`: The configuration-file version.
* `newProjectRoot`: Path where new projects are created. Absolute or relative to the workspace folder.
* `defaultProject`: Default project name to use in commands, where not provided as an argument. When you use `ng new` to create a new app in a new workspace, that app is the default project for the workspace until you change it here.
* `schematics` : A set of [schematics](guide/glossary#schematic) that customize the `ng generate` sub-command option defaults for this workspace. See [Generation schematics](#schematics) below.
* `projects` : Contains a subsection for each project (library or application) in the workspace, with the per-project configuration options.

The initial app that you create with `ng new app_name` is listed under "projects":

<code-example format="." language="json" linenums="false">
"projects": {
  "app_name": {
    ...
  }
  ...
}
</code-example>

Each additional app that you create with `ng generate application` has a corresponding end-to-end test project, with its own configuration section.
When you create a library project with `ng generate library`, the library project is also added to the `projects` section.

<div class="alert is-helpful">

  Note that the `projects` section of the configuration file does not correspond exactly to the workspace file structure.
  * The initial app created by `ng new` is at the top level of the workspace file structure.
  * Additional applications and libraries go into a `projects` folder in the workspace.

  For more information, see [Workspace and project file structure](guide/file-structure).

</div>

## Project configuration options

The following top-level configuration properties are available for each project, under `projects:<project_name>`.

<code-example format="." language="json" linenums="false">
    "my-app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {}
    }
</code-example>

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `root`          | The root folder for this project's files, relative to the workspace folder. Empty for the initial app, which resides at the top level of the workspace. |
| `sourceRoot`    | The root folder for this project's source files. |
| `projectType`   | One of "application" or "library". An application can run independently in a browser, while a library cannot.|
| `prefix`        | A string that Angular prepends to generated selectors. Can be customized to identify an app or feature area. |
| `schematics`    | A set of schematics that customize the `ng generate` sub-command option defaults for this project. See [Generation schematics](#schematics) below.  |
| `architect`     | Configuration defaults for Architect builder targets for this project. |

{@a schematics}
## Generation schematics

Angular generation [schematics](guide/glossary#schematic) are instructions for modifying a project by adding files or modifying existing files.
Individual schematics for the default Angular CLI `ng generate` sub-commands are collected in the package `@angular`.
Specify the schematic name for a subcommand in the format `schematic-package:schematic-name`;
for example, the schematic for generating a component is `@angular:component`.

The JSON schemas for the default schematics used by the CLI to generate projects and parts of projects are collected in the package [`@schematics/angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/schematics/angular/application/schema.json).
The schema describes the options available to the CLI for each of the `ng generate` sub-commands, as shown in the `--help` output.

The fields given in the schema correspond to the allowed argument values and defaults for the CLI sub-command options.
You can update your workspace schema file to set a different default for a sub-command option.

{@a architect}

## Project tool configuration options

Architect is the tool that the CLI uses to perform complex tasks, such as compilation and test running, according to provided configurations.
The `architect` section of `angular.json` contains a set of Architect *targets*.
Many of the targets correspond to the CLI commands that run them.
Some additional predefined targets can be run using the `ng run` command, and you can define your own targets.

Each target object specifies the `builder` for that target, which is the npm package for the tool that Architect runs.
In addition, each target has an `options` section that configures default options for the target, and a `configurations` section that names and specifies alternative configurations for the target.
See the example in [Build target](#build-target) below.

<code-example format="." language="json" linenums="false">
      "architect": {
        "build": { },
        "serve": { },
        "e2e" : { },
        "test": { },
        "lint": { },
        "extract-i18n": { },
        "server": { },
        "app-shell": { }
      }
</code-example>

* The `architect/build` section configures defaults for options of the `ng build` command.
See [Build target](#build-target) below for more information.

* The `architect/serve` section overrides build defaults and supplies additional serve defaults for the `ng serve` command.  In addition to the options available for the `ng build` command, it adds options related to serving the app.

* The `architect/e2e` section overrides build-option defaults for building end-to-end testing apps using the `ng e2e` command.

* The `architect/test` section overrides build-option defaults for test builds and supplies additional test-running defaults for the `ng test` command.

* The `architect/lint` section configures defaults for options of the `ng lint` command, which performs code analysis on project source files.  The default linting tool for Angular is [TSLint](https://palantir.github.io/tslint/).

* The `architect/extract-i18n` section configures defaults for options of the `ng-xi18n` tool used by the `ng xi18n` command, which extracts marked message strings from source code and outputs translation files.

* The `architect/server` section configures defaults for creating a Universal app with server-side rendering, using the `ng run <project>:server` command.

* The `architect/app-shell` section configures defaults for creating an app shell for a progressive web app (PWA), using the `ng run <project>:app-shell` command.

In general, the options for which you can configure defaults correspond to the command options listed in the [CLI reference page](cli) for each command.
Note that all options in the configuration file must use [camelCase](guide/glossary#case-conventions), rather than dash-case.

{@a build-target}

## Build target

The `architect/build` section configures defaults for options of the `ng build` command. It has the following top-level properties.

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `builder`       | The npm package for the build tool used to create this target. The default is `@angular-devkit/build-angular:browser`, which uses the [webpack](https://webpack.js.org/) package bundler. |
| `options`       | This section contains default build target options, used when no named alternative configuration is specified. See [Default build targets](#default-build-targets) below. |
| `configurations`| This section defines and names alternative configurations for different intended destinations. It contains a section for each named configuration, which sets the default options for that intended environment. See [Alternate build configurations](#build-configs) below. |

{@a default-build-targets}

### Default build targets

Angular defines default builders for use with the Architect tool and `ng run` command.
The default builders provide implementations that use a particular tool to perform a complex operation.

The JSON schemas that the define the options and defaults for each of these default builders are collected in the [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/angular/cli/lib/config/schema.json) package. The schemas configure options for the following Architect build targets:

* app-shell
* browser
* dev-server
* extract-i18n
* karma
* protractor
* server
* tslint

{@a build-configs}

### Alternate build configurations

By default, a `production` configuration is defined, and the `ng build` command has `--prod` option that builds using this configuration. The `production` configuration sets defaults that optimize the app in a number of ways, such bundling files, minimizing excess whitespace, removing comments and dead code, and rewriting code to use short, cryptic names ("minification").

You can define and name additional alternate configurations (such as `stage`, for instance) appropriate to your development process. Some examples of different build configurations are `stable`, `archive` and `next` used by AIO itself, and the individual locale-specific configurations required for building localized versions of an app. For details, see [Internationalization (i18n)](guide/i18n#merge-aot).

{@a build-props}

### Additional build and test options

The configurable options for a default or targeted build generally correspond to the options available for the [`ng build`](cli/build), [`ng serve`](cli/serve), and [`ng test`](cli/test) commands. For details of those options and their possible values, see the [CLI Reference](cli).

Some additional options (listed below) can only be set through the configuration file, either by direct editing or with the [`ng config`](cli/config) command.

| OPTIONS PROPERTIES | DESCRIPTION |
| :------------------------- | :---------------------------- |
| `fileReplacements`         | An object containing files and their compile-time replacements. |
| `stylePreprocessorOptions` | An object containing option-value pairs to pass to style preprocessors. |
| `assets`                   | An object containing paths to static assets to add to the global context of the project. The default paths point to the project's icon file and its `assets` folder.  See more below. |
| `styles`                   | An object containing style files to add to the global context of the project. Angular CLI supports CSS imports and all major CSS preprocessors: [sass/scss](http://sass-lang.com/), [less](http://lesscss.org/), and [stylus](http://stylus-lang.com/). |
| `scripts`                  | An object containing JavaScript script files to add to the global context of the project. The scripts are loaded exactly as if you had added them in a `<script>` tag inside `index.html`. |
| `budgets`                  | Default size-budget type and threshholds for all or parts of your app. You can configure the builder to report a warning or an error when the output reaches or exceeds a threshold size. See [Configure size budgets](guide/build#configure-size-budgets). (Not available in `test` section.) |

## Project asset configuration

Each `build` target configuration can include an `assets` array that lists files or folders you want to copy as-is when building your project.
By default, the `src/assets/` folder and `src/favicon.ico` are copied over.

<code-example format="." language="json" linenums="false">
"assets": [
  "src/assets",
  "src/favicon.ico"
]
</code-example>

To exclude an asset, you can remove it from the assets configuration.

You can further configure assets to be copied by specifying assets as objects, rather than as simple paths relative to the workspace root.
A asset specification object can have the following fields.

* `glob`:  A [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) using `input` as base directory.
* `input`: A path relative to the workspace root.
* `output`: A path relative to `outDir` (default is `dist/`*project-name*). Because of the security implications, the CLI never writes files outside of the project output path.
* `ignore`: A list of globs to exclude.

For example, the default asset paths can be represented in more detail using the following objects.

<code-example format="." language="json" linenums="false">
"assets": [
  { "glob": "**/*", "input": "src/assets/", "output": "/assets/" },
  { "glob": "favicon.ico", "input": "src/", "output": "/" },
]
</code-example>

You can use this extended configuration to copy assets from outside your project.
For example, the following configuration copies assets from a node package:

<code-example format="." language="json" linenums="false">
"assets": [
 { "glob": "**/*", "input": "./node_modules/some-package/images", "output": "/some-package/" },
]
</code-example>

The contents of `node_modules/some-package/images/` will be available in `dist/some-package/`.

The following example uses the `ignore` field to exclude certain files in the assets folder from being copied into the build:

<code-example format="." language="json" linenums="false">
"assets": [
 { "glob": "**/*", "input": "src/assets/", "ignore": ["**/*.svg"], "output": "/assets/" },
]
</code-example>
