'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {signOut} from "next-auth/react";

export function HeaderProfile() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLLIElement>(null)

    // Fermer le dropdown quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <li className="nav-item dropdown header-profile" ref={dropdownRef}>
            {/* Toggle dropdown */}
            <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                }}
            >
                <img src="/images/profile/pic1.jpg" width="20" alt="" />
                <div className="header-info">
                    <span>Johndoe</span>
                    <small>Super Admin</small>
                </div>
            </a>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="dropdown-menu dropdown-menu-right show" data-bs-popper='none'>
                    <Link href="/app-profile" className="dropdown-item ai-icon">
                        <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span className="ms-2">Profile </span>
                    </Link>
                    <Link href="/email-inbox" className="dropdown-item ai-icon">
                        Inbox
                    </Link>
                    <a  onClick={() => signOut({ callbackUrl: "/" })} className="dropdown-item ai-icon">
                        Logout
                    </a>
                </div>
            )}
        </li>
    )
}