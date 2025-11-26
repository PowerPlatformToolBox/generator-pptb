import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface ConnectionStatusProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  isLoading: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connection,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LinkIcon />
            <Typography variant="h6">Connection Status</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={24} />
            <Typography>Checking connection...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!connection) {
    return (
      <Card
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LinkIcon />
            <Typography variant="h6">Connection Status</Typography>
          </Box>
          <Alert severity="warning">
            <Typography variant="body1" fontWeight="bold">
              No active connection
            </Typography>
            <Typography variant="body2">
              Please connect to a Dataverse environment to use this tool.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getEnvironmentColor = (
    env: string
  ): "success" | "warning" | "error" | "info" | "default" => {
    const envLower = env.toLowerCase();
    if (envLower === "production") return "error";
    if (envLower === "sandbox") return "warning";
    if (envLower === "development") return "info";
    return "default";
  };

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LinkIcon />
          <Typography variant="h6">Connection Status</Typography>
        </Box>
        <Alert severity="success" sx={{ mb: 0 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold">
                Name:
              </Typography>
              <Typography variant="body2">{connection.name}</Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold">
                URL:
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {connection.url}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold">
                Environment:
              </Typography>
              <Chip
                label={connection.environment}
                color={getEnvironmentColor(connection.environment)}
                size="small"
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold">
                ID:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
              >
                {connection.id}
              </Typography>
            </Box>
          </Box>
        </Alert>
      </CardContent>
    </Card>
  );
};
