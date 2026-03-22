export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

export interface SearchParams {
  q: string;
  page: number;
}

export interface SearchResponse {
  totalCount: number;
  items: GithubRepository[];
}
