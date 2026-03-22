const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'features'));
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // If the file already handles overflow explicitly, skip it to avoid double-wrapping
  if (content.includes('overflowX: \'auto\'')) {
    return;
  }
  
  // Replace all <table className="data-table">...</table> with a responsive wrapper
  const newContent = content.replace(/(<table className="data-table"[^>]*>[\s\S]*?<\/table>)/g, '<div style={{ overflowX: \'auto\', width: \'100%\' }}>\n            $1\n          </div>');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    updatedCount++;
    console.log('Updated:', file);
  }
});

console.log('Total files updated:', updatedCount);
