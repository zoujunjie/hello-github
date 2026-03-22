import React from "react";
import { Card, Tag, Space, Typography } from "antd";
import {
  StarOutlined,
  CodeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { GithubRepository } from "../types";
import styles from "./RepositoryItem.module.css";

const { Text } = Typography;

interface RepositoryItemProps {
  repo: GithubRepository;
}

export const RepositoryItem: React.FC<RepositoryItemProps> = ({ repo }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <Card
      hoverable
      className={styles["repository-card"]}
      classNames={{ body: styles["repository-card-body"] }}
    >
      <div className={styles["repo-header"]}>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["repo-link"]}
          title={repo.full_name}
        >
          {repo.full_name}
        </a>
        <Space className={styles["repo-stars"]}>
          <StarOutlined />
          {repo.stargazers_count > 1000
            ? `${(repo.stargazers_count / 1000).toFixed(1)}k`
            : repo.stargazers_count}
        </Space>
      </div>

      <div className={styles["repo-description"]}>{repo.description || "No description provided"}</div>

      <div className={styles["repo-footer"]}>
        <div>
          {repo.language ? (
            <Tag icon={<CodeOutlined />} color="blue" variant="filled">
              {repo.language}
            </Tag>
          ) : (
            <Text type="secondary" className={styles["repo-lang-unknown"]}>
              Unknown
            </Text>
          )}
        </div>
        <Space className={styles["repo-updated-at"]}>
          <ClockCircleOutlined />
          {formatDate(repo.updated_at)}
        </Space>
      </div>
    </Card>
  );
};
