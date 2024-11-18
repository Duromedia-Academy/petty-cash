export type UserRole = "requester" | "superior" | "administrator";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
}

export interface PettyCashRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  amount: number;
  purpose: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approverComment?: string;
}