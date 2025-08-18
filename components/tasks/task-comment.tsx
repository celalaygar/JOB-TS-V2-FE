"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import { ProjectTaskComment } from "@/types/task"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"


interface TaskCommentProps {
  comment: ProjectTaskComment
}

export function TaskComment({ comment }: TaskCommentProps) {


  const authUser = useAuthUser();
  const [onEditForm, setonEditForm] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");

  const onSaveEdit = (text: string) => {
    console.log(text)
  }
  const onCancelEdit = () => {
    setonEditForm(false)
  }

  const deleteComment = (comment: ProjectTaskComment) => {
    console.log(comment)
  }



  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Use either text or content property (for backward compatibility)
  const commentText = comment.comment || ""

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={"/placeholder.svg"} alt={comment.createdBy.email} />
        <AvatarFallback>{0}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-[var(--fixed-secondary)] p-3 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.createdBy.email}</span>
              <span className="text-xs text-[var(--fixed-sidebar-muted)]">{formatDate(comment.createdAt)}</span>
              {comment.updatedAt && <span className="text-xs text-[var(--fixed-sidebar-muted)] italic">(edited)</span>}
            </div>
            {comment.createdBy.id === authUser?.user.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => setonEditForm(true)} // Doğru kullanım
                  className="text-xs text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComment}
                  className="text-xs text-[var(--fixed-danger)] hover:text-[var(--fixed-danger)]/80"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {comment.createdBy.id === authUser?.user.id && onEditForm ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText?.(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onCancelEdit}
                  className="px-2 py-1 text-xs rounded-md border border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                >
                  Cancel
                </button>
                <button
                  onClick={e => onSaveEdit(editText)}
                  className="px-2 py-1 text-xs rounded-md bg-[var(--fixed-primary)] text-white"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">{commentText}</div>
          )}
        </div>

      </div>
    </div>
  )
}
