export type UserRole = "TOURIST" | "ADMIN";
export type BookingStatus = "CONFIRMED" | "CANCELLED";
export interface APIResponse<T> { data: T; success: boolean; }
export interface User { id: number; email: string; firstName: string; lastName: string; role: UserRole; }
export interface Activity { id: number; title: string; description: string; city: string; category: string; meetingPoint: string; startDate: string; durationMinutes: number; pricePerPerson: string; capacity: number; imageUrl: string; }
export interface Booking { id: number; activityId: number; participants: number; totalPrice: string; status: BookingStatus; createdAt: string; activity?: Activity; }
export interface AuthResponse { user: User; token: string; }
