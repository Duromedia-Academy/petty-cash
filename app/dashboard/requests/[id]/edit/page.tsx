"use client"

import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RequestForm } from "@/components/requests/request-form";

const EditRequest = () => {
    const { id: requestId } = useParams()
    const [ requestData, setRequestData ] = useState(null)

    useEffect(() => {
        const fetchRequestData = async () => {
            const docRef = doc(db, "requests", requestId);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setRequestData({ ...data, id: docSnap.id });
                    console.log("Document data:", docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Error getting document:", error);
            }
        };

        fetchRequestData();
    }, [requestId]);

  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Edit Request</h1>
        <div className="grid gap-6">
            {requestData && <RequestForm defaultValues={requestData} requestId={requestData.id} />}
        </div>
    </div>
  )
}

export default EditRequest