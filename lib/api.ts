// Replace these with real API calls as needed

export interface User {
  id: string
  username: string
  email: string
  status: "active" | "inactive" | "suspended"
  postsCount: number
  commentsCount: number
  verified: boolean
  joinDate: string
}

export interface Group {
  id: string
  name: string
  description: string
  members: number
  posts: number
  verified: boolean
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  content: string
  targetGroup: string
  sentAt: string
  deliveredCount: number
}

export interface GhostPost {
  id: string
  content: string
  author: string
  likes: number
  comments: number
  createdAt: string
}

export interface FOMOWindow {
  id: string
  name: string
  status: "active" | "scheduled" | "ended"
  startDate: string
  endDate: string
  postsCreated: number
  usersParticipated: number
}

export interface ContentFlag {
  id: string
  postId: string
  content: string
  reason: string
  flaggedAt: string
  status: "pending" | "reviewed" | "hidden"
  author: string
}

export interface AICampaign {
  id: string
  name: string
  type: "engagement" | "posts" | "comments"
  status: "active" | "paused" | "completed"
  interactions: number
  reach: number
  startedAt: string
}

// Dummy Users Data
const dummyUsers: User[] = [
  {
    id: "1",
    username: "@sophiaArt",
    email: "sophia@example.com",
    status: "active",
    postsCount: 245,
    commentsCount: 512,
    verified: true,
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    username: "@oliviaStyle",
    email: "olivia@example.com",
    status: "active",
    postsCount: 198,
    commentsCount: 445,
    verified: true,
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    username: "@avaDesigns",
    email: "ava@example.com",
    status: "active",
    postsCount: 176,
    commentsCount: 389,
    verified: true,
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    username: "@jessicakim",
    email: "jessica@example.com",
    status: "active",
    postsCount: 154,
    commentsCount: 321,
    verified: false,
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    username: "@emmaMusic",
    email: "emma@example.com",
    status: "active",
    postsCount: 132,
    commentsCount: 278,
    verified: true,
    joinDate: "2023-05-12",
  },
  {
    id: "6",
    username: "@miaPhoto",
    email: "mia@example.com",
    status: "inactive",
    postsCount: 98,
    commentsCount: 156,
    verified: false,
    joinDate: "2023-06-01",
  },
  {
    id: "7",
    username: "@lunaGaming",
    email: "luna@example.com",
    status: "active",
    postsCount: 267,
    commentsCount: 634,
    verified: true,
    joinDate: "2022-12-20",
  },
  {
    id: "8",
    username: "@isabelaArt",
    email: "isabela@example.com",
    status: "suspended",
    postsCount: 112,
    commentsCount: 234,
    verified: true,
    joinDate: "2023-03-22",
  },
  {
    id: "9",
    username: "@zoeTravel",
    email: "zoe@example.com",
    status: "active",
    postsCount: 156,
    commentsCount: 412,
    verified: true,
    joinDate: "2023-07-14",
  },
  {
    id: "10",
    username: "@noahTech",
    email: "noah@example.com",
    status: "active",
    postsCount: 189,
    commentsCount: 501,
    verified: false,
    joinDate: "2023-08-03",
  },
  {
    id: "11",
    username: "@liamCoding",
    email: "liam@example.com",
    status: "active",
    postsCount: 223,
    commentsCount: 567,
    verified: true,
    joinDate: "2023-01-08",
  },
  {
    id: "12",
    username: "@evanVlogs",
    email: "evan@example.com",
    status: "active",
    postsCount: 178,
    commentsCount: 389,
    verified: false,
    joinDate: "2023-09-11",
  },
]

const dummyGroups: Group[] = [
  {
    id: "1",
    name: "Photography Enthusiasts",
    description: "Share and discuss photography tips",
    members: 2450,
    posts: 8920,
    verified: true,
    createdAt: "2022-06-15",
  },
  {
    id: "2",
    name: "Digital Art Collective",
    description: "Showcase digital art works",
    members: 1890,
    posts: 5670,
    verified: true,
    createdAt: "2022-08-22",
  },
  {
    id: "3",
    name: "Gaming Community",
    description: "Gaming news and discussions",
    members: 3200,
    posts: 12500,
    verified: true,
    createdAt: "2022-05-10",
  },
  {
    id: "4",
    name: "Travel Vlog Squad",
    description: "Travel vlogs and experiences",
    members: 1567,
    posts: 4230,
    verified: false,
    createdAt: "2023-01-20",
  },
  {
    id: "5",
    name: "Music Producers",
    description: "Music production and collaboration",
    members: 890,
    posts: 2345,
    verified: true,
    createdAt: "2023-02-14",
  },
]

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "New Feature Launch",
    content: "Check out our new ghost posting feature!",
    targetGroup: "all",
    sentAt: "2024-01-15",
    deliveredCount: 23450,
  },
  {
    id: "2",
    title: "Maintenance Reminder",
    content: "System maintenance on Sunday 2AM UTC",
    targetGroup: "all",
    sentAt: "2024-01-14",
    deliveredCount: 18920,
  },
  {
    id: "3",
    title: "Content Update",
    content: "New guidelines for content creators",
    targetGroup: "verified",
    sentAt: "2024-01-13",
    deliveredCount: 3218,
  },
]

