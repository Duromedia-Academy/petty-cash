"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../context/authContext";
import { redirect } from "next/navigation";
import { X } from "lucide-react";

const itemSchema = z.object({
  details: z.string().min(1, "Details are required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Unit price must be at least 0.01"),
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
});

const paymentScheduleSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  plantCode: z.string().min(1, "Plant code is required"),
});

const formSchema = z.object({
  department: z.string().min(1, "Department is required"),
  purpose: z.string().min(3, "Purpose must be at least 3 characters"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0.01, "Total amount must be at least 0.01"),
  amountInWords: z.string().min(1, "Amount in words is required"),
  paymentSchedule: paymentScheduleSchema,
  notes: z.string().optional(),
});

const handleRequestCreation = async (data: {
  department: string;
  purpose: string;
  items: Array<{
    sn: string;
    details: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  totalAmount: number;
  amountInWords: string;
  paymentSchedule: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    plantCode: string;
  };
  notes?: string;
  uid: string;
  displayName: string;
}) => {
  const { department, purpose, items, totalAmount, amountInWords, paymentSchedule, notes, uid, displayName } = data;
  const requestCollection = collection(db, "requests");
  await addDoc(requestCollection, {
    department,
    purpose,
    items,
    totalAmount,
    amountInWords,
    paymentSchedule,
    notes,
    status: "pending",
    requesterId: uid,
    requesterName: displayName,
    createdAt: serverTimestamp(),
  });
};

export function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      purpose: "",
      items: [{ details: "", quantity: 1, unitPrice: 0.01, amount: 0.01 }],
      totalAmount: 0.01,
      amountInWords: "",
      paymentSchedule: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        plantCode: "",
      },
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (user) {
        const { uid, displayName } = user;
        await handleRequestCreation({ ...values, uid, displayName });
        console.log("Request submitted", user);
        toast({
          title: "Success",
          description: "Your request has been submitted.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not authenticated.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      redirect("/dashboard/requests");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requesting Department</FormLabel>
              <FormControl>
                <Input placeholder="Enter department" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose of Request</FormLabel>
              <FormControl>
                <Input placeholder="Enter purpose" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2 space-y-2">
          <FormLabel className="text-xl font-semibold">Items</FormLabel>
          <div className="space-y-2 divide-y divide-dashed">
            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-3 py-2 items-center">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`items.${index}.details`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter quantity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Enter unit price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="outline" onClick={() => remove(index)} className="text-red-500 self-end justify-self-end">
                  <X size={22} />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" onClick={() => append({ details: "", quantity: 1, unitPrice: 0.01, amount: 0.01 })}>
            Add Item
          </Button>
        </div>
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amountInWords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount in Words</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount in words" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2 space-y-2">
          <FormLabel className="text-xl font-semibold">Purchase Schedule</FormLabel>
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="paymentSchedule.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentSchedule.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentSchedule.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentSchedule.plantCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plant code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any additional details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Submit Request
          </Button>
        </div>
      </form>
    </Form>
  );
}