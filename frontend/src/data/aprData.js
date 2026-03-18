// ============================================================
// src/data/aprData.js
// Mapeamento de riscos e EPIs por tipo de trabalho
// Usado pelo formulário de PT para sugestão automática de APR
// ============================================================

export const TIPOS_TRABALHO = [
  'Trabalho a Quente (solda, corte, esmerilhamento)',
  'Trabalho em Altura (acima de 2 metros)',
  'Espaço Confinado',
  'Trabalho Elétrico (baixa tensão)',
  'Trabalho Elétrico (alta tensão)',
  'Içamento e Movimentação de Cargas',
  'Trabalho com Produtos Químicos / Perigosos',
  'Escavação e Trabalho em Valas',
  'Bloqueio e Etiquetagem (LOTO)',
  'Trabalho em Linha Viva',
  'Outro (descrever em observações)',
]

export const RISCOS_BASE = [
  { id: 'queda-altura',     label: 'Risco de queda de altura' },
  { id: 'choque-eletrico',  label: 'Risco de choque elétrico' },
  { id: 'incendio',         label: 'Risco de incêndio / explosão' },
  { id: 'agentes-quimicos', label: 'Exposição a agentes químicos' },
  { id: 'aprisionamento',   label: 'Risco de aprisionamento' },
  { id: 'atmosfera-o2',     label: 'Atmosfera deficiente de O₂' },
  { id: 'ruido',            label: 'Exposição a ruído elevado' },
  { id: 'soterramento',     label: 'Risco de soterramento' },
  { id: 'projecao',         label: 'Projeção de partículas' },
  { id: 'temperatura',      label: 'Temperatura extrema' },
  { id: 'ergonomico',       label: 'Risco ergonômico' },
  { id: 'outros',           label: 'Outros riscos (descrever)' },
]

export const EPIS_LISTA = [
  { id: 'Capacete',            label: 'Capacete',            icone: 'bi-hard-drive',       obrigatorio: true },
  { id: 'Óculos de Proteção',  label: 'Óculos de Proteção',  icone: 'bi-eye',              obrigatorio: true },
  { id: 'Luvas',               label: 'Luvas',               icone: 'bi-hand-index',       obrigatorio: false },
  { id: 'Botina de Segurança', label: 'Botina',              icone: 'bi-box',              obrigatorio: true },
  { id: 'Cinto de Segurança',  label: 'Cinto de Seg.',       icone: 'bi-link-45deg',       obrigatorio: false },
  { id: 'Protetor Auricular',  label: 'Protetor Auricular',  icone: 'bi-ear',              obrigatorio: true },
  { id: 'Respirador / Máscara',label: 'Respirador',          icone: 'bi-mask',             obrigatorio: false },
  { id: 'Protetor Facial',     label: 'Protetor Facial',     icone: 'bi-shield',           obrigatorio: false },
  { id: 'Uniforme / Macacão',  label: 'Uniforme',            icone: 'bi-person-standing',  obrigatorio: false },
  { id: 'Colete Refletivo',    label: 'Colete Refletivo',    icone: 'bi-brightness-high',  obrigatorio: false },
  { id: 'Detector de Gás',     label: 'Detector de Gás',     icone: 'bi-wind',             obrigatorio: false },
  { id: 'Luva Dielétrica',     label: 'Luva Dielétrica',     icone: 'bi-lightning',        obrigatorio: false },
]

export const MEDIDAS_CONTROLE = [
  'Área isolada e sinalizada',
  'Extintor de incêndio no local',
  'Bloqueio de energias (LOTO)',
  'Vigias designados',
  'Monitoramento de atmosfera',
  'Plano de resgate disponível',
  'Comunicação com equipe de emergência',
  'DDS (Diálogo Diário de Segurança) realizado',
]

