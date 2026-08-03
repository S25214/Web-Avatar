const fs = require('fs');
const path = require('path');

const config = {
    'VRM': ['.vrm'],
    'VRMA': ['.vrma', '.glb', '.gltf']
};

const manifest = {
    VRM: [],
    VRMA: [],
    modelAnimations: {}
};

// 1. Process VRM (flat list of files)
const vrmPath = path.join(__dirname, 'VRM');
if (fs.existsSync(vrmPath)) {
    const files = fs.readdirSync(vrmPath);
    manifest.VRM = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return config.VRM.includes(ext);
    }).map(file => path.parse(file).name);
    console.log(`Found ${manifest.VRM.length} files in VRM`);
}

// 2. Process VRMA (files + subdirectories)
const vrmaPath = path.join(__dirname, 'VRMA');
if (fs.existsSync(vrmaPath)) {
    const entries = fs.readdirSync(vrmaPath, { withFileTypes: true });
    
    entries.forEach(entry => {
        if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (config.VRMA.includes(ext)) {
                const animName = ext === '.vrma' ? path.parse(entry.name).name : entry.name;
                manifest.VRMA.push(animName);
            }
        } else if (entry.isDirectory()) {
            const subDirName = entry.name;
            const subDirPath = path.join(vrmaPath, subDirName);
            const subFiles = fs.readdirSync(subDirPath);
            
            const animNames = subFiles.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return config.VRMA.includes(ext);
            }).map(file => {
                const ext = path.extname(file).toLowerCase();
                return ext === '.vrma' ? path.parse(file).name : file;
            });
            
            if (animNames.length > 0) {
                manifest.modelAnimations[subDirName] = animNames;
                console.log(`Found ${animNames.length} model-specific animations for ${subDirName}`);
            }
        }
    });
    console.log(`Found ${manifest.VRMA.length} common files in VRMA`);
}

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json updated successfully!');
