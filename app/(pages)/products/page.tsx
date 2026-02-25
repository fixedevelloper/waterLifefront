'use client'

import { useEffect, useState } from "react";
import {ProductType, ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';


export default function ProductPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axiosServices.get<ResponsePaginate<ProductType>>("api/admin/products");
                setProducts(res.data.data);
            } catch (err: any) {
                console.error("Erreur API :", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div>Chargement des produits...</div>;
    }

    return (
        <div className="tf-container">
            <h3 className='mb-10'>Listes des produits</h3>
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
                    <Link href="/products/add" className="tf-button style-2 f12-bold d-md-flex d-none">
                        <i className="icon icon-add"></i> Ajouter
                    </Link>
                </div>
            </div>

            {/* -------------------- Table -------------------- */}
            <div className="table-list-transaction">
                <div className="list-transaction-head d-flex text-white fw-bold mb-2">
                    <div className="col">ID</div>
                    <div className="col">Libellé</div>
                    <div className="col">Volume</div>
                    <div className="col">Prix de base (FCFA)</div>
                    <div className="col">Status</div>
                    <div className="col">Actions</div>
                </div>

                <table className="list-transaction-content w-100">
                    <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="tf-table-item text-start">
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.volume_liters ?? "-"}</td>
                            <td>{product.base_price.toLocaleString()} FCFA</td>
                            <td>
                                <div className={`box-status ${
                                    product.is_active ? "bg-YellowGreen" : "bg-LightGray"
                                } d-flex align-items-center`}>
                                    {product.is_active && <i className="icon icon-check me-1"></i>}
                                </div>
                            </td>
                            <td>
                                <Dropdown className="dropdown default">
                                    <Dropdown.Toggle variant="secondary" id={`dropdown-${product.id}`}>
                                        <span className="icon-more"></span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} href={`/products/${product.id}/edit`}>
                                            Modifier
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} href={`/product/cancel/${product.id}`}>
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