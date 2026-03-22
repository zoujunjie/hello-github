import { Alert, Card, Input, Pagination, Typography, message } from "antd";

import { useState } from "react";
import { useGithubRepositoryList } from "./hooks";
import styles from "./index.module.css";
import { RepositoryItem } from "./components/RepositoryItem";

const Home: React.FC = () => {
  const { text, page, items, totalCount, loading, error, search, setPage } =
    useGithubRepositoryList();
  const [inputValue, setInputValue] = useState("");

  const MAX_RESULTS = 1000;
  const PAGE_SIZE = 10;
  const effectiveTotal = Math.min(totalCount, MAX_RESULTS);

  const onSearchClick = (value: string) => {
    
    const searchText = value.trim();

    if (!searchText) {
      message.warning("Search text cannot be empty.");
      return;
    }
    if (searchText.length > 256) {
      message.warning("Search query cannot exceed 256 characters.");
      return;
    }

    search(searchText);
  };

  return (
    <>
      <div className={styles["search-container"]}>
        <Input.Search
          placeholder="Search GitHub repositories..."
          enterButton="Search"
          size="large"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          loading={loading}
          onSearch={onSearchClick}
        />
      </div>
      {error && (
        <Alert title="Error" description={error} type="error" showIcon />
      )}
      {text && !loading && !error && (
        <div className={styles["results-text-container"]}>
          <Typography.Text type="secondary">
            {totalCount.toLocaleString()} repository results for{" "}
            <Typography.Text strong>"{text}"</Typography.Text>
            {totalCount > MAX_RESULTS &&
              ` (showing the first ${MAX_RESULTS} results due to API limits)`}
          </Typography.Text>
        </div>
      )}
      <div className={styles["repository-grid"]}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                loading={true}
                variant="borderless"
                className={styles["repository-skeleton-card"]}
              />
            ))
          : items.map((repo) => <RepositoryItem key={repo.id} repo={repo} />)}
      </div>
      {totalCount > PAGE_SIZE && !loading && (
        <div className={styles["pagination-container"]}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={effectiveTotal}
            onChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showSizeChanger={false}
          />
        </div>
      )}
    </>
  );
};

export default Home;
