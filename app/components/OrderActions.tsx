"use client";

import {useState, useEffect} from "react";
import {Dropdown, Modal, ListGroup, Spinner} from "react-bootstrap";
import axiosServices from "../lib/axios";

type Agent = {
    id: number;
    name: string;
};

type Props = {
    orderId: number;
};

export default function OrderActions({orderId}: Props) {
    const [showModal, setShowModal] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [actionType, setActionType] = useState<"collecte" | "livraison" | null>(null);

    // -----------------------------
    // FETCH AGENTS
    // -----------------------------
    const fetchAgents = async () => {
        setLoadingAgents(true);
        try {
            const res = await axiosServices.get("/api/admin/agents?role=agent");
            setAgents(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAgents(false);
        }
    };

    // -----------------------------
    // OPEN MODAL
    // -----------------------------
    const handleOpen = (type: "collecte" | "livraison") => {
        setActionType(type);
        fetchAgents();
        setShowModal(true);
    };

    // -----------------------------
    // ASSIGN AGENT
    // -----------------------------
    const assignAgent = async (agentId: number) => {
        try {
            if (actionType=='collecte'){
                await axiosServices.post(`/api/admin/collects/assign`, {
                    order_id: orderId,
                    collector_id: agentId,
                });
            }else {
                await axiosServices.post(`/api/admin/deliveries/assign`, {
                    delivery_agent_id: agentId,
                    order_id: orderId,
                });
            }



            setShowModal(false);
            alert("✅ Agent assigné avec succès");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur lors de l'assignation");
        }
    };
// -----------------------------
// MARK AS COLLECTED
// -----------------------------
    const markAsCollected = async () => {
        try {
            await axiosServices.post(`/api/admin/collects/mark-collected`, {
                order_id: orderId,
            });

            alert("✅ Commande collectée");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur");
        }
    };

// -----------------------------
// MARK AS DELIVERED
// -----------------------------
    const markAsDelivered = async () => {
        try {
            await axiosServices.post(`/api/admin/deliveries/mark-delivered`, {
                order_id: orderId,
            });

            alert("✅ Commande livrée");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur");
        }
    };

// -----------------------------
// CANCEL ORDER
// -----------------------------
    const cancelOrder = async () => {
        if (!confirm("Confirmer l'annulation ?")) return;

        try {
            await axiosServices.post(`/api/admin/orders/cancel`, {
                order_id: orderId,
            });

            alert("❌ Commande annulée");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur");
        }
    };

// -----------------------------
// REFUND ORDER
// -----------------------------
    const refundOrder = async () => {
        if (!confirm("Confirmer le remboursement ?")) return;

        try {
            await axiosServices.post(`/api/admin/orders/refund`, {
                order_id: orderId,
            });

            alert("💰 Remboursement effectué");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur");
        }
    };
    return (
        <>
            {/* ---------------- ACTIONS ---------------- */}
            <div className="wg-box gap16 mb-4">
                <div className="card-body">
                    <h5 className="mb-3">⚙️ Actions</h5>

                    {/* COLLECTE */}
                    <Dropdown className="mb-3 w-100"
                              style={{
                                  borderRadius: "12px",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                  border: "none",
                              }}
                    >
                        <Dropdown.Toggle   className="w-100 d-flex align-items-center justify-content-between px-3 py-2 fw-semibold"

                                           style={{
                                               borderRadius: "12px",
                                               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                               height: '40px'
                                           }} variant="primary">
                            Collecte
                        </Dropdown.Toggle>
                        <Dropdown.Menu    className="w-100 p-2"
                                          style={{
                                              borderRadius: "12px",
                                              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                              border: "none",
                                          }}>
                            <Dropdown.Item onClick={() => handleOpen("collecte")}>
                                Assigner collecteur
                            </Dropdown.Item>
                            <Dropdown.Item onClick={markAsCollected}>Marquer collecté</Dropdown.Item>
                            <Dropdown.Item onClick={cancelOrder}>Annuler</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* LIVRAISON */}

                    <Dropdown className="mb-3 w-100">
                        <Dropdown.Toggle
                            className="w-100 d-flex align-items-center justify-content-between px-3 py-2 fw-semibold"
                            variant="success"
                            style={{
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                height: '40px'
                            }}
                        >
        <span className="d-flex align-items-center gap-2">

            Livraison
        </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            className="w-100 p-2"
                            style={{
                                borderRadius: "12px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                border: "none",
                            }}
                        >
                            {/* ASSIGNER */}
                            <Dropdown.Item
                                onClick={() => handleOpen("livraison")}
                                className="d-flex align-items-center gap-2 rounded px-3 py-2"
                            >

                                Assigner livreur
                            </Dropdown.Item>

                            {/* LIVRÉ */}
                            <Dropdown.Item
                                onClick={markAsDelivered}
                                className="d-flex align-items-center gap-2 rounded px-3 py-2"
                            >

                                Marquer livré
                            </Dropdown.Item>

                            <Dropdown.Divider />

                            {/* ANNULER */}
                            <Dropdown.Item
                                onClick={cancelOrder}
                                className="d-flex align-items-center gap-2 rounded px-3 py-2 text-danger"
                            >

                                Annuler
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* COMMANDE */}
                    <Dropdown className="w-100"
                              style={{
                                  borderRadius: "12px",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                  border: "none",

                              }}
                    >
                        <Dropdown.Toggle   className="w-100 d-flex align-items-center justify-content-between px-3 py-2 fw-semibold"
                                           style={{
                                               borderRadius: "12px",
                                               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                               height: '40px'
                                           }} variant="warning">
                            Commande
                        </Dropdown.Toggle>
                        <Dropdown.Menu    className="w-100 p-2"
                                          style={{
                                              borderRadius: "12px",
                                              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                              border: "none",
                                          }}>
                            <Dropdown.Item
                                className="d-flex align-items-center gap-2 rounded px-3 py-2"
                                onClick={cancelOrder}>Annuler commande</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                className="d-flex align-items-center gap-2 rounded px-3 py-2"
                                onClick={refundOrder}>Rembourser</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* ---------------- MODAL ---------------- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered fullscreen='lg-down'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === "collecte"
                            ? "🚚 Assigner un collecteur"
                            : "📦 Assigner un livreur"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loadingAgents ? (
                        <div className="text-center">
                            <Spinner animation="border"/>
                        </div>
                    ) : (
                        <ListGroup>
                            {agents.map((agent) => (
                                <ListGroup.Item
                                    key={agent.id}
                                    action
                                    onClick={() => assignAgent(agent.id)}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    👤 {agent.name}
                                    <span className="badge bg-primary">Choisir</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}