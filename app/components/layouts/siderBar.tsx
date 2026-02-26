'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from "next/link";

type SubMenu = {
    title: string
    link: string
}

type Menu = {
    key: string
    title: string
    icon: string
    link: string
    subMenus?: SubMenu[]
}

type SiderBarProps = {
    isOpen: boolean
}

export function SiderBar({ isOpen }: SiderBarProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    const toggleMenu = (menuKey: string) => {
        setOpenMenu(openMenu === menuKey ? null : menuKey)
    }

    // URL courante
    const pathname = usePathname()

    const menus: Menu[] = [
        {
            key: 'dashboard',
            title: "Dashboard",
            link: "/dashboard",
            icon: "flaticon-381-networking"
        },

        {
            key: 'orders',
            title: "Commandes",
            link: "/orders",
            icon: "flaticon-381-database"
        },
        {
            key: 'customers',
            title: "Clients",
            link: "/customers",
            icon: "flaticon-381-user-9"
        },
        {
            key: 'drivers',
            title: "Transporteurs",
            link: "/agents",
            icon: "flaticon-381-user-2"
        },
        {
            key: 'managers',
            title: "Gestionnaires",
            link: "/managers",
            icon: "flaticon-381-user-1"
        },
        {
            key: 'products',
            title: "Produits",
            link: "/products",
            icon: "flaticon-381-app"
        },
        {
            key: 'settings',
            title: "Settings",
            link: "/settings",
            icon: "flaticon-381-settings-1"
        }
    ]

    return (
        <div className={`deznav ${isOpen ? 'open' : 'closed'}`}>
            <div className="deznav-scroll">
                <ul className="metismenu" id="menu">
                    {menus.map((menu) => {
                        // Déterminer si le menu est actif
                        const isActiveMenu =
                            menu.key === openMenu ||
                            pathname === menu.link ||
                            menu.subMenus?.some((sub) => sub.link === pathname)

                        return (
                            <li key={menu.key} className={isActiveMenu ? 'mm-active' : ''}>
                                <Link
                                    className="has-arrow ai-icon"
                                    href={menu.link}
                                    onClick={(e) => {
                                        if (menu.subMenus && menu.subMenus.length > 0) {
                                            e.preventDefault() // ne pas naviguer si menu a des sous-menus
                                            toggleMenu(menu.key)
                                        }
                                    }}
                                >
                                    <i className={menu.icon} />
                                    <span className="nav-text">{menu.title}</span>
                                </Link>

                                {openMenu === menu.key && menu.subMenus && (
                                    <ul>
                                        {menu.subMenus.map((sub, idx) => (
                                            <li
                                                key={idx}
                                                className={sub.link === pathname ? 'mm-active' : ''}
                                            >
                                                <Link href={sub.link}>{sub.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        )
                    })}
                </ul>

        <div className="book-box">
                    <img src="/logo.png" alt="" width='200' />
                 {/*   <a href="#">Generate Report</a>*/}
                </div>

                <div className="copyright">
                    <p>
                        <strong>L'eau pour la vie</strong> © 2022
                    </p>
                </div>
            </div>
        </div>
    )
}