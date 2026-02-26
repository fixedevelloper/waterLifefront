'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosServices from "../../../lib/axios";

export default function AddProductPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [volume, setVolume] = useState<number | "">("");
    const [basePrice, setBasePrice] = useState<number | "">("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !volume || !basePrice) {
            setError("Tous les champs sont requis !");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosServices.post("/api/admin/products", {
                name,
                volume_liters: Number(volume),
                base_price: Number(basePrice),
                is_active: isActive,
            });

            // Redirection vers la page produit après ajout
            router.push("/products");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Ajouter un produit</h5>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="productName" className="form-label">
                                Nom du produit
                            </label>
                            <input
                                type="text"
                                id="productName"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="productVolume" className="form-label">
                                Volume (litres)
                            </label>
                            <input
                                type="number"
                                id="productVolume"
                                className="form-control"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                min={0}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="basePrice" className="form-label">
                                Prix de base (FCFA)
                            </label>
                            <input
                                type="number"
                                id="basePrice"
                                className="form-control"
                                value={basePrice}
                                onChange={(e) => setBasePrice(Number(e.target.value))}
                                min={0}
                                required
                            />
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isActiveCheck"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                            <label className="form-check-label" htmlFor="isActiveCheck">
                                Actif
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Ajout en cours..." : "Ajouter le produit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}