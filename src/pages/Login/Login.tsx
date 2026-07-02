import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import "./login.css";
import Logo from "../../assets/logo.svg";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        navigate("/");
    }

    return (
        <section id="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-logo">
                    <img src={Logo} alt="Assina Fácil Logo" />
                </div>

                <div className="login-header">
                    <h1>Bem-vindo ao Assina Fácil</h1>
                    <p>Gerencie suas assinaturas de forma inteligente.</p>
                </div>

                <div className="input-group">
                    <label htmlFor="email">E-mail</label>
                    <div className="input-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label htmlFor="password">Senha</label>
                        <span
                            className="forgot-link"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Esqueceu a senha?
                        </span>
                    </div>
                    <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Entrar <ArrowRight size={18} />
                </button>

                <p className="register-text">
                    Não possui uma conta?{" "}
                    <span className="register-link" onClick={() => navigate("/register")}>
                        Criar conta grátis
                    </span>
                </p>
            </form>

            <div className="login-footer">
                <span onClick={() => navigate("/terms")}>Termos</span>
                <span onClick={() => navigate("/privacy")}>Privacidade</span>
                <span onClick={() => navigate("/help")}>Ajuda</span>
            </div>
        </section>
    );
}