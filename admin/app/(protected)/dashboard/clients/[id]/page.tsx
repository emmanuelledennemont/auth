"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios-config";
import { Client } from "@/types/client.type";
import { Hash, Mail, Phone, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientDetails() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Client>(
          `/clients/${params.id}`
        );
        setClient(response.data);
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClient();
    }
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  if (!client)
    return (
      <div className="flex justify-center items-center h-screen">
        No client found
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100">
      {/* Global Info Section */}
      <div className="w-full lg:w-1/5 p-4 bg-white shadow-md lg:h-auto lg:overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarFallback>{client.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{client.username}</h2>
          <p className="text-sm text-gray-500">{client.role}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <Hash className="mr-2 h-4 w-4" />
            <span className="text-sm">{client._id}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span className="text-sm">{client.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <span className="text-sm">{client.phone}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:h-screen lg:overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Client Information</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>
                    {client.firstname} {client.lastname}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Card */}
          <Card>
            <CardHeader>
              <CardTitle>Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              {client.favorites.length > 0 ? (
                <ul className="list-disc pl-5">
                  {client.favorites.map((favorite, index) => (
                    <li key={index}>{favorite}</li>
                  ))}
                </ul>
              ) : (
                <p>No favorites added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Repair List Card */}
          <Card>
            <CardHeader>
              <CardTitle>Repair List</CardTitle>
            </CardHeader>
            <CardContent>
              {client.repairList.length > 0 ? (
                <ul className="list-disc pl-5">
                  {client.repairList.map((repair, index) => (
                    <li key={index}>{repair}</li>
                  ))}
                </ul>
              ) : (
                <p>No repairs in the list.</p>
              )}
            </CardContent>
          </Card>

          {/* Savings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Savings</CardTitle>
            </CardHeader>
            <CardContent>
              {client.saving.length > 0 ? (
                <ul className="list-disc pl-5">
                  {client.saving.map((save, index) => (
                    <li key={index}>{JSON.stringify(save)}</li>
                  ))}
                </ul>
              ) : (
                <p>No savings recorded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
