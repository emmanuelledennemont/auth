"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios-config";
import { Technician } from "@/types/technician.type";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export const RecentTechnicianCard = ({}) => {
  const router = useRouter();

  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axiosInstance.get("/technicians");
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Technicians</CardTitle>
          <CardDescription>
            Recent technicians who have joined the platform
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="dashboard/technicians">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden xl:table-cell">Status</TableHead>
              <TableHead className="hidden xl:table-cell">
                Date Joined
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicians.map((technician) => (
              <TableRow
                key={technician._id}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/dashboard/technicians/${technician._id}`);
                }}
              >
                <TableCell>
                  <div className="font-medium">{technician.username}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {technician.email}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge className="text-xs">Approved</Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {new Date(technician.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
