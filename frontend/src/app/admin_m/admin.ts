// Admin Panel Type Definitions

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  profilePhoto?: string;
  role: 'admin' | 'super_admin' | 'moderator';
  permissions: AdminPermission[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  twoFactorEnabled?: boolean;
}

export type AdminPermission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage_users'
  | 'manage_complaints'
  | 'view_analytics'
  | 'generate_reports'
  | 'system_settings';

export interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    admin: AdminProfile;
    expiresIn: number;
  };
  message: string;
}

export interface AdminUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface AdminPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  userId: string;
  userEmail: string;
  userName?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  attachments: ComplaintAttachment[];
  comments: ComplaintComment[];
  history: ComplaintHistoryEntry[];
  tags?: string[];
}

export type ComplaintCategory = 
  | 'technical'
  | 'academic'
  | 'administrative'
  | 'facilities'
  | 'financial'
  | 'general'
  | 'other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus = 
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'rejected';

export interface ComplaintAttachment {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ComplaintComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorRole: 'user' | 'admin';
  isInternal: boolean;
  createdAt: string;
  updatedAt?: string;
  attachments?: ComplaintAttachment[];
}

export interface ComplaintHistoryEntry {
  id: string;
  action: ComplaintAction;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export type ComplaintAction = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'comment_added'
  | 'attachment_added'
  | 'resolved'
  | 'closed'
  | 'reopened';

export interface ComplaintFilters {
  status?: ComplaintStatus[];
  category?: ComplaintCategory[];
  priority?: ComplaintPriority[];
  assignedTo?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  search?: string;
}

export interface ComplaintListResponse {
  success: boolean;
  data: {
    complaints: Complaint[];
    pagination: PaginationInfo;
  };
  message: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  averageResolutionTime: number; // in hours
  complaintsThisMonth: number;
  complaintsThisWeek: number;
  categoryStats: CategoryStat[];
  priorityStats: PriorityStat[];
  recentActivity: ActivityEntry[];
  performanceMetrics: PerformanceMetric[];
}

export interface CategoryStat {
  category: ComplaintCategory;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PriorityStat {
  priority: ComplaintPriority;
  count: number;
  percentage: number;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type ActivityType = 
  | 'complaint_created'
  | 'complaint_updated'
  | 'complaint_resolved'
  | 'admin_login'
  | 'admin_logout'
  | 'system_update'
  | 'report_generated';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

export interface ReportRequest {
  type: ReportType;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: ComplaintFilters;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  includeDetails?: boolean;
}

export type ReportType = 
  | 'complaints'
  | 'performance'
  | 'category_analysis'
  | 'user_activity'
  | 'resolution_trends';

export interface ReportResponse {
  success: boolean;
  data: {
    reportId: string;
    downloadUrl: string;
    generatedAt: string;
    expiresAt: string;
  };
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string>;
  code?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  code: string;
  timestamp: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface AdminApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface AdminSecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  sessionTimeout: number;
  ipWhitelist?: string[];
  loginAttempts: number;
  accountLocked: boolean;
  lockoutExpiry?: string;
}

// Utility types for component props
export interface AdminPageComponentProps {
  admin: AdminProfile;
  onUpdateProfile?: (updatedProfile: Partial<AdminProfile>) => Promise<AdminProfile>;
  onUploadPhoto?: (file: File) => Promise<string>;
  onSignOut?: () => void;
  className?: string;
  apiConfig?: AdminApiConfig;
}

export interface ComplaintTableProps {
  complaints: Complaint[];
  loading?: boolean;
  onStatusChange?: (complaintId: string, status: ComplaintStatus) => void;
  onAssign?: (complaintId: string, adminId: string) => void;
  onView?: (complaint: Complaint) => void;
  onFilter?: (filters: ComplaintFilters) => void;
}

export interface DashboardProps {
  stats: DashboardStats;
  loading?: boolean;
  onRefresh?: () => void;
}

// Validation schemas (to be used with libraries like Yup or Zod)
export interface AdminProfileValidation {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface PasswordValidation {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Event handlers
export type AdminEventHandler<T = void> = (data: T) => void | Promise<void>;
export type AdminFormHandler<T> = (formData: T) => void | Promise<void>;

// Status and state types for UI components
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type TabType = 'personal' | 'security' | 'complaints' | 'analytics';

export interface UiState {
  loading: LoadingState;
  error: string | null;
  success: string | null;
  activeTab: TabType;
}

// Type aliases for convenience
export type AdminProfileType = AdminProfile;
export type AdminLoginRequestType = AdminLoginRequest;
export type AdminLoginResponseType = AdminLoginResponse;
export type AdminUpdateRequestType = AdminUpdateRequest;
export type AdminPasswordChangeRequestType = AdminPasswordChangeRequest;
export type ComplaintType = Complaint;
export type DashboardStatsType = DashboardStats;
export type ApiResponseType<T = unknown> = ApiResponse<T>;
export type AdminApiConfigType = AdminApiConfig;