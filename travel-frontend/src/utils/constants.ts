// ==================== src/utils/constants.ts ====================
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');

export const ROUTES = {
  HOME: '/',
  PACKAGES: '/packages',
  PACKAGE_DETAILS: '/packages/:id',
  BOOKINGS: '/bookings',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_PACKAGE: '/admin/packages/create',
};

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
} as const;

export const USER_ROLES = {
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
} as const;