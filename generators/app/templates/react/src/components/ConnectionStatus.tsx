import React from "react";
import {
  Card,
  CardHeader,
  Spinner,
  Text,
  Badge,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";

interface ConnectionStatusProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  isLoading: boolean;
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
    gap: tokens.spacingVerticalS,
  },
  connectionItem: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "baseline",
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "120px",
  },
  warningBox: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
});

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connection,
  isLoading,
}) => {
  const styles = useStyles();

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text weight="semibold" size={400}>
              🔗 Connection Status
            </Text>
          }
        />
        <div className={styles.content}>
          <Spinner label="Checking connection..." />
        </div>
      </Card>
    );
  }

  if (!connection) {
    return (
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text weight="semibold" size={400}>
              🔗 Connection Status
            </Text>
          }
        />
        <div className={styles.content}>
          <div className={styles.warningBox}>
            <Warning24Regular />
            <div>
              <Text weight="semibold">No active connection</Text>
              <br />
              <Text>
                Please connect to a Dataverse environment to use this tool.
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getEnvironmentColor = (
    env: string
  ): "success" | "danger" | "warning" | "important" => {
    switch (env.toLowerCase()) {
      case "production":
        return "danger";
      case "sandbox":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            🔗 Connection Status
          </Text>
        }
        action={
          <CheckmarkCircle24Regular
            color={tokens.colorPaletteGreenForeground2}
          />
        }
      />
      <div className={styles.content}>
        <div className={styles.connectionItem}>
          <Text className={styles.label}>Name:</Text>
          <Text>{connection.name}</Text>
        </div>
        <div className={styles.connectionItem}>
          <Text className={styles.label}>URL:</Text>
          <Text>{connection.url}</Text>
        </div>
        <div className={styles.connectionItem}>
          <Text className={styles.label}>Environment:</Text>
          <Badge
            appearance="filled"
            color={getEnvironmentColor(connection.environment)}
          >
            {connection.environment}
          </Badge>
        </div>
        <div className={styles.connectionItem}>
          <Text className={styles.label}>ID:</Text>
          <Text>{connection.id}</Text>
        </div>
      </div>
    </Card>
  );
};
