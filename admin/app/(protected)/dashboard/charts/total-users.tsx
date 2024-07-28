"use client";

import { axiosInstance } from "@/lib/axios-config";
import { Users } from "lucide-react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface User {
  role: string;
}

interface UserData {
  totalUsers: number;
  clientsCount: number;
  techniciansCount: number;
}

const chartConfig = {
  count: {
    label: "Count",
  },
  clients: {
    label: "Clients",
    color: "hsl(var(--chart-1))",
  },
  technicians: {
    label: "Techniciens",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TotalUsersChart() {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/users");
        const users = response.data;

        const totalUsers = users.length;
        const clientsCount = users.filter(
          (user) => user.role === "Client"
        ).length;
        const techniciansCount = users.filter(
          (user) => user.role === "Technician"
        ).length;

        setUserData({ totalUsers, clientsCount, techniciansCount });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No data available</div>;

  const { totalUsers, clientsCount, techniciansCount } = userData;

  const chartData = [
    { userType: "clients", count: clientsCount, fill: "hsl(var(--chart-1))" },
    {
      userType: "technicians",
      count: techniciansCount,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const clientsPercentage = ((clientsCount / totalUsers) * 100).toFixed(1);
  const techniciansPercentage = ((techniciansCount / totalUsers) * 100).toFixed(
    1
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Utilisateurs</CardTitle>
        <CardDescription>Clients vs Techniciens</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="userType"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Utilisateurs
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <Users className="h-4 w-4" /> Distribution des utilisateurs
        </div>
        <div className="flex justify-between w-full">
          <span className="text-muted-foreground">
            Clients: {clientsPercentage}%
          </span>
          <span className="text-muted-foreground">
            Techniciens: {techniciansPercentage}%
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
