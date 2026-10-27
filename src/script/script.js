// ========================================
// SISTEMA DE AGENDAMENTO ESCOLAR
// ARMAZENAMENTO, LISTAGEM, CONSULTA E AGENDA DIÁRIA
// ========================================

// ========================================
// ELEMENTOS DO FORMULÁRIO DE AGENDAMENTO
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
const secaoAgendamento = document.querySelector("#novoAgendamento");
const botaoCancelarEdicao = document.querySelector("#botaoCancelarEdicao");
const botaoLimparFormulario = document.querySelector("#botaoLimparFormulario");
const textoBotaoEnviar = document.querySelector("#textoBotaoEnviar");

let agendamentoEmEdicao = null;

// ========================================
// ELEMENTOS DA CONSULTA DE DISPONIBILIDADE
// ========================================

const formularioConsultaDisponibilidade = document.querySelector(
  "#formularioConsultaDisponibilidade",
);

const filtroEspaco = document.querySelector("#filtroEspaco");
const filtroData = document.querySelector("#filtroData");

const resultadoDisponibilidade = document.querySelector(
  "#resultadoDisponibilidade",
);

// ========================================
// ELEMENTOS DA AGENDA DIÁRIA
// ========================================

const formularioAgendaDiaria = document.querySelector(
  "#formularioAgendaDiaria",
);

const dataAgendaDiaria = document.querySelector("#dataAgendaDiaria");
const espacoAgendaDiaria = document.querySelector("#espacoAgendaDiaria");
const linhaTempoAgenda = document.querySelector("#linhaTempoAgenda");

const dataSelecionadaAgenda = document.querySelector("#dataSelecionadaAgenda");

const totalAgendamentosAgenda = document.querySelector(
  "#totalAgendamentosAgenda",
);

const totalEspacosOcupadosAgenda = document.querySelector(
  "#totalEspacosOcupadosAgenda",
);

const tituloLinhaTempoAgenda = document.querySelector(
  "#tituloLinhaTempoAgenda",
);

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

    if (!Array.isArray(agendamentos)) {
      return [];
    }

    // Atualiza registros antigos que ainda estavam pendentes.
    // Todo agendamento ativo passa a ser considerado confirmado.
    let houveAlteracao = false;

    const agendamentosAtualizados = agendamentos.map((agendamento) => {
      const statusAtual = String(agendamento.status || "")
        .trim()
        .toLowerCase();

      if (statusAtual === "pendente") {
        houveAlteracao = true;

        return {
          ...agendamento,
          status: "confirmado",
        };
      }

      if (!statusAtual && agendamento.status !== "cancelado") {
        houveAlteracao = true;

        return {
          ...agendamento,
          status: "confirmado",
        };
      }

      return {
        ...agendamento,
        status: statusAtual || "confirmado",
      };
    });

    if (houveAlteracao) {
      localStorage.setItem(
        chaveArmazenamento,
        JSON.stringify(agendamentosAtualizados),
      );
    }

    return agendamentosAtualizados;
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
  if (campoDataAgendamento) {
    campoDataAgendamento.min = obterDataLocalAtual();
  }
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

// ========================================
// VERIFICAÇÃO DE CONFLITOS
// ========================================

