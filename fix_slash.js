const fs = require('fs');
const path = require('path');

const metadataDir = path.join(process.env.APPDATA, 'Mexlify', 'downloads', 'metadata');
const files = fs.readdirSync(metadataDir).filter(f => f.endsWith('.txt'));
let count = 0;

for (const file of files) {
    const p = path.join(metadataDir, file);
    let content = fs.readFileSync(p, 'utf-8');
    // mexlify://C:/ --> mexlify:///C:/
    if (/mexlify:\/\/[A-Z]:/.test(content)) {
        const updated = content.replace(/mexlify:\/\/([A-Z]:)/g, 'mexlify:///$1');
        fs.writeFileSync(p, updated, 'utf-8');
        count++;
        console.log('Fixed: ' + file);
    }
}
console.log('Done: ' + count + ' files fixed');
