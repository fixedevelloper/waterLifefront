import Link from "next/link";
import React, {useState} from "react";
import {SiderBar} from "./siderBar";
import {HeaderProfile} from "./HeaderProfile";

export function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <>

        <div className="nav-header">
            <Link href="/" className="brand-logo">
                <img id="logo_header" alt="Logo" src="/logo.png" width="100" />
            </Link>

            <div className="nav-control" onClick={toggleSidebar}>
                <div className={`hamburger ${sidebarOpen ? 'is-active' : ''}`}>
                    <span className="line"/>
                    <span className="line"/>
                    <span className="line"/>
                </div>
            </div>
        </div>
        <div className="header">
            <div className="header-content">
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">

                        <div className="header-left">
                            <div className="dashboard_bar">Eau pour tous</div>
                        </div>

                        <ul className="navbar-nav header-right">
                            <li className="nav-item">
                                <div className="input-group search-area d-xl-inline-flex d-none">
                                    <div className="input-group-append">
                                        <button className="input-group-text">
                                            <i className="flaticon-381-search-2"/>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search here..."
                                    />
                                </div>
                            </li>

                       {/*     <li className="nav-item dropdown notification_dropdown">
                                <a className="nav-link ai-icon" href="#" data-bs-toggle="dropdown">
                                    <i className="flaticon-381-ring"/>
                                    <div className="pulse-css"/>
                                </a>
                            </li>*/}

                           <HeaderProfile />

                        </ul>
                    </div>
                </nav>
            </div>
        </div>
            <SiderBar isOpen={sidebarOpen} />
            </>
    )
}