const dummyGhostPosts: GhostPost[] = [
  {
    id: "1",
    content: "Anonymous post about travel experiences",
    author: "Ghost_12345",
    likes: 234,
    comments: 56,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    content: "Mysterious photography tips shared",
    author: "Ghost_67890",
    likes: 567,
    comments: 123,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    content: "Anonymous art showcase",
    author: "Ghost_11111",
    likes: 892,
    comments: 234,
    createdAt: "2024-01-13",
  },
]

const dummyFOMOWindows: FOMOWindow[] = [
  {
    id: "1",
    name: "Summer Challenge 2024",
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-01-17",
    postsCreated: 2890,
    usersParticipated: 1240,
  },
  {
    id: "2",
    name: "New Year Photo Contest",
    status: "ended",
    startDate: "2024-01-01",
    endDate: "2024-01-08",
    postsCreated: 3450,
    usersParticipated: 1567,
  },
  {
    id: "3",
    name: "Spring Creativity Week",
    status: "scheduled",
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    postsCreated: 0,
    usersParticipated: 0,
  },
]

const dummyContentFlags: ContentFlag[] = [
  {
    id: "1",
    postId: "post_123",
    content: "Explicit content detected",
    reason: "Violation of community guidelines",
    flaggedAt: "2024-01-15",
    status: "pending",
    author: "@user123",
  },
  {
    id: "2",
    postId: "post_456",
    content: "Hate speech detected",
    reason: "Offensive language",
    flaggedAt: "2024-01-14",
    status: "reviewed",
    author: "@user456",
  },
  {
    id: "3",
    postId: "post_789",
    content: "Spam content",
    reason: "Promotional spam",
    flaggedAt: "2024-01-13",
    status: "hidden",
    author: "@user789",
  },
]

const dummyAICampaigns: AICampaign[] = [
  {
    id: "1",
    name: "Engagement Booster",
    type: "engagement",
    status: "active",
    interactions: 15420,
    reach: 34560,
    startedAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Content Seeding",
    type: "posts",
    status: "active",
    interactions: 8920,
    reach: 21340,
    startedAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Comment Catalyst",
    type: "comments",
    status: "paused",
    interactions: 5670,
    reach: 12450,
    startedAt: "2024-01-08",
  },
]

// API Functions
export async function getUsers(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  const start = (page - 1) * limit
  const end = start + limit
  return {
    users: dummyUsers.slice(start, end),
    total: dummyUsers.length,
    page,
    limit,
  }
}

export async function getGroups(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = (page - 1) * limit
  const end = start + limit
  return {
    groups: dummyGroups.slice(start, end),
    total: dummyGroups.length,
    page,
    limit,
  }
}

export async function getNotifications() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return dummyNotifications
}

export async function sendNotification(notification: Omit<Notification, "id" | "sentAt" | "deliveredCount">) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, id: Math.random().toString(36) }
}

export async function getGhostPosts(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = (page - 1) * limit
  const end = start + limit
  return {
    posts: dummyGhostPosts.slice(start, end),
    total: dummyGhostPosts.length,
    page,
    limit,
  }
}

export async function getFOMOWindows() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return dummyFOMOWindows
}

export async function getContentFlags(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = (page - 1) * limit
  const end = start + limit
  return {
    flags: dummyContentFlags.slice(start, end),
    total: dummyContentFlags.length,
    page,
    limit,
  }
}

export async function reviewContent(flagId: string, action: "approve" | "hide") {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { success: true }
}

export async function getAICampaigns() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return dummyAICampaigns
}

export async function createAICampaign(campaign: Omit<AICampaign, "id" | "interactions" | "reach" | "startedAt">) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, id: Math.random().toString(36) }
}
