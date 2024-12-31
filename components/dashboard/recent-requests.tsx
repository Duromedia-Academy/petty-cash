"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/context/authContext";
import {
  collection,
  onSnapshot,
  query,
  where,
  or,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PettyCashRequest } from "@/types";

export function RecentRequests() {
  const { user, role } = useAuth();
  const [requests, setRequests] = useState<PettyCashRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestCollection = collection(db, "requests");
      let q;

      if (role === "administrator") {
        q = query(
          requestCollection,
          or(
            where("status", "==", "passed"),
            where("status", "==", "approved"),
            where("status", "==", "not completed")
          ),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else if (role === "superior") {
        q = query(
          requestCollection,
          or(
            where("status", "==", "pending"),
            where("status", "==", "passed"),
            where("status", "==", "rejected")
          ),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else if (role === "accountant") {
        q = query(
          requestCollection,
          or(
            where("status", "==", "approved"),
            where("status", "==", "completed")
          ),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else {
        q = query(
          requestCollection,
          where("requesterId", "==", user?.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      }

      await onSnapshot(q, (snapshot) => {
        const requests: PettyCashRequest[] = snapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id, // Include the document ID
            } as PettyCashRequest)
        );
        setRequests(requests);
      });
    };
    fetchRequests();
  }, [user, role]);

  return (
    <div className="space-y-8">
      {requests.map((request, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {request.requesterName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {request.requesterName}
            </p>
            <p className="text-sm text-muted-foreground">{request.purpose}</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge
              className={
                request.status === "approved"
                  ? "bg-green-500 text-white"
                  : request.status === "completed"
                  ? "bg-green-800 text-white"
                  : request.status === "passed"
                  ? "bg-lime-500 text-white"
                  : request.status === "rejected"
                  ? "bg-red-600 text-white"
                  : request.status === "not completed"
                  ? "bg-orange-800 text-white"
                  : request.status === "not passed"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-white"
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <span className="font-medium">${request.totalAmount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
