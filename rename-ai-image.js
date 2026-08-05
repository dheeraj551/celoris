const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir);

const targetFile = files.find(f => f.startsWith('AI-Powered Web Development'));
if (targetFile) {
    fs.renameSync(path.join(publicDir, targetFile), path.join(publicDir, 'ai-web-dev-feature.png'));
    console.log('✅ Renamed', targetFile, 'to ai-web-dev-feature.png');
} else {
    console.log('❌ Could not find file starting with "AI-Powered Web Development"');
}
