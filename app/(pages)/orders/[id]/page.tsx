'use client'
import React,{ useEffect, useState} from "react";
import {Badge, Button, Dropdown} from "react-bootstrap";
import {OrderDetailType} from "../../../types/types";
import axiosServices from "../../../lib/axios";

import { useParams } from "next/navigation";
import OrderMap from "../../../components/GoogleMapOrder";
import OrderActions from "../../../components/OrderActions";


export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id;

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

    if (loading) return <div className="p-4">Chargement...</div>;
    if (!order) return <div className="p-4">Commande introuvable</div>;

    const statusColor = {
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

                {/* ================= LEFT ================= */}
                <div className="col-lg-8">

                    {/* CARD HEADER */}
                    <div className="wg-box gap16 mb-5">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-1">
                                    Commande #{order.order_number}
                                </h4>
                                <small className="text-muted label-02">
                                    {new Date(order.created_at).toLocaleString()}
                                </small>
                            </div>

                            <Badge className="mb-3 label-01" bg={statusColor[order.status]}>
                                {order.tracking.status_label}
                            </Badge>
                        </div>
                    </div>

                    {/* INFOS */}
                    <div className="wg-box style-1 bg-Gainsboro shadow-none widget-tabs mb-32">
                        <div className="card-body">
                            <h5 className="mb-3 title">Informations</h5>

                            <div className="row">
                                <div className="col-md-6 mb-2 label-01">
                                    <strong>Client :</strong> {order.customer?.name}
                                </div>
                                <div className="col-md-6 mb-2 label-01">
                                    <strong>Montant :</strong>{" "}
                                    {order.total_amount.toLocaleString()} FCFA
                                </div>
                                <div className="col-12 label-01">
                                    <strong>Adresse :</strong>{" "}
                                    {order.address?.full_address}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div  className="wg-box gap16 mt-4">
                        <div className="card-body">
                            <h5 className="mb-4">Suivi de commande</h5>

                            <div className="timeline">
                                {order.tracking.timeline.map((step) => (
                                    <div
                                        key={step.step}
                                        className={`timeline-item ${
                                            step.completed ? "done" : ""
                                        }`}
                                    >
                                        <div className="timeline-icon">
                                            {step.completed ? "✔" : ""}
                                        </div>
                                        <div className="timeline-content">
                                            {step.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ARTICLES */}
                    <div className="wg-box gap16 mt-4">
                        <div className="card-body">
                            <h5 className="mb-3">Articles</h5>

                            <table className="table align-middle label-02">
                                <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th>Quantité collectée</th>
                                    <th>Quantité livrée</th>
                                    <th>Prix</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items?.map((item) => {
                                    // 🔹 Cherche l'item correspondant dans collect et delivery
                                    const collectItem = order?.collect?.items?.find(
                                        (ci) => ci.product_id === item.id
                                    );
                                    const deliveryItem = order?.delivery?.items?.find(
                                        (di) => di.product_id === item.id
                                    );

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

                {/* ================= RIGHT ================= */}
                <div className="col-lg-4">

                    <OrderActions orderId={order.id} />
                    <div className="wg-box style-1 gap16 mb-5">
                        <h5 className="mb-3 title">Collete</h5>
                        <h5 className="mb-3 label-01">Collecteur: {order.collect?.collector?.name}</h5>
                        <h5 className="mb-3 label-01">Telephone: {order.collect?.collector?.phone}</h5>
                        <h5 className="mb-3 label-01">Date: {order.collect?.collected_at}</h5>
                        <p className="mb-3 label-01">Status: {order.collect?.status || '-'}</p>
                    </div>
                    <div className="wg-box style-1 gap16 mb-5">
                        <h5 className="mb-3 title">Livraison</h5>
                        <h5 className="mb-3 label-01">Livreur: {order.delivery?.delivery_agent?.name}</h5>
                        <h5 className="mb-3 label-01">Telephone: {order.delivery?.delivery_agent?.phone}</h5>
                        <h5 className="mb-3 label-01">Date: {order.delivery?.delivered_at}</h5>
                        <p className="mb-3 label-01">Status: {order.delivery?.status || '-'}</p>
                    </div>

                </div>
                <div className="wg-box style-1 gap16 mb-5">
                    <div className="label-01">
                        📍 Localisation
                    </div>
                    <div className="p-2">
                        <OrderMap
                            lat={Number(order.address?.latitude)}
                            lng={Number(order.address?.longitude)}
                            address={order.address?.full_address}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}