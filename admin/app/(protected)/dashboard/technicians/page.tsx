"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Technician } from "@/types/technician.type";
import { ChevronDown, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function TechnicianTable() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axiosInstance.get("/technicians");
        setTechnicians(response.data);
        setLoading(false);
      } catch (error) {
        setError("Échec de la récupération des techniciens");
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const matchesSearch =
        technician.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technician.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity =
        cityFilter.length === 0 ||
        (technician.address?.city &&
          cityFilter.includes(technician.address.city));
      const matchesCategory =
        categoryFilter.length === 0 ||
        technician.categories.some((cat) => categoryFilter.includes(cat.name));
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [technicians, searchTerm, cityFilter, categoryFilter]);

  const uniqueCities = useMemo(() => {
    return Array.from(
      new Set(
        technicians
          .map((t) => t.address?.city)
          .filter((city): city is string => Boolean(city))
      )
    );
  }, [technicians]);

  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(technicians.flatMap((t) => t.categories.map((cat) => cat.name)))
    );
  }, [technicians]);

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
    setCityFilter([]);
    setCategoryFilter([]);
  };

  const isFiltersApplied =
    searchTerm !== "" || cityFilter.length > 0 || categoryFilter.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Rechercher un technicien..."
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
              <Button variant="outline">
                Ville <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueCities.map((city) => (
                <DropdownMenuCheckboxItem
                  key={city}
                  checked={cityFilter.includes(city)}
                  onCheckedChange={(checked) =>
                    setCityFilter(
                      checked
                        ? [...cityFilter, city]
                        : cityFilter.filter((c) => c !== city)
                    )
                  }
                >
                  {city}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Catégorie <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={categoryFilter.includes(category)}
                  onCheckedChange={(checked) =>
                    setCategoryFilter(
                      checked
                        ? [...categoryFilter, category]
                        : categoryFilter.filter((c) => c !== category)
                    )
                  }
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Catégories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTechnicians.map((technician) => (
            <TableRow
              key={technician._id}
              className="cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/technicians/${technician._id}`)
              }
            >
              <TableCell className="font-medium">
                {technician.username}
              </TableCell>
              <TableCell>{technician.email}</TableCell>
              <TableCell>{technician.address?.city || "N/A"}</TableCell>
              <TableCell>
                {technician.rating.score.toFixed(1)} (
                {technician.rating.reviews} avis)
              </TableCell>
              <TableCell>
                {technician.categories.map((cat) => cat.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
