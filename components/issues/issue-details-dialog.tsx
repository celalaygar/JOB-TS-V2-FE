"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addComment, updateIssue, updateComment, deleteComment } from "@/lib/redux/features/issues-slice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  CalendarDays,
  MessageSquare,
  Paperclip,
  Clock,
  Link2,
  Edit,
  AtSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react"
import { IssueComment } from "@/components/issues/issue-comment"
import { IssueAttachments } from "@/components/issues/issue-attachments"
import { IssueActivity } from "@/components/issues/issue-activity"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IssueDetailsDialogProps {
  issueId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IssueDetailsDialog({ issueId, open, onOpenChange }: IssueDetailsDialogProps) {
  const dispatch = useDispatch()
  const issue = useSelector((state: RootState) => state.issues.issues.find((i) => i.id === issueId))
  const currentUser = useSelector((state: RootState) => state.users.currentUser)
  const users = useSelector((state: RootState) => state.users.users)
  const projects = useSelector((state: RootState) => state.projects.projects)

  const [comment, setComment] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [mentionSearch, setMentionSearch] = useState("")
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [copyLinkTooltip, setCopyLinkTooltip] = useState("Copy Link")

  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (issue) {
      setDescription(issue.description)
    }
  }, [issue])

  useEffect(() => {
    // Reset state when dialog opens/closes
    if (!open) {
      setComment("")
      setActiveTab("details")
      setEditingComment(null)
      setReplyingTo(null)
      setShowMentionDropdown(false)
    }
  }, [open])

  // Focus on description input when editing
  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus()
    }
  }, [isEditingDescription])

  if (!issue) return null

  const project = projects.find((p) => p.id === issue.project)

  const handleStatusChange = (status: string) => {
    dispatch(
      updateIssue({
        id: issue.id,
        changes: { status },
      }),
    )
  }

  const handleAssigneeChange = (assigneeId: string) => {
    const assignee = users.find((user) => user.id === assigneeId)

    if (assignee) {
      dispatch(
        updateIssue({
          id: issue.id,
          changes: {
            assignee: {
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatar,
              initials: assignee.initials,
            },
          },
        }),
      )

      // Add activity record for assignee change
      const activityComment = {
        id: `comment-${Date.now()}`,
        text: `Changed assignee to ${assignee.name}`,
        author: {
          id: currentUser?.id || "",
          name: currentUser?.name || "",
          avatar: currentUser?.avatar || "",
          initials: currentUser?.initials || "",
        },
        createdAt: new Date().toISOString(),
        isActivity: true,
      }

      dispatch(
        addComment({
          issueId: issue.id,
          comment: activityComment,
        }),
      )
    }
  }

  const handlePriorityChange = (priority: string) => {
    dispatch(
      updateIssue({
        id: issue.id,
        changes: { priority },
      }),
    )

    // Add activity record for priority change
    const activityComment = {
      id: `comment-${Date.now()}`,
      text: `Changed priority to ${priority}`,
      author: {
        id: currentUser?.id || "",
        name: currentUser?.name || "",
        avatar: currentUser?.avatar || "",
        initials: currentUser?.initials || "",
      },
      createdAt: new Date().toISOString(),
      isActivity: true,
    }

    dispatch(
      addComment({
        issueId: issue.id,
        comment: activityComment,
      }),
    )
  }

  const handleAddComment = () => {
    if (!comment.trim() || !currentUser) return

    dispatch(
      addComment({
        issueId: issue.id,
        comment: {
          id: `comment-${Date.now()}`,
          text: comment,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            initials: currentUser.initials,
          },
          createdAt: new Date().toISOString(),
          parentId: undefined,
        },
      }),
    )

    setComment("")
  }

  const handleEditComment = (commentId: string) => {
    const commentToEdit = issue.comments?.find((c) => c.id === commentId)
    if (commentToEdit) {
      setEditingComment(commentId)
      setEditCommentText(commentToEdit.text)
    }
  }

  const handleSaveEditedComment = () => {
    if (!editCommentText.trim() || !editingComment) return

    dispatch(
      updateComment({
        issueId: issue.id,
        commentId: editingComment,
        changes: {
          text: editCommentText,
          editedAt: new Date().toISOString(),
        },
      }),
    )

    setEditingComment(null)
    setEditCommentText("")
  }

  const handleCancelEditComment = () => {
    setEditingComment(null)
    setEditCommentText("")
  }

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId)
    setReplyText("")

    // Focus on the reply input after state update
    setTimeout(() => {
      const replyInput = document.getElementById(`reply-input-${commentId}`)
      if (replyInput) {
        replyInput.focus()
      }
    }, 0)
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim() || !currentUser) return

    dispatch(
      addComment({
        issueId: issue.id,
        comment: {
          id: `comment-${Date.now()}`,
          text: replyText,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            initials: currentUser.initials,
          },
          createdAt: new Date().toISOString(),
          parentId: parentId,
        },
      }),
    )

    setReplyingTo(null)
    setReplyText("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  const handleDeleteComment = () => {
    if (!commentToDelete) return

    dispatch(
      deleteComment({
        issueId: issue.id,
        commentId: commentToDelete,
      }),
    )

    setCommentToDelete(null)
  }

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setComment(value)

    // Check for @mention
    const lastAtSymbolIndex = value.lastIndexOf("@")
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex > value.lastIndexOf(" ")) {
      const searchText = value.substring(lastAtSymbolIndex + 1)
      setMentionSearch(searchText)
      setShowMentionDropdown(true)

      // Calculate position for mention dropdown
      const textarea = e.target
      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = value.substring(0, cursorPosition)
      const lines = textBeforeCursor.split("\n")
      const currentLineIndex = lines.length - 1
      const currentLineLength = lines[currentLineIndex].length

      // Approximate position calculation
      const lineHeight = 24 // Approximate line height in pixels
      const charWidth = 8 // Approximate character width in pixels

      setMentionPosition({
        top: (currentLineIndex + 1) * lineHeight,
        left: currentLineLength * charWidth,
      })
    } else {
      setShowMentionDropdown(false)
    }
  }

  const handleSelectMention = (username: string) => {
    if (!commentInputRef.current) return

    const cursorPos = commentInputRef.current.selectionStart
    const textBeforeCursor = comment.substring(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const newComment = comment.substring(0, lastAtIndex) + `@${username} ` + comment.substring(cursorPos)

      setComment(newComment)
      setShowMentionDropdown(false)

      // Focus back on textarea and set cursor position after the mention
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus()
          const newCursorPos = lastAtIndex + username.length + 2 // +2 for @ and space
          commentInputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    }
  }

  const handleSaveDescription = () => {
    dispatch(
      updateIssue({
        id: issue.id,
        changes: { description },
      }),
    )

    setIsEditingDescription(false)

    // Add activity record for description update
    if (description !== issue.description) {
      const activityComment = {
        id: `comment-${Date.now()}`,
        text: `Updated task description`,
        author: {
          id: currentUser?.id || "",
          name: currentUser?.name || "",
          avatar: currentUser?.avatar || "",
          initials: currentUser?.initials || "",
        },
        createdAt: new Date().toISOString(),
        isActivity: true,
      }

      dispatch(
        addComment({
          issueId: issue.id,
          comment: activityComment,
        }),
      )
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tasks/${issue.id}`)
    setCopyLinkTooltip("Copied!")
    setTimeout(() => setCopyLinkTooltip("Copy Link"), 2000)
  }

  // Filter users for @mentions
  const filteredUsers = users
    .filter((user) => user.name.toLowerCase().includes(mentionSearch.toLowerCase()))
    .slice(0, 5) // Limit to 5 results

  // Organize comments into threads
  const parentComments = issue.comments?.filter((comment) => !comment.parentId) || []
  const childComments = issue.comments?.filter((comment) => comment.parentId) || []

  // Get activity items (comments marked as activity)
  const activityItems = issue.comments?.filter((comment) => comment.isActivity) || []

  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "to-do":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "review":
        return "In Review"
      case "done":
        return "Done"
      default:
        return status
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "to-do":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "review":
        return <FileText className="h-4 w-4" />
      case "done":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex-1 pr-4">
            <DialogTitle className="text-xl">{issue.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono">
                {issue.issueNumber}
              </Badge>
              <span className="text-sm text-[var(--fixed-sidebar-muted)]">
                Created {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyLink}>
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copyLinkTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                issue.status === "to-do"
                  ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                  : issue.status === "in-progress"
                    ? "bg-[var(--fixed-primary)] text-white"
                    : issue.status === "review"
                      ? "bg-[var(--fixed-warning)] text-white"
                      : "bg-[var(--fixed-success)] text-white"
              }
            >
              {getStatusIcon(issue.status)}
              <span className="ml-1">{getStatusDisplay(issue.status)}</span>
            </Badge>
            <Badge
              className={
                issue.priority === "High"
                  ? "bg-[var(--fixed-danger)] text-white"
                  : issue.priority === "Medium"
                    ? "bg-[var(--fixed-warning)] text-white"
                    : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
              }
            >
              {issue.priority}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="col-span-2">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({parentComments.filter((c) => !c.isActivity).length})
                </TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Description</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setIsEditingDescription(!isEditingDescription)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        {isEditingDescription ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    {isEditingDescription ? (
                      <div className="space-y-2">
                        <Textarea
                          ref={descriptionInputRef}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide a detailed description of the issue..."
                          className="min-h-[120px] border-[var(--fixed-card-border)]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingDescription(false)
                              setDescription(issue.description)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveDescription}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[var(--fixed-secondary)] p-3 rounded-md text-sm">
                        {description ? (
                          <div className="whitespace-pre-wrap">{description}</div>
                        ) : (
                          <div className="text-[var(--fixed-sidebar-muted)] italic">
                            No description provided. Click edit to add one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {issue.sprint && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                      <span>
                        Sprint:{" "}
                        {issue.sprint === "current"
                          ? "Current Sprint"
                          : issue.sprint === "next"
                            ? "Next Sprint"
                            : "Backlog"}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[var(--fixed-card-border)] pt-4 mt-4">
                    <h3 className="text-sm font-medium mb-3">Recent Comments</h3>
                    {parentComments
                      .filter((c) => !c.isActivity)
                      .slice(0, 3)
                      .map((comment) => (
                        <IssueComment
                          key={comment.id}
                          comment={comment}
                          childComments={childComments.filter((c) => c.parentId === comment.id)}
                          currentUser={currentUser}
                          onEdit={() => handleEditComment(comment.id)}
                          onDelete={() => setCommentToDelete(comment.id)}
                          onReply={() => handleReplyToComment(comment.id)}
                          isEditing={editingComment === comment.id}
                          editText={editCommentText}
                          onEditTextChange={setEditCommentText}
                          onSaveEdit={handleSaveEditedComment}
                          onCancelEdit={handleCancelEditComment}
                          isReplying={replyingTo === comment.id}
                          replyText={replyText}
                          onReplyTextChange={setReplyText}
                          onSubmitReply={() => handleSubmitReply(comment.id)}
                          onCancelReply={handleCancelReply}
                          users={users}
                          showFullThread={false}
                        />
                      ))}

                    {parentComments.filter((c) => !c.isActivity).length > 3 && (
                      <Button variant="link" className="mt-2 p-0 h-auto" onClick={() => setActiveTab("comments")}>
                        View all comments
                      </Button>
                    )}

                    {parentComments.filter((c) => !c.isActivity).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-[var(--fixed-sidebar-muted)]">No comments yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <div className="space-y-6">
                  {parentComments.filter((c) => !c.isActivity).length > 0 ? (
                    parentComments
                      .filter((c) => !c.isActivity)
                      .map((comment) => (
                        <IssueComment
                          key={comment.id}
                          comment={comment}
                          childComments={childComments.filter((c) => c.parentId === comment.id)}
                          currentUser={currentUser}
                          onEdit={() => handleEditComment(comment.id)}
                          onDelete={() => setCommentToDelete(comment.id)}
                          onReply={() => handleReplyToComment(comment.id)}
                          isEditing={editingComment === comment.id}
                          editText={editCommentText}
                          onEditTextChange={setEditCommentText}
                          onSaveEdit={handleSaveEditedComment}
                          onCancelEdit={handleCancelEditComment}
                          isReplying={replyingTo === comment.id}
                          replyText={replyText}
                          onReplyTextChange={setReplyText}
                          onSubmitReply={() => handleSubmitReply(comment.id)}
                          onCancelReply={handleCancelReply}
                          users={users}
                          showFullThread={true}
                        />
                      ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-[var(--fixed-sidebar-muted)]">No comments yet.</p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6 relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        ref={commentInputRef}
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={handleCommentInputChange}
                        className="min-h-[80px] border-[var(--fixed-card-border)]"
                      />

                      {/* @mention dropdown */}
                      {showMentionDropdown && filteredUsers.length > 0 && (
                        <div
                          className="absolute z-10 bg-[var(--fixed-card-bg)] border border-[var(--fixed-card-border)] rounded-md shadow-md w-64"
                          style={{
                            top: `${mentionPosition.top + 40}px`,
                            left: `${mentionPosition.left}px`,
                          }}
                        >
                          <div className="p-1">
                            {filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 p-2 hover:bg-[var(--fixed-secondary)] rounded cursor-pointer"
                                onClick={() => handleSelectMention(user.name)}
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  className="border-[var(--fixed-card-border)]"
                                >
                                  <Paperclip className="h-4 w-4 mr-1" />
                                  Attach
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add an attachment</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  className="border-[var(--fixed-card-border)]"
                                  onClick={() => {
                                    setComment((prev) => prev + "@")
                                    setShowMentionDropdown(true)
                                    // Focus and move cursor after @
                                    setTimeout(() => {
                                      if (commentInputRef.current) {
                                        commentInputRef.current.focus()
                                        const pos = commentInputRef.current.value.length
                                        commentInputRef.current.setSelectionRange(pos, pos)
                                      }
                                    }, 0)
                                  }}
                                >
                                  <AtSign className="h-4 w-4 mr-1" />
                                  Mention
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mention a user</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!comment.trim()}
                          className="bg-[var(--fixed-primary)] text-white"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="mt-4">
                <IssueAttachments issueId={issue.id} />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <IssueActivity activityItems={activityItems} issue={issue} users={users} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <Select value={issue.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-do">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Assignee</h3>
              <Select value={issue.assignee.id} onValueChange={handleAssigneeChange}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <Select value={issue.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Project</h3>
              <div className="text-sm p-2 border rounded-md bg-[var(--fixed-secondary)]">
                {project?.name || issue.projectName}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Sprint</h3>
              <Select
                value={issue.sprint || ""}
                onValueChange={(value) => {
                  dispatch(
                    updateIssue({
                      id: issue.id,
                      changes: { sprint: value || undefined },
                    }),
                  )
                }}
              >
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Not assigned to sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-assigned">Not assigned</SelectItem>
                  <SelectItem value="current">Current Sprint</SelectItem>
                  <SelectItem value="next">Next Sprint</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Labels</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  <Tag className="h-3 w-3 mr-1" />
                  Frontend
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <Tag className="h-3 w-3 mr-1" />
                  Feature
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-dashed border-[var(--fixed-card-border)]"
                >
                  + Add Label
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Created by</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} alt={issue.assignee.name} />
                  <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{issue.assignee.name}</span>
                <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                  on {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteComment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
