'use client'

import React, { useEffect, useState } from "react";
import {Order, ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';


export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axiosServices.get<ResponsePaginate<Order>>(
                    'api/admin/orders'
                )
                setOrders(res.data.data)
            } catch (err: any) {
                console.error('Erreur API :', err.response?.data || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const filteredOrders = orders.filter(
        (order) =>
            order.order_number?.includes(search) ||
            order.customer.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div>Chargement des commandes...</div>

    function cancelOrder() {

    }

    return (
        <>
            <div className="row page-titles mx-0">
                <div className="col-sm-6 p-md-0">
                    <div className="welcome-text">
                        <h4>Commandes!</h4>
                        <p className="mb-0">Liste des commandes</p>
                    </div>
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a href="#">Commandes</a>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher une commande..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <thead>
                                    <tr>
                                        <th className="align-middle">
                                            <div className="form-check custom-checkbox">
                                                <input type="checkbox" className="form-check-input" id="checkAll" />
                                                <label className="form-check-label" htmlFor="checkAll"></label>
                                            </div>
                                        </th>
                                        <th className="align-middle">Order</th>
                                        <th className="align-middle pr-7">Date</th>
                                        <th className="align-middle" style={{ minWidth: '12.5rem' }}>
                                            Ship To
                                        </th>
                                        <th className="align-middle text-right">Status</th>
                                        <th className="align-middle text-right">Amount</th>
                                        <th className="no-sort"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="btn-reveal-trigger">
                                            <td className="py-2">
                                                <div className="form-check custom-checkbox checkbox-success">
                                                    <input type="checkbox" className="form-check-input" id={`checkbox-${order.id}`} />
                                                    <label className="form-check-label" htmlFor={`checkbox-${order.id}`}></label>
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <a href="#">
                                                    <strong>#{order.order_number}</strong>
                                                </a>{' '}
                                                by <strong>{order.customer.name}</strong>
                                                <br />
                                                <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                                            </td>
                                            <td className="py-2">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-2">
                                                {order.address.full_address}
                                                <p className="mb-0 text-500">Via {order?.delivery_agent?.name}</p>
                                            </td>
                                            <td className="py-2 text-right">
                          <span
                              className={`badge ${
                                  order.status === 'delivered'
                                      ? 'badge-success'
                                      : order.status === 'pending'
                                      ? 'badge-warning'
                                      : 'badge-secondary'
                              }`}
                          >
                            {order.status}
                          </span>
                                            </td>
                                            <td className="py-2 text-right">${order.total_amount}</td>
                                            <td className="py-2 text-end">
                                                <Dropdown className="text-end">
                                                    <Dropdown.Toggle
                                                        as="div" // 👈 on utilise un div pour personnaliser le contenu
                                                        className="d-inline-block"
                                                        id={`orderDropdown${order.id}`}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-success sharp"
                                                            style={{ padding: "6px 10px", borderRadius: "8px" }}
                                                        >
                                                            <svg
                                                                width="20px"
                                                                height="20px"
                                                                viewBox="0 0 24 24"
                                                                version="1.1"
                                                            >
                                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                                    <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                                                    <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                                                    <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            <Link href={`/orders/${order.id}`}>
                                                                Détails
                                                            </Link>

                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={cancelOrder} className="text-danger">
                                                            Annuler
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Aucune commande trouvée.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}