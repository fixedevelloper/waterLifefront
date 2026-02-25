"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function Settings() {
    const router = useRouter();

    const items = [
        {
            icon: "icon-mouse-square",
            title: "Coordonnées GPS Forage",
            description: "Used for withdrawal & Security verification",
            actionText: "Modifier",
            actionType: "gps",
        },
        {
            icon: "icon-login",
            title: "Login Password",
            description: "Used for withdrawal & Security verification",
            actionText: "Reset",
            actionType: "password",
        },
    ];

    const [gpsPosition, setGpsPosition] = useState({ lat: 3.848, lng: 11.502 });
    const [showMap, setShowMap] = useState(false);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const handleAction = (type: string) => {
        if (type === "gps") {
            setShowMap(true);
        } else if (type === "password") {
            router.push("/settings/password"); // page reset mot de passe
        }
    };

    return (
        <div className="account-security-item d-block mb-24">
            <h3 className='mb-10'>Parametrages</h3>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="content-item mb-24 d-flex align-items-center justify-content-between"
                >
                    <div className="d-flex align-items-center flex-grow">
                        <div className="icon flex-shrink-0 me-3">
                            <i className={item.icon}></i>
                        </div>
                        <div>
                            <div className="mb-1 f12-bold">{item.title}</div>
                            <div className="f12-regular text-GrayDark">{item.description}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleAction(item.actionType)}
                        className="flex-shrink-0 f12-medium btn btn-link"
                    >
                        {item.actionText}
                    </button>
                </div>
            ))}

            {/* MAP MODAL */}
            {showMap && isLoaded && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                     style={{ background: "rgba(0,0,0,0.5)", zIndex: 1000 }}>
                    <div className="bg-white p-3 rounded" style={{ width: "80%", height: "80%" }}>
                        <h5>Déplacez le marker pour définir la position GPS</h5>
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "90%" }}
                            center={gpsPosition}
                            zoom={15}
                        >
                            <Marker
                                position={gpsPosition}
                                draggable
                                onDragEnd={(e) =>
                                    setGpsPosition({ lat: e.latLng?.lat()!, lng: e.latLng?.lng()! })
                                }
                            />
                        </GoogleMap>
                        <div className="mt-2 d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowMap(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    console.log("Nouvelle position GPS:", gpsPosition);
                                    setShowMap(false);
                                    // Ici tu peux appeler ton API pour sauvegarder la position
                                }}
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}