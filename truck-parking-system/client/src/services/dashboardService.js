import API from "../api";

// Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

// Active Parked Trucks
export const getActiveTrucks = async () => {
  const response = await API.get("/dashboard/active-trucks");
  return response.data;
};