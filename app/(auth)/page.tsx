'use client';

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useSnackbar } from "notistack";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔁 Redirection si déjà connecté
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone || !password) {
      enqueueSnackbar("Veuillez remplir tous les champs", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone,
        password,
      });

      if (res?.error) {
        enqueueSnackbar("Identifiants incorrects", { variant: "error" });
      } else {
        enqueueSnackbar("Connexion réussie", { variant: "success" });
        router.push("/dashboard");
      }
    } catch {
      enqueueSnackbar("Une erreur est survenue", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <div className="text-center">
          <img src="/logo.png" width={120} alt="Logo" />
        </div>

        <div className="sub f12-regular text-GrayDark">
          Bon retour sur notre site
        </div>

        <div className="sign-in-inner">
          <h4>Connexion</h4>

          <form
              onSubmit={handleSubmit}
              className="form-login flex flex-column gap24"
          >
            {/* Email */}
            <fieldset className="email">
              <div className="f14-regular mb-6">Téléphone</div>
              <input
                  className="flex-grow"
                  type="text"
                  placeholder="Entrez votre téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
              />
            </fieldset>

            {/* Mot de passe */}
            <fieldset className="password">
              <div className="f14-regular mb-6">Mot de passe</div>
              <input
                  className="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />

              <span
                  className={`show-pass ${showPassword ? "active" : ""}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
              >
  {showPassword ? (
      <i className="icon-view view" />
  ) : (
      <i className="icon-hide hide" />
  )}
</span>

            </fieldset>

            {/* Checkbox */}
            <div className="tf-cart-checkbox">
              <div className="tf-checkbox-wrapp">
                <input className="checkbox-item" type="checkbox" required />
                <div>
                  <i className="icon-check"/>
                </div>
              </div>

              <div className="f14-regular">
                En continuant, vous acceptez les{" "}
                <a href="#" className="f14-bold">
                  Conditions générales
                </a>
              </div>
            </div>

            {/* Bouton */}
            <button
                type="submit"
                className="tf-button style-1 label-01 w-100"
                disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Register */}
          <div className="f14-regular">
            Vous n’avez pas de compte ?{" "}
            <a href="/register" className="f14-bold">
              S’inscrire
            </a>
          </div>
        </div>
      </>
  );
}