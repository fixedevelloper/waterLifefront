"use client";

import React, { useEffect, useState } from "react";
import {ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import {formatDate} from "../../utils/hook";


export default function CustomerPage() {
    const [customers, setCustomers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const res = await axiosServices.get<ResponsePaginate<User>>(
                    'api/admin/customers'
                )
                setCustomers(res.data.data)
            } catch (err: any) {
                console.error('Erreur API :', err.response?.data || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    const filteredCustomers = customers.filter((customer) =>
        customer.name?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div>Chargement des clients...</div>

    function cancelCustomer() {

    }

    return (
        <>
            <div className="row page-titles mx-0">
                <div className="col-sm-6 p-md-0">
                    <div className="welcome-text">
                        <h4>Clients!</h4>
                        <p className="mb-0">Liste des clients</p>
                    </div>
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a href="#">Customers</a>
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
                                    placeholder="Rechercher un client..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="table-responsive">
                                <table className="table table-sm mb-0 table-striped student-tbl">
                                    <thead>
                                    <tr>
                                        <th className="pe-3">
                                            <div className="form-check custom-checkbox mx-2">
                                                <input type="checkbox" className="form-check-input" id="checkAll" />
                                                <label className="form-check-label"></label>
                                            </div>
                                        </th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th className="ps-5" style={{ minWidth: '200px' }}>
                                            Billing Address
                                        </th>
                                        <th>Joined</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="btn-reveal-trigger">
                                            <td className="py-2">
                                                <div className="form-check custom-checkbox mx-2">
                                                    <input type="checkbox" className="form-check-input" />
                                                    <label className="form-check-label"></label>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <a href="#">
                                                    <div className="media d-flex align-items-center">
                                                        <div className="avatar avatar-xl me-2">
                                                            <div>
                                                                <img
                                                                    className="rounded-circle img-fluid"
                                                                    src={customer.avatar || '/images/avatar/default.png'}
                                                                    width={30}
                                                                    alt={customer.name}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <h5 className="mb-0 fs--1">{customer.name}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </td>
                                            <td className="py-2">
                                                <a href={`mailto:${customer.email}`}>{customer.email}</a>
                                            </td>
                                            <td className="py-2">
                                                <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                                            </td>
                                            <td className="py-2 ps-5">{customer.billingAddress}</td>
                                            <td className="py-2 ps-5">{formatDate(customer.created_at)}</td>
                                            <td className="py-2 text-end">
                                                <Dropdown className="text-end">
                                                    <Dropdown.Toggle
                                                        as="div" // 👈 on utilise un div pour personnaliser le contenu
                                                        className="d-inline-block"
                                                        id={`orderDropdown${customer.id}`}
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
                                                            <Link href={`/customers/${customer.id}/edit`}>
                                                                Modifier
                                                            </Link>

                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={cancelCustomer} className="text-danger">
                                                            Annuler
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Aucun client trouvé.
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