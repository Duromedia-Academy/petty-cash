"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestList from "@/components/requests/RequestList";
import { RequestDialog } from "@/components/requests/request-dialog";
import { RequestFilters } from "@/components/requests/request-filters";

export default function RequestsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Petty Cash Requests</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
      <RequestFilters />
      <RequestList />
      <RequestDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}