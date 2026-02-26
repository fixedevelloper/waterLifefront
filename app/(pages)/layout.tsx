"use client";

import "./../globals.css";
import React, { useState, useEffect, useRef } from "react";
import SectionMenuLeft from "../components/sectionMenuLeft";
import {Header} from "../components/layouts/header";
import {SiderBar} from "../components/layouts/siderBar";

export default function PageLayout({
                                       children,

                                   }: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleMenu = () => setCollapsed(!collapsed);

    return (
        <div id="main-wrapper" className="show">
            <Header />

            <div className="content-body">
                <div className="container-fluid">
                    {children}
                </div>
            </div>
        </div>
    );
}