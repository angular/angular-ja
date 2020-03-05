const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');

const copyTargets = [
    'content/cli/**/*.md',
    'content/guide/**/*.md',
    'content/marketing/**/*',
    'content/start/**/*.md',
    'content/tutorial/**/*.md',
    'content/navigation.json',
    'src/index.html',
    'src/app/layout/doc-viewer/doc-viewer.component.ts',
    'src/app/layout/nav-item/nav-item.component.html',
    'src/app/layout/footer/footer.component.html',
    'src/app/navigation/navigation.model.ts',
    'content/examples/toh-pt6/src/app/hero-search/hero-search.component.ts',
    'content/examples/toh-pt6/src/app/heroes/heroes.component.html',
    'content/examples/toh-pt6/src/app/hero.service.ts',
    'content/examples/universal/src/app/app.server.module.ts',
    'content/examples/universal/src/server.ts',
    'content/examples/universal/src/webpack.server.config.js',
    'tools/transforms/templates/lib/githubLinks.html',
];

const promiseGlob = promisify(glob);

async function main() {
    const aioOriginDir = 'origin/aio';
    const aioJaDir = 'aio-ja';

    const searchFiles = async () => {
        const globResults = await Promise.all(copyTargets.map(target => {
            return promiseGlob(path.resolve(aioOriginDir, target), {});
        }));
        return globResults.reduce((files, result) => [...files, ...(result.map(file => path.relative(aioOriginDir, file)))], []);
    }

    const files = await searchFiles();

    const copy = (file) => {
        const ext = path.extname(file);
        const enFilePath = file.replace(`${ext}`, `.en${ext}`);
        const src = fs.readFileSync(path.resolve(aioOriginDir, file), { encoding: 'utf8' });

        let isTranslated = false;
        try {
            fs.accessSync(path.resolve(aioJaDir, enFilePath));
            isTranslated = true;
        } catch (err) { }

        fs.writeFileSync(path.resolve(aioJaDir, isTranslated ? enFilePath : file), src, { encoding: 'utf8' });
    };
    files.forEach(copy);
}


main().catch(err => {
    console.error(err);
    process.exit(1);
});

