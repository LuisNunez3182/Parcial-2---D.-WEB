import { useState } from "react";
import { User, Lock } from "lucide-react";
import styles from "../styles/LoginPage.module.css";
import { COLORS } from "../constants/colors";
import ApiService from "../services/ApiService";

export default function LoginPage({ onLogin }) {
  // Los useState se utilizan para manejar el estado de los campos de entrada (username y password), así como para gestionar el estado de error y carga. Esto permite que el componente sea interactivo y responda a las acciones del usuario, como ingresar texto o enviar el formulario, proporcionando retroalimentación visual en caso de errores o durante el proceso de inicio de sesión.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // La función handleSubmit se encarga de manejar el evento de envío del formulario. Realiza validaciones básicas para asegurarse de que los campos no estén vacíos y que la contraseña tenga una longitud mínima. Luego, hace una llamada a la API utilizando el servicio ApiService para intentar iniciar sesión con las credenciales proporcionadas. Dependiendo de la respuesta de la API, actualiza el estado de error o llama a la función onLogin para actualizar el estado de autenticación en el componente padre. Esto permite una gestión eficiente del proceso de inicio de sesión y proporciona una experiencia de usuario fluida.
  // async es necesario para poder usar await dentro de la función, lo que permite manejar operaciones asíncronas de manera más sencilla y legible. En este caso, se utiliza para esperar la respuesta de la API antes de continuar con el flujo del programa, asegurando que se manejen correctamente los resultados de la solicitud de inicio de sesión.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    if (password.length < 3) {
      setError("Contraseña demasiado corta.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.login(username, password);

      if (response.success) {
        onLogin(response.data);
      } else {
        setError(response.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: COLORS.RED }} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <div style={{ background: COLORS.RED, borderRadius: 10, padding: "7px 13px" }}>
            <span style={{ color: COLORS.YELLOW, fontWeight: 900, fontSize: 18, letterSpacing: 1.5 }}>
              DHL
            </span>
          </div>
          <div>
            <div className={styles.title}>FleetOps</div>
            <div className={styles.subtitle}>Gestión de Flota Inteligente</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usuario</label>
            <div className={styles.inputWrapper}>
              <User size={14} color="#AEAEB2" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="nombre.usuario"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock size={14} color="#AEAEB2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className={styles.footer}>DHL Supply Chain · Sistema interno v2.4</p>
      </div>
    </div>
  );
}