function existeConflito(novoAgendamento, agendamentos, idIgnorado = null) {
  return agendamentos.some((agendamento) => {
    // Ignora o próprio registro durante a edição.
    if (idIgnorado !== null && String(agendamento.id) === String(idIgnorado)) {
      return false;
    }

    // Reservas canceladas não geram conflitos.
    if (String(agendamento.status).toLowerCase() === "cancelado") {
      return false;
    }

    const mesmoEspaco =
      agendamento.espacoEscolar === novoAgendamento.espacoEscolar;

    const mesmaData =
      agendamento.dataAgendamento === novoAgendamento.dataAgendamento;

    // Verifica se os horários se sobrepõem.
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
// CRIAÇÃO DE ELEMENTOS HTML
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

  detalhe.appendChild(
    criarElemento("span", "valorDetalhe", valor || "Não informado"),
  );

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
      `Agendamento #${agendamento.id}`,
    ),
  );

  const cancelado = String(agendamento.status).toLowerCase() === "cancelado";

  const status = criarElemento(
    "span",
    `statusAgendamento ${cancelado ? "statusCancelado" : "statusConfirmado"}`,
    cancelado ? "Cancelado" : "Confirmado",
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

    const botaoEditar = criarElemento(
      "button",
      "botaoEditarAgendamento",
      "Editar",
    );

    botaoEditar.type = "button";
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = String(agendamento.id);

    botaoEditar.setAttribute(
      "aria-label",
      `Editar agendamento ${agendamento.id}`,
    );

    const botaoCancelar = criarElemento(
      "button",
      "botaoCancelarAgendamento",
      "Cancelar agendamento",
    );

    botaoCancelar.type = "button";
    botaoCancelar.dataset.acao = "cancelar";
    botaoCancelar.dataset.id = String(agendamento.id);

    botaoCancelar.setAttribute(
      "aria-label",
      `Cancelar agendamento ${agendamento.id}`,
    );

    acoes.append(botaoEditar, botaoCancelar);
    card.appendChild(acoes);
  }

  return card;
}

function renderizarAgendamentos() {
  const agendamentos = obterAgendamentos();

  listaAgendamentos.replaceChildren();

  contadorAgendamentos.textContent =
    agendamentos.length === 1
      ? "1 agendamento"
      : `${agendamentos.length} agendamentos`;

  if (agendamentos.length === 0) {
    const mensagemVazia = criarElemento("div", "estadoVazio");

    mensagemVazia.appendChild(
      criarElemento("h3", "", "Nenhum agendamento cadastrado"),
    );

    mensagemVazia.appendChild(
      criarElemento(
        "p",
        "",
        "Quando você registrar um agendamento, ele aparecerá nesta seção.",
      ),
    );

    listaAgendamentos.appendChild(mensagemVazia);

    return;
  }

  // Mostra primeiro os agendamentos mais recentes.
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
// EDIÇÃO DE AGENDAMENTOS
// ========================================

function iniciarEdicao(id) {
  const agendamentos = obterAgendamentos();

  const agendamento = agendamentos.find(
    (item) => String(item.id) === String(id),
  );

  if (
    !agendamento ||
    String(agendamento.status).toLowerCase() === "cancelado"
  ) {
    exibirMensagemFormulario("Este agendamento não pode ser editado.", "erro");

    return;
  }

  agendamentoEmEdicao = String(agendamento.id);

  formularioAgendamento.elements.professorResponsavel.value =
    agendamento.professorResponsavel;

  formularioAgendamento.elements.turma.value = agendamento.turma;

  formularioAgendamento.elements.espacoEscolar.value =
    agendamento.espacoEscolar;

  campoDataAgendamento.value = agendamento.dataAgendamento;

  campoHorarioInicio.value = agendamento.horarioInicio;

  campoHorarioFim.value = agendamento.horarioFim;

  formularioAgendamento.elements.finalidade.value = agendamento.finalidade;

  textoBotaoEnviar.textContent = "Salvar alterações";

  botaoCancelarEdicao.hidden = false;
  botaoLimparFormulario.hidden = true;

  secaoAgendamento.classList.add("emEdicao");

  limparMensagemFormulario();

  mostrarPagina("novoAgendamento");

  secaoAgendamento.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  formularioAgendamento.elements.professorResponsavel.focus();
}

function encerrarEdicao(limparFormulario = true) {
  agendamentoEmEdicao = null;

  if (limparFormulario) {
    formularioAgendamento.reset();
  }

  textoBotaoEnviar.textContent = "Solicitar agendamento";

  botaoCancelarEdicao.hidden = true;
  botaoLimparFormulario.hidden = false;

  secaoAgendamento.classList.remove("emEdicao");

  definirDataMinima();
  limparMensagemFormulario();
}

// ========================================
// CADASTRO E ATUALIZAÇÃO DE AGENDAMENTOS
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

  const dataSelecionada = campoDataAgendamento.value;
  const dataAtual = obterDataLocalAtual();

  // Não permite datas passadas em novos agendamentos.
  if (agendamentoEmEdicao === null && dataSelecionada < dataAtual) {
    exibirMensagemFormulario(
      "Selecione uma data igual ou posterior à data atual.",
      "erro",
    );

    campoDataAgendamento.focus();

    return;
  }

  const dadosFormulario = {
    professorResponsavel:
      formularioAgendamento.elements.professorResponsavel.value.trim(),

    turma: formularioAgendamento.elements.turma.value.trim(),

    espacoEscolar: formularioAgendamento.elements.espacoEscolar.value,

    dataAgendamento: campoDataAgendamento.value,

    horarioInicio: campoHorarioInicio.value,

    horarioFim: campoHorarioFim.value,

    finalidade: formularioAgendamento.elements.finalidade.value.trim(),
  };

  const camposObrigatorios = Object.values(dadosFormulario);

  if (camposObrigatorios.some((valor) => !valor)) {
    exibirMensagemFormulario("Preencha todos os campos obrigatórios.", "erro");

    return;
  }

  const agendamentos = obterAgendamentos();

  // Confere conflitos antes de confirmar o agendamento.
  if (existeConflito(dadosFormulario, agendamentos, agendamentoEmEdicao)) {
    exibirMensagemFormulario(
      "Este espaço já possui um agendamento nesse período. Escolha outro horário ou outro espaço.",
      "erro",
    );

    return;
  }

  // ========================================
  // MODO DE EDIÇÃO
  // ========================================

  if (agendamentoEmEdicao !== null) {
    const indice = agendamentos.findIndex(
      (item) => String(item.id) === agendamentoEmEdicao,
    );

    if (
      indice === -1 ||
      String(agendamentos[indice].status).toLowerCase() === "cancelado"
    ) {
      encerrarEdicao();

      exibirMensagemFormulario(
        "O agendamento não foi encontrado ou já foi cancelado.",
        "erro",
      );

      return;
    }

    const agendamentoOriginal = agendamentos[indice];

    agendamentos[indice] = {
      ...agendamentoOriginal,
      ...dadosFormulario,
      status: "confirmado",
      atualizadoEm: new Date().toISOString(),
    };

    if (!salvarAgendamentos(agendamentos)) {
      return;
    }

    encerrarEdicao();

    renderizarAgendamentos();
    consultarDisponibilidadeAtual();
    renderizarAgendaDiaria();

    exibirMensagemFormulario(
      "Agendamento atualizado e confirmado com sucesso!",
      "sucesso",
    );

    return;
  }

  // ========================================
  // MODO DE NOVO CADASTRO
  // ========================================

  const novoAgendamento = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...dadosFormulario,
    status: "confirmado",
    criadoEm: new Date().toISOString(),
  };

  agendamentos.push(novoAgendamento);

  if (!salvarAgendamentos(agendamentos)) {
    return;
  }

  formularioAgendamento.reset();

  definirDataMinima();

  renderizarAgendamentos();
  consultarDisponibilidadeAtual();
  renderizarAgendaDiaria();

  exibirMensagemFormulario(
    "Agendamento confirmado com sucesso! Não foi identificado conflito de horário.",
    "sucesso",
  );
});

