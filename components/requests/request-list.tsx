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
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";


export function RequestList() {
  const { user, role } = useAuth()!;

  const [filteredRequests, setFilteredRequests] = useState<PettyCashRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestCollection = collection(db, "requests");
      let q;
      if (role === "administrator" || role === "superior") {
        q = query(requestCollection);
      } else if(role === "accountant") {
        q = query(requestCollection, where("status", "==", "approved"));
      } else {
        q = query(requestCollection, where("requesterId", "==", user?.uid));
      }
      const requestSnapshot = await onSnapshot(q, (snapshot) => {
        const requests: Request[] = snapshot.docs.map((doc) => doc.data() as PettyCashRequest)
        setFilteredRequests(requests);
      });
    };

    fetchRequests();
  }, [user]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {(role === "administrator" || role === "superior" || role === "accountant") &&
              <TableHead>Requester</TableHead>
            }
            <TableHead>Purpose</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request, index) => (
            <TableRow key={request.id || index}>
              <TableCell>
                {request.createdAt && format(new Date(request.createdAt.seconds * 1000), "MMM d, yyyy")}
              </TableCell>
                {(role === "administrator" || role === "superior" || role === "accountant") && 
                  <TableCell>{request.requesterName}</TableCell>
                }
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