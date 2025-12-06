// src/components/chat/SourceCitations.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import LanguageIcon from "@mui/icons-material/Language";
import FunctionsIcon from "@mui/icons-material/Functions";

/**
 * Simple heuristic:
 * - Split question into keywords (length >= 4).
 * - Keep a document if its snippet or title contains at least one keyword.
 * - If question empty or keywords empty → keep all.
 */
const filterDocSourcesByQuestion = (sources, question) => {
  if (!question || typeof question !== "string") return sources;

  const text = question.toLowerCase();
  const words = text
    .split(/\W+/)
    .filter((w) => w.length >= 4 && !["explain", "define", "first", "second"].includes(w));

  if (words.length === 0) return sources;

  return sources.filter((src) => {
    const snippet = (src.snippet || "").toLowerCase();
    const title = (src.title || "").toLowerCase();
    return words.some(
      (w) => snippet.includes(w) || title.includes(w)
    );
  });
};

const SourceCitations = ({ sources = [], question = "" }) => {
  const [expanded, setExpanded] = useState(false);

  const { docSources, webSources, sqlSources } = useMemo(() => {
    const docs = [];
    const web = [];
    const sql = [];

    for (const src of sources) {
      if (src.source_type === "document") docs.push(src);
      else if (src.source_type === "web") web.push(src);
      else if (src.source_type === "sql") sql.push(src);
    }

    // Filter out obviously unrelated documents where possible
    const filteredDocs = filterDocSourcesByQuestion(docs, question);

    return {
      docSources: filteredDocs,
      webSources: web,
      sqlSources: sql,
    };
  }, [sources, question]);

  const usedChannels = [];
  if (docSources.length > 0) usedChannels.push("Local PDFs (Vector DB)");
  if (sqlSources.length > 0) usedChannels.push("Physics DB (SQL/RDBMS)");
  if (webSources.length > 0) usedChannels.push("Web search");

  if (
    docSources.length === 0 &&
    webSources.length === 0 &&
    sqlSources.length === 0
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 0.5,
        borderRadius: 2,
        border: "1px dashed rgba(148,163,184,0.5)",
        backgroundColor: "rgba(15,23,42,0.8)",
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={(_, isExp) => setExpanded(isExp)}
        disableGutters
        elevation={0}
        square={false}
        sx={{
          bgcolor: "transparent",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          sx={{
            minHeight: 0,
            px: 1.5,
            py: 0.75,
            "& .MuiAccordionSummary-content": {
              margin: 0,
              alignItems: "center",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexWrap: "wrap" }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, opacity: 0.8 }}
            >
              Sources used:
            </Typography>
            {usedChannels.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  borderRadius: 999,
                  bgcolor: "rgba(37,99,235,0.2)",
                }}
              />
            ))}
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0.5, pb: 1.25, px: 1.5 }}>
          <Stack spacing={1.25}>
            {/* Local PDFs */}
            {docSources.length > 0 && (
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <DescriptionIcon
                    sx={{ fontSize: 16, opacity: 0.9, color: "primary.light" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, textTransform: "uppercase" }}
                  >
                    Local PDFs / Notes
                  </Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  {docSources.map((src, idx) => (
                    <Tooltip
                      key={`${src.file_id}-${idx}`}
                      title={
                        src.extra?.stored_filename
                          ? `File ID: ${src.file_id}, Stored: ${src.extra.stored_filename}`
                          : ""
                      }
                      arrow
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          opacity: 0.8,
                        }}
                      >
                        • {src.title || "Untitled document"}
                        {typeof src.page_number === "number" &&
                          ` (page ${src.page_number})`}
                        {src.snippet && (
                          <>
                            {" — "}
                            <span style={{ opacity: 0.8 }}>
                              {src.snippet.length > 140
                                ? src.snippet.slice(0, 140) + "…"
                                : src.snippet}
                            </span>
                          </>
                        )}
                      </Typography>
                    </Tooltip>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Web search */}
            {webSources.length > 0 && (
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LanguageIcon
                    sx={{ fontSize: 16, opacity: 0.9, color: "primary.light" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, textTransform: "uppercase" }}
                  >
                    Web Search
                  </Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  {webSources.map((src, idx) => (
                    <Typography
                      key={`${src.id || idx}`}
                      variant="caption"
                      sx={{
                        display: "block",
                        opacity: 0.85,
                      }}
                    >
                      •{" "}
                      {src.url ? (
                        <MuiLink
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          underline="hover"
                          color="inherit"
                          sx={{ fontWeight: 500 }}
                        >
                          {src.title || src.url}
                        </MuiLink>
                      ) : (
                        src.title || "Web result"
                      )}
                      {src.snippet && (
                        <>
                          {" — "}
                          <span style={{ opacity: 0.8 }}>
                            {src.snippet.length > 140
                              ? src.snippet.slice(0, 140) + "…"
                              : src.snippet}
                          </span>
                        </>
                      )}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Physics DB (SQL) */}
            {sqlSources.length > 0 && (
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <FunctionsIcon
                    sx={{ fontSize: 16, opacity: 0.9, color: "primary.light" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, textTransform: "uppercase" }}
                  >
                    Physics Formula DB
                  </Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  {sqlSources.map((src, idx) => (
                    <Typography
                      key={`${src.id || idx}`}
                      variant="caption"
                      sx={{
                        display: "block",
                        opacity: 0.85,
                      }}
                    >
                      • {src.title || "Formula"} —{" "}
                      <span style={{ opacity: 0.85 }}>
                        {src.snippet && src.snippet.length > 160
                          ? src.snippet.slice(0, 160) + "…"
                          : src.snippet || "Physics formula / definition"}
                      </span>
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SourceCitations;
