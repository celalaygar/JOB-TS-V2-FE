// components/tasks/task-detail/task-comment.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { deleteProjectTaskCommentHelper, updateProjectTaskCommentHelper } from "@/lib/service/api-helpers";
import { ProjectTaskComment, TaskCommentRequest } from "@/types/task";
import { formatDistanceToNow } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { DeleteTaskCommentConfirmationDialog } from "./task-detail/delete-task-comment-confirmation-dialog";

interface TaskCommentProps {
  comment: ProjectTaskComment;
  setComments: Dispatch<SetStateAction<ProjectTaskComment[] | null>>;
}

export function TaskComment({ comment, setComments }: TaskCommentProps) {
  const authUser = useAuthUser();
  const [onEditForm, setonEditForm] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(comment.comment || "");
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 👈 Yeni state

  // Yorumu kaydetme
  const onSaveEdit = async () => {
    const body: TaskCommentRequest = {
      comment: editText,
    };
    const response: ProjectTaskComment | null = await updateProjectTaskCommentHelper(
      comment.id,
      comment.taskId,
      body,
      { setLoading }
    );

    if (!!response) {
      setComments((prevComments) => {
        if (!prevComments) return null;
        return prevComments.map((c) => (c.id === response.id ? response : c));
      });
      setonEditForm(false);
    }
  };

  // Düzenleme formunu iptal etme
  const onCancelEdit = () => {
    setonEditForm(false);
    setEditText(comment.comment || "");
  };

  // Yorumu silme işlemini gerçekleştiren fonksiyon
  const handleConfirmDelete = async () => {
    const response: boolean | null = await deleteProjectTaskCommentHelper(
      comment.id,
      comment.taskId,
      { setLoading }
    );

    if (!!response) {
      setComments((prevComments) => {
        if (!prevComments) return null;
        return prevComments.filter((c) => c.id !== comment.id);
      });
      setIsDeleteDialogOpen(false); // Dialogu kapat
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const commentText = comment.comment || "";

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={"/placeholder.svg"} alt={comment.createdBy.email} />
        <AvatarFallback>{comment.createdBy.email.substring(0, 1).toUpperCase()}</AvatarFallback>
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
                  onClick={() => setonEditForm(true)}
                  className="text-xs text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)} // 👈 Dialogu açar
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
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onCancelEdit}
                  disabled={loading}
                  className="px-2 py-1 text-xs rounded-md border border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveEdit}
                  disabled={loading}
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
      {/* Silme dialogu buraya yerleştirildi */}
      <DeleteTaskCommentConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to permanently delete this comment? This action cannot be undone."
      />
    </div>
  );
}