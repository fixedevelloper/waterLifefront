'use client'
import React, {useEffect, useState} from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import axiosServices from "../../lib/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Customer {
    id: number;
    full_name: string;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
}
interface OrderStats {
    month: string;
    total: number;
}
export default function Dashboard() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderStats, setOrderStats] = useState<OrderStats[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [customersRes, ordersRes] = await Promise.all([
                    axiosServices.get("/api/admin/customers?limit=5"),
                    axiosServices.get("/api/admin/orders?limit=5"),
                ]);

                setCustomers(customersRes.data.data);
                setOrders(ordersRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchOrderStats() {
            try {
                const res = await axiosServices.get("/api/admin/orders-stats");
                // Ex: [{ month: 'Jan', total: 12 }, { month: 'Feb', total: 18 }, ...]
                setOrderStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrderStats();
    }, []);

    const chartData = {
        labels: orderStats.map((stat) => stat.month),
        datasets: [
            {
                label: "Commandes par mois",
                data: orderStats.map((stat) => stat.total),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };
    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Tableau de bord</h1>

            {/* ================= CARDS ================= */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm">
                        <h5>Total Clients</h5>
                        <p className="fs-4 fw-bold">{customers.length}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm">
                        <h5>Total Commandes</h5>
                        <p className="fs-4 fw-bold">{orders.length}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm">
                        <h5>Commandes Livrées</h5>
                        <p className="fs-4 fw-bold">
                            {orders.filter((o) => o.status === "delivered").length}
                        </p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm">
                        <h5>Commandes en attente</h5>
                        <p className="fs-4 fw-bold">
                            {orders.filter((o) => o.status !== "delivered").length}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= CHART ================= */}
            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="card p-3 shadow-sm">
                        <h5 className="mb-3">Commandes par mois</h5>
                        <Bar data={chartData} />
                    </div>
                </div>
            </div>

            {/* ================= DERNIÈRES COMMANDES ================= */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm p-3">
                        <h5 className="mb-3">Dernières commandes</h5>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Montant</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.order_number}</td>
                                        <td>{order.total_amount.toLocaleString()} FCFA</td>
                                        <td>{order.status}</td>
                                        <td>
                                            {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}