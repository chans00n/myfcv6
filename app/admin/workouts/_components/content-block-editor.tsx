"use client"

import * as React from "react"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
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
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"

export type ContentBlock = {
  id: string
  type: "text" | "image" | "video"
  content: string
  order: number
}

interface ContentBlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  disabled?: boolean
}

export function ContentBlockEditor({
  blocks,
  onChange,
  disabled,
}: ContentBlockEditorProps) {
  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      order: blocks.length,
    }
    onChange([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    )
  }

  const removeBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    onChange(updatedItems)
  }

  const handleImageUpload = async (file: File) => {
    return uploadFile(file, "workout-media", "content")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => addBlock("text")}
          disabled={disabled}
        >
          Add Text
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addBlock("image")}
          disabled={disabled}
        >
          Add Image
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addBlock("video")}
          disabled={disabled}
        >
          Add Video
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks
                .sort((a, b) => a.order - b.order)
                .map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-start gap-2 rounded-lg border p-4"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="mt-3 cursor-move"
                        >
                          <DragHandleDots2Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Select
                            value={block.type}
                            onValueChange={(value: ContentBlock["type"]) =>
                              updateBlock(block.id, { type: value })
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
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
                                updateBlock(block.id, {
                                  content: e.target.value,
                                })
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
                              onUpload={handleImageUpload}
                              disabled={disabled}
                            />
                          )}
                          {block.type === "video" && (
                            <Textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  content: e.target.value,
                                })
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
                          ✕
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
    </div>
  )
} 