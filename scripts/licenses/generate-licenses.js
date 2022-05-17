const { execSync } = require('child_process');
const { readFileSync, writeFileSync, fstat } = require('fs');
const { resolve } = require('path');
const mustache = require("mustache");

const root_dir = resolve(__dirname, '../../');
const format_path = resolve(__dirname, 'report-format.json');

const template = readFileSync(resolve(__dirname, 'template.html'), { encoding: 'utf-8' });

const data = JSON.parse(execSync(`npx license-checker --production --json --customPath ${format_path}`, {
    cwd: root_dir,
    encoding: 'utf-8',
}));

const list = Object.keys(data).map(name => {
    const { repository, licenseText } = data[name];
    return { name, repository, licenseText };
})

const output = mustache.render(template, { modules: list });
const out_path = resolve(root_dir, 'ThirdPartyLicenses.html')
writeFileSync(out_path, output);

console.log(`Successfully compiled licenses at ${out_path}`);