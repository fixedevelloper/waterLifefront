'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosServices from "../../../../lib/axios";

export default function EditAgentPage() {
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

        async function fetchAgent() {
            try {
                setFetching(true);
                const res = await axiosServices.get(`/api/admin/agents/${id}`);
                const agent = res.data.data;

                setName(agent.user.name || "");
                setEmail(agent.user.email || "");
                setPhone(agent.user.phone || "");
                setCanCollect(agent.can_collect ?? true);
                setCanDeliver(agent.can_deliver ?? true);
                setIsActive(agent.is_active ?? true);
            } catch (err: any) {
                console.error(err);
                setError("Impossible de récupérer le transporteur");
            } finally {
                setFetching(false);
            }
        }

        fetchAgent();
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
            await axiosServices.put(`/api/admin/agents/${id}`, {
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

    if (fetching) return <div>Chargement du transporteur...</div>;

    return (
        <div className="tf-container">
            <div className="wg-box box-quick-trade mb-32">

                <div className="title fw-bold">
                    <span className='label-01'>Modifier le transporteur</span>
                </div>

                <div className="content">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="quick-trade-wrap">

                            <div className="quick-trade-list">

                                <div className="relative">
                                    <div className="f12-medium text-Primary title">
                                        Nom complet
                                    </div>
                                    <input
                                        type="text"
                                        className="quick-trade-input style-1"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="f12-medium text-Primary title">
                                        Téléphone
                                    </div>
                                    <input
                                        type="tel"
                                        className="quick-trade-input style-1"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="f12-medium text-Primary title">
                                        Email
                                    </div>
                                    <input
                                        type="email"
                                        className="quick-trade-input style-1"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="tf-cart-checkbox style-3 mb-5">
                                <div className="tf-checkbox-wrapp">
                                    <input
                                        className="checkbox-item"
                                        type="checkbox"
                                        checked={canCollect}
                                        onChange={() => setCanCollect(!canCollect)}
                                        id="isActiveCheck"
                                    />
                                    <div><i className="icon-check" /></div>
                                </div>
                                <div className="f12-medium text-GrayDark">
                                    Peut effectuer la collecte?
                                </div>
                            </div>
                            <div className="tf-cart-checkbox style-3 mb-5">
                                <div className="tf-checkbox-wrapp">
                                    <input
                                        className="checkbox-item"
                                        type="checkbox"
                                        checked={canDeliver}
                                        onChange={() => setCanDeliver(!canDeliver)}
                                        id="isActiveCheck"
                                    />
                                    <div><i className="icon-check" /></div>
                                </div>
                                <div className="f12-medium text-GrayDark">
                                    Peut effectuer les livraison?
                                </div>
                            </div>
                            <div className="tf-cart-checkbox style-3 mb-5">
                                <div className="tf-checkbox-wrapp">
                                    <input
                                        className="checkbox-item"
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => setIsActive(!isActive)}
                                        id="isActiveCheck"
                                    />
                                    <div><i className="icon-check" /></div>
                                </div>
                                <div className="f12-medium text-GrayDark">
                                    Actif
                                </div>
                            </div>
                            <div className="bottom-button">
                                <button
                                    type="submit"
                                    className="btn-buy f12-bold w-100"
                                    disabled={loading}
                                >
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