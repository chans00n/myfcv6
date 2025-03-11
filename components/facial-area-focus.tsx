"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Define the order of facial areas for consistent rendering
const FACIAL_AREA_ORDER = ["forehead", "eyes", "cheeks", "jawline", "neck"] as const

// Sample data for facial areas
const facialAreas = [
  {
    id: "forehead",
    name: "Forehead",
    minutes: 45,
    percentage: 20,
    description: "Targets forehead muscles to reduce lines and wrinkles",
  },
  {
    id: "eyes",
    name: "Eye Area",
    minutes: 60,
    percentage: 25,
    description: "Focuses on muscles around the eyes to reduce crow's feet",
  },
  {
    id: "cheeks",
    name: "Cheeks",
    minutes: 35,
    percentage: 15,
    description: "Tones and lifts the cheek muscles for a more defined look",
  },
  {
    id: "jawline",
    name: "Jawline",
    minutes: 55,
    percentage: 23,
    description: "Strengthens the jawline for a more sculpted appearance",
  },
  {
    id: "neck",
    name: "Neck",
    minutes: 40,
    percentage: 17,
    description: "Tightens neck muscles to reduce sagging and improve contour",
  },
].sort((a, b) => FACIAL_AREA_ORDER.indexOf(a.id as typeof FACIAL_AREA_ORDER[number]) - FACIAL_AREA_ORDER.indexOf(b.id as typeof FACIAL_AREA_ORDER[number]))

const tabData = [
  { id: "facial_areas_tab_all", label: "All Areas" },
  { id: "facial_areas_tab_most", label: "Most Focused" },
  { id: "facial_areas_tab_least", label: "Least Focused" },
] as const

export function FacialAreaFocus() {
  const [selectedArea, setSelectedArea] = useState(facialAreas[0])
  const [activeTab, setActiveTab] = useState<typeof tabData[number]["id"]>(tabData[0].id)

  // Stable sort function that uses percentage and id
  const stableSort = (items: typeof facialAreas, ascending = true) => {
    return [...items].sort((a, b) => {
      const diff = ascending ? a.percentage - b.percentage : b.percentage - a.percentage
      return diff === 0 ? FACIAL_AREA_ORDER.indexOf(a.id as typeof FACIAL_AREA_ORDER[number]) - FACIAL_AREA_ORDER.indexOf(b.id as typeof FACIAL_AREA_ORDER[number]) : diff
    })
  }

  const renderAreaItem = (area: typeof facialAreas[0], index: number) => (
    <div key={`facial_area_item_${area.id}_${index}`} className="flex items-center justify-between">
      <span className="text-sm">{area.name}</span>
      <div className="flex items-center gap-2 min-w-0 flex-shrink">
        <Progress value={area.percentage * 4} className="w-24 h-1.5" />
        <span className="text-xs text-muted-foreground w-8 text-right">{area.percentage}%</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="relative h-[180px] w-[180px] mx-auto">
        {/* Simplified face diagram - in a real app, you'd use an actual SVG or image */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/30"></div>

        {/* Facial area hotspots */}
        {FACIAL_AREA_ORDER.map((areaId, index) => {
          const area = facialAreas.find(a => a.id === areaId)!
          return (
            <div
              key={`facial_area_hotspot_${area.id}_${index}`}
              className={`${getHotspotPosition(area.id)} cursor-pointer ${
                selectedArea.id === area.id ? "bg-primary/30" : "bg-primary/10 hover:bg-primary/20"
              }`}
              onClick={() => setSelectedArea(area)}
            ></div>
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-medium">{selectedArea.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedArea.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Focus time</span>
            <span className="text-sm text-muted-foreground">{selectedArea.minutes} minutes</span>
          </div>
          <Progress value={selectedArea.percentage * 4} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {selectedArea.percentage}% of your total workout time
          </p>
        </div>
      </div>

      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {tabData.map((tab) => (
              <TabsTrigger key={`facial_areas_trigger_${tab.id}`} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tabData[0].id} className="mt-4 w-full max-w-full">
            <div className="space-y-3">
              {[...facialAreas].map((area, index) => renderAreaItem(area, index))}
            </div>
          </TabsContent>
          <TabsContent value={tabData[1].id} className="mt-4 w-full max-w-full">
            <div className="space-y-3">
              {stableSort(facialAreas, false).slice(0, 3).map((area, index) => renderAreaItem(area, index))}
            </div>
          </TabsContent>
          <TabsContent value={tabData[2].id} className="mt-4 w-full max-w-full">
            <div className="space-y-3">
              {stableSort(facialAreas, true).slice(0, 3).map((area, index) => renderAreaItem(area, index))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getHotspotPosition(id: string): string {
  const positions = {
    forehead: "absolute top-[20%] left-[50%] transform -translate-x-1/2 w-16 h-8",
    eyes: "absolute top-[35%] left-[50%] transform -translate-x-1/2 w-14 h-6",
    cheeks: "absolute top-[50%] left-[50%] transform -translate-x-1/2 w-12 h-10",
    jawline: "absolute top-[70%] left-[50%] transform -translate-x-1/2 w-16 h-6",
    neck: "absolute top-[85%] left-[50%] transform -translate-x-1/2 w-10 h-8",
  } as const

  return positions[id as keyof typeof positions]
}

