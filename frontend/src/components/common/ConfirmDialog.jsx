// src/components/common/ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * ConfirmDialog
 *
 * Props:
 * - open: boolean
 * - title?: string
 * - description?: string | ReactNode
 * - confirmLabel?: string
 * - cancelLabel?: string
 * - isLoading?: boolean   // disable buttons when true
 * - onConfirm: () => void | Promise<void>
 * - onClose: () => void
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  const handleConfirm = async () => {
    if (!onConfirm) return;
    await onConfirm();
  };

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
