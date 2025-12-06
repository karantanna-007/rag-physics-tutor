// src/components/files/FileCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const FileCard = ({ file, onDelete }) => {
  const isPdf =
    file?.content_type?.toLowerCase().includes("pdf") ||
    (file?.original_filename || "").toLowerCase().endsWith(".pdf");

  const Icon = isPdf ? PictureAsPdfIcon : DescriptionIcon;

  const handleDeleteClick = () => {
    if (!onDelete || !file?.id) return;
    const ok = window.confirm(
      `Delete "${file.original_filename || "this file"}" from your physics library?`
    );
    if (!ok) return;
    onDelete(file.id);
  };

  const createdAtLabel = file?.created_at
    ? new Date(file.created_at).toLocaleString()
    : null;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid rgba(148,163,184,0.45)",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.15), rgba(15,23,42,0.98))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Icon
            sx={{
              fontSize: 32,
              color: isPdf ? "#f97373" : "primary.light",
              mt: 0.5,
            }}
          />
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={file.original_filename || ""}
            >
              {file.original_filename || "Unnamed document"}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {formatSize(file.size_bytes)}{" "}
              {typeof file.pages === "number" && (
                <>• {file.pages} page(s) indexed</>
              )}
            </Typography>

            {createdAtLabel && (
              <Typography variant="caption" sx={{ opacity: 0.65 }}>
                Uploaded: {createdAtLabel}
              </Typography>
            )}

            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
              <Chip
                size="small"
                label="Indexed"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  borderRadius: 999,
                  bgcolor: "rgba(34,197,94,0.25)",
                }}
              />
              {file.topic_name && (
                <Chip
                  size="small"
                  label={file.topic_name}
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    borderRadius: 999,
                    bgcolor: "rgba(37,99,235,0.3)",
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          mt: "auto",
          pt: 0,
          px: 1.5,
          pb: 1.5,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Tooltip title="Remove this file from your RAG library">
          <span>
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              disabled={!onDelete}
              sx={{ color: "rgba(248,113,113,0.9)" }}
            >
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default FileCard;
