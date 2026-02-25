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
        <div className="tf-container">
            <div className="wg-box box-quick-trade mb-32">
                <div className="title fw-bold"><span className='label-01'>Ajouter un produit</span></div>
                <div className="content">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}
                    <form onSubmit={handleSubmit}>

                        <div className="quick-trade-wrap">
                            <div className="quick-trade-list">
                                <div className="relative">
                                    <div className="f12-medium text-Primary title">Nom du produit</div>
                                    <input type="text" placeholder="" className="quick-trade-input style-1"
                                           value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           required aria-required="true"/>
                                </div>
                                <div className="relative">
                                    <div className="f12-medium text-Primary title">Volume (litres)</div>
                                    <input type="text" placeholder="" className="quick-trade-input style-1"
                                           value={volume}
                                           onChange={(e) => setVolume(Number(e.target.value))}
                                           required
                                           min={0}
                                           aria-required="true"/>
                                </div>
                                <div className="relative">
                                    <div className="f12-medium text-Primary title">Prix de base (FCFA)</div>
                                    <input type="text" placeholder="" className="quick-trade-input style-1"
                                           value={basePrice}
                                           onChange={(e) => setBasePrice(Number(e.target.value))}
                                           required
                                           min={0}
                                           aria-required="true"/>
                                </div>
                            </div>
                            <div className="tf-cart-checkbox style-3 mb-5">
                                <div className="tf-checkbox-wrapp">
                                    <input className="checkbox-item" type="checkbox" name="transaction_checkbox"
                                           checked={isActive}
                                           onChange={() => setIsActive(!isActive)}
                                           id="isActiveCheck"
                                    />
                                    <div>
                                        <i className="icon-check"/>
                                    </div>
                                </div>
                                <div className="f12-medium text-GrayDark">
                                    Actif
                                </div>
                            </div>
                            <div className="bottom-button">
                                <button type="submit" className="btn-buy f12-bold w-100" disabled={loading}>
                                    {loading ? "Ajout en cours..." : "Ajouter le produit"}
                                </button>
                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}