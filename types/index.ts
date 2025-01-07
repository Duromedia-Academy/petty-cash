export type UserRole =
  | "requester"
  | "superior"
  | "accountant"
  | "administrator";

export type RequestData = {
  id: string;
  requesterId: string;
  requesterName: string;
  totalAmount: number;
  purpose: string;
  status: 
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "not completed"
    | "passed"
    | "not passed";
  createdAt: Date;
  updatedAt: Date;
  department: string;
  amountInWords: string;
  paymentSchedule: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    plantCode: string;
  };
  items: Array<{
    details: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  notes?: string;
  approvedBy?: string;
  approverComment?: string;
  [key: string]: any;
};

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
  totalAmount: number;
  purpose: string;
  notes?: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "not completed"
    | "passed"
    | "not passed";
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approverComment?: string;
  department: string;
  amountInWords: string;
  paymentSchedule: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    plantCode: string;
  };
  items: Array<{
    details: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}
