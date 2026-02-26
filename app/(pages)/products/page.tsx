'use client'

import React, {useEffect, useState} from "react";
import {ProductType, ResponsePaginate, User} from "../../types/types";
import axiosServices from "../../lib/axios";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';

export default function ProductPage() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axiosServices.get<ResponsePaginate<ProductType>>(
                    'api/admin/products'
                )
                setProducts(res.data.data)
            } catch (err: any) {
                console.error('Erreur API :', err.response?.data || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div>Chargement des produits...</div>

    function cancelOrder() {

    }

    return (
        <>
            <div className="row page-titles mx-0">
                <div className="col-sm-6 p-md-0">
                    <div className="welcome-text">
                        <h4>Produits!</h4>
                        <p className="mb-0">Liste des produits</p>
                    </div>
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a href="#">Produits</a>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Rechercher un produit..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <Link className="btn btn-primary" href="/products/add">
                                 Ajouter un produit
                                </Link>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-sm mb-0 table-striped student-tbl">
                                    <thead>
                                    <tr>
                                        <th className="pe-3">
                                            <div className="form-check custom-checkbox mx-2">
                                                <input type="checkbox" className="form-check-input" id="checkAll" />
                                                <label className="form-check-label" htmlFor="checkAll" />
                                            </div>
                                        </th>
                                        <th>Libellé</th>
                                        <th>Volume (L)</th>
                                        <th>Prix de base (FCFA)</th>
                                        <th>État</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="btn-reveal-trigger">
                                            <td className="py-2">
                                                <div className="form-check custom-checkbox mx-2">
                                                    <input type="checkbox" className="form-check-input" />
                                                    <label className="form-check-label"></label>
                                                </div>
                                            </td>
                                            <td className="py-2">{product.name}</td>
                                            <td className="py-2 ps-5">{product.volume_liters}</td>
                                            <td className="py-2">{product.base_price}</td>
                                            <td className="py-2">
                                                {product.is_active ? 'Actif' : 'Inactif'}
                                            </td>
                                            <td className="py-2 text-end">
                                                <div className="dropdown">
                                                    <Dropdown className="text-end">
                                                        <Dropdown.Toggle
                                                            as="div" // 👈 on utilise un div pour personnaliser le contenu
                                                            className="d-inline-block"
                                                            id={`orderDropdown${product.id}`}
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
                                                                <Link href={`/products/${product.id}/edit`}>
                                                                    Modifier
                                                                </Link>

                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item onClick={cancelOrder} className="text-danger">
                                                                Annuler
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Aucun produit trouvé.
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