import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  iconeCadeado,
  iconeEmail,
  iconeOlho,
  iconeOlhoRiscado
} from '../../assets';
import "./login.css";
import Logo from "../../assets/logo.svg";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        navigate("/dashboard");
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
                        <img src={iconeEmail} alt="E-mail" className="input-icon" />
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
                        <img  src={iconeCadeado} alt="Senha" className="input-icon" />
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
                            {showPassword ? <img src={iconeOlhoRiscado} alt="Ocultar senha" /> : <img src={iconeOlho} alt="Mostrar senha" />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Entrar
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