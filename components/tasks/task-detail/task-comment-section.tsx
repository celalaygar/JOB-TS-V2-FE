// components/tasks/task-detail/task-comment-section.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCallback, useEffect, useState } from "react"
import type { ProjectTaskComment, TaskCommentRequest } from "@/types/task"
import { addProjectTaskCommentHelper, getProjectTaskCommentsHelper } from "@/lib/service/api-helpers"
import { Loader2 } from "lucide-react"
import { TaskComment } from "../task-comment"

interface TaskCommentSectionProps {
  taskId: string
  projectId: string
  currentUser?: any
}


export function TaskCommentSection({ taskId, currentUser, projectId }: TaskCommentSectionProps) {
  const [commentText, setCommentText] = useState<string>("")
  const [comments, setComments] = useState<ProjectTaskComment[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingAddCommentForm, setLoadingAddCommentForm] = useState(false)

  const fetchProjectTaskComments = useCallback(async () => {
    const response: ProjectTaskComment[] | null = await getProjectTaskCommentsHelper(taskId, { setLoading });
    if (response) {
      setComments(response);
    }
  }, [taskId]);

  useEffect(() => {
    fetchProjectTaskComments();
  }, [fetchProjectTaskComments])



  const handleAddComment = async () => {
    let body: TaskCommentRequest = {
      taskId,
      projectId,
      comment: commentText,
      userIds: null
    }
    const response: ProjectTaskComment | null = await addProjectTaskCommentHelper(body, { setLoading: setLoadingAddCommentForm });
    if (!!response) {
      let array: ProjectTaskComment[] = comments ?? [];
      array.push(response)
      setComments(array)
      setCommentText("")
    }

  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>
      {
        loading ?
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
          : <>
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <TaskComment
                    key={comment.id}
                    comment={comment}
                    setComments={setComments}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No comments yet.</p>
            )}
          </>
      }
      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">Add Comment</h4>
        <textarea
          disabled={loadingAddCommentForm}
          className="w-full min-h-[100px] p-2 border rounded-md"
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || loadingAddCommentForm}>
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )
}