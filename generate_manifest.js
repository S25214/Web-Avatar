const fs = require('fs');
const path = require('path');

const config = {
    'VRM': ['.vrm'],
    'VRMA': ['.vrma']
};

const manifest = {};

for (const [dirName, extensions] of Object.entries(config)) {
    const dirPath = path.join(__dirname, dirName);

    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        manifest[dirName] = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return extensions.includes(ext);
        });
        console.log(`Found ${manifest[dirName].length} files in ${dirName}`);
    } else {
        console.warn(`Directory not found: ${dirName}`);
        manifest[dirName] = [];
    }
}

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json updated successfully!');
