import { api } from "./client";
import type { APIResponse, Activity, AuthResponse, Booking, User } from "../types";
export const AuthApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => api.post<APIResponse<AuthResponse>>("/auth/register", data).then(r => r.data.data),
  login: (data: { email: string; password: string }) => api.post<APIResponse<AuthResponse>>("/auth/login", data).then(r => r.data.data),
  me: () => api.get<APIResponse<User>>("/auth/me").then(r => r.data.data),
  logout: () => api.post<void>("/auth/logout"),
};
export const ActivityApi = {
  list: (city?: string, category?: string) => api.get<APIResponse<Activity[]>>("/activities", { params: { ...(city ? { city } : {}), ...(category ? { category } : {}) } }).then(r => r.data.data),
  get: (id: number) => api.get<APIResponse<Activity>>(`/activities/${id}`).then(r => r.data.data),
};
export const BookingApi = {
  create: (data: { activityId: number; participants: number }) => api.post<APIResponse<Booking>>("/bookings", data).then(r => r.data.data),
  mine: () => api.get<APIResponse<Booking[]>>("/bookings/me").then(r => r.data.data),
  cancel: (id: number) => api.patch<APIResponse<Booking>>(`/bookings/${id}/cancel`).then(r => r.data.data),
};
