import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import type { LogEntry } from "../hooks/useToolboxAPI";

interface EventLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ logs, onClear }) => {
  const getChipColor = (
    type: string
  ): "success" | "info" | "warning" | "error" | "default" => {
    switch (type) {
      case "success":
        return "success";
      case "info":
        return "info";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ListAltIcon />
            <Typography variant="h6">Event Log</Typography>
          </Box>
          <Button variant="outlined" size="small" onClick={onClear}>
            Clear Log
          </Button>
        </Box>
        {logs.length === 0 ? (
          <Typography color="text.secondary" fontStyle="italic">
            No logs yet...
          </Typography>
        ) : (
          <List
            dense
            sx={{
              bgcolor: "background.default",
              borderRadius: 1,
              maxHeight: 400,
              overflow: "auto",
            }}
          >
            {logs.map((log, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace" }}
                      >
                        [{log.timestamp.toLocaleTimeString()}]
                      </Typography>
                      <Chip
                        label={log.type}
                        color={getChipColor(log.type)}
                        size="small"
                        sx={{ height: 20 }}
                      />
                      <Typography variant="body2">{log.message}</Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
