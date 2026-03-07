export default function ApkPage() {
    const apkUrl = "/apk/app-release.apk"; // chemin vers votre fichier APK

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            padding: "20px"
        }}>
            <div style={{
                maxWidth: "500px",
                width: "100%",
                background: "#fff",
                padding: "40px",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>

                <h1 style={{marginBottom: "10px"}}>
                    Télécharger l'application
                </h1>

                <p style={{color: "#666", marginBottom: "30px"}}>
                    Téléchargez la dernière version de notre application Android.
                </p>

                <a
                    href={apkUrl}
                    download
                    style={{
                        display: "inline-block",
                        padding: "15px 25px",
                        background: "#0d6efd",
                        color: "#fff",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Télécharger l'APK
                </a>

                <p style={{marginTop: "20px", fontSize: "14px", color: "#999"}}>
                    Version Android requise : 6.0 ou plus
                </p>

            </div>
        </div>
    );
}