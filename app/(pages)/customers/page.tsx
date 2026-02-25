"use client";

import { useEffect, useState } from "react";
import {ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";

export default function CustomerPage() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const res = await axiosServices.get<ResponsePaginate<User>>("api/admin/customers");
                setCustomers(res.data.data);
            } catch (err: any) {
                console.error("Erreur API :", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) =>
        customer.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Chargement des clients...</div>;

   // console.log(filteredCustomers)
    return (
        <div className="tf-container">
            <h3 className='mb-10'>Listes des clients</h3>
            {/* -------------------- Topbar -------------------- */}
            <div className="topbar-search d-flex align-items-center mb-3">
                <form className="form-search flex-grow-1 d-flex" onSubmit={e => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Rechercher un client"
                        className="show-search style-1 flex-grow-1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        name="search"
                    />
                    <button className="button-submit" type="submit">
                        <i className="icon-search-normal1"></i>
                    </button>
                </form>
            </div>

            {/* -------------------- Table -------------------- */}
            <div className="table-list-transaction">
                <div className="list-transaction-head d-flex text-white fw-bold mb-2">
                    <div className="col">ID</div>
                    <div className="col">Nom complet</div>
                    <div className="col">Email</div>
                    <div className="col">Téléphone</div>
                    <div className="col">Status</div>
                    <div className="col">Actions</div>
                </div>

                <table className="list-transaction-content w-100">
                    <tbody>
                    {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="tf-table-item text-start">
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email ?? "-"}</td>
                            <td>{customer.phone ?? "-"}</td>
                            <td>
                                <div className={`box-status ${
                                    customer.is_active ? "bg-YellowGreen" : "bg-LightGray"
                                } d-flex align-items-center`}>
                                    {customer.is_active && <i className="icon icon-check me-1"/>}
                                </div>
                            </td>
                            <td>
                                <Dropdown className="dropdown default">
                                    <Dropdown.Toggle variant="secondary" id={`dropdown-${customer.id}`}>
                                        <span className="icon-more"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} href={`/customers/${customer.id}/edit`}>
                                            Modifier
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} href={`/customers/cancel/${customer.id}`}>
                                            Supprimer
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