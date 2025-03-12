import { default as dynamicImport } from "next/dynamic"

export const dynamic = "force-static"

const ClientPage = dynamicImport(() => import("./client-wrapper"), {
  ssr: false
})

export default function OfflinePage() {
  return <ClientPage />
}

