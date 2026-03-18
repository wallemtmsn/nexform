// ============================================================
// src/data/empresas.js
// Configuração das empresas cadastradas na plataforma.
// Substituir por chamada à API quando o backend estiver pronto.
// ============================================================

const empresas = [
  {
    id: 'brasilport',
    nomeFantasia: 'Brasil Port',
    nomeCompleto: 'Brasil Port Operações Portuárias Ltda.',
    localidade: 'Porto do Açu, RJ',
    cor: '#2d6be4',          // cor de destaque da empresa
    ferramentas: [
      {
        id: 'emissao-pt',
        nome: 'Emissão de Permissão de Trabalho',
        descricao: 'Emita, controle e arquive PTs com análise de riscos automática e geração de PDF.',
        icone: 'bi-file-earmark-check',
        status: 'ativa',         // 'ativa' | 'manutencao' | 'inativa'
        rota: '/pt',
      },
      // Adicionar novas ferramentas aqui conforme forem contratadas
    ],
    usuarios: [
      {
        email: 'contato@nexforms.com.br',
        senha: 'nexforms123',
        nome: 'Carlos Eduardo',
        cargo: 'Técnico de Segurança',
      },
    ],
  },
]

// Retorna a empresa pelo id
export function getEmpresa(id) {
  return empresas.find(e => e.id === id) || null
}

// Retorna a empresa padrão (usada enquanto não temos subdomínio)
export function getEmpresaPadrao() {
  return empresas[0]
}

// Valida login de um usuário dentro de uma empresa
export function validarLogin(empresa, email, senha) {
  const usuario = empresa.usuarios.find(
    u => u.email === email.trim().toLowerCase() && u.senha === senha
  )
  return usuario || null
}

export default empresas
