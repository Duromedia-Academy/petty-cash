export type UserRole = "requester" | "superior" | "accountant" | "administrator";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  department?: string;
}

export interface PettyCashRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  amount: number;
  purpose: string;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "completed" | "not completed" | "passed" | "not passed";
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approverComment?: string;
}