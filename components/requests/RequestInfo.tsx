"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { PettyCashRequest, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RequestInfoProps {
  request: PettyCashRequest | null;
  role: UserRole;
  refetchData: () => void;
}

const RequestInfo = ({ request, role, refetchData }: RequestInfoProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: string) => {
    if (!request) return;
    setLoading(true);
    try {
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, { status });
      refetchData(); // Refresh data after successful update
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update request status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusButtons = () => {
    if (!request) return null;

    const { status } = request;
    let buttons :any[] = [];

    if (role === "superior") {
      buttons = [
        {
          status: "not passed",
          label: "Not Pass",
          disabled: status === "not passed" || status === "approved" || status === "not completed" || status === "completed",
          action: () => updateStatus("not passed"),
        },
        {
          status: "passed",
          label: "Pass",
          disabled: status === "passed" || status === "approved" || status === "not completed" || status === "completed",
          action: () => updateStatus("passed"),
        },
      ];
    } else if (role === "administrator") {
      buttons = [
        {
          status: "rejected",
          label: "Reject",
          disabled: status === "rejected" || status === "completed",
          action: () => updateStatus("rejected"),
        },
        {
          status: "approved",
          label: "Approve",
          disabled: status === "approved" || status === "completed",
          action: () => updateStatus("approved"),
        },
      ];
    } else if (role === "accountant") {
      buttons = [
        {
          status: "not completed",
          label: "Incomplete",
          disabled: status === "not completed",
          action: () => updateStatus("not completed"),
        },
        {
          status: "completed",
          label: "Complete",
          disabled: status === "completed",
          action: () => updateStatus("completed"),
        },
      ];
    }

    return buttons.map(({ status, label, disabled, action }) => (
      <Button
        key={status}
        variant="outline"
        disabled={disabled || loading}
        onClick={action}
        className={
          disabled
        ? "border-gray-300 text-gray-500 cursor-not-allowed"
        : status === "completed" || status === "approved" || status === "passed"
        ? "border-green-500 text-green-500 hover:text-green-500 hover:bg-green-100"
        : "border-red-500 text-red-500 hover:text-red-500 hover:bg-red-100"
        }
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : status === "completed" || status === "approved" || status === "passed" ? (
          <CheckCircle className="mr-2 h-5 w-5" />
        ) : (
          <XCircle className="mr-2 h-5 w-5" />
        )}
        {label}
      </Button>
    ));
  };

  if (!request) {
    return (
      <div className="h-80 flex flex-col items-start justify-center">
        <p className="mb-4">Request is unavailable. Please select a request to view details.</p>
        <Button onClick={() => router.push('/dashboard/requests')}>Go to Requests</Button>
      </div>
    );
  }

  return (
    <>
      {request ? (
        <Card className="rounded-sm mt-4 md:p-2">
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1 space-y-1">
              <CardTitle>{request.purpose}</CardTitle>
              <CardDescription>Created By <span className="font-bold text-black">{request.requesterName}</span></CardDescription>
            </div>
            <div className="flex items-center justify-center">
              <Badge
                className={
                request.status === "approved"
                ? "bg-green-500 text-white ml-2 text-sm"
                : request.status === "completed"
                ? "bg-green-800 text-white ml-2 text-sm"
                : request.status === "passed"
                ? "bg-lime-500 text-white ml-2 text-sm"
                : request.status === "rejected"
                ? "bg-red-600 text-white ml-2 text-sm"
                : request.status === "not completed"
                ? "bg-orange-800 text-white ml-2 text-sm"
                : request.status === "not passed"
                ? "bg-red-500 text-white ml-2 text-sm"
                : "bg-gray-800 text-white ml-2 text-sm"
                }
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <hr className="border-gray-200 mx-4" />
          <CardContent className="space-y-10">
            <div className="space-y-2">
              <h4 className="text-base">Description</h4>
              <p className="text-sm">{request.notes}</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1 space-y-2">
                <h4 className="text-base">Amount</h4>
                <p className="text-lg font-semibold">{request.totalAmount}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <h4 className="text-base">Amount in Words</h4>
                <p className="font-semibold capitalize">{request.amountInWords}</p>
              </div>
            </div>
            <div className="flex items-center justify-start gap-5 flex-wrap">
              <div className="w-40 space-y-2">
                <h4 className="text-base">Created At</h4>
                <p className="text-base font-semibold">{request.createdAt ? format(new Date(request.createdAt.seconds * 1000), "MMMM d, yyyy") : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-base">Department</h4>
                <p className="text-base font-semibold">{request.department}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold underline">Payment Schedule</h4>
              <div className="flex items-center justify-start gap-5 flex-wrap">
                <div className="w-40 space-y-2">
                  <h4 className="text-base">Account Name</h4>
                  <p className="text-base font-semibold">{request.paymentSchedule.accountName}</p>
                </div>
                <div className="w-40 space-y-2">
                  <h4 className="text-base">Account Number</h4>
                  <p className="text-base font-semibold">{request.paymentSchedule.accountNumber}</p>
                </div>
                <div className="w-40 space-y-2">
                  <h4 className="text-base">Bank Name</h4>
                  <p className="text-base font-semibold">{request.paymentSchedule.bankName}</p>
                </div>
                <div className="w-40 space-y-2">
                  <h4 className="text-base">Plant Code</h4>
                  <p className="text-base font-semibold">{request.paymentSchedule.plantCode}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold underline">Schedule of Items Requested</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Details</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.details}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitPrice}</TableCell>
                      <TableCell className="text-right">{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">{request.totalAmount}</TableCell>
                </TableRow>
              </Table>
            </div>
          </CardContent>
          <div className="mt-6 flex justify-start space-x-4 p-4">
            {getStatusButtons()}
          </div>
        </Card>
      ): 
        "No request selected"
      }
    </>
  );
};

export default RequestInfo;