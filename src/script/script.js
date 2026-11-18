
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
const botaoSair = document.querySelector(".itemSair");

let agendamentoEmEdicao = null;

// Os agendamentos são mantidos em memória após a consulta ao Supabase.
let agendamentosEmMemoria = [];
let modoLeituraAgendamentos = true;

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

const CHAVE_NOTIFICACOES = "notificacoesEscolares";
// ========================================
// TAREFA 120 — CENTRAL DE NOTIFICAÇÕES
// ========================================

const botaoNotificacoes = document.querySelector("#botaoNotificacoes");

const contadorNotificacoes = document.querySelector("#contadorNotificacoes");

let painelNotificacoes = null;
let listaNotificacoes = null;

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO COM SUPABASE
// ========================================
async function entrarNoSistema(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        console.error("Erro ao entrar:", error.message);
        return {
            sucesso: false,
            mensagem: "E-mail ou senha inválidos."
        };
    }

    return {
        sucesso: true,
        usuario: data.user
    };
}

// ====================================================
// Função para cadastrar um novo professor no Supabase
// ====================================================

async function cadastrarProfessor(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                nome: nome
            }
        }
    });

    if (error) {
        return {
            sucesso: false,
            mensagem: error.message
        };
    }

    return {
        sucesso: true,
        usuario: data.user
    };
}

// Verifica se as notificações estão habilitadas.
function notificacoesEstaoAtivas() {
  try {
    const configuracoes = obterConfiguracoes();

    return configuracoes.notificacoesAtivas !== false;
  } catch (erro) {
    console.error(
      "Não foi possível consultar as configurações de notificações:",
      erro,
    );

    return true;
  }
}

// ========================================
// Verifica se o usuário está logado, caso contrário redireciona para a página de login.
// ========================================
async function verificarUsuarioLogado() {
    const { data, error } = await clienteSupabase.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return null;
    }

    return data.user;
}

// ========================================
// Função para sair do sistema e redirecionar para a página de login
// ========================================

/* ========================================
   ENCERRAR SESSÃO - BOTÃO SAIR
======================================== */


if (botaoSair) {
    botaoSair.addEventListener("click", async function (evento) {
        evento.preventDefault();

        // Evita cliques repetidos
        botaoSair.style.pointerEvents = "none";
        botaoSair.style.opacity = "0.6";

        try {
            const { error } = await clienteSupabase.auth.signOut();

            if (error) {
                throw error;
            }

            // Redireciona após encerrar a sessão
            window.location.replace("/src/html/login.html");

        } catch (erro) {
            console.error("Erro ao encerrar sessão:", erro);

            alert(
                "Não foi possível sair do sistema. Tente novamente."
            );

            botaoSair.style.pointerEvents = "";
            botaoSair.style.opacity = "";
        }
    });
}

// Recupera as notificações armazenadas no navegador.
function obterListaNotificacoes() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_NOTIFICACOES);

    if (!dadosSalvos) {
      return [];
    }

    const notificacoes = JSON.parse(dadosSalvos);

    return Array.isArray(notificacoes) ? notificacoes : [];
  } catch (erro) {
    console.error("Não foi possível carregar as notificações:", erro);

    return [];
  }
}

// Salva as notificações no navegador.
function salvarListaNotificacoes(notificacoes) {
  try {
    localStorage.setItem(CHAVE_NOTIFICACOES, JSON.stringify(notificacoes));

    return true;
  } catch (erro) {
    console.error("Não foi possível salvar as notificações:", erro);

    return false;
  }
}

// Registra uma notificação.
function adicionarNotificacao(titulo, mensagem, tipo = "informacao") {
  if (!notificacoesEstaoAtivas()) {
    return;
  }

  const notificacoes = obterListaNotificacoes();

  notificacoes.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    titulo,
    mensagem,
    tipo,
    data: new Date().toISOString(),
    lida: false,
  });

  // Mantém somente as 100 notificações mais recentes.
  const notificacoesLimitadas = notificacoes.slice(0, 100);

  if (salvarListaNotificacoes(notificacoesLimitadas)) {
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
  }
}

