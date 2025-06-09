import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface Invitation {
  type: "project" | "Task"
  projectId: string
  projectName: string
  recipientId: string
  recipientName: string
  recipientEmail: string
  senderId: string
  senderName: string
  senderAvatar: string
  senderInitials: string

  id: string;
  status: InvitationStatus;
  project: {
    id: string;
    name: string;
  };
  invitedBy: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  invitedUser: {
    id: string | null;
    email: string;
    firstname: string | null;
    lastname: string | null;
  };
  team: any | null; // Eğer `team` objesinin yapısı belliyse detaylandırılabilir
  createdAt: string; // ISO tarih formatı
  token: string;
  tokenExpiry: string; // ISO tarih formatı
}

interface InvitationsState {
  invitations: Invitation[]
}

// Sample invitations
const initialState: InvitationsState = {
  invitations: [
    {
      id: "invitation-1",
      type: "project",
      projectId: "project-1",
      projectName: "Website Redesign",
      recipientId: "user-2",
      recipientName: "Alex Johnson",
      recipientEmail: "alex@example.com",
      senderId: "user-1",
      senderName: "John Smith",
      senderAvatar: "/placeholder.svg",
      senderInitials: "JS",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "invitation-2",
      type: "project",
      projectId: "project-3",
      projectName: "Mobile App Development",
      recipientId: "user-3",
      recipientName: "Sarah Miller",
      recipientEmail: "sarah@example.com",
      senderId: "user-1",
      senderName: "John Smith",
      senderAvatar: "/placeholder.svg",
      senderInitials: "JS",
      status: "accepted",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: "invitation-3",
      type: "project",
      projectId: "project-2",
      projectName: "API Integration",
      recipientId: "user-4",
      recipientName: "David Chen",
      recipientEmail: "david@example.com",
      senderId: "user-1",
      senderName: "John Smith",
      senderAvatar: "/placeholder.svg",
      senderInitials: "JS",
      status: "declined",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ],
}

export const invitationsSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    addInvitation: (state, action: PayloadAction<Invitation>) => {
      state.invitations.push(action.payload)
    },
    updateInvitationStatus: (state, action: PayloadAction<{ id: string; status: "accepted" | "declined" }>) => {
      const invitation = state.invitations.find((inv) => inv.id === action.payload.id)
      if (invitation) {
        invitation.status = action.payload.status
      }
    },
    removeInvitation: (state, action: PayloadAction<string>) => {
      state.invitations = state.invitations.filter((inv) => inv.id !== action.payload)
    },
  },
})

export const { addInvitation, updateInvitationStatus, removeInvitation } = invitationsSlice.actions
export default invitationsSlice.reducer
