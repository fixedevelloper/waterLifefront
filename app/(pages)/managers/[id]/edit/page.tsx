'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosServices from "../../../../lib/axios";

export default function EditManagerPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [canCollect, setCanCollect] = useState(true);
    const [canDeliver, setCanDeliver] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    // 🔹 Fetch agent
    useEffect(() => {
        if (!id) return;

        async function fetchManager() {
            try {
                setFetching(true);
                const res = await axiosServices.get(`/api/admin/managers/${id}`);
                const agent = res.data.data;

                setName(agent.user.name || "");
                setEmail(agent.user.email || "");
                setPhone(agent.user.phone || "");
                setCanCollect(agent.can_collect ?? true);
                setCanDeliver(agent.can_deliver ?? true);
                setIsActive(agent.is_active ?? true);
            } catch (err: any) {
                console.error(err);
                setError("Impossible de récupérer le gestionaire");
            } finally {
                setFetching(false);
            }
        }

        fetchManager();
    }, [id]);

    // 🔹 Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !email.trim() || !phone.trim()) {
            setError("Tous les champs sont requis !");
            return;
        }

        setLoading(true);
        try {
            await axiosServices.put(`/api/admin/managers/${id}`, {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                is_active: isActive,
                can_collect:canCollect,
                can_deliver:canDeliver
            });

            router.push("/agents");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Chargement du Gestionnaire...</div>;

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">

                {/* Header */}
                <div className="card-header fw-bold">
                    Modifier le gestionnaire
                </div>

                {/* Body */}
                <div className="card-body">

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            {/* Nom */}
                            <div className="col-md-6">
                                <label className="form-label">Nom complet</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Téléphone */}
                            <div className="col-md-6">
                                <label className="form-label">Téléphone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-12">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Statut */}
                            <div className="col-12">
                                <div className="form-check form-switch">
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

                            {/* Bouton */}
                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    )}
                                    {loading ? "Modification..." : "Mettre à jour"}
                                </button>
                            </div>

                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}