// Formata a data e a hora da notificação.
function formatarDataNotificacao(dataISO) {
  const data = new Date(dataISO);

  if (Number.isNaN(data.getTime())) {
    return "Data não disponível";
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Atualiza o contador de notificações não lidas.
function atualizarContadorNotificacoes() {
  if (!contadorNotificacoes || !botaoNotificacoes) {
    return;
  }

  const notificacoes = obterListaNotificacoes();

  const quantidadeNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida,
  ).length;

  const notificacoesAtivas = notificacoesEstaoAtivas();

  contadorNotificacoes.textContent =
    quantidadeNaoLidas > 99 ? "99+" : String(quantidadeNaoLidas);

  contadorNotificacoes.hidden = !notificacoesAtivas || quantidadeNaoLidas === 0;

  botaoNotificacoes.setAttribute(
    "aria-label",
    notificacoesAtivas
      ? `Notificações: ${quantidadeNaoLidas} não lidas`
      : "Notificações desativadas",
  );

  botaoNotificacoes.title = notificacoesAtivas
    ? "Notificações"
    : "Notificações desativadas";
}

// Cria o painel de notificações sem duplicar elementos.
function criarPainelNotificacoes() {
  if (painelNotificacoes) {
    return;
  }

  painelNotificacoes = document.createElement("section");
  painelNotificacoes.id = "painelNotificacoes";
  painelNotificacoes.className = "painelNotificacoes";
  painelNotificacoes.hidden = true;

  painelNotificacoes.setAttribute("aria-label", "Central de notificações");

  const cabecalho = document.createElement("div");
  cabecalho.className = "cabecalhoNotificacoes";

  const titulo = document.createElement("h2");
  titulo.textContent = "Notificações";

  const acoes = document.createElement("div");
  acoes.className = "acoesNotificacoes";

  const botaoMarcarTodas = document.createElement("button");
  botaoMarcarTodas.type = "button";
  botaoMarcarTodas.textContent = "Marcar lidas";
  botaoMarcarTodas.dataset.acaoNotificacao = "marcar-todas";

  const botaoLimpar = document.createElement("button");
  botaoLimpar.type = "button";
  botaoLimpar.textContent = "Limpar";
  botaoLimpar.dataset.acaoNotificacao = "limpar";

  acoes.append(botaoMarcarTodas, botaoLimpar);
  cabecalho.append(titulo, acoes);

  listaNotificacoes = document.createElement("div");
  listaNotificacoes.className = "listaNotificacoes";

  const rodape = document.createElement("div");
  rodape.className = "rodapeNotificacoes";
  rodape.textContent = "As notificações são armazenadas neste navegador.";

  painelNotificacoes.append(cabecalho, listaNotificacoes, rodape);

  // Insere o painel logo depois do botão existente.
  botaoNotificacoes.insertAdjacentElement("afterend", painelNotificacoes);
}

// Mostra as notificações no painel.
function renderizarNotificacoes() {
  if (!listaNotificacoes) {
    return;
  }

  listaNotificacoes.replaceChildren();

  if (!notificacoesEstaoAtivas()) {
    const mensagem = document.createElement("p");
    mensagem.className = "estadoVazioNotificacoes";
    mensagem.textContent =
      "As notificações estão desativadas nas configurações.";

    listaNotificacoes.appendChild(mensagem);
    return;
  }

  const notificacoes = obterListaNotificacoes();

  if (notificacoes.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.className = "estadoVazioNotificacoes";
    mensagem.textContent = "Você não tem notificações.";

    listaNotificacoes.appendChild(mensagem);
    return;
  }

  notificacoes.forEach((notificacao) => {
    const item = document.createElement("article");

    item.className = notificacao.lida
      ? "itemNotificacao"
      : "itemNotificacao naoLida";

    const titulo = document.createElement("h3");
    titulo.textContent = notificacao.titulo || "Notificação";

    const mensagem = document.createElement("p");
    mensagem.textContent = notificacao.mensagem || "";

    const data = document.createElement("time");
    data.className = "dataNotificacao";
    data.dateTime = notificacao.data || "";
    data.textContent = formatarDataNotificacao(notificacao.data);

    item.append(titulo, mensagem, data);

    if (!notificacao.lida) {
      const botaoMarcarLida = document.createElement("button");

      botaoMarcarLida.type = "button";
      botaoMarcarLida.textContent = "Marcar como lida";
      botaoMarcarLida.dataset.acaoNotificacao = "marcar";
      botaoMarcarLida.dataset.idNotificacao = notificacao.id;

      item.appendChild(botaoMarcarLida);
    }

    listaNotificacoes.appendChild(item);
  });
}

// Abre ou fecha o painel.
function alternarPainelNotificacoes() {
  if (!painelNotificacoes) {
    criarPainelNotificacoes();
  }

  const estaAberto = !painelNotificacoes.hidden;

  if (!estaAberto) {
    renderizarNotificacoes();
  }

  painelNotificacoes.hidden = estaAberto;

  botaoNotificacoes.setAttribute("aria-expanded", String(!estaAberto));
}

// Marca uma notificação específica como lida.
function marcarNotificacaoComoLida(id) {
  const notificacoes = obterListaNotificacoes();

  const atualizadas = notificacoes.map((notificacao) => {
    if (String(notificacao.id) === String(id)) {
      return {
        ...notificacao,
        lida: true,
      };
    }

    return notificacao;
  });

  if (salvarListaNotificacoes(atualizadas)) {
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
  }
}

// Marca todas as notificações como lidas.
function marcarTodasNotificacoesComoLidas() {
  const notificacoes = obterListaNotificacoes();

  const atualizadas = notificacoes.map((notificacao) => ({
    ...notificacao,
    lida: true,
  }));

  if (salvarListaNotificacoes(atualizadas)) {
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
  }
}

// Limpa todas as notificações.
function limparNotificacoes() {
  const confirmou = window.confirm(
    "Deseja realmente excluir todas as notificações?",
  );

  if (!confirmou) {
    return;
  }

  if (salvarListaNotificacoes([])) {
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
  }
}

// Configura os eventos do painel.
function inicializarNotificacoes() {
  if (!botaoNotificacoes) {
    console.warn("O botão de notificações não foi encontrado.");
    return;
  }

  criarPainelNotificacoes();

  botaoNotificacoes.addEventListener("click", alternarPainelNotificacoes);

  painelNotificacoes.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao-notificacao]");

    if (!botao) {
      return;
    }

    const acao = botao.dataset.acaoNotificacao;

    if (acao === "marcar") {
      marcarNotificacaoComoLida(botao.dataset.idNotificacao);
    }

    if (acao === "marcar-todas") {
      marcarTodasNotificacoesComoLidas();
    }

    if (acao === "limpar") {
      limparNotificacoes();
    }
  });

  // Fecha o painel quando o usuário clica fora dele.
  document.addEventListener("click", (evento) => {
    if (
      painelNotificacoes.hidden ||
      painelNotificacoes.contains(evento.target) ||
      botaoNotificacoes.contains(evento.target)
    ) {
      return;
    }

    painelNotificacoes.hidden = true;

    botaoNotificacoes.setAttribute("aria-expanded", "false");
  });

  // Fecha o painel com a tecla Escape.
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !painelNotificacoes.hidden) {
      painelNotificacoes.hidden = true;

      botaoNotificacoes.setAttribute("aria-expanded", "false");

      botaoNotificacoes.focus();
    }
  });

  atualizarContadorNotificacoes();
  renderizarNotificacoes();
}
// ========================================
// ARMAZENAMENTO
// ========================================

