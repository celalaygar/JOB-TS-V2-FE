"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Author {
  id: string
  name: string
  avatar: string
  initials: string
}

interface Comment {
  id: string
  text?: string
  content?: string
  author: Author
  createdAt: string
  editedAt?: string
  parentId?: string
  isActivity?: boolean
}

interface TaskCommentProps {
  comment: Comment
  childComments?: Comment[]
  currentUser?: Author
  onEdit?: () => void
  onDelete?: () => void
  onReply?: () => void
  isEditing?: boolean
  editText?: string
  onEditTextChange?: (text: string) => void
  onSaveEdit?: () => void
  onCancelEdit?: () => void
  isReplying?: boolean
  replyText?: string
  onReplyTextChange?: (text: string) => void
  onSubmitReply?: () => void
  onCancelReply?: () => void
  users?: any[]
  showFullThread?: boolean
}

export function TaskComment({
  comment,
  childComments = [],
  currentUser,
  onEdit,
  onDelete,
  onReply,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  isReplying,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
  users,
  showFullThread = true,
}: TaskCommentProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Use either text or content property (for backward compatibility)
  const commentText = comment.text || comment.content || ""

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
        <AvatarFallback>{comment.author.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-[var(--fixed-secondary)] p-3 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-xs text-[var(--fixed-sidebar-muted)]">{formatDate(comment.createdAt)}</span>
              {comment.editedAt && <span className="text-xs text-[var(--fixed-sidebar-muted)] italic">(edited)</span>}
            </div>
            {currentUser && comment.author.id === currentUser.id && !isEditing && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="text-xs text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="text-xs text-[var(--fixed-danger)] hover:text-[var(--fixed-danger)]/80"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => onEditTextChange?.(e.target.value)}
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
                  onClick={onSaveEdit}
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

        {!isEditing && onReply && (
          <button onClick={onReply} className="text-xs text-[var(--fixed-primary)] mt-1 hover:underline">
            Reply
          </button>
        )}

        {isReplying && (
          <div className="mt-2 space-y-2">
            <textarea
              id={`reply-input-${comment.id}`}
              value={replyText}
              onChange={(e) => onReplyTextChange?.(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Write a reply..."
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelReply}
                className="px-2 py-1 text-xs rounded-md border border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
              >
                Cancel
              </button>
              <button
                onClick={onSubmitReply}
                className="px-2 py-1 text-xs rounded-md bg-[var(--fixed-primary)] text-white"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {childComments.length > 0 && showFullThread && (
          <div className="mt-2 space-y-2 pl-4 border-l-2 border-[var(--fixed-card-border)]">
            {childComments.map((childComment) => (
              <TaskComment
                key={childComment.id}
                comment={childComment}
                currentUser={currentUser}
                onEdit={() => onEdit?.()}
                onDelete={() => onDelete?.()}
                users={users}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
