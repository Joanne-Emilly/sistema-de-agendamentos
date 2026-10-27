// ========================================
// SISTEMA DE AGENDAMENTO ESCOLAR
// ETAPA 7 — ARMAZENAMENTO E LISTAGEM
// ========================================

const formularioAgendamento = document.querySelector("#formularioAgendamento");

const mensagemFormulario = document.querySelector("#mensagemFormulario");

const campoDataAgendamento = document.querySelector("#dataAgendamento");

const campoHorarioInicio = document.querySelector("#horarioInicio");

const campoHorarioFim = document.querySelector("#horarioFim");

const listaAgendamentos = document.querySelector("#listaAgendamentos");

const estadoVazio = document.querySelector("#estadoVazio");

const contadorAgendamentos = document.querySelector("#contadorAgendamentos");

const chaveArmazenamento = "agendamentosEscolares";

// ========================================
// ARMAZENAMENTO
// ========================================

function obterAgendamentos() {
  try {
    const dadosSalvos = localStorage.getItem(chaveArmazenamento);

    if (!dadosSalvos) {
      return [];
    }

    const agendamentos = JSON.parse(dadosSalvos);

    return Array.isArray(agendamentos) ? agendamentos : [];
  } catch (erro) {
    console.error("Não foi possível ler os agendamentos:", erro);
    return [];
  }
}

function salvarAgendamentos(agendamentos) {
  try {
    localStorage.setItem(chaveArmazenamento, JSON.stringify(agendamentos));

    return true;
  } catch (erro) {
    console.error("Não foi possível salvar os agendamentos:", erro);

    exibirMensagemFormulario(
      "Não foi possível salvar os dados no navegador. Verifique o espaço disponível e as configurações de armazenamento.",
      "erro",
    );

    return false;
  }
}

// ========================================
// DATAS E VALIDAÇÕES
// ========================================

function obterDataLocalAtual() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function definirDataMinima() {
  campoDataAgendamento.min = obterDataLocalAtual();
}

function validarHorarios() {
  const horarioInicio = campoHorarioInicio.value;
  const horarioFim = campoHorarioFim.value;

  campoHorarioFim.setCustomValidity("");

  if (!horarioInicio || !horarioFim) {
    return true;
  }

  if (horarioFim <= horarioInicio) {
    campoHorarioFim.setCustomValidity(
      "O horário de término deve ser posterior ao horário de início.",
    );

    return false;
  }

  return true;
}

function existeConflito(novoAgendamento, agendamentos) {
  return agendamentos.some((agendamento) => {
    if (agendamento.status === "cancelado") {
      return false;
    }

    const mesmoEspaco =
      agendamento.espacoEscolar === novoAgendamento.espacoEscolar;

    const mesmaData =
      agendamento.dataAgendamento === novoAgendamento.dataAgendamento;

    const horariosSobrepostos =
      novoAgendamento.horarioInicio < agendamento.horarioFim &&
      novoAgendamento.horarioFim > agendamento.horarioInicio;

    return mesmoEspaco && mesmaData && horariosSobrepostos;
  });
}

// ========================================
// MENSAGENS DO FORMULÁRIO
// ========================================

function exibirMensagemFormulario(mensagem, tipo) {
  mensagemFormulario.textContent = mensagem;
  mensagemFormulario.className = `mensagemFormulario ${tipo}`;
  mensagemFormulario.hidden = false;
}

function limparMensagemFormulario() {
  mensagemFormulario.textContent = "";
  mensagemFormulario.className = "mensagemFormulario";
  mensagemFormulario.hidden = true;
}

// ========================================
// CRIAÇÃO DE ELEMENTOS DA LISTA
// ========================================

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}

function adicionarDetalhe(container, rotulo, valor, classeExtra = "") {
  const detalhe = criarElemento(
    "div",
    `detalheAgendamento ${classeExtra}`.trim(),
  );

  detalhe.appendChild(criarElemento("span", "rotuloDetalhe", rotulo));

  detalhe.appendChild(criarElemento("span", "valorDetalhe", valor));

  container.appendChild(detalhe);
}

