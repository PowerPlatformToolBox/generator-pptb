import { useCallback, useEffect } from "react";
import { Layout, Typography, Space, Button } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { DataverseAPIDemo } from "./components/DataverseAPIDemo";
import { EventLog } from "./components/EventLog";
import {
  useConnection,
  useEventLog,
  useToolboxEvents,
} from "./hooks/useToolboxAPI";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const { connection, isLoading, refreshConnection } = useConnection();
  const { logs, addLog, clearLogs } = useEventLog();

  // Handle platform events
  const handleEvent = useCallback(
    (event: string, _data: any) => {
      switch (event) {
        case "connection:updated":
        case "connection:created":
          refreshConnection();
          break;

        case "connection:deleted":
          refreshConnection();
          break;

        case "terminal:output":
        case "terminal:command:completed":
        case "terminal:error":
          // Terminal events handled by dedicated components
          break;
      }
    },
    [refreshConnection]
  );

  useToolboxEvents(handleEvent);

  // Add initial log (run only once on mount)
  useEffect(() => {
    addLog("React Sample Tool initialized", "success");
  }, [addLog]);

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
        addLog(`Notification shown: ${title} - ${body}`, type);
      } catch (error) {
        addLog(
          `Error showing notification: ${(error as Error).message}`,
          "error"
        );
      }
    },
    [addLog]
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textAlign: "center",
          padding: "16px 12px",
          height: "auto",
          lineHeight: "normal",
        }}
      >
        <Title level={2} style={{ color: "white", margin: "0 0 8px 0" }}>
          ⚛️ React Sample Tool
        </Title>
        <Paragraph
          style={{ color: "white", fontSize: "14px", margin: "0 0 12px 0" }}
        >
          A complete example of building Power Platform Tool Box tools with
          React & TypeScript based on Ant Design components.
        </Paragraph>
        <Space
          wrap
          size="small"
          style={{
            marginTop: "0",
            justifyContent: "center",
            width: "100%",
            display: "flex",
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={() =>
              showNotification(
                "Success!",
                "Operation completed successfully",
                "success"
              )
            }
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Show Success
          </Button>
          <Button
            size="large"
            icon={<InfoCircleOutlined />}
            onClick={() =>
              showNotification(
                "Information",
                "This is an informational message",
                "info"
              )
            }
            style={{
              backgroundColor: "white",
              color: "#1890ff",
              borderColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Show Info
          </Button>
          <Button
            size="large"
            icon={<WarningOutlined />}
            onClick={() =>
              showNotification(
                "Warning",
                "Please review this warning",
                "warning"
              )
            }
            style={{
              backgroundColor: "#faad14",
              borderColor: "#faad14",
              color: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Show Warning
          </Button>
          <Button
            danger
            type="primary"
            size="large"
            icon={<CloseCircleOutlined />}
            onClick={() =>
              showNotification("Error", "An error has occurred", "error")
            }
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Show Error
          </Button>
        </Space>
      </Header>
      <Content
        style={{
          padding: "16px 8px",
          maxWidth: "calc(100% - 15px)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <ConnectionStatus
          connection={connection}
          isLoading={isLoading}
          onLog={addLog}
        />

        <DataverseAPIDemo connection={connection} onLog={addLog} />

        <EventLog logs={logs} onClear={clearLogs} />
      </Content>
    </Layout>
  );
}

export default App;
