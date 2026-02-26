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
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">

              {/* Logo */}
              <div className="text-center mb-4">
                <img src="/logo.png" alt="Logo" width={120} />
              </div>

              {/* Sous-titre */}
              <p className="text-center text-muted mb-4">Bon retour sur notre site</p>

              {/* Formulaire */}
              <div className="card shadow-sm p-4">
                <h4 className="text-center mb-4">Connexion</h4>

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>

                  {/* Téléphone */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Téléphone</label>
                    <input
                        type="text"
                        id="phone"
                        className="form-control"
                        placeholder="Entrez votre téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-3 position-relative">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁" : "🙈"}
                    </button>
                  </div>

                  {/* Checkbox conditions */}
                  <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="termsCheck"
                        required
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      En continuant, vous acceptez les{" "}
                      <a href="#">Conditions générales</a>
                    </label>
                  </div>

                  {/* Bouton */}
                  <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      disabled={loading}
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>

                </form>

                {/* Lien inscription */}
                <p className="text-center mb-0">
                  Vous n’avez pas de compte ?{" "}
                  <a href="/register">S’inscrire</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}