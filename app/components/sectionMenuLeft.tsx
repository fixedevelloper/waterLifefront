'use client'
import Link from "next/link";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

type MenuItem = {
    title: string;
    href: string;
    icon: string;
    children?: MenuItem[];
};
const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: "icon-category"
    },

    {
        title: "Commandes",
        href: "/orders",
        icon: "icon-arrow-swap"
    },
    {
        title: "Clients",
        href: "/customers",
        icon: "icon-dash1"
    },
    {
        title: "Transporteurs",
        href: "/agents",
        icon: "icon-person"
    },
/*    {
        title: "My Wallet",
        icon: "icon-wallet1",
        children: [
            { title: "My Wallet", href: "/wallet" },
            { title: "Account", href: "/account" }
        ]
    },*/
    {
        title: "Produits",
        href: "/products",
        icon: "icon-arrow-swap"
    },
    {
        title: "Settings",
        href: "/settings",
        icon: "icon-setting1"
    }
];
interface Props {
    collapsed?: boolean;
    toggleMenuMin: () => void;
}

export default function SectionMenuLeft({ collapsed = false,toggleMenuMin }: Props) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (title: string) => {
        setOpenMenu(openMenu === title ? null : title);
    };

    return (
        <div className={`section-menu-left ${collapsed ? "collapsed" : ""}`}>
            <div className="box-logo">
                <Link href="/" id="site-logo-inner">
                    <img id="logo_header" alt="Logo" src="/logo.png" width="80" />
                </Link>
                <div className="button-show-hide"  onClick={toggleMenuMin}>
                    <i className="icon-back"/>
                </div>
            </div>

            <div className="section-menu-left-wrap">
                <div className="center">
                    <div className="center-item">
                        <div className="center-heading f14-regular text-Gray menu-heading mb-12">
                            Navigation
                        </div>
                    </div>

                    <div className="center-item">
                        <ul>
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={`menu-item ${item.children ? "has-children" : ""} ${openMenu === item.title ? "active" : ""}`}
                                >
                                    {item.children ? (
                                        <>
                                            {/* bouton pour ouvrir/fermer le sous-menu */}
                                            <Link href='#'
                                                className="menu-item-button"
                                                onClick={() => toggleMenu(item.title)}
                                            >
                                                <div className="icon" >
                                                    <i className={item.icon}/>
                                                </div>
                                                <div className="text">{item.title}</div>
                                            </Link>

                                            {/* sous-menu */}
                                            <ul
                                                className="sub-menu"
                                                style={{ display: openMenu === item.title ? "block" : "none" }}
                                            >
                                                {item.children.map((sub:any, i:number) => (
                                                    <li key={i} className="sub-menu-item" onClick={(e) => e.stopPropagation()}>
                                                        <Link href={sub.href}>
                                                            <div className="text">{sub.title}</div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <Link href={item.href} className="menu-item-button">
                                            <div className="icon">
                                                <i className={item.icon}></i>
                                            </div>
                                            <div className="text">{item.title}</div>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <LogoutButton />
            </div>
        </div>
    );
}