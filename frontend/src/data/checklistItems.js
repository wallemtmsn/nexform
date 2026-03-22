// ============================================================
// src/data/checklistItems.js
// Itens do Checklist Diário — Empilhadeira a Combustão
// Baseado no formulário BPORT/SGI/FORM-MANEQP/1400 Rev.04
// Legenda: C = Conforme | NC = Não Conforme | NA = Não Aplicável
// ============================================================

// Itens marcados com *** no formulário original inviabilizam
// a operação quando NC — sinalizados com critico: true
export const CHECKLIST_ITEMS = [
  // ── Itens 1–39 (C / NC apenas) ──
  { id: 1,  critico: true,  categoria: 'Geral',         texto: 'Checar visualmente danos estruturais no chassi do equipamento (trincas e folgas)' },
  { id: 2,  critico: false, categoria: 'Geral',         texto: 'Checar visualmente danos na máquina como amassamentos, corrosões leves e danos na pintura' },
  { id: 3,  critico: true,  categoria: 'Geral',         texto: 'Checar visualmente os retrovisores (trincas, fixação e visibilidade)' },
  { id: 4,  critico: false, categoria: 'Geral',         texto: 'Checar as condições do punho de assistência a subida da empilhadeira' },
  { id: 5,  critico: true,  categoria: 'Geral',         texto: 'Checar visualmente as condições dos pneus e aros (indicador de desgaste do pneu, trincas e danos)' },
  { id: 6,  critico: false, categoria: 'Cabine',        texto: 'Checar visualmente o estado geral do teto, grade de proteção superior e colunas da cabine' },
  { id: 7,  critico: true,  categoria: 'Capô do Motor', texto: 'Checar visualmente o nível do fluido de arrefecimento (não abrir a tampa do reservatório)' },
  { id: 8,  critico: true,  categoria: 'Capô do Motor', texto: 'Checar nível de óleo do motor (máquina nivelada e desligada por no mínimo 15 min.)' },
  { id: 9,  critico: true,  categoria: 'Capô do Motor', texto: 'Checar visualmente correias do motor (acessórios) e hélice (tensão da correia, desgaste, danos)' },
  { id: 10, critico: true,  categoria: 'Geral',         texto: 'Checar nível de óleo da transmissão (desligar o motor e aguardar 5 min para prova)' },
  { id: 11, critico: true,  categoria: 'Geral',         texto: 'Checar nível do óleo hidráulico (torre recolhida, quadro de carga baixo, garfos no chão)' },
  { id: 12, critico: true,  categoria: 'Capô do Motor', texto: 'Checar nível do fluido do freio' },
  { id: 13, critico: false, categoria: 'Capô do Motor', texto: 'Checar visualmente as baterias (desgaste, corrosão e aperto dos terminais)' },
  { id: 14, critico: false, categoria: 'Geral',         texto: 'Checar visualmente o estado geral da fixação elétrica (fixação, ressecamentos, danos)' },
  { id: 15, critico: true,  categoria: 'Geral',         texto: 'Checar visualmente a existência do manual de operação em português' },
  { id: 16, critico: false, categoria: 'Cabine',        texto: 'Checar visualmente o estado geral dos adesivos de identificação/segurança e realizar limpeza da cabine do operador' },
  { id: 17, critico: false, categoria: 'Cabine',        texto: 'Checar sistema de ignição/partida e funcionamento da marcha lenta (ruídos anormais na partida, oscilação de rotação do motor, vibrações e escapamento)' },
  { id: 18, critico: true,  categoria: 'Cabine',        texto: 'Checar o estado da botoeira de emergência (fixação, ressecamentos, trincas) e funcionamento adequado' },
  { id: 19, critico: true,  categoria: 'Cabine',        texto: 'Checar visualmente o painel de medidores quanto a normalidade de luzes de alerta' },
  { id: 20, critico: true,  categoria: 'Cabine',        texto: 'Checar nível de combustível (Sempre manter nível acima de 25% ou uma botija de GLP cheia)' },
  { id: 21, critico: true,  categoria: 'Cabine',        texto: 'Checar funcionamento da buzina e sirene de ré' },
  { id: 22, critico: true,  categoria: 'Cabine',        texto: 'Checar as condições do cinto de segurança (faixa, conectores e parafusos de fixação)' },
  { id: 23, critico: true,  categoria: 'Cabine',        texto: 'Checar visualmente o extintor de incêndio (mangueira, calibre, corpo, suporte, pino, etiqueta de inspeção e validade)' },
  { id: 24, critico: false, categoria: 'Cabine',        texto: 'Checar as condições do banco do operador e seu ajuste' },
  { id: 25, critico: true,  categoria: 'Cabine',        texto: 'Checar funcionamento do sistema hidráulico todas as funções (elevação; inclinação; direção; posicionador de quadro ou garfo)' },
  { id: 26, critico: true,  categoria: 'Sistema Içamento', texto: 'Checar visualmente as condições do quadro de carga, rolamentos, suporte de fixação e garfos (fixação, trincas, desgastes)' },
  { id: 27, critico: false, categoria: 'Sistema Içamento', texto: 'Checar visualmente alinhamento frontal/horizontal da ponta dos garfos da empilhadeira' },
  { id: 28, critico: true,  categoria: 'Sistema Içamento', texto: 'Checar visualmente cilindros hidráulicos (danos, corrosões, vazamentos, fixação de porcas e pinos)' },
  { id: 29, critico: false, categoria: 'Sistema Içamento', texto: 'Checar visualmente condição da corrente de elevação observando deformidades, tensão' },
  { id: 30, critico: true,  categoria: 'Sistema Içamento', texto: 'Checar visualmente condições da torre, buchas e seu trilho de fixação (trincas, desgastes)' },
  { id: 31, critico: true,  categoria: 'Cabine',        texto: 'Checar visualmente todas as lâmpadas da empilhadeira como luz de freio, setas, ré, farol e giroflex' },
  { id: 32, critico: true,  categoria: 'Cabine',        texto: 'Checar o funcionamento e folga do freio de serviço' },
  { id: 33, critico: true,  categoria: 'Cabine',        texto: 'Checar o funcionamento e folga do freio de estacionamento' },
  { id: 34, critico: true,  categoria: 'Cabine',        texto: 'Checar o funcionamento e folga do pedal corta transmissão' },
  { id: 35, critico: true,  categoria: 'Cabine',        texto: 'Checar o funcionamento e folga do pedal do acelerador' },
  { id: 36, critico: true,  categoria: 'Cabine',        texto: 'Checar o funcionamento do limitador de velocidade (10 km/h – equipamento limita velocidade)' },
  { id: 37, critico: true,  categoria: 'Cabine',        texto: 'Checar a existência de folga anormal do volante e coluna de direção do operador' },
  { id: 38, critico: true,  categoria: 'Geral',         texto: 'Checar visualmente vazamentos na empilhadeira (sistema hidráulica, motor, transmissão, diferencial, freio, líquido de arrefecimento)' },
  { id: 39, critico: true,  categoria: 'Cabine',        texto: 'Checar funcionamento do sistema de transmissão/direção (frente, neutro e ré)' },

  // ── Itens 40–47 (C / NC / NA — apenas se equipamento possuir telemetria) ──
  { id: 40, critico: false, categoria: 'Telemetria', texto: 'Checar o funcionamento da telemetria (aviso sonoro do leitor de cartão)', temNA: true },
  { id: 41, critico: false, categoria: 'Telemetria', texto: 'Checar o indicador de aviso do cinto de segurança no painel (visual e sonoro)', temNA: true },
  { id: 42, critico: false, categoria: 'Telemetria', texto: 'Checar o indicador do freio de estacionamento no painel (visual e sonoro)', temNA: true },
  { id: 43, critico: true,  categoria: 'Telemetria', texto: 'Checar funcionamento de sistema de bloqueio da transmissão e do sistema hidráulico (bloquear ao levantar do banco)', temNA: true },
  { id: 44, critico: true,  categoria: 'Telemetria', texto: 'Checar estado geral do para-brisa, limpador e esguicho d\'água (funcionamento, desgaste de borrachas e visibilidade)', temNA: true },
  { id: 45, critico: false, categoria: 'Telemetria', texto: 'Checar nível de água do reservatório do limpador (completar se abaixo de 50% do tanque)', temNA: true },
  { id: 46, critico: true,  categoria: 'Telemetria', texto: 'Checar a pressão do compressor de ar, drenar líquido de condensação no tanque de armazenamento de ar', temNA: true },
  { id: 47, critico: false, categoria: 'Telemetria', texto: 'Checar a pressão dos pneus quando pneumáticos', temNA: true },
]

// Categorias únicas para agrupamento visual
export const CATEGORIAS = [...new Set(CHECKLIST_ITEMS.map(i => i.categoria))]

// Turno options
export const TURNOS = ['Turno A (06h–14h)', 'Turno B (14h–22h)', 'Turno C (22h–06h)']
