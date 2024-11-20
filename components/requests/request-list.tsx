"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { PettyCashRequest } from "@/types";
import { useAuth } from "../context/authContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const mockRequests: PettyCashRequest[] = [
  {
    id: "1",
    requesterId: "user1",
    requesterName: "John Doe",
    amount: 150.00,
    purpose: "Office Supplies",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    requesterId: "user2",
    requesterName: "Jane Smith",
    amount: 75.50,
    purpose: "Team Lunch",
    status: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    approvedBy: "admin1",
    approverComment: "Approved for team building",
  },
];


export function RequestList() {
  const { user } = useAuth();

  const [filteredRequests, setFilteredRequests] = useState<PettyCashRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestCollection = collection(db, "requests");
      const q = query(requestCollection, where("requesterId", "==", user.uid));
      const requestSnapshot = await getDocs(q);
      setFilteredRequests(requestSnapshot.docs.map((doc) => doc.data() as PettyCashRequest));
      console.log(requestSnapshot.docs.map((doc) => doc.data() as PettyCashRequest));
    };

    fetchRequests();
  }, [user]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {format(new Date(request.createdAt.seconds * 1000), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{request.requesterName}</TableCell>
              <TableCell>{request.purpose}</TableCell>
              <TableCell>${request.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "success"
                      : request.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}