export const APR_MAP = {
  'Trabalho a Quente (solda, corte, esmerilhamento)': {
    precheck: ['incendio', 'projecao', 'temperatura', 'ruido'],
    extra: ['Queimaduras por fagulhas ou respingos', 'Intoxicação por fumos metálicos', 'Incêndio em materiais próximos', 'Explosão por atmosfera inflamável'],
    epi: ['Capacete', 'Óculos de Proteção', 'Protetor Facial', 'Luvas', 'Botina de Segurança', 'Protetor Auricular', 'Respirador / Máscara', 'Uniforme / Macacão'],
    risco: 'Alto',
  },
  'Trabalho em Altura (acima de 2 metros)': {
    precheck: ['queda-altura', 'projecao', 'ergonomico'],
    extra: ['Queda de ferramentas e objetos', 'Tombamento de estrutura ou plataforma', 'Colapso do ponto de ancoragem', 'Choque contra estruturas durante queda'],
    epi: ['Capacete', 'Cinto de Segurança', 'Botina de Segurança', 'Luvas', 'Óculos de Proteção', 'Colete Refletivo'],
    risco: 'Alto',
  },
  'Espaço Confinado': {
    precheck: ['aprisionamento', 'atmosfera-o2', 'agentes-quimicos', 'temperatura'],
    extra: ['Atmosfera tóxica ou explosiva', 'Afogamento ou soterramento interno', 'Colapso das paredes do espaço', 'Dificuldade de resgate em emergência'],
    epi: ['Capacete', 'Respirador / Máscara', 'Detector de Gás', 'Luvas', 'Botina de Segurança', 'Cinto de Segurança'],
    risco: 'Alto',
  },
  'Trabalho Elétrico (baixa tensão)': {
    precheck: ['choque-eletrico', 'incendio'],
    extra: ['Arco elétrico e flash', 'Queimaduras elétricas', 'Parada cardiorrespiratória por eletrocussão', 'Incêndio por curto-circuito'],
    epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança'],
    risco: 'Médio',
  },
  'Trabalho Elétrico (alta tensão)': {
    precheck: ['choque-eletrico', 'incendio', 'queda-altura'],
    extra: ['Arco elétrico de alta energia', 'Eletrocussão fatal', 'Explosão de equipamentos sob tensão', 'Queimaduras graves por arco'],
    epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança', 'Uniforme / Macacão'],
    risco: 'Alto',
  },
  'Içamento e Movimentação de Cargas': {
    precheck: ['queda-altura', 'ergonomico', 'projecao'],
    extra: ['Queda de carga sobre trabalhadores', 'Atropelamento por equipamento de movimentação', 'Esmagamento e prensamento de membros', 'Tombamento do equipamento de içamento', 'Ruptura de cabos ou correntes', 'Colisão com estruturas durante o içamento'],
    epi: ['Capacete', 'Luvas', 'Botina de Segurança', 'Colete Refletivo', 'Óculos de Proteção'],
    risco: 'Alto',
  },
  'Trabalho com Produtos Químicos / Perigosos': {
    precheck: ['agentes-quimicos', 'incendio', 'temperatura'],
    extra: ['Intoxicação por inalação de vapores', 'Queimadura química na pele ou olhos', 'Contaminação ambiental por derramamento', 'Reação química descontrolada'],
    epi: ['Capacete', 'Óculos de Proteção', 'Protetor Facial', 'Luvas', 'Respirador / Máscara', 'Uniforme / Macacão', 'Botina de Segurança'],
    risco: 'Alto',
  },
  'Escavação e Trabalho em Valas': {
    precheck: ['soterramento', 'agentes-quimicos', 'queda-altura'],
    extra: ['Soterramento por desmoronamento das paredes', 'Contato com tubulações enterradas (gás, elétrica)', 'Afogamento por acúmulo de água', 'Queda de pessoas ou objetos na vala'],
    epi: ['Capacete', 'Luvas', 'Botina de Segurança', 'Colete Refletivo', 'Óculos de Proteção'],
    risco: 'Alto',
  },
  'Bloqueio e Etiquetagem (LOTO)': {
    precheck: ['choque-eletrico', 'aprisionamento'],
    extra: ['Energização acidental do equipamento', 'Partida intempestiva de máquinas', 'Liberação de energia residual (molas, pressão)', 'Falha no bloqueio por dispositivo inadequado'],
    epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Botina de Segurança', 'Luvas'],
    risco: 'Médio',
  },
  'Trabalho em Linha Viva': {
    precheck: ['choque-eletrico', 'queda-altura', 'incendio'],
    extra: ['Eletrocussão por contato direto', 'Arco elétrico com energia elevada', 'Queda durante manobra na linha', 'Falha de EPI dielétrico'],
    epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança', 'Uniforme / Macacão'],
    risco: 'Alto',
  },
}
