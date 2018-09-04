const fs = require('fs');
const path = require('path');

const tmpOriginDir = '.tmp';
const packageJsonPath = path.resolve(tmpOriginDir, 'package.json');

// Used For GitHub Links
function modifyPackageJson() {

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }));
    packageJson.repository = {
        "type": "git",
        "url": "https://github.com/angular/angular-ja.git"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
}

modifyPackageJson();
