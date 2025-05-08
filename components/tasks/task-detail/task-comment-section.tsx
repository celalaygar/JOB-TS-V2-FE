"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TaskComment } from "@/components/tasks/task-comment"
import { useState } from "react"
import type { Comment } from "@/types/task"

interface TaskCommentSectionProps {
  comments: Comment[]
  taskId: string
  currentUser?: any
}

export function TaskCommentSection({ comments, taskId, currentUser }: TaskCommentSectionProps) {
  const [commentText, setCommentText] = useState("")

  const handleAddComment = () => {
    // In a real app, this would dispatch an action to add the comment
    console.log("Adding comment:", commentText)
    setCommentText("")
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <TaskComment key={comment.id} comment={comment} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No comments yet.</p>
      )}

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">Add Comment</h4>
        <textarea
          className="w-full min-h-[100px] p-2 border rounded-md"
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={handleAddComment} disabled={!commentText.trim()}>
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )
}
