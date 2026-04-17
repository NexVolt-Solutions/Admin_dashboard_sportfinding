export interface UsersByMonth {
  month: string;
  count: number;
}

export interface MatchesPerDay {
  day: string;
  count: number;
}

export interface PopularSport {
  sport: string;
  count: number;
  percentage: number;
}

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

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  location: string;
  matches: number;
  status: string;
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
