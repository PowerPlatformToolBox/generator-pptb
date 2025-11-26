import React, { useCallback } from "react";
import {
  Card,
  Spin,
  Alert,
  Descriptions,
  Tag,
  Row,
  Col,
  Space,
  Button,
} from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CopyOutlined,
  BgColorsOutlined,
  SaveOutlined,
} from "@ant-design/icons";

interface ConnectionStatusProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  isLoading: boolean;
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connection,
  isLoading,
  onLog,
}) => {
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
  if (isLoading) {
    return (
      <Card title="🔗 Connection Status" style={{ marginBottom: 24 }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Checking connection..."
        >
          <div style={{ padding: 50 }} />
        </Spin>
      </Card>
    );
  }

  if (!connection) {
    return (
      <Card title="🔗 Connection Status" style={{ marginBottom: 24 }}>
        <Alert
          title="No active connection"
          description="Please connect to a Dataverse environment to use this tool."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
        />
      </Card>
    );
  }

  const getEnvTagColor = (env: string) => {
    const envLower = env.toLowerCase();
    if (envLower === "production") return "red";
    if (envLower === "sandbox") return "gold";
    if (envLower === "dev") return "cyan";
    return "blue";
  };

  return (
    <Card title="🔗 Connection Status & Utilities" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Alert
            message="Connected"
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {connection.name}
            </Descriptions.Item>
            <Descriptions.Item label="URL">{connection.url}</Descriptions.Item>
            <Descriptions.Item label="Environment">
              <Tag color={getEnvTagColor(connection.environment)}>
                {connection.environment.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ID">{connection.id}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🔧 Utilities" size="small" style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button icon={<CopyOutlined />} onClick={copyToClipboard} block>
                Copy to Clipboard
              </Button>
              <Button
                icon={<BgColorsOutlined />}
                onClick={showCurrentTheme}
                block
              >
                Get Theme
              </Button>
              <Button icon={<SaveOutlined />} onClick={saveDataToFile} block>
                Save File
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
