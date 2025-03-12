"use client"

import { useState } from "react"
import { nanoid } from "nanoid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { uploadFile } from "@/lib/supabase/upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Plus, Trash2 } from "lucide-react"

export interface ContentBlock {
  id: string
  type: "text" | "image" | "video"
  content: string
  order: number
}

interface ContentBlockEditorProps {
  value: ContentBlock[]
  onChange: (value: ContentBlock[]) => void
  disabled?: boolean
}

export function ContentBlockEditor({
  value,
  onChange,
  disabled
}: ContentBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(value || [])

  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: nanoid(),
      type: "text",
      content: "",
      order: blocks.length
    }
    const updatedBlocks = [...blocks, newBlock]
    setBlocks(updatedBlocks)
    onChange(updatedBlocks)
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    )
    setBlocks(updatedBlocks)
    onChange(updatedBlocks)
  }

  const removeBlock = (id: string) => {
    const updatedBlocks = blocks
      .filter(block => block.id !== id)
      .map((block, index) => ({ ...block, order: index }))
    setBlocks(updatedBlocks)
    onChange(updatedBlocks)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedBlocks = items.map((item, index) => ({
      ...item,
      order: index
    }))
    setBlocks(updatedBlocks)
    onChange(updatedBlocks)
  }

  const handleUpload = async (file: File) => {
    const result = await uploadFile(file)
    return result.url
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable
                  key={block.id}
                  draggableId={block.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-start gap-4 rounded-lg border p-4"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="mt-3 cursor-move"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <Select
                          value={block.type}
                          onValueChange={(value: "text" | "image" | "video") =>
                            updateBlock(block.id, { type: value })
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select block type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                        {block.type === "text" && (
                          <Textarea
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, { content: e.target.value })
                            }
                            placeholder="Enter text content..."
                            disabled={disabled}
                          />
                        )}
                        {block.type === "image" && (
                          <ImageUpload
                            value={block.content}
                            onChange={(url) =>
                              updateBlock(block.id, { content: url })
                            }
                            onUpload={handleUpload}
                            disabled={disabled}
                          />
                        )}
                        {block.type === "video" && (
                          <Input
                            type="url"
                            value={block.content}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateBlock(block.id, { content: e.target.value })
                            }
                            placeholder="Enter video URL..."
                            disabled={disabled}
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(block.id)}
                        disabled={disabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addBlock}
        disabled={disabled}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Block
      </Button>
    </div>
  )
} 