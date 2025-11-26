import React, { useCallback } from "react";
import { Card, Button, Space, Typography } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  BgColorsOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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
    <Card title="🛠️ ToolBox API Examples" style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={5}>Notifications</Title>
          <Space wrap>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
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
              icon={<InfoCircleOutlined />}
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
              icon={<WarningOutlined />}
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
              danger
              icon={<CloseCircleOutlined />}
              onClick={() =>
                showNotification("Error", "An error has occurred", "error")
              }
            >
              Show Error
            </Button>
          </Space>
        </div>

        <div>
          <Title level={5}>Utilities</Title>
          <Space wrap>
            <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
              Copy to Clipboard
            </Button>
            <Button icon={<BgColorsOutlined />} onClick={showCurrentTheme}>
              Get Theme
            </Button>
            <Button icon={<SaveOutlined />} onClick={saveDataToFile}>
              Save File
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};
