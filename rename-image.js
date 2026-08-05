const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir);

const targetFile = files.find(f => f.startsWith('Web Development Bootcamp'));
if (targetFile) {
    fs.renameSync(path.join(publicDir, targetFile), path.join(publicDir, 'web-dev-bootcamp-feature.png'));
    console.log('✅ Renamed', targetFile, 'to web-dev-bootcamp-feature.png');
} else {
    console.log('❌ Could not find file starting with "Web Development Bootcamp"');
}
