'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosServices from "../../../../lib/axios";

type EditProductPageProps = {};

export default function EditProductPage(props: EditProductPageProps) {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState("");
    const [volume, setVolume] = useState<number | "">("");
    const [basePrice, setBasePrice] = useState<number | "">("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    // Récupération du produit si on est en mode édition
    useEffect(() => {
        if (!id) return;

        async function fetchProduct() {
            try {
                setFetching(true);
                const res = await axiosServices.get(`/api/admin/products/${id}`);
                const product = res.data.data;
                setName(product.name);
                setVolume(product.volume_liters);
                setBasePrice(product.base_price);
                setIsActive(product.is_active);
            } catch (err: any) {
                console.error(err);
                setError("Impossible de récupérer le produit");
            } finally {
                setFetching(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !volume || !basePrice) {
            setError("Tous les champs sont requis !");
            return;
        }

        setLoading(true);
        try {
            if (id) {
                // EDIT
                await axiosServices.put(`/api/admin/products/${id}`, {
                    name,
                    volume_liters: Number(volume),
                    base_price: Number(basePrice),
                    is_active: isActive,
                });
            } else {
                // ADD
                await axiosServices.post("/api/admin/products", {
                    name,
                    volume_liters: Number(volume),
                    base_price: Number(basePrice),
                    is_active: isActive,
                });
            }

            router.push("/products");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Chargement du produit...</div>;

    return (
        <div className="container-fluid mt-4">
            <div className="card">
                <div className="card-header">
                    <h5>{id ? "Modifier le produit" : "Ajouter un produit"}</h5>
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
                            {loading
                                ? id
                                    ? "Modification en cours..."
                                    : "Ajout en cours..."
                                : id
                                    ? "Modifier le produit"
                                    : "Ajouter le produit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}