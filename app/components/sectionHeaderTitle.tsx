
'use client'
import Link from "next/link";
import { useState } from "react";

interface Props {
    title?: string;
    toggleMenu: () => void;
}

export default function SectionHeaderTitle({ title = "Eau pour tous", toggleMenu }: Props) {
    const [search, setSearch] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search:", search);
    };

    return (
        <div className="header-dashboard">
            <div className="wrap">

                <div className="header-left">

                    <div className="button-show-hide" onClick={toggleMenu}>
                        <i className="icon-menu"/>
                    </div>

                    <h6>{title}</h6>

                    <form className="form-search flex-grow" onSubmit={handleSubmit}>
                        <fieldset className="name">
                            <input
                                type="text"
                                placeholder="Type to search…"
                                className="show-search style-1"
                                name="search"
                                tabIndex={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </fieldset>

                        <div className="button-submit">
                            <button type="submit">
                                <i className="icon-search-normal1" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="header-grid">
                    {/* Messages / Notifications / User */}
                </div>
            </div>
        </div>
    );
}