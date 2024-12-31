"use client";

import { db } from "@/lib/firebase";
import { collectioin, doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RequestForm } from "@/components/requests/request-form";
import { useAuth } from "@/components/context/authContext"; // Assuming you have an auth hook
import { useToast } from "@/components/ui/use-toast";

const EditRequest = () => {
  const { id: requestId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, role } = useAuth(); // Get the current user
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      const docRef = doc(db, "requests", requestId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.requesterId !== user.uid && role !== "administrator") {
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: "You are not authorized to edit this request.",
            });
            router.push("/dashboard/requests"); // Redirect unauthorized users
            return;
          }
          setRequestData({ ...data, id: docSnap.id });
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    if (user) {
      fetchRequestData();
    }
  }, [requestId, user]);

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
