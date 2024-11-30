import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PettyCashRequest, UserRole } from "@/types";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface RequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PettyCashRequest | null;
  // onSave: (updatedRequest: PettyCashRequest) => void;
  role: UserRole;
}

const RequestSheet = ({
  open,
  onOpenChange,
  request,
  // onSave,
  role,
}: RequestSheetProps) => {
  const updateStatus = async (status: "approved" | "rejected" | "completed" | "not completed" | "passed" | "not passed") => {
    if (request) {
      const requestRef = doc(db, "requests", request.id); // Use request.id for the document ID
      await updateDoc(requestRef, {
        status: status
      });
      // onSave({ ...request, status });
      onOpenChange(false);
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
            >
              <XCircle className="mr-2 h-5 w-5" />
              Not Completed
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("completed")}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
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
            >
              <XCircle className="mr-2 h-5 w-5" />
              Not Approved
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("approved")}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
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
            >
              <XCircle className="mr-2 h-5 w-5" />
              Not Passed
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-100"
              onClick={() => updateStatus("passed")}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Passed
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
          <SheetDescription>
            {request ? (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{request.purpose}</CardTitle>
                  <CardDescription>{request.notes}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <p><strong>Amount:</strong> ${request.totalAmount}</p>
                  <p><strong>Status:</strong> 
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
                  </p>
                  <p className="text-base"><strong>Created At:</strong> {request.createdAt ? format(new Date(request.createdAt.seconds * 1000), "MMM d, yyyy") : "N/A"}</p>
                </CardContent>
                <div className="mt-6 flex justify-start space-x-4 p-4">
                  {getStatusButtons()}
                </div>
              </Card>
            ) : (
              <p>No request selected</p>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default RequestSheet;