function formatarData(data) {
  if (!data) {
    return "Não informada";
  }

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

// ========================================
// EXIBIÇÃO DOS AGENDAMENTOS
// ========================================

function criarCardAgendamento(agendamento) {
  const card = criarElemento("article", "cardAgendamento");

  const cabecalho = criarElemento("div", "cabecalhoAgendamento");
  const identificacao = criarElemento("div");

  identificacao.appendChild(
    criarElemento("h3", "tituloAgendamento", agendamento.espacoEscolar),
  );

  identificacao.appendChild(
    criarElemento(
      "span",
      "identificadorAgendamento",
      `Solicitação #${agendamento.id}`,
    ),
  );

  const cancelado = agendamento.status === "cancelado";

  const status = criarElemento(
    "span",
    `statusAgendamento ${cancelado ? "statusCancelado" : "statusPendente"}`,
    cancelado ? "Cancelado" : "Pendente",
  );

  cabecalho.append(identificacao, status);

  const detalhes = criarElemento("div", "detalhesAgendamento");

  adicionarDetalhe(
    detalhes,
    "Professor(a) responsável",
    agendamento.professorResponsavel,
  );

  adicionarDetalhe(detalhes, "Turma", agendamento.turma);

  adicionarDetalhe(detalhes, "Data", formatarData(agendamento.dataAgendamento));

  adicionarDetalhe(
    detalhes,
    "Horário",
    `${agendamento.horarioInicio} às ${agendamento.horarioFim}`,
  );

  adicionarDetalhe(
    detalhes,
    "Finalidade",
    agendamento.finalidade,
    "finalidadeAgendamento",
  );

  card.append(cabecalho, detalhes);

  if (!cancelado) {
    const acoes = criarElemento("div", "acoesAgendamento");

    const botaoCancelar = criarElemento(
      "button",
      "botaoCancelarAgendamento",
      "Cancelar solicitação",
    );

    botaoCancelar.type = "button";
    botaoCancelar.dataset.id = String(agendamento.id);
    botaoCancelar.setAttribute(
      "aria-label",
      `Cancelar solicitação ${agendamento.id}`,
    );

    acoes.appendChild(botaoCancelar);
    card.appendChild(acoes);
  }

  return card;
}

function renderizarAgendamentos() {
  const agendamentos = obterAgendamentos();

  listaAgendamentos.replaceChildren();

  const quantidade = agendamentos.length;

  contadorAgendamentos.textContent =
    quantidade === 1 ? "1 agendamento" : `${quantidade} agendamentos`;

  if (quantidade === 0) {
    const mensagemVazia = criarElemento("div", "estadoVazio");

    mensagemVazia.appendChild(
      criarElemento("h3", "", "Nenhum agendamento cadastrado"),
    );

    mensagemVazia.appendChild(
      criarElemento(
        "p",
        "",
        "Quando você registrar uma solicitação, ela aparecerá nesta seção.",
      ),
    );

    listaAgendamentos.appendChild(mensagemVazia);
    return;
  }

  // Mostra primeiro as reservas mais recentes pela data e horário.
  agendamentos.sort((a, b) => {
    const dataA = `${a.dataAgendamento}T${a.horarioInicio}`;
    const dataB = `${b.dataAgendamento}T${b.horarioInicio}`;

    return dataB.localeCompare(dataA);
  });

  agendamentos.forEach((agendamento) => {
    listaAgendamentos.appendChild(criarCardAgendamento(agendamento));
  });
}

// ========================================
// CADASTRO DE AGENDAMENTOS
// ========================================

formularioAgendamento.addEventListener("submit", (evento) => {
  evento.preventDefault();

  limparMensagemFormulario();

  if (!formularioAgendamento.reportValidity()) {
    return;
  }

  if (!validarHorarios()) {
    campoHorarioFim.reportValidity();
    return;
  }

  if (campoDataAgendamento.value < obterDataLocalAtual()) {
    exibirMensagemFormulario(
      "Selecione uma data igual ou posterior à data atual.",
      "erro",
    );

    campoDataAgendamento.focus();
    return;
  }

  const novoAgendamento = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    professorResponsavel:
      formularioAgendamento.elements.professorResponsavel.value.trim(),
    turma: formularioAgendamento.elements.turma.value.trim(),
    espacoEscolar: formularioAgendamento.elements.espacoEscolar.value,
    dataAgendamento: campoDataAgendamento.value,
    horarioInicio: campoHorarioInicio.value,
    horarioFim: campoHorarioFim.value,
    finalidade: formularioAgendamento.elements.finalidade.value.trim(),
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };

  if (
    !novoAgendamento.professorResponsavel ||
    !novoAgendamento.turma ||
    !novoAgendamento.finalidade
  ) {
    exibirMensagemFormulario("Preencha todos os campos obrigatórios.", "erro");

    return;
  }

  const agendamentos = obterAgendamentos();

  if (existeConflito(novoAgendamento, agendamentos)) {
    exibirMensagemFormulario(
      "Já existe uma solicitação ativa para esse espaço, nessa data, com horário sobreposto. Escolha outro horário ou outro espaço.",
      "erro",
    );

    return;
  }

  agendamentos.push(novoAgendamento);

  if (!salvarAgendamentos(agendamentos)) {
    return;
  }

  formularioAgendamento.reset();
  definirDataMinima();
  renderizarAgendamentos();

  exibirMensagemFormulario(
    "Solicitação registrada neste navegador com sucesso! O status inicial é Pendente.",
    "sucesso",
  );
});

// ========================================
// CANCELAMENTO DE SOLICITAÇÕES
// ========================================

listaAgendamentos.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".botaoCancelarAgendamento");

  if (!botao) {
    return;
  }

  const id = botao.dataset.id;

  const confirmar = window.confirm(
    "Deseja realmente cancelar esta solicitação?",
  );

  if (!confirmar) {
    return;
  }

  const agendamentos = obterAgendamentos();

  const agendamento = agendamentos.find((item) => String(item.id) === id);

  if (!agendamento || agendamento.status === "cancelado") {
    return;
  }

  agendamento.status = "cancelado";
  agendamento.canceladoEm = new Date().toISOString();

  if (salvarAgendamentos(agendamentos)) {
    renderizarAgendamentos();
  }
});

// ========================================
// EVENTOS AUXILIARES
// ========================================

campoHorarioInicio.addEventListener("change", () => {
  campoHorarioFim.setCustomValidity("");
  limparMensagemFormulario();
});

campoHorarioFim.addEventListener("change", () => {
  validarHorarios();
  limparMensagemFormulario();
});

campoDataAgendamento.addEventListener("change", () => {
  limparMensagemFormulario();
});

formularioAgendamento.addEventListener("reset", () => {
  setTimeout(() => {
    campoHorarioFim.setCustomValidity("");
    limparMensagemFormulario();
    definirDataMinima();
  }, 0);
});

// ========================================
// INICIALIZAÇÃO
// ========================================

definirDataMinima();
renderizarAgendamentos();
