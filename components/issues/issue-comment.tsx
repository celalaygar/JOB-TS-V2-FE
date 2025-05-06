"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface IssueCommentProps {
  comment: {
    id: string
    text: string
    author: {
      id: string
      name: string
      avatar: string
      initials: string
    }
    createdAt: string
    editedAt?: string
    parentId?: string
    isActivity?: boolean
  }
  childComments: {
    id: string
    text: string
    author: {
      id: string
      name: string
      avatar: string
      initials: string
    }
    createdAt: string
    editedAt?: string
    parentId?: string
  }[]
  currentUser: {
    id: string
    name: string
    avatar: string
    initials: string
  } | null
  onEdit: () => void
  onDelete: () => void
  onReply: () => void
  isEditing: boolean
  editText: string
  onEditTextChange: (text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  isReplying: boolean
  replyText: string
  onReplyTextChange: (text: string) => void
  onSubmitReply: () => void
  onCancelReply: () => void
  users: {
    id: string
    name: string
    avatar: string
    initials: string
  }[]
  showFullThread: boolean
}

export function IssueComment({
  comment,
  childComments,
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
  showFullThread,
}: IssueCommentProps) {
  const [showAllReplies, setShowAllReplies] = useState(false)

  // Check if current user is the author
  const isAuthor = currentUser?.id === comment.author.id

  // Format the comment text to highlight @mentions
  const formatCommentText = (text: string) => {
    // Replace @mentions with styled spans
    const mentionRegex = /@(\w+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add the styled mention
      const mentionedName = match[1]
      const mentionedUser = users.find((u) => u.name.toLowerCase() === mentionedName.toLowerCase())

      if (mentionedUser) {
        parts.push(
          <span key={`mention-${match.index}`} className="text-[var(--fixed-primary)] font-medium">
            @{mentionedName}
          </span>,
        )
      } else {
        parts.push(`@${mentionedName}`)
      }

      lastIndex = match.index + match[0].length
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  // Determine how many replies to show
  const visibleReplies = showFullThread || showAllReplies ? childComments : childComments.slice(0, 2)

  const hasMoreReplies = childComments.length > visibleReplies.length

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-[var(--fixed-secondary)] p-3 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              {comment.editedAt && <span className="text-xs text-[var(--fixed-sidebar-muted)] italic">(edited)</span>}
            </div>

            {!comment.isActivity && (isAuthor || currentUser?.id) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onReply}>
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </DropdownMenuItem>
                  {isAuthor && (
                    <>
                      <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--fixed-danger)]" onClick={onDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
                className="min-h-[80px] border-[var(--fixed-card-border)]"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onSaveEdit} disabled={!editText.trim()}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">{formatCommentText(comment.text)}</div>
          )}
        </div>

        {!isEditing && !comment.isActivity && (
          <div className="flex gap-2 mt-1 ml-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-[var(--fixed-sidebar-muted)]"
              onClick={onReply}
            >
              Reply
            </Button>
          </div>
        )}

        {/* Replies */}
        {visibleReplies.length > 0 && (
          <div className="mt-3 ml-6 space-y-3">
            {visibleReplies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                  <AvatarFallback>{reply.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-[var(--fixed-secondary)] p-2 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">{reply.author.name}</span>
                        <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                        {reply.editedAt && (
                          <span className="text-xs text-[var(--fixed-sidebar-muted)] italic">(edited)</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs whitespace-pre-wrap">{formatCommentText(reply.text)}</div>
                  </div>
                </div>
              </div>
            ))}

            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-[var(--fixed-sidebar-muted)]"
                onClick={() => setShowAllReplies(!showAllReplies)}
              >
                {showAllReplies
                  ? "Show fewer replies"
                  : `Show ${childComments.length - 2} more ${childComments.length - 2 === 1 ? "reply" : "replies"}`}
              </Button>
            )}
          </div>
        )}

        {/* Reply form */}
        {isReplying && (
          <div className="mt-3 ml-6 flex gap-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                id={`reply-input-${comment.id}`}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] text-sm border-[var(--fixed-card-border)]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={onCancelReply}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onSubmitReply} disabled={!replyText.trim()}>
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
