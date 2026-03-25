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
  
  let newContent = content
    .replace(/borderRadius:\s*20%'/g, "borderRadius: '50%'")
    .replace(/borderRadius:\s*20%"/g, 'borderRadius: "50%"')
    .replace(/borderRadius:\s*20px'/g, "borderRadius: '40px'")
    .replace(/borderRadius:\s*20px"/g, 'borderRadius: "40px"')
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8')
    console.log(`Fixed syntax in ${filePath}`)
  }
})
