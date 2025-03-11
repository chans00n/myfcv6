const fs = require("fs")
const path = require("path")

// Get absolute path to project root
const projectRoot = process.cwd()
console.log("Project root directory:", projectRoot)

// Base directory for public assets
const publicDir = path.join(projectRoot, "public")
const iconsDir = path.join(publicDir, "icons")
const avatarsDir = path.join(publicDir, "avatars")

console.log("Creating assets in:")
console.log("- Public dir:", publicDir)
console.log("- Icons dir:", iconsDir)
console.log("- Avatars dir:", avatarsDir)

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  } else {
    console.log(`Directory already exists: ${dirPath}`)
  }
}

// Create directories
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
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`)
  try {
    fs.writeFileSync(filePath, svgContent)
    console.log(`Created icon: ${filePath}`)
  } catch (error) {
    console.error(`Error creating ${filePath}:`, error)
  }
})

// Create a favicon.ico placeholder
const faviconPath = path.join(publicDir, "favicon.ico")
try {
  fs.writeFileSync(faviconPath, createSvgIcon(32))
  console.log(`Created favicon: ${faviconPath}`)
} catch (error) {
  console.error(`Error creating favicon:`, error)
}

// Create a placeholder avatar
const avatarPath = path.join(avatarsDir, "shadcn.svg")
try {
  fs.writeFileSync(avatarPath, createAvatarSvg(128))
  console.log(`Created avatar: ${avatarPath}`)
} catch (error) {
  console.error(`Error creating avatar:`, error)
}

console.log("Asset generation complete!")

// List all created files to verify
console.log("\nVerifying created files:")
if (fs.existsSync(iconsDir)) {
  console.log("Icons directory contents:")
  fs.readdirSync(iconsDir).forEach((file) => {
    console.log(`- ${path.join(iconsDir, file)}`)
  })
}

if (fs.existsSync(avatarsDir)) {
  console.log("Avatars directory contents:")
  fs.readdirSync(avatarsDir).forEach((file) => {
    console.log(`- ${path.join(avatarsDir, file)}`)
  })
}

if (fs.existsSync(faviconPath)) {
  console.log(`Favicon exists: ${faviconPath}`)
} else {
  console.log(`Favicon does not exist: ${faviconPath}`)
}

