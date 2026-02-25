'use client'

import { useEffect, useState } from "react";
import {ApiResponse, ProductType, ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';


export default function AgentPage() {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchAgents() {
            try {
                const res = await axiosServices.get<ResponsePaginate<User>>("api/admin/agents");
                setAgents(res.data.data);
            } catch (err: any) {
                console.error("Erreur API :", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div>Chargement des agents...</div>;
    }

    return (
        <div className="tf-container">

            <h3 className='mb-10'>Listes des transporteurs</h3>
            {/* -------------------- Topbar -------------------- */}
            <div className="topbar-search d-flex align-items-center mb-3">
                <form className="form-search flex-grow-1 d-flex" onSubmit={e => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="show-search style-1 flex-grow-1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        name="name"
                        aria-required="true"
                        required
                    />
                    <button className="button-submit" type="submit">
                        <i className="icon-search-normal1"></i>
                    </button>
                </form>

                <div className="ms-3">
                    <Link href="/agents/add" className="tf-button style-2 f12-bold d-md-flex d-none">
                        <i className="icon icon-add"/> Ajouter
                    </Link>
                </div>
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
                    {filteredAgents.map((agent) => (
                        <tr key={agent.id} className="tf-table-item text-start">
                            <td className='tf-cart-checkbox'>{agent.id}</td>
                            <td>{agent.name}</td>
                            <td>{agent.email ?? "-"}</td>
                            <td>{agent.phone ?? "-"}</td>
                            <td>
                                <div className={`box-status ${
                                    agent.is_active ? "bg-YellowGreen" : "bg-LightGray"
                                } d-flex align-items-center`}>
                                    {agent.is_active && <i className="icon icon-check me-1"/>}
                                </div>
                            </td>
                            <td>
                                <Dropdown className="dropdown default">
                                    <Dropdown.Toggle variant="secondary" id={`dropdown-${agent.id}`}>
                                        <span className="icon-more"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} href={`/agents/${agent.id}/edit`}>
                                            Modifier
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} href={`/agents/cancel/${agent.id}`}>
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