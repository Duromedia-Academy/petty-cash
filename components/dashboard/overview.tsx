"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useAuth } from "@/components/context/authContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Overview() {
  const { user, role } = useAuth();
  const [data, setData] = useState<{ name: string; total: number; }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestCollection = collection(db, "requests");
        let q;

        if (role === "administrator") {
          q = query(requestCollection);
        } else {
          q = query(requestCollection, where("requesterId", "==", user?.uid));
        }

        const snapshot = await getDocs(q);
        const requests = snapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));

        // Get last 6 months
        const today = new Date();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          return {
            month: d.getMonth(),
            year: d.getFullYear(),
            name: d.toLocaleString("default", { month: "short" }),
          };
        });

        const monthlyData = last6Months
          .map(({ month, year, name }) => {
            const monthRequests = requests.filter((req) => {
              if (!req.createdAt) return false;
              return (
                req.createdAt.getMonth() === month &&
                req.createdAt.getFullYear() === year
              );
            });

            return {
              name,
              total: monthRequests.length,
            };
          })
          .reverse();

        setData(monthlyData as { name: string; total: number; }[]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, role]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
