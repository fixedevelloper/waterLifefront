"use client";

import "./../globals.css";
import React, { useState, useEffect, useRef } from "react";
import SectionMenuLeft from "../components/sectionMenuLeft";
import SectionHeaderTitle from "../components/sectionHeaderTitle";

export default function PageLayout({
                                       children,

                                   }: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleMenu = () => setCollapsed(!collapsed);

    return (
        <div id="wrapper">
            <div id="page">
                <div className={`layout-wrap loader-off ${collapsed ? "full-width" : ""}`}>

                    <SectionMenuLeft collapsed={collapsed}  toggleMenuMin={toggleMenu} />

                    <div className="section-content-right">

                        {/* titre dynamique */}
                        <SectionHeaderTitle toggleMenu={toggleMenu} />

                        <div className="main-content">
                            <div className="main-content-inner">
                                <div className="main-content-wrap">
                                    <div className="tf-container">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}