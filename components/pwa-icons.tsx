import Head from "next/head"

export function PwaIcons() {
  return (
    <Head>
      {/* Add favicon link */}
      <link
        rel="icon"
        href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23a4b61a'/><text x='50%' y='50%' fontFamily='Arial, sans-serif' fontSize='12px' fill='white' textAnchor='middle' dominantBaseline='middle' fontWeight='bold'>MYFC</text></svg>"
      />

      {/* Add PWA icons */}
      {[72, 96, 128, 144, 152, 192, 384, 512].map((size) => (
        <link
          key={size}
          rel="apple-touch-icon"
          sizes={`${size}x${size}`}
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'><rect width='${size}' height='${size}' fill='%23a4b61a'/><text x='50%' y='50%' fontFamily='Arial, sans-serif' fontSize='${Math.floor(size * 0.4)}px' fill='white' textAnchor='middle' dominantBaseline='middle' fontWeight='bold'>MYFC</text></svg>`}
        />
      ))}
    </Head>
  )
}

