import apiClient from "./apiClient";

export interface Activity {
  type: "LEND" | "RETURN" | "READER" | "BOOK";
  message: string;
  timestamp: string; 
}

// Fetch recent activity (top 10)
export const getRecentActivity = async (): Promise<Activity[]> => {
  const { data } = await apiClient.get<Activity[]>("/activity");
  return data;
};
