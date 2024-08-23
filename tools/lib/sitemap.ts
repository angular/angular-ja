import { writeFile } from 'node:fs/promises';
import { SitemapStream, streamToPromise } from 'sitemap';
import { glob } from './fsutils';
import { buildOutputDir } from './workspace';

export async function generateSitemap(distPath: string) {
  const htmlFiles = await glob(
    ['**/*.html', '!index.csr.html', '!assets/**/*'],
    {
      cwd: buildOutputDir,
    }
  );

  const stream = new SitemapStream({
    hostname: 'https://angular.jp',
  });

  for (const file of htmlFiles) {
    stream.write({ url: file.replace(/\/index\.html$/, '') });
  }
  stream.end();

  const sitemap = await streamToPromise(stream);
  await writeFile(distPath, sitemap.toString());
}
