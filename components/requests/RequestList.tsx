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
import { collection, getDocs, onSnapshot, or, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RequestSheet from "./RequestSheet";

const RequestList = () => {
  const { user, role } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<PettyCashRequest | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState<PettyCashRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestCollection = collection(db, "requests");
      let q;
      if (role === "administrator") {
        q = query(requestCollection,
          or(
            where("status", "==", "passed"),
            where("status", "==", "approved"),
            where("status", "==", "not completed"),
          )
        );
      } else if(role === "superior") {
        q = query(requestCollection, 
          or(
            where("status", "==", "pending"),
            where("status", "==", "passed"),
            where("status", "==", "rejected")
          )
        );
      } else if(role === "accountant") {
        q = query(requestCollection, 
          or(
            where("status", "==", "approved"),
            where("status", "==", "completed")
          )
        );
      } else {
        q = query(requestCollection, where("requesterId", "==", user?.uid));
      }
      const requestSnapshot = await onSnapshot(q, (snapshot) => {
        const requests: PettyCashRequest[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Include the document ID
        } as PettyCashRequest));
        setFilteredRequests(requests);
      });
    };

    fetchRequests();
  }, [user]);

  const handleViewRequest = (request: PettyCashRequest) => {
    setSelectedRequest(request);
    console.log(request);
    setRequestDialogOpen(true);
  }

  const handleSaveRequest = (updatedRequest: PettyCashRequest) => {
    setFilteredRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === updatedRequest.id ? updatedRequest : request))
    );
  };

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
            <TableRow key={index} onClick={() => handleViewRequest(request)}>
              <TableCell>
                {request.createdAt && format(new Date(request.createdAt.seconds * 1000), "MMM d, yyyy")}
              </TableCell>
              {(role === "administrator" || role === "superior" || role === "accountant") && 
                <TableCell>{request.requesterName}</TableCell>
              }
              <TableCell>{request.purpose}</TableCell>
              <TableCell>${request.totalAmount}</TableCell>
              <TableCell>
                <Badge
                  className={
                    request.status === "approved"
                    ? "bg-green-500 text-white ml-2"
                    : request.status === "completed"
                    ? "bg-green-300 text-white ml-2"
                    : request.status === "passed"
                    ? "bg-lime-500 text-white ml-2"
                    : request.status === "rejected"
                    ? "bg-red-500 text-white ml-2"
                    : request.status === "not completed"
                    ? "bg-orange-500 text-white ml-2"
                    : request.status === "not passed"
                    ? "bg-red-700 text-white ml-2"
                    : "bg-gray-800 text-white ml-2"
                    }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RequestSheet 
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        request={selectedRequest}
        // onSave={handleSaveRequest}
        role={role}
      />
    </div>
  );
}

export default RequestList;