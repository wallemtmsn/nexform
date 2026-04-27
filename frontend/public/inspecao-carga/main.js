// ── IC Number
function genICNumber() {
  var y = new Date().getFullYear();
  var n = String(Math.floor(Math.random() * 9000) + 1000);
  return 'IC-' + y + '-' + n;
}
var currentIC = genICNumber();
document.getElementById('ic-num').textContent = currentIC;

// ── Default date/time
document.getElementById('data').valueAsDate = new Date();
var _now = new Date();
var _horaStr = String(_now.getHours()).padStart(2,'0') + ':' + String(_now.getMinutes()).padStart(2,'0');
document.getElementById('hora').value = _horaStr;
document.getElementById('hora-mar').value = _horaStr;

// ── Tipo toggle
var currentTipo = 'terrestre';
function setTipo(tipo) {
  currentTipo = tipo;
  document.getElementById('btn-terrestre').classList.toggle('tipo-btn--active', tipo === 'terrestre');
  document.getElementById('btn-maritimo').classList.toggle('tipo-btn--active', tipo === 'maritimo');
  document.getElementById('campos-terrestre').style.display = tipo === 'terrestre' ? '' : 'none';
  document.getElementById('campos-maritimo').style.display = tipo === 'maritimo' ? '' : 'none';
}

