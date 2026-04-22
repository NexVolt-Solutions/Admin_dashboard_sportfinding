export interface UsersByMonth {
  month: string;
  count: number;
}

export interface MatchesPerDay {
  day: string;
  count: number;
}

export interface PopularSport {
  sport: SportType;
  count: number;
  percentage: number;
}

export type SportType =
  | "Football"
  | "Basketball"
  | "Cricket"
  | "Tennis"
  | "Volleyball"
  | "Badminton";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type MatchStatus = "Open" | "Full" | "Ongoing" | "Completed" | "Cancelled";

export type UserStatus = "Pending_Verification" | "Active" | "Blocked";

export type SupportRequestStatus = "Open" | "Resolved";

export interface DashboardStats {
  generated_at: string;
  total_users: number;
  total_matches: number;
  active_matches: number;
  new_users_today: number;
  total_users_by_month: UsersByMonth[];
  matches_per_day: MatchesPerDay[];
  most_popular_sports: PopularSport[];
}

export interface AdminAccountResponse {
  full_name: string;
  email: string;
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  location: string | null;
  matches: number;
  status: UserStatus;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface AdminMatch {
  id: string;
  title: string;
  host_name: string;
  host_email: string;
  location: string;
  scheduled_at: string;
}

export interface AdminMatchListResponse {
  items: AdminMatch[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ReviewModerationUserItemResponse {
  id: string;
  full_name: string;
  avatar_url: string | null;
  reviews_count: number;
}

export interface ReviewModerationReviewItemResponse {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewModerationUserReviewsResponse {
  user: ReviewModerationUserItemResponse;
  items: ReviewModerationReviewItemResponse[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SupportRequestListItemResponse {
  id: string;
  user_id: string;
  subject: string;
  submitted_at: string;
  status: SupportRequestStatus;
}

export interface SupportRequestDetailResponse {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  submitted_at: string;
  status: SupportRequestStatus;
}
