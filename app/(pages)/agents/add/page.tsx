'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosServices from "../../../lib/axios";

export default function AddAgentPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isActive, setIsActive] = useState(true);
    const [canCollect, setCanCollect] = useState(true);
    const [canDeliver, setCanDeliver] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // ✅ Validation simple
        if (!name.trim() || !phone.trim() || !email.trim()) {
            setError("Tous les champs sont requis !");
            return;
        }

        setLoading(true);
        try {
            await axiosServices.post("/api/admin/agents", {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                is_active: isActive,
                can_collect:canCollect,
                can_deliver:canDeliver
            });

            // 🔹 Redirection après ajout
            router.push("/agents");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">

                <div className="card-header fw-bold">
                    Ajouter un transporteur
                </div>

                <div className="card-body">

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* Nom */}
                            <div className="col-md-4">
                                <label className="form-label">Nom complet</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nom du transporteur"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Téléphone */}
                            <div className="col-md-4">
                                <label className="form-label">Téléphone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Ex: 699123456"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-4">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="email@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                        </div>

                        {/* CHECKBOXES */}
                        <div className="mt-4">

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={canCollect}
                                    onChange={() => setCanCollect(!canCollect)}
                                    id="canCollect"
                                />
                                <label className="form-check-label" htmlFor="canCollect">
                                    Peut effectuer la collecte ?
                                </label>
                            </div>

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={canDeliver}
                                    onChange={() => setCanDeliver(!canDeliver)}
                                    id="canDeliver"
                                />
                                <label className="form-check-label" htmlFor="canDeliver">
                                    Peut effectuer la livraison ?
                                </label>
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                    id="isActive"
                                />
                                <label className="form-check-label" htmlFor="isActive">
                                    Actif
                                </label>
                            </div>

                        </div>

                        {/* BUTTON */}
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Ajout en cours..." : "Ajouter le transporteur"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}