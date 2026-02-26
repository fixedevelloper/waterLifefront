'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosServices from "../../../../lib/axios";

export default function EditCustomerPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    // 🔹 Fetch agent
    useEffect(() => {
        if (!id) return;

        async function fetchCustomers() {
            try {
                setFetching(true);
                const res = await axiosServices.get(`/api/admin/customers/${id}`);
                const agent = res.data.data;

                setName(agent.name || "");
                setEmail(agent.email || "");
                setPhone(agent.phone || "");
                setIsActive(agent.is_active ?? true);
            } catch (err: any) {
                console.error(err);
                setError("Impossible de récupérer le client");
            } finally {
                setFetching(false);
            }
        }

        fetchCustomers();
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
            await axiosServices.put(`/api/admin/customers/${id}`, {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                is_active: isActive,
            });

            router.push("/customers");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Chargement du transporteur...</div>;

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">

                <div className="card-header fw-bold">
                    Modifier le client
                </div>

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
                                <label className="form-label">
                                    Nom complet
                                </label>
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
                                <label className="form-label">
                                    Téléphone
                                </label>
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
                                <label className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Checkbox */}
                            <div className="col-12">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => setIsActive(!isActive)}
                                        id="isActiveCheck"
                                    />
                                    <label className="form-check-label" htmlFor="isActiveCheck">
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
                                        <span className="spinner-border spinner-border-sm me-2"/>
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