// ── Checklist data
var IC_SECOES = [
  {
    id: 1, titulo: 'Inspeção de Eslingas', icone: 'bi-link-45deg',
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
    id: 2, titulo: 'Inspeção do Equipamento', icone: 'bi-box-seam',
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
    id: 3, titulo: 'Inspeção de Equipamento Utilizado', subtitulo: 'Quando Aplicável', icone: 'bi-boxes',
    itens: [
      { id: '3.1', texto: 'Os produtos estão devidamente amarrados para evitar movimentos durante o transporte? O equipamento possui rede de proteção na porta e a cinta de amarração?' },
      { id: '3.2', texto: 'No cinto de equipamento operário, está colocado na posição de proteção superior?' },
      { id: '3.3', texto: 'A carga está bem equilibrada (centro de gravidade)?' },
    ],
  },
  {
    id: 4, titulo: 'Inspeção Cilindros / Tanques / Químicos / Perigosos', icone: 'bi-exclamation-diamond',
    itens: [
      { id: '4.1', texto: 'Os cilindros estão pesados de forma segura no container? Possuem capacete nas válvulas? Os cilindros estão na posição vertical?' },
      { id: '4.2', texto: 'A carga possui identificação de risco (químicos, inflamáveis, explosivos, radioativos, e etc.)?' },
      { id: '4.3', texto: 'Os tanques possuem skid para proteção dos vasos?' },
      { id: '4.4', texto: 'As válvulas ou tampas estão sem vazamentos e lacradas?' },
    ],
  },
  {
    id: 5, titulo: 'Inspeção de Operação', icone: 'bi-gear',
    itens: [
      { id: '5.1', texto: 'Os o-rings (anéis) estão rachados, danificados, enferrujados ou gastos?' },
      { id: '5.2', texto: 'O veículo de transporte é adequado e compatível com a dimensão e peso da carga?' },
      { id: '5.3', texto: 'A empilhadeira, guindaste, ponte ou veículo é compatível com a carga máxima de trabalho do equipamento?' },
    ],
  },
  {
    id: 6, titulo: 'Inspeção de Objetos Soltos (DROPs)', icone: 'bi-arrow-down-circle',
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
    id: 7, titulo: 'Inspeção Final', icone: 'bi-patch-check',
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
];

var IC_TODOS_ITENS = [];
IC_SECOES.forEach(function(s) { IC_TODOS_ITENS = IC_TODOS_ITENS.concat(s.itens); });
var TOTAL = IC_TODOS_ITENS.length;

// ── State (var so inline handlers can access globally)
var respostas = {};
var obsItens  = {};

// ── Render sections
function renderSecoes() {
  var container = document.getElementById('secoes');
  container.innerHTML = IC_SECOES.map(function(secao) {
    return '<div class="card">' +
      '<div class="card-header">' +
        '<i class="bi ' + secao.icone + '"></i>' +
        '<div>' +
          '<h2>' + secao.id + '. ' + secao.titulo + '</h2>' +
          (secao.subtitulo ? '<span class="secao-sub">(' + secao.subtitulo + ')</span>' : '') +
        '</div>' +
        '<span class="cat-count">' + secao.itens.length + ' itens</span>' +
      '</div>' +
      '<div class="card-body card-body--itens">' +
        '<div class="itens-head">' +
          '<div class="itens-head-num">#</div>' +
          '<div class="itens-head-desc">Descrição</div>' +
          '<div class="itens-head-opt">C</div>' +
          '<div class="itens-head-opt">NC</div>' +
          '<div class="itens-head-opt">NA</div>' +
        '</div>' +
        secao.itens.map(function(item) {
          var wid = item.id.replace('.', '-');
          return '<div class="item-wrap" id="wrap-' + wid + '">' +
            '<div class="item-row">' +
              '<div class="item-num">' + item.id + '</div>' +
              '<div class="item-desc">' + item.texto + '</div>' +
              '<div class="item-opt"><button type="button" class="opt-btn opt-c" onclick="setResp(\'' + item.id + '\',\'C\')">C</button></div>' +
              '<div class="item-opt"><button type="button" class="opt-btn opt-nc" onclick="setResp(\'' + item.id + '\',\'NC\')">NC</button></div>' +
              '<div class="item-opt"><button type="button" class="opt-btn opt-na" onclick="setResp(\'' + item.id + '\',\'NA\')">NA</button></div>' +
            '</div>' +
            '<div class="item-obs" id="obs-row-' + wid + '" style="display:none;">' +
              '<input type="text" placeholder="Descreva a não conformidade..." oninput="obsItens[\'' + item.id + '\'] = this.value" />' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }).join('');
}
renderSecoes();

// ── Set response
function setResp(id, valor) {
  var wid  = id.replace('.', '-');
  var prev = respostas[id];

  if (prev === valor) {
    delete respostas[id];
  } else {
    respostas[id] = valor;
  }

  var wrap = document.getElementById('wrap-' + wid);
  wrap.querySelectorAll('.opt-btn').forEach(function(b) { b.classList.remove('opt-btn--selected'); });
  if (respostas[id]) {
    var cls = respostas[id] === 'C' ? '.opt-c' : respostas[id] === 'NC' ? '.opt-nc' : '.opt-na';
    wrap.querySelector(cls).classList.add('opt-btn--selected');
  }

  var obsRow = document.getElementById('obs-row-' + wid);
  var isNC   = respostas[id] === 'NC';
  obsRow.style.display = isNC ? '' : 'none';
  wrap.classList.toggle('item-wrap--nc', isNC);
  if (!isNC) {
    obsRow.querySelector('input').value = '';
    delete obsItens[id];
  }

  updateProgress();
}

// ── Progress
function updateProgress() {
  var respondidos = 0;
  IC_TODOS_ITENS.forEach(function(i) { if (respostas[i.id]) respondidos++; });
  var pct = Math.round((respondidos / TOTAL) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-label').textContent = respondidos + ' / ' + TOTAL + ' itens respondidos (' + pct + '%)';
}

// ── Validate
function validate() {
  var missing = [];
  if (!document.getElementById('cliente').value.trim()) missing.push('Cliente');
  if (!document.getElementById('data').value) missing.push('Data');

  if (currentTipo === 'terrestre') {
    if (!document.getElementById('motorista').value.trim())      missing.push('Motorista');
    if (!document.getElementById('transportadora').value.trim()) missing.push('Transportadora');
    if (!document.getElementById('placa').value.trim())          missing.push('Placa');
  } else {
    if (!document.getElementById('embarcacao').value.trim()) missing.push('Embarcação');
    if (!document.getElementById('manifesto').value.trim())  missing.push('Manifesto / MSL');
  }

  var semResposta = IC_TODOS_ITENS.filter(function(i) { return !respostas[i.id]; }).length;
  if (semResposta > 0) {
    missing.push(semResposta + ' item(ns) sem resposta — todos devem ser marcados como C, NC ou NA');
  }
  return missing;
}

// ── Collect data
function collectData() {
  var conformes     = IC_TODOS_ITENS.filter(function(i) { return respostas[i.id] === 'C'; }).length;
  var naoConformes  = IC_TODOS_ITENS.filter(function(i) { return respostas[i.id] === 'NC'; }).length;
  var naoAplicaveis = IC_TODOS_ITENS.filter(function(i) { return respostas[i.id] === 'NA'; }).length;
  return {
    ic:             currentIC,
    tipo:           currentTipo,
    cliente:        document.getElementById('cliente').value || '—',
    data:           document.getElementById('data').value || '—',
    motorista:      document.getElementById('motorista').value || '—',
    romaneio:       document.getElementById('romaneio').value || '—',
    transportadora: document.getElementById('transportadora').value || '—',
    placa:          document.getElementById('placa').value || '—',
    hora:           document.getElementById('hora').value || '—',
    inspetor:       document.getElementById('inspetor').value || '—',
    embarcacao:     document.getElementById('embarcacao').value || '—',
    manifesto:      document.getElementById('manifesto').value || '—',
    horaMar:        document.getElementById('hora-mar').value || '—',
    inspetorMar:    document.getElementById('inspetor-mar').value || '—',
    conformes:      conformes,
    naoConformes:   naoConformes,
    naoAplicaveis:  naoAplicaveis,
    totalItens:     TOTAL,
    obsGeral:       document.getElementById('obs-geral').value || '—',
    emitidoEm:      new Date().toLocaleString('pt-BR'),
  };
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  function fmtDate(s) {
    if (!s || s === '—') return '—';
    var parts = s.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  var identHTML = d.tipo === 'terrestre'
    ? '<div class="pdf-grid-3">' +
        '<div class="pdf-field"><label>Cliente</label><p>' + d.cliente + '</p></div>' +
        '<div class="pdf-field"><label>Data</label><p>' + fmtDate(d.data) + '</p></div>' +
        '<div class="pdf-field"><label>Hora</label><p>' + d.hora + '</p></div>' +
        '<div class="pdf-field"><label>Motorista</label><p>' + d.motorista + '</p></div>' +
        '<div class="pdf-field"><label>Romaneio</label><p>' + d.romaneio + '</p></div>' +
        '<div class="pdf-field"><label>Transportadora</label><p>' + d.transportadora + '</p></div>' +
        '<div class="pdf-field"><label>Placa</label><p>' + d.placa + '</p></div>' +
        '<div class="pdf-field"><label>Inspecionado por</label><p>' + d.inspetor + '</p></div>' +
      '</div>'
    : '<div class="pdf-grid-3">' +
        '<div class="pdf-field"><label>Cliente</label><p>' + d.cliente + '</p></div>' +
        '<div class="pdf-field"><label>Data</label><p>' + fmtDate(d.data) + '</p></div>' +
        '<div class="pdf-field"><label>Hora</label><p>' + d.horaMar + '</p></div>' +
        '<div class="pdf-field span-2"><label>Embarcação</label><p>' + d.embarcacao + '</p></div>' +
        '<div class="pdf-field span-2"><label>Manifesto / MSL</label><p>' + d.manifesto + '</p></div>' +
        '<div class="pdf-field"><label>Inspecionado por</label><p>' + d.inspetorMar + '</p></div>' +
      '</div>';

  var secoesHTML = IC_SECOES.map(function(secao) {
    var itensHTML = secao.itens.map(function(item) {
      var resp = respostas[item.id] || '—';
      var obs  = obsItens[item.id] ? ' <div class="pdf-item-obs">Obs: ' + obsItens[item.id] + '</div>' : '';
      var color = resp === 'C' ? '#16a34a' : resp === 'NC' ? '#dc2626' : '#6b7f9a';
      return '<div class="pdf-item-row">' +
        '<div class="pdf-item-id">' + item.id + '</div>' +
        '<div class="pdf-item-desc">' + item.texto + obs + '</div>' +
        '<div class="pdf-item-resp" style="color:' + color + ';">' + resp + '</div>' +
      '</div>';
    }).join('');
    return '<div class="pdf-section">' +
      '<div class="pdf-section-title">' + secao.id + '. ' + secao.titulo + (secao.subtitulo ? ' (' + secao.subtitulo + ')' : '') + '</div>' +
      itensHTML +
    '</div>';
  }).join('');

  var obsHTML = d.obsGeral !== '—'
    ? '<div class="pdf-section"><div class="pdf-section-title">Observações Gerais</div><div class="pdf-obs-box">' + d.obsGeral + '</div></div>'
    : '';

  return '<div class="pdf-header">' +
    '<div class="pdf-logo">Nex<span>form</span></div>' +
    '<div class="pdf-title-block"><h1>Checklist de Inspeção de Carga</h1><p>Tipo: ' + (d.tipo === 'terrestre' ? 'Terrestre' : 'Marítimo') + '</p></div>' +
    '<div class="pdf-num"><span>Número</span><strong>' + d.ic + '</strong><span>Emitido: ' + d.emitidoEm + '</span></div>' +
  '</div>' +
  '<div class="pdf-section">' +
    '<div class="pdf-section-title">Identificação</div>' +
    identHTML +
  '</div>' +
  '<div class="pdf-section">' +
    '<div class="pdf-section-title">Resumo</div>' +
    '<div class="pdf-grid-3">' +
      '<div class="pdf-field"><label>Total de Itens</label><p>' + d.totalItens + '</p></div>' +
      '<div class="pdf-field"><label>Conformes (C)</label><p style="color:#16a34a;font-weight:600;">' + d.conformes + '</p></div>' +
      '<div class="pdf-field"><label>Não Conformes (NC)</label><p style="color:#dc2626;font-weight:600;">' + d.naoConformes + '</p></div>' +
      '<div class="pdf-field"><label>Não Aplicáveis (NA)</label><p>' + d.naoAplicaveis + '</p></div>' +
    '</div>' +
  '</div>' +
  secoesHTML +
  obsHTML +
  '<div class="pdf-section">' +
    '<div class="pdf-section-title">Assinaturas</div>' +
    '<div class="pdf-sig-grid">' +
      '<div class="pdf-sig-box"><div class="pdf-sig-label">Inspecionado por</div></div>' +
      '<div class="pdf-sig-box"><div class="pdf-sig-label">Finalizado por / Aprovado pelo Líder</div></div>' +
    '</div>' +
  '</div>' +
  '<div class="pdf-footer">' +
    '<span>Nexform · Sistema de Inspeção de Carga</span>' +
    '<span>' + d.ic + ' · ' + d.emitidoEm + '</span>' +
    '<span>Válido somente com assinaturas</span>' +
  '</div>';
}

// ── Generate PDF
async function gerarPDF() {
  var missing = validate();
  if (missing.length) { showErrorModal(missing); return; }

  var d   = collectData();
  var btn = document.querySelector('.btn-primary');
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Gerando...';
  btn.disabled = true;

  var tpl = document.getElementById('pdf-template');
  tpl.innerHTML = buildPDFHTML(d);
  await new Promise(function(r) { setTimeout(r, 300); });

  try {
    var canvas = await html2canvas(tpl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, windowWidth: 794 });
    var jsPDF  = window.jspdf.jsPDF;
    var pdf    = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
    var pW     = pdf.internal.pageSize.getWidth();
    var pH     = pdf.internal.pageSize.getHeight();
    var ratio  = pW / canvas.width;
    var imgH   = canvas.height * ratio;

    if (imgH <= pH) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pW, imgH);
    } else {
      var yOffset = 0;
      while (yOffset < canvas.height) {
        var sliceH = Math.min(pH / ratio, canvas.height - yOffset);
        var c2 = document.createElement('canvas');
        c2.width = canvas.width; c2.height = sliceH;
        c2.getContext('2d').drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(c2.toDataURL('image/png'), 'PNG', 0, 0, pW, sliceH * ratio);
        yOffset += sliceH;
      }
    }

    pdf.save(d.ic + '.pdf');
    tpl.innerHTML = '';
    document.getElementById('modal-ic-num').textContent = d.ic;
    document.getElementById('success-overlay').classList.add('open');
  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Relatório';
  btn.disabled = false;
}

// ── Modal helpers
function closeModal() { document.getElementById('success-overlay').classList.remove('open'); }
function showErrorModal(missing) {
  document.getElementById('modal-missing-list').innerHTML = missing.map(function(m) { return '<li>' + m + '</li>'; }).join('');
  document.getElementById('error-overlay').classList.add('open');
}
function closeErrorModal() { document.getElementById('error-overlay').classList.remove('open'); }

// ── Nova inspeção
function novaInspecao() {
  if (!confirm('Iniciar nova inspeção? Os dados atuais serão perdidos.')) return;

  for (var k in respostas) delete respostas[k];
  for (var k in obsItens)  delete obsItens[k];

  renderSecoes();

  ['cliente','motorista','romaneio','transportadora','placa','inspetor','embarcacao','manifesto','inspetor-mar','obs-geral']
    .forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });

  document.getElementById('data').valueAsDate = new Date();
  var n = new Date();
  var t = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  document.getElementById('hora').value = t;
  document.getElementById('hora-mar').value = t;

  setTipo('terrestre');
  updateProgress();
  currentIC = genICNumber();
  document.getElementById('ic-num').textContent = currentIC;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
