// Dummy data for the admin dashboard
export interface User {
  id: string
  avatar: string
  username: string
  displayName: string
  age: number
  email: string
  status: "online" | "offline" | "banned" | "restricted"
  verified: boolean
  ghostMode: boolean
  dateJoined: string
}

export interface Group {
  id: string
  name: string
  type: "public" | "private"
  membersCount: number
  verified: boolean
  status: "active" | "restricted" | "banned"
  createdDate: string
}

export interface Notification {
  id: string
  title: string
  message: string
  audience: string
  dateSent: string
  deliveryStatus: "delivered" | "scheduled"
  openRate: number
  clicks: number
}

export interface GhostPostWindow {
  id: string
  startTime: string
  endTime: string
  status: "upcoming" | "active" | "ended"
  notificationSent: boolean
}

export interface GhostName {
  id: string
  name: string
  status: "allowed" | "banned"
  usageCount: number
  lastUsed: string
}

export interface FOMOWindow {
  id: string
  name: string
  start: string
  end: string
  active: boolean
  postsCreated: number
  uniqueUsers: number
}

export interface ContentItem {
  id: string
  thumbnail: string
  text: string
  author: string
  type: "post" | "story" | "ghost-post" | "media"
  authorAge: number
  flags: string[]
  datePosted: string
}

export interface VerificationRequest {
  id: string
  username: string
  displayName: string
  avatar: string
  followers: number
  docsReceived: boolean
  requestDate: string
  status: "pending" | "approved" | "rejected"
}

export interface SupportTicket {
  id: string
  ticketId: string
  username: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved"
  createdAt: string
  updatedAt: string
  message: string
}

export interface AdCampaign {
  id: string
  name: string
  status: "active" | "paused" | "ended"
  impressions: number
  clicks: number
  ctr: number
  startDate: string
  endDate: string
}

const dummyUsers: User[] = [
  {
    id: "1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    username: "@teenUser123",
    displayName: "Alex Rivera",
    age: 16,
    email: "alex.rivera@email.com",
    status: "online",
    verified: false,
    ghostMode: false,
    dateJoined: "2023-06-15",
  },
  {
    id: "2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    username: "@jessicakim",
    displayName: "Jessica Kim",
    age: 19,
    email: "jessica.kim@email.com",
    status: "online",
    verified: true,
    ghostMode: true,
    dateJoined: "2023-04-20",
  },
  {
    id: "3",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    username: "@marcosGaming",
    displayName: "Marcos Luna",
    age: 17,
    email: "marcos.luna@email.com",
    status: "offline",
    verified: false,
    ghostMode: false,
    dateJoined: "2023-08-10",
  },
  {
    id: "4",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Princess",
    username: "@sophiaArt",
    displayName: "Sophia Chen",
    age: 18,
    email: "sophia.chen@email.com",
    status: "online",
    verified: true,
    ghostMode: false,
    dateJoined: "2023-02-28",
  },
  {
    id: "5",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    username: "@leoTechBro",
    displayName: "Leonardo Santos",
    age: 21,
    email: "leo.santos@email.com",
    status: "restricted",
    verified: true,
    ghostMode: false,
    dateJoined: "2023-01-10",
  },
  {
    id: "6",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    username: "@emmaMusic",
    displayName: "Emma Wilson",
    age: 20,
    email: "emma.wilson@email.com",
    status: "online",
    verified: false,
    ghostMode: true,
    dateJoined: "2023-07-05",
  },
  {
    id: "7",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    username: "@noahFitness",
    displayName: "Noah Johnson",
    age: 19,
    email: "noah.johnson@email.com",
    status: "banned",
    verified: false,
    ghostMode: false,
    dateJoined: "2023-03-12",
  },
  {
    id: "8",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    username: "@oliviaStyle",
    displayName: "Olivia Martinez",
    age: 22,
    email: "olivia.martinez@email.com",
    status: "online",
    verified: true,
    ghostMode: false,
    dateJoined: "2023-05-20",
  },
  {
    id: "9",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    username: "@liamCoding",
    displayName: "Liam Taylor",
    age: 17,
    email: "liam.taylor@email.com",
    status: "offline",
    verified: false,
    ghostMode: true,
    dateJoined: "2023-09-08",
  },
  {
    id: "10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    username: "@avaDesigns",
    displayName: "Ava Garcia",
    age: 20,
    email: "ava.garcia@email.com",
    status: "online",
    verified: true,
    ghostMode: false,
    dateJoined: "2023-06-30",
  },
]

const dummyGroups: Group[] = [
  {
    id: "1",
    name: "College Lounge",
    type: "public",
    membersCount: 2340,
    verified: true,
    status: "active",
    createdDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Gaming Central",
    type: "private",
    membersCount: 1200,
    verified: false,
    status: "active",
    createdDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Fitness Squad",
    type: "public",
    membersCount: 890,
    verified: true,
    status: "active",
    createdDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Art & Design",
    type: "public",
    membersCount: 560,
    verified: false,
    status: "restricted",
    createdDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Music Lovers",
    type: "private",
    membersCount: 1500,
    verified: true,
    status: "active",
    createdDate: "2023-05-12",
  },
]

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "New Feature Alert",
    message: "Check out our new Ghost Post feature!",
    audience: "All Users",
    dateSent: "2024-11-19",
    deliveryStatus: "delivered",
    openRate: 45,
    clicks: 320,
  },
  {
    id: "2",
    title: "Weekend Challenge",
    message: "Participate in our weekend story challenge!",
    audience: "Specific Groups",
    dateSent: "2024-11-18",
    deliveryStatus: "delivered",
    openRate: 62,
    clicks: 890,
  },
]

