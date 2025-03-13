export interface ChangelogSection {
  title: string
  items: string[]
}

export interface ChangelogEntry {
  version: string
  date: string
  sections: ChangelogSection[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: "Unreleased",
    date: "Coming Soon",
    sections: [
      {
        title: "Added",
        items: [
          "Initial project overview document",
          "YouTube video player with autoplay and fullscreen functionality",
          "Cookie handling improvements",
          "Route handler for sample workouts"
        ]
      },
      {
        title: "Fixed",
        items: [
          "Cookie parsing issues",
          "Multiple GoTrueClient instances",
          "YouTube video display and autoplay issues"
        ]
      },
      {
        title: "Changed",
        items: [
          "Enhanced video modal component",
          "Updated cookie handling logic"
        ]
      }
    ]
  },
  {
    version: "0.1.0",
    date: "March 13, 2024",
    sections: [
      {
        title: "Initial Release",
        items: [
          "Core functionality",
          "Basic authentication flow",
          "Route handler implementation",
          "Video modal component"
        ]
      }
    ]
  }
]

export function getLatestChanges(): ChangelogEntry {
  return changelog[0]
}

export function formatChangelogForMarkdown(): string {
  return changelog
    .map((entry) => {
      const header = `## [${entry.version}]${entry.date !== "Coming Soon" ? ` - ${entry.date}` : ""}\n`
      const sections = entry.sections
        .map((section) => {
          const sectionHeader = `### ${section.title}\n`
          const items = section.items.map((item) => `- ${item}`).join("\n")
          return `${sectionHeader}${items}\n`
        })
        .join("\n")
      return `${header}\n${sections}`
    })
    .join("\n")
} 