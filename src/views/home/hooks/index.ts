import { useEffect, useReducer } from "react";
import type { SearchResponse, GithubRepository } from "../types";
import { getGithubRepositories } from "../api";

const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_TEXT = "";
const ACTIONS = {
  NEW_SEARCH: "NEW_SEARCH",
  CHANGE_PAGE: "CHANGE_PAGE",
  LOAD_START: "LOAD_START",
  LOAD_SUCCESS: "LOAD_SUCCESS",
  LOAD_FAILED: "LOAD_FAILED",
} as const;

interface RepositorySearchState {
  text: string;
  page: number;
  items: GithubRepository[];
  loading: boolean;
  totalCount: number;
  error: string;
}

type RepositorySearchAction =
  | { type: typeof ACTIONS.NEW_SEARCH; payload: string }
  | { type: typeof ACTIONS.CHANGE_PAGE; payload: number }
  | { type: typeof ACTIONS.LOAD_START }
  | {
      type: typeof ACTIONS.LOAD_SUCCESS;
      payload: SearchResponse;
    }
  | { type: typeof ACTIONS.LOAD_FAILED; payload: string };

const repositorySearchReducer = (
  state: RepositorySearchState,
  action: RepositorySearchAction,
): RepositorySearchState => {
  switch (action.type) {
    case ACTIONS.NEW_SEARCH:
      if (state.text === action.payload) return state;
      return {
        ...state,
        text: action.payload,
        page: 1,
        items: [],
        totalCount: 0,
        error: "",
      };

    case ACTIONS.CHANGE_PAGE:
      return { ...state, page: action.payload };

    case ACTIONS.LOAD_START:
      return { ...state, loading: true, error: "" };

    case ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        totalCount: action.payload.totalCount,
      };

    case ACTIONS.LOAD_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const useGithubRepositoryList = () => {
  const [state, dispatch] = useReducer(repositorySearchReducer, {
    text: DEFAULT_TEXT,
    page: DEFAULT_PAGE_INDEX,
    items: [],
    totalCount: 0,
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (!state.text || state.page < DEFAULT_PAGE_INDEX) return;

    const loadData = async () => {
      dispatch({ type: ACTIONS.LOAD_START });
      try {
        const result = await getGithubRepositories({
          q: state.text,
          page: state.page,
        });
        dispatch({
          type: ACTIONS.LOAD_SUCCESS,
          payload: { items: result.items, totalCount: result.totalCount },
        });
      } catch (error: unknown) {
        dispatch({
          type: ACTIONS.LOAD_FAILED,
          payload: error instanceof Error ? error.message : String(error),
        });
      }
    };

    loadData();
  }, [state.text, state.page]);

  return {
    ...state,
    search: (text: string) =>
      dispatch({ type: ACTIONS.NEW_SEARCH, payload: text }),
    setPage: (pageNumber: number) =>
      dispatch({ type: ACTIONS.CHANGE_PAGE, payload: pageNumber }),
  };
};
