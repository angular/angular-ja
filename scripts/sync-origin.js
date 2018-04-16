const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');

const copyTargets = [
    'content/guide/**/*.md',
    'content/marketing/**/*',
    'content/tutorial/**/*.md',
    'content/navigation.json',
    'src/index.html',
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

main();
