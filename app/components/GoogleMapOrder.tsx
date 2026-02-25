
"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type Props = {
    lat: number;
    lng: number;
    address?: string;
};

export default function OrderMap({ lat, lng, address }: Props) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });

    if (!isLoaded) return <div>Chargement de la carte...</div>;

    return (
        <GoogleMap
            center={{ lat, lng }}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "400px" }}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
            }}
        >
            <Marker position={{ lat, lng }} title={address} />
        </GoogleMap>
    );
}