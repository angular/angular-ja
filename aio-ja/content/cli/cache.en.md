
# Persistent disk cache

Angular CLI saves a number of cachable operations on disk by default.

When you re-run the same build, the build system restores the state of the previous build and re-uses previously performed operations, which decreases the time taken to build and test your applications and libraries.

To amend the default cache settings, add the `cli.cache` object to your [Workspace Configuration](guide/workspace-config).
The object goes under `cli.cache` at the top level of the file, outside the `projects` sections.

<code-example format="json" language="json">

{
  "$schema": "./node_modules/&commat;angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "cache": {
      ...
    }
  },
  "projects": {}
}

</code-example>

For more information, see [cache options](guide/workspace-config#cache-options).

### Enabling and disabling the cache

Caching is enabled by default.
To disable caching run the following command:

<code-example format="shell" language="shell">

ng config cli.cache.enabled false

</code-example>

To re-enable caching, set `cli.cache.enabled` to `true`.

### Cache environments

By default, disk cache is only enabled for local environments.

To enable caching for all environments, run the following command:

<code-example format="shell" language="shell">

ng config cli.cache.environment all

</code-example>

For more information, see `environment` in [cache options](guide/workspace-config#cache-options).

<div class="alert is-helpful">

The Angular CLI checks for the presence and value of the `CI` environment variable to determine in which environment it is running.

</div>

### Cache path

By default, `.angular/cache` is used as a base directory to store cache results.
To change this path, run the following command:

<code-example format="shell" language="shell">

ng config cli.cache.path ".cache/ng"

</code-example>

### Clearing the cache

To clear the cache, run one of the following commands.

To clear the cache on Unix-based operating systems:

<code-example format="shell" language="shell">

rm -rf .angular/cache

</code-example>

To clear the cache on Windows:

<code-example format="shell" language="shell">

rmdir /s /q .angular\cache

</code-example>

For more information, see [rm command](https://man7.org/linux/man-pages/man1/rm.1.html) and [rmdir command](https://docs.microsoft.com/windows-server/administration/windows-commands/rmdir).
