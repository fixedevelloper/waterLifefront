'use client'

import { useEffect, useState } from "react";
import {Order, ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';


export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axiosServices.get<ResponsePaginate<Order>>("api/admin/orders");
                setOrders(res.data.data);
            } catch (err: any) {
                console.error("Erreur API :", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

   const filteredOrders = orders.filter(order =>
        order.order_number?.includes(search) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div>Chargement des commandes...</div>;
    }

    return (
        <div className="tf-container">
            <h3 className='mb-10'>Listes des commandes</h3>
            {/* Topbar search */}
            <div className="topbar-search mb-3">
                <form className="form-search flex-grow">
                    <fieldset className="name">
                        <input type="text" placeholder="Search" className="show-search style-1"
                               value={search}
                               onChange={e => setSearch(e.target.value)}
                               name="name"  aria-required="true" required />
                    </fieldset>
                    <div className="button-submit">
                        <button className="" type="submit"><i className="icon-search-normal1"></i></button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="table-list-transaction">
                <div className="list-transaction-head d-flex text-white fw-bold mb-2">
                    <div className="col">Commande ID</div>
                    <div className="col">Date</div>
                    <div className="col">Client</div>
                    <div className="col">Collecteur</div>
                    <div className="col">Livreur</div>
                    <div className="col">Montant</div>
                    <div className="col">Status</div>
                    <div className="col">Actions</div>
                </div>

                <table className="list-transaction-content w-100">
                    <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="tf-table-item">
                            <td>{order.order_number || order.id}</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>{order.customer.name}</td>
                            <td>{order.collector?.name || "-"}</td>
                            <td>{order.delivery_agent?.name || "-"}</td>
                            <td>{order.total_amount.toLocaleString()} FCFA</td>
                            <td>
                                <div className={`box-status ${
                                    order.status === "delivered" ? "bg-YellowGreen" :
                                        order.status === "pending" ? "bg-LightGray" :
                                            "bg-Blue"
                                } d-flex align-items-center`}>
                                    {order.status === "delivered" && <i className="icon icon-check me-1"></i>}
                                    <span>{order.status.replace("_", " ")}</span>
                                </div>
                            </td>
                            <td>
                                <Dropdown className='dropdown default'>
                                    <Dropdown.Toggle variant="secondary" id={`dropdown-${order.id}`}>
                                        <span className="icon-more"></span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} href={`/orders/${order.id}`}>
                                            Détail
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} href={`/orders/cancel/${order.id}`}>
                                            Annuler
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}