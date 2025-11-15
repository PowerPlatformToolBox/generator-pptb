import React, { useCallback, useEffect } from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Toolbar,
  ToolbarButton,
  Title3,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  Info24Regular,
  Warning24Regular,
  DismissCircle24Regular,
} from "@fluentui/react-icons";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { DataverseAPIDemo } from "./components/DataverseAPIDemo";
import { EventLog } from "./components/EventLog";
import { ToolboxAPIDemo } from "./components/ToolboxAPIDemo";
import {
  useConnection,
  useEventLog,
  useToolboxEvents,
} from "./hooks/useToolboxAPI";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
  header: {
    padding: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  headerTitle: {
    display: "flex",
    alignItems: "baseline",
    gap: tokens.spacingHorizontalM,
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
  toolbar: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalS,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: tokens.spacingVerticalL,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
  },
  topRowContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingVerticalL,
    alignItems: "stretch",
  },
  connectionStatus: {
    minHeight: "0",
    height: "100%",
  },
  toolboxApi: {
    minHeight: "0",
    height: "100%",
  },
});

function App() {
  const { connection, isLoading, refreshConnection } = useConnection();
  const { logs, addLog, clearLogs } = useEventLog();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const styles = useStyles();

  // Handle platform events
  const handleEvent = useCallback(
    (event: string, _data: any) => {
      addLog(`Event received: ${event}`, "info");
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

  // Get theme from Toolbox API
  useEffect(() => {
    const getTheme = async () => {
      try {
        const currentTheme = await window.toolboxAPI.utils.getCurrentTheme();
        setTheme(currentTheme === "dark" ? "dark" : "light");
      } catch (error) {
        console.error("Error getting theme:", error);
      }
    };
    getTheme();
  }, []);

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
    <FluentProvider
      theme={theme === "dark" ? webDarkTheme : webLightTheme}
      className={styles.root}
    >
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Title3>⚛️ React Sample Tool</Title3>
          <Text className={styles.subtitle}>
            A complete example of building Power Platform Tool Box tools with
            React & TypeScript
          </Text>
        </div>
      </div>

      <Toolbar className={styles.toolbar}>
        <ToolbarButton
          icon={<CheckmarkCircle24Regular />}
          onClick={() =>
            showNotification(
              "Success!",
              "Operation completed successfully",
              "success"
            )
          }
        >
          Success
        </ToolbarButton>
        <ToolbarButton
          icon={<Info24Regular />}
          onClick={() =>
            showNotification(
              "Information",
              "This is an informational message",
              "info"
            )
          }
        >
          Info
        </ToolbarButton>
        <ToolbarButton
          icon={<Warning24Regular />}
          onClick={() =>
            showNotification("Warning", "Please review this warning", "warning")
          }
        >
          Warning
        </ToolbarButton>
        <ToolbarButton
          icon={<DismissCircle24Regular />}
          onClick={() =>
            showNotification("Error", "An error has occurred", "error")
          }
        >
          Error
        </ToolbarButton>
      </Toolbar>

      <div className={styles.content}>
        <div className={styles.topRowContainer}>
          <div className={styles.connectionStatus}>
            <ConnectionStatus connection={connection} isLoading={isLoading} />
          </div>

          <div className={styles.toolboxApi}>
            <ToolboxAPIDemo onLog={addLog} />
          </div>
        </div>

        <div>
          <DataverseAPIDemo connection={connection} onLog={addLog} />
        </div>

        <div>
          <EventLog logs={logs} onClear={clearLogs} />
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
