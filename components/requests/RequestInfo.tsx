"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PettyCashRequest, UserRole } from "@/types";
import { format } from "date-fns";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
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
  refetchData: () => void; // Add refetchData prop
}

const RequestInfo = ({
  request,
  role,
  refetchData, // Destructure refetchData
}: RequestInfoProps) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "approved" | "rejected" | "completed" | "not completed" | "passed" | "not passed") => {
    if (request) {
      setLoading(true);
      const requestRef = doc(db, "requests", request.id); // Use request.id for the document ID
      await updateDoc(requestRef, {
        status: status
      });
      // Call refetchData after updating the status
      refetchData();
      setLoading(false);
    }
  };

  const getStatusButtons = () => {
    switch (role) {
      case "accountant":
        return (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-100"
              onClick={() => updateStatus("not completed")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2 h-5 w-5" />}
              Not Completed
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("completed")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              Completed
            </Button>
          </>
        );
      case "administrator":
        return (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-100"
              onClick={() => updateStatus("rejected")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2 h-5 w-5" />}
              Not Approved
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("approved")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              Approved
            </Button>
          </>
        );
      case "superior":
        return (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-100"
              onClick={() => updateStatus("not passed")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2 h-5 w-5" />}
              Not Passed
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("passed")}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              Passed
            </Button>
          </>
        );
      default:
        return null;
    }
  };

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
                ? "bg-green-300 text-white ml-2 text-sm"
                : request.status === "passed"
                ? "bg-lime-500 text-white ml-2 text-sm"
                : request.status === "rejected"
                ? "bg-red-500 text-white ml-2 text-sm"
                : request.status === "not completed"
                ? "bg-orange-500 text-white ml-2 text-sm"
                : request.status === "not passed"
                ? "bg-red-700 text-white ml-2 text-sm"
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