// ========================================
// CANCELAMENTO DE AGENDAMENTOS
// ========================================

listaAgendamentos.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) {
    return;
  }

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;

  if (acao === "editar") {
    iniciarEdicao(id);

    return;
  }

  if (acao === "cancelar") {
    const confirmar = window.confirm(
      "Deseja realmente cancelar este agendamento?",
    );

    if (!confirmar) {
      return;
    }

    const agendamentos = obterAgendamentos();

    const agendamento = agendamentos.find(
      (item) => String(item.id) === String(id),
    );

    if (
      !agendamento ||
      String(agendamento.status).toLowerCase() === "cancelado"
    ) {
      return;
    }

    agendamento.status = "cancelado";
    agendamento.canceladoEm = new Date().toISOString();

    if (salvarAgendamentos(agendamentos)) {
      if (agendamentoEmEdicao === String(id)) {
        encerrarEdicao();
      }

      renderizarAgendamentos();
      consultarDisponibilidadeAtual();
      renderizarAgendaDiaria();
    }
  }
});

// ========================================
// EVENTOS AUXILIARES DO FORMULÁRIO
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

botaoCancelarEdicao.addEventListener("click", () => {
  encerrarEdicao();
});

// ========================================
// CONSULTA DE DISPONIBILIDADE
// ========================================

