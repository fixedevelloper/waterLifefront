"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <div className="bottom">
            <div className="image">
                <img src="images/item/bot.png" alt="Bot illustration" />
            </div>
            <div className="content">
                <button
                    className="tf-button style-2 f12-bold w-max"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    Se déconnecter
                    <i className="icon icon-send"/>
                </button>
            </div>
        </div>
    );
}