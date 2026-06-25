// HEALTH / DOCS
export const HEALTH = '/health';
export const API_DOCS = '/api-docs';

// AUTH
export const LOGIN = `/auth/login`;
export const SIGNUP = `/auth/register`;
export const REFRESH_TOKEN = `/auth/refresh`;
export const VERIFY_EMAIL = (token: string) => `/auth/verify-email/${token}`;
export const FORGOT_PASSWORD = `/auth/forgot-password`;
export const RESET_PASSWORD = `/auth/reset-password`;
export const GET_ME = `/auth/me`;
export const LOGOUT = `/auth/logout`;
export const CHANGE_PASSWORD = `/auth/change-password`;
export const SEND_OTP = `/auth/send-otp`;
export const VERIFY_OTP = `/auth/verify-otp`;

// ADMIN
export const ADMIN_DASHBOARD_STATS = `/admin/dashboard-stats`;
export const ADMIN_STORES = `/admin/stores`;
export const ADMIN_USERS = `/admin/users`;
export const ADMIN_USER_DETAILS = (id: string) => `/admin/users/${id}`;
export const ADMIN_UNASSIGNED_OWNERS = `/admin/unassigned-owners`;
export const ADMIN_RATINGS = `/admin/ratings`;

// USER RATINGS
export const USER_STORES = `/user/stores`;
export const SUBMIT_RATING = `/user/submit`;
export const USER_RATINGS_HISTORY = `/user/history-log`;

// OWNER
export const OWNER_DASHBOARD = `/owner/dashboard`;