function obterAgendamentos() {
  return [...agendamentosEmMemoria];
}

function salvarAgendamentos(agendamentos) {
  try {
    localStorage.setItem(
      chaveArmazenamento,
      JSON.stringify(agendamentos),
    );

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

  if (!cancelado && !modoLeituraAgendamentos) {
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

formularioAgendamento.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  // Nesta etapa, somente novos cadastros estão habilitados.
  // Edição e cancelamento serão integrados separadamente ao Supabase.
  if (agendamentoEmEdicao !== null) {
    exibirMensagemFormulario(
      "A edição será habilitada após a integração dessa operação com o banco de dados.",
      "aviso",
    );
    return;
  }

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

  if (dataSelecionada < dataAtual) {
    exibirMensagemFormulario(
      "Não é permitido realizar agendamentos para datas passadas.",
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

  if (Object.values(dadosFormulario).some((valor) => !valor)) {
    exibirMensagemFormulario("Preencha todos os campos obrigatórios.", "erro");
    return;
  }

  if (existeConflito(dadosFormulario, obterAgendamentos())) {
    adicionarNotificacao(
      "Conflito de horário",
      `Não foi possível reservar ${dadosFormulario.espacoEscolar} em ${formatarData(dadosFormulario.dataAgendamento)}, das ${dadosFormulario.horarioInicio} às ${dadosFormulario.horarioFim}, pois já existe uma reserva nesse período.`,
      "aviso",
    );
    exibirMensagemFormulario(
      "Este espaço já possui um agendamento nesse período. Escolha outro horário ou outro espaço.",
      "erro",
    );
    return;
  }

  const botaoEnviar = formularioAgendamento.querySelector('[type="submit"]');
  if (botaoEnviar) {
    botaoEnviar.disabled = true;
  }

  try {
    if (!window.servicoAgendamentosSupabase) {
      throw new Error("O serviço de agendamentos não foi carregado. Atualize a página.");
    }

    const novoAgendamento =
      await window.servicoAgendamentosSupabase.salvarNovoAgendamento(
        dadosFormulario,
      );

    agendamentosEmMemoria.push(novoAgendamento);

    formularioAgendamento.reset();
    definirDataMinima();

    renderizarAgendamentos();
    atualizarRelatorios();
    consultarDisponibilidadeAtual();
    renderizarAgendaDiaria();

    exibirMensagemFormulario(
      "Agendamento salvo com sucesso! A reserva já está disponível para os demais usuários.",
      "sucesso",
    );
  } catch (erro) {
    console.error("Não foi possível salvar o agendamento no Supabase:", erro);

    if (erro?.code === "23P01") {
      adicionarNotificacao(
        "Conflito de horário",
        "Outra reserva ocupa esse espaço no período solicitado.",
        "aviso",
      );
      exibirMensagemFormulario(
        "Este espaço acabou de ser reservado por outra pessoa nesse período. Escolha outro horário ou outro espaço.",
        "erro",
      );
    } else {
      exibirMensagemFormulario(
        erro?.message?.includes("perfil cadastrado")
          ? erro.message
          : "Não foi possível salvar o agendamento. Verifique sua conexão e tente novamente.",
        "erro",
      );
    }
  } finally {
    if (botaoEnviar) {
      botaoEnviar.disabled = false;
    }
  }
});

// ========================================
// CANCELAMENTO DE AGENDAMENTOS
// ========================================

listaAgendamentos.addEventListener("click", (evento) => {
  if (modoLeituraAgendamentos) {
    return;
  }

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
      adicionarNotificacao(
        "Agendamento cancelado",
        `A reserva do espaço ${agendamento.espacoEscolar}, em ${formatarData(agendamento.dataAgendamento)}, foi cancelada.`,
        "aviso",
      );
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
 // CARREGAMENTO DOS ESPAÇOS CADASTRADOS NO SUPABASE
 // ========================================

function preencherSelectComEspacos(select, espacos, textoInicial, incluirTodos = false) {
  if (!select) {
    return;
  }

  const valorAnterior = select.value;
  const opcoes = [];

  if (incluirTodos) {
    opcoes.push(new Option("Todos os espaços", "todos"));
  } else {
    opcoes.push(new Option(textoInicial, ""));
  }

  espacos.forEach((espaco) => {
    opcoes.push(new Option(espaco.nome, espaco.nome));
  });

  select.replaceChildren(...opcoes);
  select.disabled = espacos.length === 0;

  const valorExiste = Array.from(select.options).some(
    (opcao) => opcao.value === valorAnterior,
  );

  if (valorExiste) {
    select.value = valorAnterior;
  } else if (incluirTodos) {
    select.value = "todos";
  } else {
    select.value = "";
  }
}

async function carregarAgendamentosDoBanco() {
  listaAgendamentos.replaceChildren(
    criarElemento("p", "estadoCarregamento", "Carregando agendamentos..."),
  );
  contadorAgendamentos.textContent = "Carregando...";

  try {
    if (!window.servicoAgendamentosSupabase) {
      throw new Error("O serviço de agendamentos não foi carregado.");
    }

    agendamentosEmMemoria =
      await window.servicoAgendamentosSupabase.listarAgendamentos();

    renderizarAgendamentos();
    atualizarRelatorios();
    renderizarAgendaDiaria();
    consultarDisponibilidadeAtual();
  } catch (erro) {
    console.error("Não foi possível carregar os agendamentos do Supabase:", erro);

    listaAgendamentos.replaceChildren(
      criarElemento(
        "p",
        "mensagemErro",
        "Não foi possível carregar os agendamentos. Atualize a página ou tente novamente mais tarde.",
      ),
    );
    contadorAgendamentos.textContent = "Falha ao carregar";
  }
}

async function carregarEspacosNosFiltros() {
  const seletores = [
    formularioAgendamento?.elements.espacoEscolar,
    filtroEspaco,
    espacoAgendaDiaria,
  ].filter(Boolean);

  seletores.forEach((select) => {
    select.disabled = true;
  });

  try {
    if (!window.servicoAgendamentosSupabase) {
      throw new Error("O serviço de agendamentos não foi carregado.");
    }

    const espacos = await window.servicoAgendamentosSupabase.listarEspacos();

    preencherSelectComEspacos(
      formularioAgendamento?.elements.espacoEscolar,
      espacos,
      "Selecione um espaço",
    );

    preencherSelectComEspacos(
      filtroEspaco,
      espacos,
      "Selecione um espaço",
    );

    preencherSelectComEspacos(
      espacoAgendaDiaria,
      espacos,
      "Todos os espaços",
      true,
    );

    if (espacos.length === 0) {
      console.warn("Não há espaços ativos cadastrados no Supabase.");
    }
  } catch (erro) {
    console.error("Não foi possível carregar os espaços:", erro);

    seletores.forEach((select) => {
      const texto = select === espacoAgendaDiaria
        ? "Espaços indisponíveis"
        : "Não foi possível carregar os espaços";

      select.replaceChildren(new Option(texto, ""));
      select.disabled = true;
    });

    if (typeof exibirMensagemFormulario === "function") {
      exibirMensagemFormulario(
        "Não foi possível carregar os espaços cadastrados. Atualize a página ou tente novamente mais tarde.",
        "erro",
      );
    }
  }
}

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
      "Os horários exibidos correspondem aos agendamentos confirmados registrados no sistema.",
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
        "A ausência de registros nesta agenda não garante disponibilidade futura; consulte novamente antes de solicitar uma reserva.",
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
      "Esta agenda apresenta os registros compartilhados no sistema.",
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
// TAREFA 118 - RELATÓRIOS E EXPORTAÇÃO
// ========================================

const formularioRelatorios = document.querySelector("#formularioRelatorios");

const relatorioDataInicial = document.querySelector("#relatorioDataInicial");
const relatorioDataFinal = document.querySelector("#relatorioDataFinal");
const relatorioEspaco = document.querySelector("#relatorioEspaco");
const relatorioProfessor = document.querySelector("#relatorioProfessor");
const relatorioSituacao = document.querySelector("#relatorioSituacao");

const relatorioTotal = document.querySelector("#relatorioTotal");
const relatorioConfirmados = document.querySelector("#relatorioConfirmados");
const relatorioCancelados = document.querySelector("#relatorioCancelados");
const relatorioEspacos = document.querySelector("#relatorioEspacos");

const corpoTabelaRelatorios = document.querySelector("#corpoTabelaRelatorios");

const mensagemQuantidadeRelatorios = document.querySelector(
  "#mensagemQuantidadeRelatorios",
);

const botaoLimparFiltrosRelatorios = document.querySelector(
  "#botaoLimparFiltrosRelatorios",
);

const botaoExportarExcel = document.querySelector("#botaoExportarExcel");
const botaoExportarCSV = document.querySelector("#botaoExportarCSV");
const botaoImprimirRelatorio = document.querySelector(
  "#botaoImprimirRelatorio",
);

let agendamentosFiltradosRelatorios = [];

// ========================================
// NORMALIZAÇÃO DOS DADOS
// ========================================

function obterSituacaoRelatorio(agendamento) {
  const situacao = String(agendamento.status || "confirmado")
    .trim()
    .toLowerCase();

  if (situacao === "cancelado") {
    return "cancelado";
  }

  if (situacao === "confirmado") {
    return "confirmado";
  }

  return situacao || "confirmado";
}

function obterProfessorRelatorio(agendamento) {
  return (
    agendamento.professorResponsavel ||
    agendamento.professor ||
    agendamento.nomeProfessor ||
    agendamento.responsavel ||
    ""
  );
}

function obterTurmaRelatorio(agendamento) {
  return agendamento.turma || agendamento.nomeTurma || "";
}

function obterTextoSituacaoRelatorio(situacao) {
  const situacoes = {
    confirmado: "Confirmado",
    cancelado: "Cancelado",
    pendente: "Pendente",
  };

  return situacoes[situacao] || situacao;
}

function formatarDataRelatorio(data) {
  if (!data) {
    return "—";
  }

  const partes = data.split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ========================================
// FILTRAGEM DOS AGENDAMENTOS
// ========================================

function filtrarAgendamentosRelatorios() {
  const dataInicial = relatorioDataInicial.value;
  const dataFinal = relatorioDataFinal.value;

  const espacoSelecionado = relatorioEspaco.value;

  const professorDigitado = relatorioProfessor.value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const situacaoSelecionada = relatorioSituacao.value;

  if (dataInicial && dataFinal && dataInicial > dataFinal) {
    alert("A data inicial não pode ser posterior à data final.");
    relatorioDataInicial.focus();
    return null;
  }

  const todosAgendamentos = obterAgendamentos();

  return todosAgendamentos
    .filter((agendamento) => {
      const data = agendamento.dataAgendamento || "";

      const espaco = agendamento.espacoEscolar || "";

      const professor =
        obterProfessorRelatorio(agendamento).toLocaleLowerCase("pt-BR");

      const situacao = obterSituacaoRelatorio(agendamento);

      const correspondeDataInicial = !dataInicial || data >= dataInicial;

      const correspondeDataFinal = !dataFinal || data <= dataFinal;

      const correspondeEspaco =
        !espacoSelecionado || espaco === espacoSelecionado;

      const correspondeProfessor =
        !professorDigitado || professor.includes(professorDigitado);

      const correspondeSituacao =
        !situacaoSelecionada || situacao === situacaoSelecionada;

      return (
        correspondeDataInicial &&
        correspondeDataFinal &&
        correspondeEspaco &&
        correspondeProfessor &&
        correspondeSituacao
      );
    })
    .sort((a, b) => {
      const comparacaoData = String(a.dataAgendamento || "").localeCompare(
        String(b.dataAgendamento || ""),
      );

      if (comparacaoData !== 0) {
        return comparacaoData;
      }

      return String(a.horarioInicio || "").localeCompare(
        String(b.horarioInicio || ""),
      );
    });
}

// ========================================
// RENDERIZAÇÃO DA TABELA
// ========================================

function criarCelulaRelatorio(texto) {
  const celula = document.createElement("td");

  celula.textContent =
    texto === null || texto === undefined || texto === "" ? "—" : String(texto);

  return celula;
}

function criarCelulaSituacaoRelatorio(situacao) {
  const celula = document.createElement("td");

  const etiqueta = document.createElement("span");

  etiqueta.classList.add("statusRelatorio");

  if (situacao === "confirmado") {
    etiqueta.classList.add("statusRelatorioConfirmado");
  } else if (situacao === "cancelado") {
    etiqueta.classList.add("statusRelatorioCancelado");
  } else {
    etiqueta.classList.add("statusRelatorioOutro");
  }

  etiqueta.textContent = obterTextoSituacaoRelatorio(situacao);

  celula.appendChild(etiqueta);

  return celula;
}

function renderizarTabelaRelatorios(agendamentos) {
  const fragmento = document.createDocumentFragment();

  if (agendamentos.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = 8;
    celula.className = "mensagemTabelaVazia";
    celula.textContent =
      "Nenhum agendamento encontrado para os filtros selecionados.";

    linha.appendChild(celula);
    fragmento.appendChild(linha);

    corpoTabelaRelatorios.replaceChildren(fragmento);

    return;
  }

  agendamentos.forEach((agendamento) => {
    const linha = document.createElement("tr");

    linha.appendChild(
      criarCelulaRelatorio(obterProfessorRelatorio(agendamento)),
    );

    linha.appendChild(criarCelulaRelatorio(obterTurmaRelatorio(agendamento)));

    linha.appendChild(criarCelulaRelatorio(agendamento.espacoEscolar));

    linha.appendChild(
      criarCelulaRelatorio(formatarDataRelatorio(agendamento.dataAgendamento)),
    );

    linha.appendChild(criarCelulaRelatorio(agendamento.horarioInicio));

    linha.appendChild(criarCelulaRelatorio(agendamento.horarioFim));

    linha.appendChild(criarCelulaRelatorio(agendamento.finalidade));

    linha.appendChild(
      criarCelulaSituacaoRelatorio(obterSituacaoRelatorio(agendamento)),
    );

    fragmento.appendChild(linha);
  });

  corpoTabelaRelatorios.replaceChildren(fragmento);
}

// ========================================
// ATUALIZAÇÃO DOS INDICADORES
// ========================================

function atualizarIndicadoresRelatorios(agendamentos) {
  const totalConfirmados = agendamentos.filter(
    (agendamento) => obterSituacaoRelatorio(agendamento) === "confirmado",
  ).length;

  const totalCancelados = agendamentos.filter(
    (agendamento) => obterSituacaoRelatorio(agendamento) === "cancelado",
  ).length;

  const espacosUtilizados = new Set(
    agendamentos
      .filter(
        (agendamento) => obterSituacaoRelatorio(agendamento) === "confirmado",
      )
      .map((agendamento) => agendamento.espacoEscolar)
      .filter(Boolean),
  );

  relatorioTotal.textContent = String(agendamentos.length);

  relatorioConfirmados.textContent = String(totalConfirmados);

  relatorioCancelados.textContent = String(totalCancelados);

  relatorioEspacos.textContent = String(espacosUtilizados.size);
}

// ========================================
// ATUALIZAÇÃO DO RELATÓRIO
// ========================================

function atualizarRelatorios() {
  const resultado = filtrarAgendamentosRelatorios();

  if (resultado === null) {
    return;
  }

  agendamentosFiltradosRelatorios = resultado;

  atualizarIndicadoresRelatorios(resultado);

  renderizarTabelaRelatorios(resultado);

  const quantidade = resultado.length;

  mensagemQuantidadeRelatorios.textContent =
    quantidade === 1
      ? "1 agendamento encontrado."
      : `${quantidade} agendamentos encontrados.`;
}

// ========================================
// DADOS PARA EXPORTAÇÃO
// ========================================

function obterDadosExportacaoRelatorios() {
  return agendamentosFiltradosRelatorios.map((agendamento) => ({
    "Professor responsável": obterProfessorRelatorio(agendamento),

    Turma: obterTurmaRelatorio(agendamento),

    Espaço: agendamento.espacoEscolar || "",

    Data: formatarDataRelatorio(agendamento.dataAgendamento),

    "Horário inicial": agendamento.horarioInicio || "",

    "Horário final": agendamento.horarioFim || "",

    Finalidade: agendamento.finalidade || "",

    Situação: obterTextoSituacaoRelatorio(obterSituacaoRelatorio(agendamento)),
  }));
}

function gerarNomeArquivoRelatorio(extensao) {
  const dataAtual = new Date().toISOString().slice(0, 10);

  return `relatorio-agendamentos-${dataAtual}.${extensao}`;
}

// ========================================
// EXPORTAÇÃO PARA EXCEL (.XLSX)
// ========================================

function exportarRelatorioExcel() {
  if (agendamentosFiltradosRelatorios.length === 0) {
    alert("Não existem registros para exportar.");
    return;
  }

  if (typeof XLSX === "undefined") {
    alert(
      "A biblioteca de exportação para Excel não foi carregada. " +
        "Verifique sua conexão com a internet e recarregue a página.",
    );

    return;
  }

  const dados = obterDadosExportacaoRelatorios();

  const planilha = XLSX.utils.json_to_sheet(dados);

  planilha["!cols"] = [
    { wch: 28 },
    { wch: 15 },
    { wch: 32 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 40 },
    { wch: 16 },
  ];

  const pastaTrabalho = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(pastaTrabalho, planilha, "Agendamentos");

  XLSX.writeFile(pastaTrabalho, gerarNomeArquivoRelatorio("xlsx"));
}

// ========================================
// EXPORTAÇÃO PARA CSV (.CSV)
// ========================================

function protegerValorCSV(valor) {
  const texto = String(valor ?? "");

  // Evita que valores fornecidos pelo usuário sejam interpretados
  // como fórmulas ao abrir o CSV em programas de planilha.
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(texto)) {
    return `'${texto}`;
  }

  return texto;
}

function exportarRelatorioCSV() {
  if (agendamentosFiltradosRelatorios.length === 0) {
    alert("Não existem registros para exportar.");
    return;
  }

  const dados = obterDadosExportacaoRelatorios();

  const cabecalhos = Object.keys(dados[0]);

  const linhas = [
    cabecalhos,
    ...dados.map((registro) =>
      cabecalhos.map((cabecalho) => registro[cabecalho]),
    ),
  ];

  const conteudoCSV = linhas
    .map((linha) =>
      linha
        .map((valor) => {
          const texto = protegerValorCSV(valor);

          return `"${texto.replace(/"/g, '""')}"`;
        })
        .join(";"),
    )
    .join("\r\n");

  // BOM UTF-8 para preservar acentos em programas de planilha.
  const arquivo = new Blob(["\uFEFF", conteudoCSV], {
    type: "text/csv;charset=utf-8;",
  });

  const enderecoTemporario = URL.createObjectURL(arquivo);

  const linkDownload = document.createElement("a");

  linkDownload.href = enderecoTemporario;
  linkDownload.download = gerarNomeArquivoRelatorio("csv");

  document.body.appendChild(linkDownload);

  linkDownload.click();

  linkDownload.remove();

  URL.revokeObjectURL(enderecoTemporario);
}

// ========================================
// IMPRESSÃO / SALVAR COMO PDF
// ========================================

function imprimirRelatorio() {
  if (agendamentosFiltradosRelatorios.length === 0) {
    alert("Não existem registros para imprimir.");
    return;
  }

  document.body.classList.add("imprimindoRelatorio");

  window.print();
}

// Remove a classe após a impressão ou ao fechar a janela de impressão.
window.addEventListener("afterprint", () => {
  document.body.classList.remove("imprimindoRelatorio");
});

// ========================================
// EVENTOS DA PÁGINA DE RELATÓRIOS
// ========================================

formularioRelatorios.addEventListener("submit", (evento) => {
  evento.preventDefault();

  atualizarRelatorios();
});

botaoLimparFiltrosRelatorios.addEventListener("click", () => {
  // O evento reset ocorre antes da restauração efetiva dos campos.
  window.setTimeout(() => {
    atualizarRelatorios();
  }, 0);
});

botaoExportarExcel.addEventListener("click", exportarRelatorioExcel);

botaoExportarCSV.addEventListener("click", exportarRelatorioCSV);

botaoImprimirRelatorio.addEventListener("click", imprimirRelatorio);
// ========================================
// TAREFA 119 - CONFIGURAÇÕES DO SISTEMA
// ========================================

const formularioConfiguracoes = document.querySelector(
  "#formularioConfiguracoes",
);

const configNomeEscola = document.querySelector("#configNomeEscola");
const configResponsavel = document.querySelector("#configResponsavel");

const configHorarioAbertura = document.querySelector("#configHorarioAbertura");

const configHorarioFechamento = document.querySelector(
  "#configHorarioFechamento",
);

const configLaboratorioInformatica = document.querySelector(
  "#configLaboratorioInformatica",
);

const configLaboratorioBiologia = document.querySelector(
  "#configLaboratorioBiologia",
);

const configBiblioteca = document.querySelector("#configBiblioteca");

const configFinaisDeSemana = document.querySelector("#configFinaisDeSemana");

const configNotificacoes = document.querySelector("#configNotificacoes");

const botaoRestaurarConfiguracoes = document.querySelector(
  "#botaoRestaurarConfiguracoes",
);

const mensagemConfiguracoes = document.querySelector("#mensagemConfiguracoes");

const chaveConfiguracoes = "configuracoesEscolares";

// Valores iniciais do sistema.
const configuracoesPadrao = {
  nomeEscola: "CETI Dr. Noronha Filho",
  responsavel: "Administrador",

  horarioAbertura: "07:30",
  horarioFechamento: "18:30",

  laboratorios: {
    informatica: true,
    biologia: true,
    biblioteca: true,
  },

  permitirFinaisDeSemana: false,
  notificacoesAtivas: true,
};

// ========================================
// LEITURA DAS CONFIGURAÇÕES
// ========================================

function obterConfiguracoes() {
  try {
    const dadosSalvos = localStorage.getItem(chaveConfiguracoes);

    if (!dadosSalvos) {
      return structuredClone(configuracoesPadrao);
    }

    const configuracoesSalvas = JSON.parse(dadosSalvos);

    if (
      !configuracoesSalvas ||
      typeof configuracoesSalvas !== "object" ||
      Array.isArray(configuracoesSalvas)
    ) {
      return structuredClone(configuracoesPadrao);
    }

    return {
      ...structuredClone(configuracoesPadrao),
      ...configuracoesSalvas,

      laboratorios: {
        ...configuracoesPadrao.laboratorios,
        ...(configuracoesSalvas.laboratorios || {}),
      },
    };
  } catch (erro) {
    console.error("Erro ao carregar as configurações:", erro);

    return structuredClone(configuracoesPadrao);
  }
}

// ========================================
// EXIBIÇÃO DAS CONFIGURAÇÕES
// ========================================

function preencherFormularioConfiguracoes() {
  const configuracoes = obterConfiguracoes();

  configNomeEscola.value = configuracoes.nomeEscola;
  configResponsavel.value = configuracoes.responsavel;

  configHorarioAbertura.value = configuracoes.horarioAbertura;
  configHorarioFechamento.value = configuracoes.horarioFechamento;

  configLaboratorioInformatica.checked = configuracoes.laboratorios.informatica;

  configLaboratorioBiologia.checked = configuracoes.laboratorios.biologia;

  configBiblioteca.checked = configuracoes.laboratorios.biblioteca;

  configFinaisDeSemana.checked = configuracoes.permitirFinaisDeSemana;

  configNotificacoes.checked = configuracoes.notificacoesAtivas;
}

// ========================================
// MENSAGENS DA INTERFACE
// ========================================

function exibirMensagemConfiguracoes(mensagem, erro = false) {
  mensagemConfiguracoes.textContent = mensagem;

  mensagemConfiguracoes.classList.toggle("erroConfiguracoes", erro);
}

// ========================================
// SALVAR CONFIGURAÇÕES
// ========================================

function salvarConfiguracoes(evento) {
  evento.preventDefault();

  const horarioAbertura = configHorarioAbertura.value;
  const horarioFechamento = configHorarioFechamento.value;

  if (
    !horarioAbertura ||
    !horarioFechamento ||
    horarioAbertura >= horarioFechamento
  ) {
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
    exibirMensagemConfiguracoes(
      "O horário de encerramento deve ser posterior ao horário de abertura.",
      true,
    );

    configHorarioFechamento.focus();

    return;
  }

  const existeEspacoAtivo =
    configLaboratorioInformatica.checked ||
    configLaboratorioBiologia.checked ||
    configBiblioteca.checked;

  if (!existeEspacoAtivo) {
    exibirMensagemConfiguracoes("Ative pelo menos um espaço escolar.", true);

    return;
  }

  const configuracoes = {
    nomeEscola: configNomeEscola.value.trim(),
    responsavel: configResponsavel.value.trim(),

    horarioAbertura,
    horarioFechamento,

    laboratorios: {
      informatica: configLaboratorioInformatica.checked,
      biologia: configLaboratorioBiologia.checked,
      biblioteca: configBiblioteca.checked,
    },

    permitirFinaisDeSemana: configFinaisDeSemana.checked,
    notificacoesAtivas: configNotificacoes.checked,
  };

  if (!configuracoes.nomeEscola || !configuracoes.responsavel) {
    exibirMensagemConfiguracoes(
      "Preencha o nome da escola e o responsável pelo sistema.",
      true,
    );

    return;
  }

  try {
    localStorage.setItem(chaveConfiguracoes, JSON.stringify(configuracoes));

    exibirMensagemConfiguracoes("Configurações salvas com sucesso.");
  } catch (erro) {
    console.error("Erro ao salvar as configurações:", erro);

    exibirMensagemConfiguracoes(
      "Não foi possível salvar as configurações neste navegador.",
      true,
    );
  }
}

// ========================================
// RESTAURAR CONFIGURAÇÕES PADRÃO
// ========================================

function restaurarConfiguracoes() {
  const confirmou = window.confirm(
    "Deseja restaurar as configurações padrão? " +
      "Essa ação não apagará os agendamentos.",
  );

  if (!confirmou) {
    return;
  }

  try {
    localStorage.setItem(
      chaveConfiguracoes,
      JSON.stringify(configuracoesPadrao),
    );

    preencherFormularioConfiguracoes();
    atualizarContadorNotificacoes();
    renderizarNotificacoes();
    exibirMensagemConfiguracoes(
      "Configurações padrão restauradas. Os agendamentos foram preservados.",
    );
  } catch (erro) {
    console.error("Erro ao restaurar as configurações:", erro);

    exibirMensagemConfiguracoes(
      "Não foi possível restaurar as configurações.",
      true,
    );
  }
}

// ========================================
// EVENTOS
// ========================================

formularioConfiguracoes.addEventListener("submit", salvarConfiguracoes);

botaoRestaurarConfiguracoes.addEventListener("click", restaurarConfiguracoes);

// ========================================
// INICIALIZAÇÃO DO SISTEMA
// ========================================

function salvarAgendamentos(agendamentos) {
  try {
    localStorage.setItem(
      chaveArmazenamento,
      JSON.stringify(agendamentos),
    );

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

// Inicialização do sistema
carregarEspacosNosFiltros();

preencherFormularioConfiguracoes();

atualizarRelatorios();

definirDataMinima();

renderizarAgendamentos();

inicializarConsultaDisponibilidade();

inicializarAgendaDiaria();

inicializarNavegacao();

inicializarNotificacoes();

// Consulta os registros compartilhados no banco após inicializar os componentes.
carregarAgendamentosDoBanco();