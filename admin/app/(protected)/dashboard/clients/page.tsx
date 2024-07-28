"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios-config";
import { Client } from "@/types/client.type";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get("/clients");
        setClients(response.data);
        setLoading(false);
      } catch (error) {
        setError("Échec de la récupération des clients");
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // const filteredClients = useMemo(() => {
  //   return clients.filter((client) => {
  //     const matchesSearch =
  //       client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       client.email.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesRole =
  //       roleFilter.length === 0 || roleFilter.includes(client.role);
  //     return matchesSearch && matchesRole;
  //   });
  // }, [clients, searchTerm, roleFilter]);

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.role)));
  }, [clients]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const clearAllFilters = () => {
    setSearchTerm("");
    setRoleFilter([]);
  };

  const isFiltersApplied = searchTerm !== "" || roleFilter.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex space-x-2">
          {isFiltersApplied && (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Effacer les filtres
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button variant="outline">
                Rôle <ChevronDown className="ml-2 h-4 w-4" />
              </Button> */}
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent>
              {uniqueRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={roleFilter.includes(role)}
                  onCheckedChange={(checked) =>
                    setRoleFilter(
                      checked
                        ? [...roleFilter, role]
                        : roleFilter.filter((r) => r !== role)
                    )
                  }
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Téléphone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client._id}
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/clients/${client._id}`)}
            >
              <TableCell className="font-medium">{client.username}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.firstname}</TableCell>
              <TableCell>{client.lastname}</TableCell>
              <TableCell>{client.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
