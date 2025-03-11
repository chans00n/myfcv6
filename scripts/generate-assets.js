const fs = require("fs")
const path = require("path")

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Base directory for public assets
const publicDir = path.join(process.cwd(), "public")
const iconsDir = path.join(publicDir, "icons")
const avatarsDir = path.join(publicDir, "avatars")

// Ensure directories exist
ensureDir(publicDir)
ensureDir(iconsDir)
ensureDir(avatarsDir)

// Create a simple SVG icon with the MYFC text
const createSvgIcon = (size) => {
  const fontSize = Math.floor(size * 0.4)
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#a4b61a" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}px" 
      fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">MYFC</text>
  </svg>`
}

// Create a simple avatar
const createAvatarSvg = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#6b7280" rx="${size / 4}" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}px" 
      fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">SC</text>
  </svg>`
}

// Generate icons in different sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]
iconSizes.forEach((size) => {
  const svgContent = createSvgIcon(size)
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svgContent)
  console.log(`Created icon-${size}x${size}.svg`)
})

// Create a favicon.ico placeholder (just a text file with instructions)
fs.writeFileSync(path.join(publicDir, "favicon.ico"), createSvgIcon(32))
console.log("Created favicon.ico")

// Create a placeholder avatar
fs.writeFileSync(path.join(avatarsDir, "shadcn.svg"), createAvatarSvg(128))
console.log("Created shadcn.svg avatar")

console.log("All assets generated successfully!")

