import NextAuth from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        token?: string;
        user: User & { id: string,
            phone?: string,
            role: string,
            name: string,
            email:string
        };
    }

    interface User {
        id?: string;
        token?: string;
        phone?: string;
        role: string;
        name: string;
        email:string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        token?: string;
        phone?: string;
        role: string;
        name: string;
        email:string;
    }
}
