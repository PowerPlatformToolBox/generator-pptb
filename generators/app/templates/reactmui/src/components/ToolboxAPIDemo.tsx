import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";

interface ToolboxAPIDemoProps {
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

export const ToolboxAPIDemo: React.FC<ToolboxAPIDemoProps> = ({ onLog }) => {
  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      type: "success" | "info" | "warning" | "error"
    ) => {
      try {
        await window.toolboxAPI.utils.showNotification({
          title,
          body,
          type,
          duration: 3000,
        });
        onLog(`Notification shown: ${title} - ${body}`, type);
      } catch (error) {
        onLog(
          `Error showing notification: ${(error as Error).message}`,
          "error"
        );
      }
    },
    [onLog]
  );

  const copyToClipboard = useCallback(async () => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        message: "This data was copied from the React Sample Tool",
      };

      await window.toolboxAPI.utils.copyToClipboard(
        JSON.stringify(data, null, 2)
      );
      await showNotification("Copied!", "Data copied to clipboard", "success");
    } catch (error) {
      onLog(`Error copying to clipboard: ${(error as Error).message}`, "error");
    }
  }, [onLog, showNotification]);

  const showCurrentTheme = useCallback(async () => {
    try {
      const theme = await window.toolboxAPI.utils.getCurrentTheme();
      await showNotification(
        "Current Theme",
        `The current theme is: ${theme}`,
        "info"
      );
      onLog(`Current theme: ${theme}`, "info");
    } catch (error) {
      onLog(`Error getting theme: ${(error as Error).message}`, "error");
    }
  }, [onLog, showNotification]);

  const saveDataToFile = useCallback(async () => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        message: "Export from React Sample Tool",
      };

      const filePath = await window.toolboxAPI.utils.saveFile(
        "react-export.json",
        JSON.stringify(data, null, 2)
      );

      if (filePath) {
        await showNotification(
          "File Saved",
          `File saved to: ${filePath}`,
          "success"
        );
        onLog(`File saved to: ${filePath}`, "success");
      } else {
        onLog("File save cancelled", "info");
      }
    } catch (error) {
      onLog(`Error saving file: ${(error as Error).message}`, "error");
    }
  }, [onLog, showNotification]);

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
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <BuildIcon />
          <Typography variant="h6">ToolBox API Examples</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Notifications
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() =>
                showNotification(
                  "Success!",
                  "Operation completed successfully",
                  "success"
                )
              }
            >
              Show Success
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<InfoIcon />}
              onClick={() =>
                showNotification(
                  "Information",
                  "This is an informational message",
                  "info"
                )
              }
            >
              Show Info
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<WarningIcon />}
              onClick={() =>
                showNotification(
                  "Warning",
                  "Please review this warning",
                  "warning"
                )
              }
            >
              Show Warning
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<ErrorIcon />}
              onClick={() =>
                showNotification("Error", "An error has occurred", "error")
              }
            >
              Show Error
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Utilities
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<PaletteIcon />}
              onClick={showCurrentTheme}
            >
              Get Theme
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveDataToFile}
            >
              Save File
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
