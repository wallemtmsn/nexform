// ============================================================
// src/pages/Login/Login.jsx
// Tela de login com branding da empresa
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getEmpresaPadrao, validarLogin } from '../../data/empresas'
import './Login.css'

export default function Login() {
  const navigate           = useNavigate()
  const { login }          = useAuth()
  const empresa            = getEmpresaPadrao()

  const [email, setEmail]               = useState('')
  const [senha, setSenha]               = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [lembrar, setLembrar]           = useState(false)
  const [erro, setErro]                 = useState('')
  const [carregando, setCarregando]     = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!email || !senha) {
      setErro('Preencha o e-mail e a senha para continuar.')
      return
    }

    setCarregando(true)

    // Simula latência de API — substituir por fetch real no futuro
    setTimeout(() => {
      const usuario = validarLogin(empresa, email, senha)

      if (usuario) {
        login(usuario, empresa)
        navigate('/dashboard')
      } else {
        setErro('E-mail ou senha incorretos. Verifique suas credenciais.')
        setSenha('')
        setCarregando(false)
      }
    }, 900)
  }

  return (
    <div className="login-screen">

      {/* ── PAINEL ESQUERDO — branding ── */}
      <div className="login-left">
        <div className="login-grid-bg" />

        <div className="login-left-top">
          <span className="login-brand">Nex<span>form</span></span>
          <span className="login-brand-sub">Plataforma de Transformação Digital</span>
        </div>

        <div className="login-left-content">
          <div className="login-client-badge">
            <div className="login-badge-dot" />
            <span>
              Sistema ativo para{' '}
              <strong>{empresa.nomeFantasia} · {empresa.localidade}</strong>
            </span>
          </div>

          <h2 className="login-headline">
            Bem-vindo à<br />
            <em>área exclusiva<br />{empresa.nomeFantasia}</em>
          </h2>

          <p className="login-desc">
            Acesse suas ferramentas digitais contratadas — centralizadas em um
            único painel seguro e rastreável.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <i className="bi bi-file-earmark-check" />
              Emissão de PT com geração de PDF
            </div>
            <div className="login-feature">
              <i className="bi bi-shield-check" />
              Análise de riscos pré-sugerida por atividade
            </div>
            <div className="login-feature">
              <i className="bi bi-clock-history" />
              Histórico completo de permissões emitidas
            </div>
            <div className="login-feature">
              <i className="bi bi-lock" />
              Acesso controlado por perfil de usuário
            </div>
          </div>
        </div>

        <div className="login-footer-text">
          <span>© 2025 Nexform · Todos os direitos reservados</span>
          <span>Desenvolvido para {empresa.nomeFantasia} — {empresa.localidade}</span>
        </div>
      </div>

      {/* ── PAINEL DIREITO — formulário ── */}
      <div className="login-right">

        <div className="login-form-header">
          <h2>Bem-vindo de volta</h2>
          <p>Acesse com suas credenciais {empresa.nomeFantasia} para continuar.</p>
        </div>

        {erro && (
          <div className="login-error">
            <i className="bi bi-exclamation-circle" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className="login-fgroup">
            <label htmlFor="login-email">E-mail corporativo</label>
            <div className="login-input-wrap">
              <i className="bi bi-envelope" />
              <input
                id="login-email"
                type="email"
                placeholder="contato@nexforms.com.br"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && document.getElementById('login-senha').focus()}
              />
            </div>
          </div>

          <div className="login-fgroup">
            <label htmlFor="login-senha">Senha</label>
            <div className="login-input-wrap">
              <i className="bi bi-lock" />
              <input
                id="login-senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setMostrarSenha(v => !v)}
                tabIndex={-1}
              >
                <i className={`bi ${mostrarSenha ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={e => setLembrar(e.target.checked)}
              />
              Manter conectado
            </label>
            <a href="#" className="login-forgot">Esqueci minha senha</a>
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando
              ? <><i className="bi bi-hourglass-split" /> Verificando...</>
              : <><i className="bi bi-box-arrow-in-right" /> Entrar no sistema</>
            }
          </button>

        </form>

        <div className="login-divider">
          <span>acesso de demonstração</span>
        </div>
        <div className="login-demo-hint">
          <strong>Usuário:</strong> contato@nexforms.com.br<br />
          <strong>Senha:</strong> nexforms123
        </div>

      </div>
    </div>
  )
}
