import type { SearchParams, SearchResponse } from "../types";

const DEFAULT_PAGE_SIZE = 10;

export const getGithubRepositories = async ({
  q,
  page,
}: SearchParams): Promise<SearchResponse> => {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q,
    )}&page=${page}&per_page=${DEFAULT_PAGE_SIZE}`,
  );

  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return {
    totalCount: data.total_count || 0,
    items: data.items || [],
  };
};
