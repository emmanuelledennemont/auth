"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios-config";
import { Technician } from "@/types/technician.type";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { Building, Clock, Hash, Mail, MapPin, Phone, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 0,
  lng: 0,
};

export default function TechnicianDetails() {
  const params = useParams();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Technician>(
          `/technicians/${params.id}`
        );
        setTechnician(response.data);
      } catch (error) {
        console.error("Error fetching technician:", error);
        setError("Failed to fetch technician details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTechnician();
    }
  }, [params.id]);

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (result !== null && status === "OK") {
        setDirections(result);
        const route = result.routes[0].legs[0];
        if (route && route.duration) {
          setTravelTime(route.duration.text);
        }
      } else {
        console.error("Directions request failed");
      }
    },
    []
  );

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
  if (!technician)
    return (
      <div className="flex justify-center items-center h-screen">
        No technician found
      </div>
    );

  const destination = {
    lat: technician.address.coordinates.coordinates[1],
    lng: technician.address.coordinates.coordinates[0],
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100">
      {/* Global Info Section */}
      <div className="w-full lg:w-1/5 p-4 bg-white shadow-md lg:h-auto lg:overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage
              src={technician.profileImage}
              alt={technician.username}
            />
          </Avatar>
          <h2 className="text-xl font-semibold">{technician.username}</h2>
          <p className="text-sm text-gray-500">{technician.role}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <Hash className="mr-2 h-4 w-4" />
            <span className="text-sm">{technician._id}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span className="text-sm">{technician.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <span className="text-sm">{technician.phone}</span>
          </div>
          <div className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            <span className="text-sm">{technician.sirene}</span>
          </div>

          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold">
              {technician.rating.score.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({technician.rating.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:h-screen lg:overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Technician Infos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address Card */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>{technician.address.addressLine}</p>
                  <p>{technician.address.addressLine2}</p>
                  <p>
                    {technician.address.city}, {technician.address.state}{" "}
                    {technician.address.zip}
                  </p>
                  <p>{technician.address.country}</p>
                  <div className="mt-2 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>
                      {technician.address.coordinates.coordinates.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="h-[400px]">
                  <LoadScript
                    googleMapsApiKey={
                      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                    }
                  >
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={destination}
                      zoom={10}
                    >
                      <Marker position={destination} />
                      {center.lat !== 0 && (
                        <>
                          <Marker position={center} />
                          <DirectionsService
                            options={{
                              destination: destination,
                              origin: center,
                              travelMode: google.maps.TravelMode.DRIVING,
                            }}
                            callback={directionsCallback}
                          />
                        </>
                      )}
                      {directions && (
                        <DirectionsRenderer
                          options={{ directions: directions }}
                        />
                      )}
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
              {travelTime && (
                <p className="mt-4">Estimated travel time: {travelTime}</p>
              )}
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technician.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opening Hours Card */}
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent>
              {technician.openingHours.map((hours, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{hours.day}</span>
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {hours.open} - {hours.close}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bio Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{technician.bio}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
