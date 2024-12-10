"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../context/authContext";

const userDetailsSchema = z.object({
  displayName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export function UserDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, fetchUserData } = useAuth();
  const { displayName, email, docId } = user;

  const userDetailsForm = useForm<z.infer<typeof userDetailsSchema>>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      displayName: displayName || "",
      email: email || "",
    },
  });

  async function onSubmitUserDetails(
    values: z.infer<typeof userDetailsSchema>
  ) {
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, "users", docId);
      await updateDoc(userDocRef, {
        displayName: values.displayName,
        email: values.email,
      });
      await fetchUserData(user); // Refetch user data
      toast({
        title: "Success",
        description: "Your details have been updated.",
      });
      userDetailsForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update details. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...userDetailsForm}>
      <form
        onSubmit={userDetailsForm.handleSubmit(onSubmitUserDetails)}
        className="space-y-4"
      >
        <FormField
          control={userDetailsForm.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={userDetailsForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => userDetailsForm.reset()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Update Details
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  async function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    setIsSubmitting(true);
    try {
      const { oldPassword, newPassword } = values;

      // Confirm old password
      const isOldPasswordCorrect = await confirmOldPassword(oldPassword);
      if (!isOldPasswordCorrect) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Old password is incorrect.",
        });
        return;
      }

      // Update to new password
      await updatePassword(newPassword);
      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmOldPassword(oldPassword: string): Promise<boolean> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated.",
      });
      return false;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error confirming old password.",
      });
      return false;
    }
  }

  async function updatePassword(newPassword: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated.",
      });
      return;
    }

    try {
      await firebaseUpdatePassword(user, newPassword);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password.",
      });
    }
  }

  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
        className="space-y-4"
      >
        <FormField
          control={passwordForm.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter old password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => passwordForm.reset()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
