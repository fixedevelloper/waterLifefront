'use client'
import React,{ useEffect, useState} from "react";
import {OrderDetailType} from "../../../types/types";
import axiosServices from "../../../lib/axios";

import { useParams } from "next/navigation";
import OrderMap from "../../../components/GoogleMapOrder";
import OrderActions from "../../../components/OrderActions";


export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderDetailType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await axiosServices.get(`/api/admin/orders/${id}`);
                setOrder(res.data.data);
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchOrder();
    }, [id]);

    if (loading) return <div className="p-4 text-center">Chargement...</div>;
    if (!order) return <div className="p-4">Commande introuvable</div>;

    const statusColor: Record<string, string> = {
        pending: "secondary",
        collector_assigned: "info",
        processing: "primary",
        delivery_assigned: "warning",
        delivered: "success",
        cancelled: "danger",
    };

    return (
        <div className="container-fluid py-4">
            <div className="row g-4">

                {/* LEFT COLUMN */}
                <div className="col-lg-8">

                    {/* HEADER */}
                    <div className="card mb-4">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-1">Commande #{order.order_number}</h4>
                                <small className="text-muted">{new Date(order.created_at).toLocaleString()}</small>
                            </div>
                            <span className={`badge bg-${statusColor[order.status]}`}>{order.tracking.status_label}</span>
                        </div>
                    </div>

                    {/* INFOS CLIENT */}
                    <div className="card mb-4">
                        <div className="card-header">Informations</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-2"><strong>Client :</strong> {order.customer?.name}</div>
                                <div className="col-md-6 mb-2"><strong>Montant :</strong> {order.total_amount.toLocaleString()} FCFA</div>
                                <div className="col-12"><strong>Adresse :</strong> {order.address?.full_address}</div>
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="card mb-4">
                        <div className="card-header">Suivi de commande</div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {order.tracking.timeline.map(step => (
                                    <li key={step.step} className={`list-group-item d-flex justify-content-between align-items-center ${step.completed ? "list-group-item-success" : ""}`}>
                                        {step.label}
                                        {step.completed && <span className="badge bg-success">✔</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ARTICLES */}
                    <div className="card mb-4">
                        <div className="card-header">Articles</div>
                        <div className="card-body p-0">
                            <table className="table table-responsive-md mb-0">
                                <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th>Collectée</th>
                                    <th>Livrée</th>
                                    <th>Prix</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items?.map(item => {
                                    const collectItem = order?.collect?.items?.find(ci => ci.product_id === item.id);
                                    const deliveryItem = order?.delivery?.items?.find(di => di.product_id === item.id);
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{collectItem?.quantity_collected ?? 0}</td>
                                            <td>{deliveryItem?.quantity_delivered ?? 0}</td>
                                            <td>{item.unit_price.toLocaleString()} FCFA</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="col-lg-4">

                    <OrderActions orderId={order.id} />

                    {/* COLLECTE */}
                    <div className="card mb-4">
                        <div className="card-header">Collecte</div>
                        <div className="card-body">
                            <p><strong>Collecteur:</strong> {order.collect?.collector?.name || '-'}</p>
                            <p><strong>Téléphone:</strong> {order.collect?.collector?.phone || '-'}</p>
                            <p><strong>Date:</strong> {order.collect?.collected_at || '-'}</p>
                            <p><strong>Status:</strong> {order.collect?.status || '-'}</p>
                        </div>
                    </div>

                    {/* LIVRAISON */}
                    <div className="card mb-4">
                        <div className="card-header">Livraison</div>
                        <div className="card-body">
                            <p><strong>Livreur:</strong> {order.delivery?.delivery_agent?.name || '-'}</p>
                            <p><strong>Téléphone:</strong> {order.delivery?.delivery_agent?.phone || '-'}</p>
                            <p><strong>Date:</strong> {order.delivery?.delivered_at || '-'}</p>
                            <p><strong>Status:</strong> {order.delivery?.status || '-'}</p>
                        </div>
                    </div>

                    {/* LOCALISATION */}
                    <div className="card mb-4">
                        <div className="card-header">Localisation 📍</div>
                        <div className="card-body p-2">
                            <OrderMap
                                lat={Number(order.address?.latitude)}
                                lng={Number(order.address?.longitude)}
                                address={order.address?.full_address}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}