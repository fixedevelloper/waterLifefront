"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import axiosServices from "../lib/axios";

const AxiosInterceptorProvider = () => {
    const { data: session } = useSession();
    const { enqueueSnackbar } = useSnackbar();

    const interceptorSet = useRef(false);
    const tokenRef = useRef<string | null>(null);

    // 🔄 Met à jour le token quand la session arrive
    useEffect(() => {
        tokenRef.current = session?.user.token ?? null;
        console.log("🔐 Token updated:", tokenRef.current);
    }, [session]);

    useEffect(() => {
        if (interceptorSet.current) return;
        interceptorSet.current = true;

        // ✅ REQUEST
        axiosServices.interceptors.request.use(
            (config) => {
                console.info(
                    "➡️ [API REQUES]",
                    config.method?.toUpperCase(),
                    `${config.baseURL}${config.url}`,
                    tokenRef.current ?? "test"
                );
                console.info("🔐 Intercepte ici:", tokenRef.current);
                const token = tokenRef.current;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // ✅ RESPONSE
        axiosServices.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Erreur serveur";

                enqueueSnackbar(message, { variant: "error" });

                console.groupCollapsed(
                    `❌ [API ERROR] ${status ?? ""} ${error.config?.url}`
                );
               // console.error("Message:", message);
                console.error("Response:", error.response?.data);
                console.groupEnd();

                if (status === 401) {
                  //  signOut({ callbackUrl: "/" });
                }

                return Promise.reject(error);
            }
        );
    }, [enqueueSnackbar]);

    return null;
};

export default AxiosInterceptorProvider;

