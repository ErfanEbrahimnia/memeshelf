"use client";

import {
  confirmable,
  ContextAwareConfirmation,
  type ConfirmDialogProps,
} from "react-confirm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

function ConfirmAlertDialog({
  show,
  proceed,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmDialogProps<ConfirmOptions, boolean>) {
  return (
    <AlertDialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          proceed(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={() => proceed(true)}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Promise-based confirmation (like `window.confirm`) using the shadcn alert dialog. */
const confirm = ContextAwareConfirmation.createConfirmation(
  confirmable(ConfirmAlertDialog)
);

const ConfirmationRoot = ContextAwareConfirmation.ConfirmationRoot;

export { confirm, ConfirmationRoot };