function inicializarConsultaDisponibilidade() {
  filtroData.value = obterDataLocalAtual();

  exibirEstadoInicialConsulta();
}

function formatarDataConsulta(data) {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function exibirEstadoInicialConsulta() {
  resultadoDisponibilidade.replaceChildren();

  const estado = criarElemento("div", "estadoConsultaInicial");

  estado.appendChild(
    criarElemento("h3", "", "Consulte os horários disponíveis"),
  );

  estado.appendChild(
    criarElemento(
      "p",
      "",
      "Escolha o espaço e a data para visualizar os agendamentos registrados.",
    ),
  );

  resultadoDisponibilidade.appendChild(estado);
}

function exibirConsultaSemReservas(espaco, data) {
  resultadoDisponibilidade.replaceChildren();

  const mensagem = criarElemento("div", "mensagemSemReservas");

  mensagem.appendChild(
    criarElemento("h3", "", "Nenhum agendamento encontrado"),
  );

  mensagem.appendChild(
    criarElemento(
      "p",
      "",
      `Não foram encontradas reservas ativas para ${espaco} em ${formatarDataConsulta(data)}.`,
    ),
  );

  resultadoDisponibilidade.appendChild(mensagem);

  resultadoDisponibilidade.appendChild(
    criarElemento(
      "p",
      "avisoDisponibilidade",
      "Esta consulta considera apenas os dados armazenados neste navegador.",
    ),
  );

  adicionarBotaoUsarEspaco(espaco, data);
}

function adicionarBotaoUsarEspaco(espaco, data) {
  const acoes = criarElemento("div", "acoesResultadoDisponibilidade");

  const botao = criarElemento(
    "button",
    "botaoUsarEspaco",
    "Solicitar agendamento neste espaço",
  );

  botao.type = "button";

  botao.addEventListener("click", () => {
    mostrarPagina("novoAgendamento");

    formularioAgendamento.elements.espacoEscolar.value = espaco;

    campoDataAgendamento.value = data;

    secaoAgendamento.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    formularioAgendamento.elements.professorResponsavel.focus();
  });

  acoes.appendChild(botao);

  resultadoDisponibilidade.appendChild(acoes);
}

function consultarDisponibilidade(espaco, data) {
  resultadoDisponibilidade.replaceChildren();

  if (!espaco || !data) {
    exibirEstadoInicialConsulta();

    return;
  }

  const agendamentos = obterAgendamentos();

  const reservasEncontradas = agendamentos
    .filter((agendamento) => {
      return (
        agendamento.espacoEscolar === espaco &&
        agendamento.dataAgendamento === data &&
        String(agendamento.status).toLowerCase() !== "cancelado"
      );
    })
    .sort((a, b) => {
      return a.horarioInicio.localeCompare(b.horarioInicio);
    });

  if (reservasEncontradas.length === 0) {
    exibirConsultaSemReservas(espaco, data);

    return;
  }

  const cabecalho = criarElemento("div", "cabecalhoResultadoDisponibilidade");

  const informacoes = criarElemento("div");

  informacoes.appendChild(
    criarElemento("h3", "tituloResultadoDisponibilidade", espaco),
  );

  informacoes.appendChild(
    criarElemento(
      "p",
      "subtituloResultadoDisponibilidade",
      `Agendamentos registrados para ${formatarDataConsulta(data)}`,
    ),
  );

  const contador = criarElemento(
    "span",
    "contadorResultadoDisponibilidade",
    reservasEncontradas.length === 1
      ? "1 agendamento"
      : `${reservasEncontradas.length} agendamentos`,
  );

  cabecalho.append(informacoes, contador);

  resultadoDisponibilidade.appendChild(cabecalho);

  const lista = criarElemento("div", "listaHorariosOcupados");

  reservasEncontradas.forEach((reserva) => {
    const item = criarElemento("article", "itemHorarioOcupado");

    const informacoesHorario = criarElemento("div", "informacoesHorario");

    informacoesHorario.appendChild(
      criarElemento(
        "span",
        "horarioReserva",
        `${reserva.horarioInicio} às ${reserva.horarioFim}`,
      ),
    );

    informacoesHorario.appendChild(
      criarElemento(
        "span",
        "responsavelReserva",
        `Professor(a): ${reserva.professorResponsavel}`,
      ),
    );

    informacoesHorario.appendChild(
      criarElemento("span", "responsavelReserva", `Turma: ${reserva.turma}`),
    );

    const status = criarElemento(
      "span",
      "statusHorario confirmado",
      "Confirmado",
    );

    item.append(informacoesHorario, status);

    lista.appendChild(item);
  });

  resultadoDisponibilidade.appendChild(lista);

  resultadoDisponibilidade.appendChild(
    criarElemento(
      "p",
      "avisoDisponibilidade",
      "Os horários exibidos correspondem aos agendamentos confirmados registrados neste navegador.",
    ),
  );

  adicionarBotaoUsarEspaco(espaco, data);
}

function consultarDisponibilidadeAtual() {
  if (
    formularioConsultaDisponibilidade &&
    filtroEspaco.value &&
    filtroData.value
  ) {
    consultarDisponibilidade(filtroEspaco.value, filtroData.value);
  }
}

formularioConsultaDisponibilidade.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formularioConsultaDisponibilidade.reportValidity()) {
    return;
  }

  consultarDisponibilidade(filtroEspaco.value, filtroData.value);
});

