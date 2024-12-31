"use client"

import { db } from "@/lib/firebase"
import { collection, doc, getDoc } from "firebase/firestore";
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import RequestInfo from "@/components/requests/RequestInfo";
import { useAuth } from "@/components/context/authContext";

const RequestDetails = () => {
    const { id: requestId } = useParams()
    const { role } = useAuth();
    const [ requestData, setRequestData ] = useState(null)

    const fetchRequestData = async () => {
        const docRef = doc(collection(db, "requests"), requestId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setRequestData({ ...data, id: docSnap.id });
                console.log("Document data:", { ...data, id: docSnap.id });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error getting document:", error);
        }
    };

    useEffect(() => {
        fetchRequestData();
    }, [requestId]);

  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Request Details</h1>
        <div className="grid gap-6">
            <RequestInfo request={requestData} role={role} refetchData={fetchRequestData} />
        </div>
    </div>
  )
}

export default RequestDetails