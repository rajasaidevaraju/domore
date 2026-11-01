import { useState } from "react";
import styles from "./management.module.css";
import { useAuthStore } from "@/app/store/auth";
import { UserRequests } from "@/app/service/UserRequests";
import { validateUsername, validatePassword } from "@/app/service/validate";

const ReLoginDialog = () => {
    const { username: savedUsername, setAuth, clearAuth } = useAuthStore();
    const [username, setUsername] = useState(savedUsername ?? "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const validationError = validateUsername(username, true) ?? validatePassword(password, true);
        if (validationError != null) {
            setError(validationError);
            return;
        }
        setError("");
        setLoading(true);
        try {
            const { token, error } = await UserRequests.loginUser(username, password);
            if (error != null) {
                setError(error);
            }
            if (token != null) {
                setAuth(true, username, token);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <form
                className={styles.dialog}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <h2>Session expired</h2>
                <p className={styles.text}>Log in again to continue. Paused uploads resume from where they stopped.</p>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="errorText">{error}</p>}
                <div className={styles.dialogActions}>
                    <button type="button" className={styles.commonButton} onClick={clearAuth}>
                        Log out
                    </button>
                    <button type="submit" className={styles.commonButton} disabled={loading}>
                        Log in
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReLoginDialog;