filtroEspaco.addEventListener("change", () => {
  if (filtroEspaco.value && filtroData.value) {
    consultarDisponibilidade(filtroEspaco.value, filtroData.value);
  }
});

filtroData.addEventListener("change", () => {
  if (filtroEspaco.value && filtroData.value) {
    consultarDisponibilidade(filtroEspaco.value, filtroData.value);
  }
});

// ========================================
// AGENDA DIÁRIA
// ========================================

function inicializarAgendaDiaria() {
  dataAgendaDiaria.value = obterDataLocalAtual();

  renderizarAgendaDiaria();
}

function criarElementoAgenda(tag, classe, texto = "") {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  elemento.textContent = texto;

  return elemento;
}

function formatarDataAgenda(data) {
  if (!data) {
    return "--/--/----";
  }

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function obterClasseEspacoAgenda(espaco) {
  const classesEspacos = {
    "Laboratório de Informática": "laboratorioInformatica",
    "Laboratório de Biologia": "laboratorioBiologia",
    Biblioteca: "biblioteca",
  };

  return classesEspacos[espaco] || "";
}

function obterStatusAgenda(status) {
  const statusFormatados = {
    pendente: "Confirmado",
    cancelado: "Cancelado",
    confirmado: "Confirmado",
  };

  return (
    statusFormatados[String(status || "confirmado").toLowerCase()] ||
    "Confirmado"
  );
}

function criarDetalheAgenda(rotulo, valor, classeExtra = "") {
  const detalhe = criarElementoAgenda(
    "div",
    `detalheCartaoAgenda ${classeExtra}`.trim(),
  );

  const elementoRotulo = criarElementoAgenda(
    "span",
    "rotuloDetalheAgenda",
    rotulo,
  );

  const elementoValor = criarElementoAgenda(
    "span",
    "valorDetalheAgenda",
    valor || "Não informado",
  );

  detalhe.append(elementoRotulo, elementoValor);

  return detalhe;
}

function criarCartaoAgendaDiaria(agendamento) {
  const itemLinhaTempo = criarElementoAgenda("article", "itemLinhaTempo");

  itemLinhaTempo.setAttribute(
    "aria-label",
    `${agendamento.espacoEscolar}, das ${agendamento.horarioInicio} às ${agendamento.horarioFim}`,
  );

  const horarioLinhaTempo = criarElementoAgenda("div", "horarioLinhaTempo");

  horarioLinhaTempo.append(
    criarElementoAgenda(
      "span",
      "horarioInicioAgenda",
      agendamento.horarioInicio,
    ),
    criarElementoAgenda(
      "span",
      "horarioFimAgenda",
      `Até ${agendamento.horarioFim}`,
    ),
  );

  const conteudoLinhaTempo = criarElementoAgenda(
    "div",
    `conteudoLinhaTempo ${obterClasseEspacoAgenda(agendamento.espacoEscolar)}`,
  );

  const cabecalhoCartao = criarElementoAgenda("div", "cabecalhoCartaoAgenda");

  cabecalhoCartao.append(
    criarElementoAgenda("h4", "nomeEspacoAgenda", agendamento.espacoEscolar),
    criarElementoAgenda(
      "span",
      "horarioCompletoAgenda",
      `${agendamento.horarioInicio} – ${agendamento.horarioFim}`,
    ),
  );

  const detalhesCartao = criarElementoAgenda("div", "detalhesCartaoAgenda");

  detalhesCartao.append(
    criarDetalheAgenda(
      "Professor(a) responsável",
      agendamento.professorResponsavel,
    ),
    criarDetalheAgenda("Turma", agendamento.turma),
    criarDetalheAgenda(
      "Finalidade",
      agendamento.finalidade,
      "finalidadeCartaoAgenda",
    ),
  );

  const indicadorStatus = criarElementoAgenda(
    "span",
    "statusAgenda confirmado",
    "Confirmado",
  );

  const areaStatus = criarElementoAgenda("div", "acaoCartaoAgenda");

  areaStatus.appendChild(indicadorStatus);

  const botaoUsarAgenda = criarElementoAgenda(
    "button",
    "botaoUsarAgenda",
    "Usar este espaço e horário",
  );

  botaoUsarAgenda.type = "button";

  botaoUsarAgenda.addEventListener("click", () => {
    preencherFormularioPelaAgenda(agendamento);
  });

  areaStatus.appendChild(botaoUsarAgenda);

  conteudoLinhaTempo.append(cabecalhoCartao, detalhesCartao, areaStatus);

  itemLinhaTempo.append(horarioLinhaTempo, conteudoLinhaTempo);

  return itemLinhaTempo;
}

function preencherFormularioPelaAgenda(agendamento) {
  if (agendamentoEmEdicao !== null) {
    encerrarEdicao();
  }

  mostrarPagina("novoAgendamento");

  const campoEspaco = document.querySelector("#espacoEscolar");
  const campoData = document.querySelector("#dataAgendamento");
  const campoInicio = document.querySelector("#horarioInicio");
  const campoFim = document.querySelector("#horarioFim");
  const campoProfessor = document.querySelector("#professorResponsavel");

  campoEspaco.value = agendamento.espacoEscolar;
  campoData.value = agendamento.dataAgendamento;
  campoInicio.value = agendamento.horarioInicio;
  campoFim.value = agendamento.horarioFim;

  campoData.dispatchEvent(new Event("change", { bubbles: true }));

  secaoAgendamento.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  campoProfessor.focus({ preventScroll: true });
}

function exibirAgendaVazia(mensagem, explicacao) {
  const estado = criarElementoAgenda("div", "estadoAgendaVazia");

  estado.append(
    criarElementoAgenda("h4", "", mensagem),
    criarElementoAgenda("p", "", explicacao),
  );

  linhaTempoAgenda.replaceChildren(estado);
}

function renderizarAgendaDiaria() {
  const dataSelecionada = dataAgendaDiaria.value;
  const espacoSelecionado = espacoAgendaDiaria.value;

  if (!dataSelecionada) {
    exibirAgendaVazia(
      "Selecione uma data",
      "Escolha uma data para visualizar a programação escolar.",
    );

    return;
  }

  const agendamentos = obterAgendamentos();

  const agendamentosDoDia = agendamentos
    .filter((agendamento) => {
      const mesmaData = agendamento.dataAgendamento === dataSelecionada;

      const mesmoEspaco =
        espacoSelecionado === "todos" ||
        agendamento.espacoEscolar === espacoSelecionado;

      const ativo = String(agendamento.status).toLowerCase() !== "cancelado";

      return mesmaData && mesmoEspaco && ativo;
    })
    .sort((a, b) => {
      return a.horarioInicio.localeCompare(b.horarioInicio);
    });

  dataSelecionadaAgenda.textContent = formatarDataAgenda(dataSelecionada);

  totalAgendamentosAgenda.textContent = String(agendamentosDoDia.length);

  const espacosOcupados = new Set(
    agendamentosDoDia.map((agendamento) => agendamento.espacoEscolar),
  );

  totalEspacosOcupadosAgenda.textContent = `${espacosOcupados.size} de ${espacoSelecionado === "todos" ? 3 : 1}`;

  tituloLinhaTempoAgenda.textContent =
    espacoSelecionado === "todos"
      ? "Programação de todos os espaços"
      : `Programação: ${espacoSelecionado}`;

  if (agendamentosDoDia.length === 0) {
    exibirAgendaVazia(
      "Nenhum agendamento encontrado",
      "Não há agendamentos registrados para a data e o espaço selecionados.",
    );

    linhaTempoAgenda.appendChild(
      criarElementoAgenda(
        "p",
        "mensagemAvisoAgenda",
        "A ausência de registros nesta agenda não garante disponibilidade real. Esta versão utiliza dados armazenados somente neste navegador.",
      ),
    );

    return;
  }

  const fragmento = document.createDocumentFragment();

  agendamentosDoDia.forEach((agendamento) => {
    fragmento.appendChild(criarCartaoAgendaDiaria(agendamento));
  });

  linhaTempoAgenda.replaceChildren(fragmento);

  linhaTempoAgenda.appendChild(
    criarElementoAgenda(
      "p",
      "mensagemAvisoAgenda",
      "Esta agenda apresenta os registros salvos neste navegador.",
    ),
  );
}

// Atualiza a agenda ao enviar os filtros.
formularioAgendaDiaria.addEventListener("submit", (evento) => {
  evento.preventDefault();

  renderizarAgendaDiaria();
});

dataAgendaDiaria.addEventListener("change", () => {
  renderizarAgendaDiaria();
});

espacoAgendaDiaria.addEventListener("change", () => {
  renderizarAgendaDiaria();
});

// ========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ========================================

const linksNavegacao = document.querySelectorAll(".menuLateral a[data-pagina]");

const secoesPrincipais = document.querySelectorAll(".areaPrincipal > section");

function mostrarPagina(idPagina) {
  const secaoSelecionada = document.getElementById(idPagina);

  if (
    !secaoSelecionada ||
    !secaoSelecionada.matches(".areaPrincipal > section")
  ) {
    return;
  }

  // Oculta todas as páginas.
  secoesPrincipais.forEach((secao) => {
    secao.classList.remove("paginaAtiva");
  });

  // Mostra somente a página selecionada.
  secaoSelecionada.classList.add("paginaAtiva");

  // Atualiza o menu lateral.
  linksNavegacao.forEach((link) => {
    const estaAtivo = link.dataset.pagina === idPagina;

    link.classList.toggle("ativo", estaAtivo);

    if (estaAtivo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Atualiza o endereço sem recarregar o site.
  if (window.location.hash !== `#${idPagina}`) {
    history.replaceState(null, "", `#${idPagina}`);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Navegação pelo menu lateral.
linksNavegacao.forEach((link) => {
  link.addEventListener("click", (evento) => {
    evento.preventDefault();

    mostrarPagina(link.dataset.pagina);
  });
});

// Permite navegar por links internos que apontam diretamente
// para uma das páginas principais.
document.addEventListener("click", (evento) => {
  const linkInterno = evento.target.closest('a[href^="#"]:not([data-pagina])');

  if (!linkInterno) {
    return;
  }

  const idDestino = linkInterno.getAttribute("href").slice(1);

  const destino = document.getElementById(idDestino);

  if (destino && destino.matches(".areaPrincipal > section")) {
    evento.preventDefault();

    mostrarPagina(idDestino);
  }
});

// Abre a página indicada no endereço, se ela existir.
function inicializarNavegacao() {
  const paginaSolicitada = window.location.hash.slice(1);

  const paginaExiste = Array.from(secoesPrincipais).some(
    (secao) => secao.id === paginaSolicitada,
  );

  mostrarPagina(paginaExiste ? paginaSolicitada : "inicio");
}

// ========================================
// INICIALIZAÇÃO DO SISTEMA
// ========================================

definirDataMinima();

renderizarAgendamentos();

inicializarConsultaDisponibilidade();

inicializarAgendaDiaria();

inicializarNavegacao();
