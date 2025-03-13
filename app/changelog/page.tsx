import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { changelog } from "@/lib/changelog"

export const metadata: Metadata = {
  title: "Changelog | MyFC",
  description: "Track the latest updates and improvements to MyFC",
}

export default function ChangelogPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Changelog</h1>
          <p className="text-muted-foreground">
            Track the latest updates and improvements to MyFC
          </p>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-6">
          <div className="space-y-8">
            {changelog.map((entry, index) => (
              <Card key={entry.version} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">v{entry.version}</h2>
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                  </div>
                  {index === 0 && (
                    <Badge variant="secondary" className="h-6">
                      Latest
                    </Badge>
                  )}
                </div>
                <div className="space-y-4">
                  {entry.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-medium text-primary mb-2">
                        {section.title}
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {section.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 