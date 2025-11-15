import React, { useCallback } from "react";
import {
  Card,
  CardHeader,
  Button,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Clipboard24Regular,
  WeatherMoon24Regular,
  Save24Regular,
} from "@fluentui/react-icons";

interface ToolboxAPIDemoProps {
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    width: "100%",
    height: "100%",
  },
  content: {
    padding: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },
});

export const ToolboxAPIDemo: React.FC<ToolboxAPIDemoProps> = ({ onLog }) => {
  const styles = useStyles();

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
    <Card className={styles.card}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            🛠️ ToolBox API Examples
          </Text>
        }
      />
      <div className={styles.content}>
        <div className={styles.section}>
          <Text weight="semibold">Utilities</Text>
          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              icon={<Clipboard24Regular />}
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </Button>
            <Button
              appearance="secondary"
              icon={<WeatherMoon24Regular />}
              onClick={showCurrentTheme}
            >
              Get Theme
            </Button>
            <Button
              appearance="secondary"
              icon={<Save24Regular />}
              onClick={saveDataToFile}
            >
              Save File
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
