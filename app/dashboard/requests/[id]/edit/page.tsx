"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RequestForm } from "@/components/requests/request-form";
import { useAuth } from "@/components/context/authContext"; // Assuming you have an auth hook
import { useToast } from "@/components/ui/use-toast";
import { PettyCashRequest } from "@/types/index";

const EditRequest = () => {
  const { id: requestId } = useParams() as { id: string }; // Explicitly type useParams
  const router = useRouter();
  const { toast } = useToast();
  const { user, role } = useAuth(); // Get the current user
  const [requestData, setRequestData] = useState<PettyCashRequest | null>(null);

  useEffect(() => {
    if (!requestId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid request ID.",
      });
      router.push("/dashboard/requests");
      return;
    }

    const fetchRequestData = async () => {
      try {
        const docRef = doc(db, "requests", requestId as string); // Ensure requestId is typed as string
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const requestData: PettyCashRequest = {
            id: docSnap.id,
            requesterId: data.requesterId || "",
            requesterName: data.requesterName || "",
            totalAmount: data.totalAmount || 0,
            purpose: data.purpose || "",
            status: data.status || "pending",
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            department: data.department || "",
            amountInWords: data.amountInWords || "",
            paymentSchedule: {
              accountName: data.paymentSchedule.accountName || "",
              accountNumber: data.paymentSchedule.accountNumber || "",
              bankName: data.paymentSchedule.bankName || "",
              plantCode: data.paymentSchedule.plantCode || "",
            },
            items: data.items.map((item: any) => ({
              details: item.details || "",
              quantity: item.quantity || 0,
              unitPrice: item.unitPrice || 0,
              amount: item.amount || 0,
            })) || [],
            notes: data.notes,
            approvedBy: data.approvedBy,
            approverComment: data.approverComment,
          };

          // Fix for error TS18047
          if (
            user &&
            data.requesterId !== user.uid &&
            role !== "administrator"
          ) {
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: "You are not authorized to edit this request.",
            });
            router.push("/dashboard/requests");
            return;
          }

          setRequestData(requestData);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Request not found.",
          });
          router.push("/dashboard/requests");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch request data.",
        });
        console.error("Error getting document:", error);
      }
    };

    fetchRequestData();
  }, [requestId, user, role, router, toast]);

  if (!user) {
    return null; // Optionally, show a loading spinner or message
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Edit Request</h1>
      <div className="grid gap-6">
        {requestData && (
          <RequestForm defaultValues={requestData} requestId={requestData.id} />
        )}
      </div>
    </div>
  );
};

export default EditRequest;
