import React from "react";
import { Card, Button, List, Tag, Empty } from "antd";
import { ClearOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { LogEntry } from "../hooks/useToolboxAPI";

interface EventLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

const getTagColor = (type: string) => {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "processing";
    default:
      return "default";
  }
};

export const EventLog: React.FC<EventLogProps> = ({ logs, onClear }) => {
  return (
    <Card
      title="📋 Event Log"
      extra={
        <Button
          icon={<ClearOutlined />}
          onClick={onClear}
          disabled={logs.length === 0}
        >
          Clear Log
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      {logs.length === 0 ? (
        <Empty description="No logs yet..." />
      ) : (
        <List
          dataSource={logs}
          renderItem={(log, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<ClockCircleOutlined style={{ fontSize: 16 }} />}
                title={
                  <span>
                    <Tag
                      color={getTagColor(log.type)}
                      style={{ marginRight: 8 }}
                    >
                      {log.type.toUpperCase()}
                    </Tag>
                    <span style={{ color: "#666", fontSize: 12 }}>
                      [{log.timestamp.toLocaleTimeString()}]
                    </span>
                  </span>
                }
                description={log.message}
              />
            </List.Item>
          )}
          style={{
            maxHeight: 400,
            overflowY: "auto",
            backgroundColor: "#fafafa",
            padding: 16,
            borderRadius: 8,
          }}
        />
      )}
    </Card>
  );
};
