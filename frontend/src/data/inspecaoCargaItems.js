// ============================================================
// src/data/inspecaoCargaItems.js
// Checklist de Inspeção de Carga — NEXFORMS
// Legenda: C = Conforme | NC = Não Conforme | NA = Não Aplicável
// ============================================================

export const IC_SECOES = [
  {
    id: 1,
    titulo: 'Inspeção de Eslingas',
    icone: 'bi-link-45deg',
    itens: [
      { id: '1.1', texto: 'Todas as manilhas são de 4 partes e todas as partes estão presentes no conjunto? Existe algum desgaste, rachadura, sinais de corrosão ou deformação? As manilhas apresentam ser soldadas?' },
      { id: '1.2', texto: 'Os contrapinos estão travados, há algum risco de ferimento? (se foram muito longos cortar e/ou anilhar)' },
      { id: '1.3', texto: 'Os olhais estão alinhados? (todos para o centro do içamento) Os orifícios dos olhais estão lisos e não dentados? Existe alguma avaria? (ferrugem, trinca, amassado)' },
      { id: '1.4', texto: 'A plaqueta está bem presa e segura? A identificação é legível?' },
      { id: '1.5', texto: 'Existe algum fio quebrado, torção na eslinga, falhas, avarias ou excesso de corrosão? Existe algum dano por calor ou queimadura por químicos na eslinga?' },
      { id: '1.6', texto: 'As eslingas são longas o suficiente para permitir ângulo de 45° entre a eslinga e carga? As eslingas são longas o suficiente para serem acessadas no deck ou no chão?' },
      { id: '1.7', texto: 'A eslinga está identificada com Colour Code correto do cliente? (quando aplicável)' },
    ],
  },
  {
    id: 2,
    titulo: 'Inspeção do Equipamento',
    icone: 'bi-box-seam',
    itens: [
      { id: '2.1', texto: 'Existe plaqueta de identificação única visível descrevendo pesos, dimensão e validade?' },
      { id: '2.2', texto: 'A estrutura (interior, inferior e exterior) do equipamento está avariada? Exemplo: rachadura, amassado, corrosão excessiva, bolsas para o manuseio com empilhadeiras ou fios?' },
      { id: '2.3', texto: 'O bujão de dreno está preso ao equipamento, sem sinal de vazamento?' },
      { id: '2.4', texto: 'Existem elementos destrutivos (correntes, cintas, etc.) em boa condição? Há algum mecanismo de fechamento secundário? (atentar para porta e janela de container escritório)' },
      { id: '2.5', texto: 'A porta, dobradiças e trava funcionam / fecham corretamente? (checar pinos, chaves de pinos, mosquetão, escotilhas, borboletas e etc.)' },
      { id: '2.6', texto: 'Existe algum item saliente que pode causar lesão ou desprender do conjunto? (GPS de equipamento ou olhais de içamento / pesão)' },
      { id: '2.7', texto: 'Na abertura do equipamento, foi verificado a presença de materiais ou resíduos? Caso haja resíduo, verificar se possui MMR.' },
    ],
  },
  {
    id: 3,
    titulo: 'Inspeção de Equipamento Utilizado',
    subtitulo: 'Quando Aplicável',
    icone: 'bi-boxes',
    itens: [
      { id: '3.1', texto: 'Os produtos estão devidamente amarrados para evitar movimentos durante o transporte? O equipamento possui rede de proteção na porta e a cinta de amarração?' },
      { id: '3.2', texto: 'No cinto de equipamento operário, está colocado na posição de proteção superior?' },
      { id: '3.3', texto: 'A carga está bem equilibrada (centro de gravidade)?' },
    ],
  },
  {
    id: 4,
    titulo: 'Inspeção Cilindros / Tanques / Químicos / Perigosos',
    icone: 'bi-exclamation-diamond',
    itens: [
      { id: '4.1', texto: 'Os cilindros estão pesados de forma segura no container? Possuem capacete nas válvulas? Os cilindros estão na posição vertical?' },
      { id: '4.2', texto: 'A carga possui identificação de risco (químicos, inflamáveis, explosivos, radioativos, e etc.)?' },
      { id: '4.3', texto: 'Os tanques possuem skid para proteção dos vasos?' },
      { id: '4.4', texto: 'As válvulas ou tampas estão sem vazamentos e lacradas?' },
    ],
  },
  {
    id: 5,
    titulo: 'Inspeção de Operação',
    icone: 'bi-gear',
    itens: [
      { id: '5.1', texto: 'Os o-rings (anéis) estão rachados, danificados, enferrujados ou gastos?' },
      { id: '5.2', texto: 'O veículo de transporte é adequado e compatível com a dimensão e peso da carga?' },
      { id: '5.3', texto: 'A empilhadeira, guindaste, ponte ou veículo é compatível com a carga máxima de trabalho do equipamento?' },
    ],
  },
  {
    id: 6,
    titulo: 'Inspeção de Objetos Soltos (DROPs)',
    icone: 'bi-arrow-down-circle',
    itens: [
      { id: '6.1', texto: 'Na parte inferior do container, foram inspecionados as bolsas, bocas dos containers e válvula de dreno (quando houver), e removidos quaisquer objetos soltos com potencial de queda?' },
      { id: '6.2', texto: 'Foram utilizados acessórios que garantem a inspeção do container, como escada (parte superior), lanterna (noturno) etc.?' },
      { id: '6.3', texto: 'Foi identificado algum objeto solto ou anomalia com equipamento ou acessórios de içamento, que traga risco de queda? (exemplos: manilhas, contra pinos, correntes de amarração, dispositivos, eslingas e outros)' },
      { id: '6.4', texto: 'Para equipamentos open top (containers sem teto e cestas): foi possível verificar a evidência de algum material sem pesão ou mal pesado?' },
      { id: '6.5', texto: 'Existem rachaduras e superfícies irregulares da carga e estrutura do equipamento?' },
      { id: '6.6', texto: 'Foram inspecionados os dispositivos de travamento das portas e a fixação de barras de proteção, muito comum nos containers de rancho?' },
    ],
  },
  {
    id: 7,
    titulo: 'Inspeção Final',
    icone: 'bi-patch-check',
    itens: [
      { id: '7.1', texto: 'Os certificados do equipamento e dos acessórios de elevação de carga estão dentro do prazo de validade? Esse prazo é suficiente para prevenir que o equipamento se mantenha certificado até o retorno à base?' },
      { id: '7.2', texto: 'A capacidade do peso total do conjunto de içamento é igual ou maior que a carga máxima de trabalho do equipamento?' },
      { id: '7.3', texto: 'Verificado se há placas ou avisos fixados na estrutura da carga que possuem peso igual ou acima de 10 Toneladas?' },
      { id: '7.4', texto: 'Conferência da numeração do container: é a mesma em todos os documentos?' },
      { id: '7.5', texto: 'A quantidade de containers no físico é a mesma que a dos documentos?' },
      { id: '7.6', texto: 'Todos os documentos obrigatórios para cada tipo de carga estão disponíveis? (Certificado, Ficha de emergência, Autorização do Exército, CNEN, RT, manifesto, Nota Fiscal, etc.)' },
      { id: '7.7', texto: 'Materiais perigosos: Estão devidamente identificados e com FDS (Ficha de Dados de Segurança)? (Exemplo: químicos, inflamáveis, corrosivos, explosivos, radioativos)' },
      { id: '7.8', texto: 'Remover etiquetas antigas de embarque, desembarque ou GSA.' },
    ],
  },
]

export const IC_TODOS_ITENS = IC_SECOES.flatMap(s => s.itens)
