import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentRequests = [
  {
    id: "1",
    requester: "Alice Smith",
    amount: 150,
    purpose: "Office Supplies",
    status: "pending",
  },
  {
    id: "2",
    requester: "Bob Johnson",
    amount: 75,
    purpose: "Team Lunch",
    status: "approved",
  },
  {
    id: "3",
    requester: "Carol Williams",
    amount: 200,
    purpose: "Travel Expenses",
    status: "rejected",
  },
];

export function RecentRequests() {
  return (
    <div className="space-y-8">
      {recentRequests.map((request) => (
        <div key={request.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {request.requester
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{request.requester}</p>
            <p className="text-sm text-muted-foreground">{request.purpose}</p>
          </div>
          <div className="ml-auto font-medium">
            ${request.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}