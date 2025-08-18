// components/shared/delete-confirmation-dialog.tsx

"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirmDelete: () => Promise<void>;
    title: string;
    description: string;
}

export function DeleteTaskCommentConfirmationDialog({
    open,
    onOpenChange,
    onConfirmDelete,
    title,
    description,
}: DeleteConfirmationDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onConfirmDelete();
        setIsDeleting(false);
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg z-50">
                    <Dialog.Title className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {description}
                    </Dialog.Description>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>

                    <Dialog.Close asChild>
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            aria-label="Kapat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}