const dummyGhostPostWindows: GhostPostWindow[] = [
  { id: "1", startTime: "2024-11-20 14:00", endTime: "2024-11-20 15:00", status: "active", notificationSent: true },
  { id: "2", startTime: "2024-11-21 18:00", endTime: "2024-11-21 19:00", status: "upcoming", notificationSent: false },
  { id: "3", startTime: "2024-11-19 12:00", endTime: "2024-11-19 13:00", status: "ended", notificationSent: true },
]

const dummyGhostNames: GhostName[] = [
  { id: "1", name: "ShadowFox", status: "allowed", usageCount: 234, lastUsed: "2024-11-19" },
  { id: "2", name: "MidnightOwl", status: "allowed", usageCount: 567, lastUsed: "2024-11-18" },
  { id: "3", name: "PhantomNinja", status: "banned", usageCount: 89, lastUsed: "2024-11-15" },
  { id: "4", name: "SilentWanderer", status: "allowed", usageCount: 123, lastUsed: "2024-11-19" },
]

const dummyFOMOWindows: FOMOWindow[] = [
  {
    id: "1",
    name: "Weekend Stories",
    start: "2024-11-16 18:00",
    end: "2024-11-17 23:59",
    active: false,
    postsCreated: 2890,
    uniqueUsers: 1240,
  },
  {
    id: "2",
    name: "Friday Night Party",
    start: "2024-11-22 20:00",
    end: "2024-11-23 06:00",
    active: false,
    postsCreated: 0,
    uniqueUsers: 0,
  },
]

const dummyContent: ContentItem[] = [
  {
    id: "1",
    thumbnail: "🎮",
    text: "Gaming stream highlight",
    author: "liamCoding",
    type: "post",
    authorAge: 17,
    flags: ["Explicit Detected"],
    datePosted: "2024-11-19 10:30",
  },
  {
    id: "2",
    thumbnail: "🎵",
    text: "Music cover video",
    author: "emmaMusic",
    type: "media",
    authorAge: 20,
    flags: [],
    datePosted: "2024-11-19 09:15",
  },
  {
    id: "3",
    thumbnail: "📸",
    text: "Photo collage",
    author: "avaDesigns",
    type: "story",
    authorAge: 20,
    flags: [],
    datePosted: "2024-11-19 14:45",
  },
]

const dummyVerificationRequests: VerificationRequest[] = [
  {
    id: "1",
    username: "@sophiaArt",
    displayName: "Sophia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Princess",
    followers: 15000,
    docsReceived: true,
    requestDate: "2024-11-18",
    status: "pending",
  },
  {
    id: "2",
    username: "@oliviaStyle",
    displayName: "Olivia Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    followers: 25000,
    docsReceived: true,
    requestDate: "2024-11-10",
    status: "approved",
  },
]

const dummyTickets: SupportTicket[] = [
  {
    id: "1",
    ticketId: "TKT-2024-001",
    username: "teenUser123",
    category: "Bug",
    priority: "high",
    status: "open",
    createdAt: "2024-11-19",
    updatedAt: "2024-11-19",
    message: "Cannot upload photos in ghost mode",
  },
  {
    id: "2",
    ticketId: "TKT-2024-002",
    username: "noahFitness",
    category: "Account Recovery",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-11-18",
    updatedAt: "2024-11-19",
    message: "Lost access to account",
  },
]

const dummyAdCampaigns: AdCampaign[] = [
  {
    id: "1",
    name: "Summer Sale 2024",
    status: "active",
    impressions: 45000,
    clicks: 2300,
    ctr: 5.1,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
  },
  {
    id: "2",
    name: "Black Friday Promo",
    status: "active",
    impressions: 78000,
    clicks: 4200,
    ctr: 5.4,
    startDate: "2024-11-20",
    endDate: "2024-11-30",
  },
]

export async function fetchUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number; pages: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedUsers = dummyUsers.slice(start, end)
  return { users: paginatedUsers, total: dummyUsers.length, pages: Math.ceil(dummyUsers.length / limit) }
}

export async function fetchGroups(page = 1, limit = 10): Promise<{ groups: Group[]; total: number; pages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedGroups = dummyGroups.slice(start, end)
  return { groups: paginatedGroups, total: dummyGroups.length, pages: Math.ceil(dummyGroups.length / limit) }
}

export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyNotifications
}

export async function fetchGhostPostWindows(): Promise<GhostPostWindow[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyGhostPostWindows
}

export async function fetchGhostNames(): Promise<GhostName[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyGhostNames
}

export async function fetchFOMOWindows(): Promise<FOMOWindow[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyFOMOWindows
}

export async function fetchContent(): Promise<ContentItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyContent
}

export async function fetchVerificationRequests(): Promise<VerificationRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyVerificationRequests
}

export async function fetchTickets(): Promise<SupportTicket[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyTickets
}

export async function fetchAdCampaigns(): Promise<AdCampaign[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyAdCampaigns
}
