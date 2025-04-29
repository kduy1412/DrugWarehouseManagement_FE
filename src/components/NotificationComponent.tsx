import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetAllNotificationQuery } from "../hooks/api/notification/getAllNotificationQuery";
import { useMarkAllNotificationAsReadMutation } from "../hooks/api/notification/markAllNotificationAsReadMutation";
import * as signalR from "@microsoft/signalr";
import {
  NotificationGetRequest,
  NotificationModel,
} from "../types/notification";
import { notification, Badge, Dropdown, Button, List, Typography } from "antd";
import { BellFilled, CheckCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import LoadingComponents from "./LoadingComponents";
import { formatDateTime } from "../utils/timeHelper";
import { useAuth } from "../hooks/useAuth";

const NotificationComponent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [queryParam, setQueryParam] = useState<NotificationGetRequest>({
    Page: 1,
    PageSize: 100,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useGetAllNotificationQuery(queryParam);
  const { mutate: markAllAsRead } = useMarkAllNotificationAsReadMutation();
  const { accessToken } = useAuth();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    refetch();
  };

  const handleViewAll = () => {
    setQueryParam((prev) => ({
      ...prev,
      PageSize: prev.PageSize + 100,
    }));
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const connections = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/notificationHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => accessToken ?? "",
      })
      .withAutomaticReconnect()
      .build();

    connections
      .start()
      .catch((e) => console.log("Error connecting to SignalR", e));

    connections.on("ReceiveMessage", (notificationData: NotificationModel) => {
      notification.info({
        message: `${notificationData.title}`,
        description: `${notificationData.content}`,
        duration: 3,
        showProgress: true,
      });
      refetch();
    });

    return () => {
      connections.stop();
    };
  }, []);

  useEffect(() => {
    if (lastItemRef.current && scrollContainerRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const unreadCount = useMemo(() => {
    return data?.items.filter((item) => !item.isRead).length ?? 0;
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingComponents />;
    }
    if (!data?.items?.length) {
      return <EmptyContainer>No notifications</EmptyContainer>;
    }
    return (
      <List
        dataSource={data.items}
        renderItem={(item, index) => (
          <ListItem
            key={item.notificationId}
            className={item.isRead ? "" : "unread"}
            ref={index === data.items.length - 1 ? lastItemRef : null}
          >
            <ItemContent>
              <div className="title">
                <strong>{item.title}</strong>
              </div>
              <div className="content">{item.content}</div>
              <div className="timestamp">
                {formatDateTime(new Date(item.createdAt))}
              </div>
            </ItemContent>
          </ListItem>
        )}
      />
    );
  };

  const dropdownItems = (
    <Container>
      <Header>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Thông báo
        </Typography.Title>
        {unreadCount > 0 && (
          <Button
            type="text"
            size="small"
            onClick={handleMarkAllAsRead}
            style={{ display: "flex", alignItems: "center", color: "#2563eb" }}
          >
            <CheckCircleFilled
              style={{ fontSize: "16px", marginRight: "4px" }}
            />
            Đã đọc
          </Button>
        )}
      </Header>

      <ScrollContainer ref={scrollContainerRef}>
        {renderContent()}
      </ScrollContainer>

      {data?.items && data?.items.length > 0 && data.totalPages > 1 && (
        <Footer>
          <Button type="link" size="small" onClick={handleViewAll}>
            Xem tất cả
          </Button>
        </Footer>
      )}
    </Container>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownItems}
      trigger={["click"]}
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="default">
        <CloseButton
          icon={
            <BellFilled
              size={32}
              className={unreadCount > 0 ? "text-blue-600" : "text-gray-600"}
            />
          }
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationComponent;

const Container = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 320px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const ScrollContainer = styled.div`
  max-height: 384px;
  overflow-y: auto;
`;

const EmptyContainer = styled.div`
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

const ListItem = styled(List.Item)`
  padding: 16px !important;
  border-bottom: 1px solid #f0f0f0 !important;

  &:hover {
    background: #f9fafb;
  }

  &.unread {
    background: #eff6ff;
  }
`;

const ItemContent = styled.div`
  width: 100%;

  .title {
    stairfont-weight: 500;
  }

  .content {
    font-size: 14px;
    color: #6b7280;
  }

  .timestamp {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
  }
`;

const Footer = styled.div`
  padding: 12px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
`;

const CloseButton = styled(Button)`
  border-radius: 50%;
  &:not(:disabled):hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;
