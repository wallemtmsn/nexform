// ============================================================
// src/data/empresas.js
// Configuração das empresas cadastradas na plataforma.
// Substituir por chamada à API quando o backend estiver pronto.
// ============================================================

const empresas = [
  {
    id: 'nexform',
    nomeFantasia: 'NEXFORMS',
    nomeCompleto: 'NEXFORMS Plataforma de Transformação Digital',
    cnpj: '52.715.328/0001-28',
    localidade: 'Rio de Janeiro, RJ',
    cor: '#2d6be4',
    ferramentas: [
      {
        id: 'emissao-pt',
        nome: 'Emissão de Permissão de Trabalho',
        descricao: 'Emita, controle e arquive PTs com análise de riscos automática e geração de PDF.',
        icone: 'bi-file-earmark-check',
        status: 'ativa',
        rota: '/pt',
      },
      {
        id: 'checklist-empilhadeira',
        nome: 'Checklist de Empilhadeira',
        descricao: 'Checklist diário de inspeção de empilhadeira com aprovação do líder e geração de PDF.',
        icone: 'bi-clipboard-check',
        status: 'ativa',
        rota: '/checklist',
      },
      {
        id: 'inspecao-carga',
        nome: 'Inspeção de Carga',
        descricao: 'Checklist de inspeção de carga para operações terrestres e marítimas, com aprovação do líder.',
        icone: 'bi-box-seam',
        status: 'ativa',
        rota: '/inspecao-carga',
      },
    ],
    usuarios: [
      {
        email: 'contato@nexforms.com.br',
        senha: 'nexforms123',
        nome: 'Carlos Eduardo',
        cargo: 'Técnico de Segurança',
        perfil: 'lider', // 'operador' | 'lider'
      },
      {
        email: 'operador@nexforms.com.br',
        senha: 'operador123',
        nome: 'João Ferreira',
        cargo: 'Operador de Empilhadeira',
        perfil: 'operador',
      },
    ],
  },
]

export function getEmpresa(id) {
  return empresas.find(e => e.id === id) || null
}

export function getEmpresaPadrao() {
  return empresas[0]
}

export function validarLogin(empresa, email, senha) {
  const usuario = empresa.usuarios.find(
    u => u.email === email.trim().toLowerCase() && u.senha === senha
  )
  return usuario || null
}

export default empresas
