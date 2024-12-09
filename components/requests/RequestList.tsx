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
import { collection, getDocs, onSnapshot, or, orderBy, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EyeIcon, Pencil, Trash, CircleEllipsis } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";

const RequestList = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [filteredRequests, setFilteredRequests] = useState<PettyCashRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PettyCashRequest | null>(null);
  const [showDialog, setShowDialog] = useState(false);

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

      await onSnapshot(q, (snapshot) => {
        const requests: PettyCashRequest[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Include the document ID
        } as PettyCashRequest));
        setFilteredRequests(requests);
      });
    };

    fetchRequests();
  }, [user]);

  const handleDelete = async () => {
    if (selectedRequest) {
      if (selectedRequest.requesterId === user?.uid || role === "administrator") {
        await deleteDoc(doc(db, "requests", selectedRequest.id));
        toast({
          title: "Request Deleted",
          description: "The request has been successfully deleted.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You are not authorized to delete this request.",
        });
      }
      setShowDialog(false);
      setSelectedRequest(null);
    }
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request, index) => (
            <TableRow key={index} className="cursor-pointer">
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <CircleEllipsis size={30} className="font-normal" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="space-x-3" onClick={() => router.push(`/dashboard/requests/${request.id}`)}>
                        <EyeIcon size={20} />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="space-x-3" onClick={() => router.push(`/dashboard/requests/${request.id}/edit`)}>
                        <Pencil size={20} />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-white focus:bg-destructive space-x-3" onClick={() => {
                        setSelectedRequest(request);
                        setShowDialog(true);
                      }}>
                        <Trash size={20} />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this request?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RequestList;