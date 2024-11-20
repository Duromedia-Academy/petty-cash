import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UserEditDialog from "./UserEditDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Image from "next/image";
// import { User } from "@/types/index";

interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: string;
  photoURL: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch users from an API or use mock data

    const getUsers = async () => {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection);

      const unsubscribe = await onSnapshot(q, (snapshot) => {
        const users: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(users);
      });
    };

    getUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex gap-5">
            <Avatar className="h-10 w-10 self-center">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width="50"
                  height="50"
                />
              ) : (
                <AvatarFallback>
                  {user.displayName
                    ? user.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : ""}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <p className="text-lg font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleEdit(user)}>
            Edit
          </Button>
        </div>
      ))}
      <UserEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default UserList;
