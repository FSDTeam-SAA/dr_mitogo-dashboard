import { getSession } from "next-auth/react"

export interface User {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  postsCount: number;
  commentsCount: number;
  verified: boolean;
  joinDate: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  verified: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  targetGroup: string;
  sentAt: string;
  deliveredCount: number;
}

export interface GhostPost {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface FOMOWindow {
  id: string;
  name: string;
  status: "active" | "scheduled" | "ended" | "disabled";
  startDate: string;
  endDate: string;
  postsCreated: number;
  usersParticipated: number;
}

export interface ContentFlag {
  id: string;
  postId: string;
  content: string;
  reason: string;
  flaggedAt: string;
  status: "pending" | "reviewed" | "hidden";
  author: string;
}

export interface AICampaign {
  id: string;
  name: string;
  type: "engagement" | "posts" | "comments";
  status: "active" | "paused" | "completed";
  interactions: number;
  reach: number;
  startedAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  displayName: string;
  email: string;
  type: string;
  submittedAt: string;
  status: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
}

export interface DashboardSummary {
  totals: {
    users: number;
    onlineNow: number;
    verifiedAccounts: number;
    ghostPosts24h: number;
    flaggedContent: number;
  };
  topActiveUsers: Array<{
    id: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    posts: number;
    comments: number;
    interactions: number;
  }>;
  aiEngagementToday: {
    comments: number;
    likes: number;
    replies: number;
  };
  fomoStatus:
    | {
        isActive: true;
        windowId: string;
        title: string;
        startTime: string;
        endTime: string;
        remainingMs: number;
        stats: { postCount: number; participantCount: number };
      }
    | { isActive: false };
  flaggedExplicitContent: {
    total: number;
    hiddenUnder18: number;
    escalated: number;
  };
}

export interface GhostSummary {
  totalGhostPosts: number;
  activeThisHour: number;
  avgEngagement: number;
}

export interface VerificationStats {
  pending: number;
  approved30d: number;
  rejected30d: number;
}

export interface AdSummary {
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  totalSpend: number;
}

export interface SecuritySummary {
  sslStatus: string;
  sslValidUntil: string | null;
  rateLimitStatus: string;
  twoFaAdoptionPercent: number;
  failedLogins24h: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getAuthToken = async () => {
  if (typeof window === "undefined") return "";
  const localToken =
    window.localStorage.getItem("adminToken") ||
    window.localStorage.getItem("token") ||
    "";
  if (localToken) return localToken;

  const session = await getSession();
  if (session?.accessToken) {
    window.localStorage.setItem("adminToken", session.accessToken);
    return session.accessToken;
  }
  return "";
};

const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload as T;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiRequest<{ data: DashboardSummary }>(
    "/dashboard/summary"
  );
  return response.data;
}

export async function getUsers(
  page = 1,
  limit = 10,
  search?: string,
  status?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("search", search);
  if (status && status !== "all") {
    const mappedStatus = status === "reviewed" ? "approved" : status === "hidden" ? "removed" : status;
    params.set("status", mappedStatus);
  }

  const response = await apiRequest<{
    data: User[];
    pagination: { total: number; page: number; limit: number };
  }>(`/user/admin/users?${params.toString()}`);

  return {
    users: response.data,
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function getGroups(page = 1, limit = 10, search?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("search", search);

  const response = await apiRequest<{
    data: Array<{
      id: string;
      name: string;
      description: string;
      members: number;
      posts: number;
      isVerified: boolean;
      createdAt: string;
    }>;
    pagination: { total: number; page: number; limit: number };
  }>(`/group/admin/groups?${params.toString()}`);

  return {
    groups: response.data.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members,
      posts: group.posts,
      verified: group.isVerified,
      createdAt: new Date(group.createdAt).toISOString().split("T")[0],
    })),
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function getGroupDetails(id: string) {
  const response = await apiRequest<{
    data: {
      id: string;
      name: string;
      description: string;
      visibility: string;
      isVerified: boolean;
      members: number;
      posts: number;
      createdAt: string;
      updatedAt: string;
      avatarUrl?: string;
    };
  }>(`/group/admin/groups/${id}`);

  const group = response.data;
  return {
    ...group,
    createdAt: new Date(group.createdAt).toISOString().split("T")[0],
    updatedAt: new Date(group.updatedAt).toISOString().split("T")[0],
  };
}

export async function updateGroup(
  id: string,
  payload: { name?: string; description?: string; visibility?: string; isVerified?: boolean }
) {
  return apiRequest(`/group/admin/groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteGroup(id: string) {
  return apiRequest(`/group/admin/groups/${id}`, { method: "DELETE" });
}

export async function getNotifications(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiRequest<{
    data: Array<{
      id: string;
      title: string;
      content: string;
      targetGroup: string;
      deliveredCount: number;
      createdAt: string;
    }>;
  }>(`/admin-notifications/admin?${params.toString()}`);

  return response.data.map((notif) => ({
    id: notif.id,
    title: notif.title,
    content: notif.content,
    targetGroup: notif.targetGroup,
    deliveredCount: notif.deliveredCount,
    sentAt: new Date(notif.createdAt).toISOString().split("T")[0],
  }));
}

export async function sendNotification(notification: {
  title: string;
  content: string;
  targetGroup: string;
}) {
  const response = await apiRequest<{ data: { id: string } }>(
    "/admin-notifications/admin",
    {
      method: "POST",
      body: JSON.stringify(notification),
    }
  );
  return response.data;
}

export async function getGhostSummary(): Promise<GhostSummary> {
  const response = await apiRequest<{ data: GhostSummary }>(
    "/ghost/admin/summary"
  );
  return response.data;
}

export async function getGhostPosts(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiRequest<{
    data: Array<{
      id: string;
      contentPreview: string;
      author: string | null;
      likes: number;
      comments: number;
      createdAt: string;
    }>;
    pagination: { total: number; page: number; limit: number };
  }>(`/ghost/admin/posts?${params.toString()}`);

  return {
    posts: response.data.map((post) => ({
      id: post.id,
      content: post.contentPreview,
      author: post.author || "Ghost",
      likes: post.likes,
      comments: post.comments,
      createdAt: new Date(post.createdAt).toISOString().split("T")[0],
    })),
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function getFOMOWindows() {
  const response = await apiRequest<{
    data: Array<{
      id: string;
      title: string;
      description?: string;
      status: "active" | "scheduled" | "ended" | "disabled";
      startTime: string;
      endTime: string;
      stats: { postCount: number; participantCount: number };
    }>;
  }>("/fomo/admin/windows");

  return response.data.map((window) => ({
    id: window.id,
    name: window.title,
    status: window.status,
    startDate: new Date(window.startTime).toISOString().split("T")[0],
    endDate: new Date(window.endTime).toISOString().split("T")[0],
    postsCreated: window.stats?.postCount || 0,
    usersParticipated: window.stats?.participantCount || 0,
    description: window.description || "",
  }));
}

export async function createFOMOWindow(payload: {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}) {
  return apiRequest("/fomo/admin/windows", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFOMOWindow(
  id: string,
  payload: { title?: string; description?: string; startTime?: string; endTime?: string }
) {
  return apiRequest(`/fomo/admin/windows/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteFOMOWindow(id: string) {
  return apiRequest(`/fomo/admin/windows/${id}`, {
    method: "DELETE",
  });
}

export async function getFOMOWindowAnalytics(id: string) {
  return apiRequest(`/fomo/admin/windows/${id}/analytics`);
}

export async function getContentFlags(page = 1, limit = 10, status?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status && status !== "all") {
    const mappedStatus = status === "reviewed" ? "approved" : status === "hidden" ? "removed" : status;
    params.set("status", mappedStatus);
  }

  const response = await apiRequest<{
    data: Array<{
      id: string;
      postId: string;
      contentPreview: string;
      reason: string;
      author: { username?: string; displayName?: string } | null;
      status: string;
      displayStatus?: string;
      createdAt: string;
    }>;
    pagination: { total: number; page: number; limit: number };
  }>(`/moderation/queue?${params.toString()}`);

  return {
    flags: response.data.map((flag) => ({
      id: flag.id,
      postId: flag.postId,
      content: flag.contentPreview,
      reason: flag.reason,
      flaggedAt: new Date(flag.createdAt).toISOString().split("T")[0],
      status: (flag.displayStatus || flag.status || "pending") as ContentFlag["status"],
      author: flag.author?.username || flag.author?.displayName || "-",
    })),
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function reviewContent(flagId: string, action: "approve" | "hide") {
  const status = action === "approve" ? "approved" : "removed";
  return apiRequest("/moderation/status", {
    method: "PATCH",
    body: JSON.stringify({ postId: flagId, status }),
  });
}

export async function getAICampaigns() {
  const response = await apiRequest<{ data: AICampaign[] }>("/ai-campaigns");
  return response.data.map((campaign) => ({
    ...campaign,
    startedAt: new Date(campaign.startedAt).toISOString().split("T")[0],
  }));
}

export async function createAICampaign(campaign: {
  name: string;
  type: AICampaign["type"];
  status: AICampaign["status"];
}) {
  return apiRequest("/ai-campaigns", {
    method: "POST",
    body: JSON.stringify(campaign),
  });
}

export async function updateAICampaignStatus(id: string, status: AICampaign["status"]) {
  return apiRequest(`/ai-campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAICampaign(id: string) {
  return apiRequest(`/ai-campaigns/${id}`, { method: "DELETE" });
}

export async function getSupportTickets(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await apiRequest<{
    data: Array<{
      _id: string;
      subject: string;
      status: string;
      priority: string;
      createdAt: string;
      user?: { displayName?: string; email?: string };
    }>;
    pagination: { total: number; page: number; limit: number };
  }>(`/support-ticket/admin/all-tickets?${params.toString()}`);

  return {
    tickets: response.data.map((ticket) => ({
      id: ticket._id,
      subject: ticket.subject,
      status: ticket.status || "open",
      priority: ticket.priority || "medium",
      createdAt: new Date(ticket.createdAt).toISOString().split("T")[0],
      user: ticket.user?.displayName || ticket.user?.email || "Unknown",
    })),
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function updateSupportTicketStatus(payload: {
  ticketId: string;
  status?: string;
  priority?: string;
}) {
  return apiRequest("/support-ticket/admin/update-status", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getVerificationRequests(status?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("limit", "100");

  const response = await apiRequest<{
    data: Array<{
      id: string;
      email: string;
      displayName: string;
      createdAt: string;
      status: string;
    }>;
  }>(`/verification/admin/requests?${params.toString()}`);

  return response.data.map((request) => ({
    id: request.id,
    displayName: request.displayName || "-",
    email: request.email,
    type: "Verification Badge",
    submittedAt: new Date(request.createdAt).toISOString().split("T")[0],
    status: request.status,
  }));
}

export async function getVerificationStats(): Promise<VerificationStats> {
  const response = await apiRequest<{ data: VerificationStats }>(
    "/verification/admin/stats"
  );
  return response.data;
}

export async function updateVerificationRequest(payload: {
  id: string;
  status: "approved" | "rejected" | "processing" | "pending";
  reason?: string;
}) {
  return apiRequest(`/verification/admin/requests/${payload.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status, reason: payload.reason }),
  });
}

export async function getAdSummary(): Promise<AdSummary> {
  const response = await apiRequest<{ data: AdSummary }>("/ads/summary");
  return response.data;
}

export async function getAdCampaigns(): Promise<AdCampaign[]> {
  const response = await apiRequest<{ data: AdCampaign[] }>("/ads/campaigns");
  return response.data;
}

export async function createAdCampaign(payload: {
  name: string;
  impressions?: number;
  clicks?: number;
  spend?: number;
}) {
  return apiRequest("/ads/campaigns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSecuritySummary(): Promise<SecuritySummary> {
  const response = await apiRequest<{ data: SecuritySummary }>(
    "/security/summary"
  );
  return response.data;
}
