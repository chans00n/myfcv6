const sharp = require("sharp")
const fs = require("fs").promises
const path = require("path")

const sizes = [16, 32, 48, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512]

async function generateIcons() {
  const inputFile = path.join(process.cwd(), "public", "MYFC_block.png")
  const outputDir = path.join(process.cwd(), "public", "icons")

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true })

  // Generate PWA icons
  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size, {
        fit: "contain",
        background: { r: 164, g: 182, b: 26, alpha: 1 }, // #a4b61a
      })
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`))

    // Generate Apple touch icons (with padding)
    if ([120, 152, 167, 180].includes(size)) {
      await sharp(inputFile)
        .resize(size - 20, size - 20, {
          fit: "contain",
          background: { r: 164, g: 182, b: 26, alpha: 1 },
        })
        .extend({
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
          background: { r: 164, g: 182, b: 26, alpha: 1 },
        })
        .toFile(path.join(outputDir, `apple-touch-icon-${size}x${size}.png`))
    }
  }

  // Generate favicon.ico (16x16, 32x32, 48x48)
  const faviconSizes = [16, 32, 48]
  const faviconBuffers = await Promise.all(
    faviconSizes.map((size) =>
      sharp(inputFile)
        .resize(size, size, {
          fit: "contain",
          background: { r: 164, g: 182, b: 26, alpha: 1 },
        })
        .toBuffer(),
    ),
  )

  await sharp(faviconBuffers[0]).toFile(path.join(outputDir, "favicon.ico"))
}

generateIcons().catch(console.error)

