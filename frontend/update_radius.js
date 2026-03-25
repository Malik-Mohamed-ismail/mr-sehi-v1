import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && filePath.endsWith('.tsx')) {
      callback(filePath, stat)
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback)
    }
  })
}

walkSync(path.join(__dirname, 'src'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Replace inline styles like borderRadius: 8, borderRadius: '12px'
  // But DO NOT replace '50%' or 99 or '99px' (used for circles/pills)
  // Match digits from 4 to 32
  let newContent = content.replace(/borderRadius:\s*['"]?(?:[4-9]|1[0-9]|2[0-9]|3[0-2])(?:px)?['"]?/g, "borderRadius: 2")
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8')
    console.log(`Updated inline styles in ${filePath}`)
  }
})
