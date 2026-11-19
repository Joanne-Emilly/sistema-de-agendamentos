
// ========================================
// ELEMENTOS DO FORMULÁRIO DE AGENDAMENTO
// ========================================

const formularioAgendamento = document.querySelector("#formularioAgendamento");
const mensagemFormulario = document.querySelector("#mensagemFormulario");
const campoDataAgendamento = document.querySelector("#dataAgendamento");
const campoHorarioInicio = document.querySelector("#horarioInicio");
const campoHorarioFim = document.querySelector("#horarioFim");
const campoPeriodoAula = document.querySelector("#periodoAula");
const listaAgendamentos = document.querySelector("#listaAgendamentos");
const estadoVazio = document.querySelector("#estadoVazio");
const contadorAgendamentos = document.querySelector("#contadorAgendamentos");
const chaveArmazenamento = "agendamentosEscolares";
const listaRecursosAgendamento = document.querySelector("#listaRecursosAgendamento");
let espacosSistema = [];
let recursosAtivosAgendamento = [];
let recursosSelecionadosAgendamento = new Set();
let requisicaoDisponibilidadeRecursos = 0;
let requisicaoAtualizacaoAgenda = 0;
const secaoAgendamento = document.querySelector("#novoAgendamento");
const botaoCancelarEdicao = document.querySelector("#botaoCancelarEdicao");
const botaoLimparFormulario = document.querySelector("#botaoLimparFormulario");
const textoBotaoEnviar = document.querySelector("#textoBotaoEnviar");
const botaoSair = document.querySelector(".itemSair");
const botaoPerfil = document.querySelector("#botaoPerfil");
const avatarUsuarioCabecalho = document.querySelector("#avatarUsuarioCabecalho");
const nomeUsuarioCabecalho = document.querySelector("#nomeUsuarioCabecalho");
const tipoUsuarioCabecalho = document.querySelector("#tipoUsuarioCabecalho");
const avatarPerfil = document.querySelector("#avatarPerfil");
const perfilNomeCabecalho = document.querySelector("#perfilNomeCabecalho");
const perfilPapelCabecalho = document.querySelector("#perfilPapelCabecalho");
const perfilNome = document.querySelector("#perfilNome");
const perfilEmail = document.querySelector("#perfilEmail");
const perfilPapel = document.querySelector("#perfilPapel");
const mensagemPerfil = document.querySelector("#mensagemPerfil");

let agendamentoEmEdicao = null;

// Os agendamentos são mantidos em memória após a consulta ao Supabase.
let agendamentosEmMemoria = [];
let modoLeituraAgendamentos = true;
let usuarioAutenticadoId = null;
let papelUsuarioAutenticado = null;

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

function mostrarPopupSucessoAgendamento() {
  let popup = document.querySelector("#popupSucessoAgendamento");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupSucessoAgendamento";
    popup.className = "sobreposicaoPopupSucesso";

    const cartao = document.createElement("section");
    cartao.className = "cartaoPopupSucesso";
    cartao.setAttribute("role", "dialog");
    cartao.setAttribute("aria-modal", "true");
    cartao.setAttribute("aria-labelledby", "tituloPopupSucesso");

    const icone = document.createElement("span");
    icone.className = "iconePopupSucesso";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = "✓";

    const titulo = document.createElement("h2");
    titulo.id = "tituloPopupSucesso";
    titulo.textContent = "AGENDAMENTO REALIZADO COM SUCESSO";

    const descricao = document.createElement("p");
    descricao.textContent = "Sua reserva foi registrada e já está disponível na agenda.";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botaoPopupSucesso";
    botao.textContent = "Entendi";
    botao.addEventListener("click", fecharPopupSucessoAgendamento);

    cartao.append(icone, titulo, descricao, botao);
    popup.appendChild(cartao);
    popup.addEventListener("click", (evento) => {
      if (evento.target === popup) fecharPopupSucessoAgendamento();
    });
    document.body.appendChild(popup);
  }

  popup.hidden = false;
  popup.querySelector(".botaoPopupSucesso").focus();
  document.addEventListener("keydown", tratarTeclaPopupSucesso);
}

function fecharPopupSucessoAgendamento() {
  const popup = document.querySelector("#popupSucessoAgendamento");
  if (!popup || popup.hidden) return;

  popup.hidden = true;
  document.removeEventListener("keydown", tratarTeclaPopupSucesso);
  const botaoEnviar = formularioAgendamento.querySelector('[type="submit"]');
  if (botaoEnviar) botaoEnviar.focus();
}

function tratarTeclaPopupSucesso(evento) {
  if (evento.key === "Escape") fecharPopupSucessoAgendamento();
}

let temporizadorToastIndisponivel = null;

function mostrarToastIndisponibilidade() {
  let toast = document.querySelector("#toastIndisponibilidadeAgendamento");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastIndisponibilidadeAgendamento";
    toast.className = "toastIndisponibilidadeAgendamento";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.textContent = "JÁ ESTÁ OCUPADO, TENTE OUTRO ESPAÇO OU OUTRO HORÁRIO";
    document.body.appendChild(toast);
  }

  toast.classList.remove("visivel");
  // Reinicia a animação caso o aviso seja acionado novamente.
  void toast.offsetWidth;
  toast.classList.add("visivel");

  window.clearTimeout(temporizadorToastIndisponivel);
  temporizadorToastIndisponivel = window.setTimeout(() => {
    toast.classList.remove("visivel");
  }, 4500);
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

  adicionarDetalhe(
    detalhes,
    "Recursos pedagógicos",
    Array.isArray(agendamento.recursosPedagogicos) &&
      agendamento.recursosPedagogicos.length > 0
      ? agendamento.recursosPedagogicos.join(", ")
      : "Nenhum recurso reservado",
  );

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

  const podeCancelar =
    !cancelado &&
    papelUsuarioAutenticado === "professor" &&
    usuarioAutenticadoId &&
    String(agendamento.usuarioId) === String(usuarioAutenticadoId);

  if (podeCancelar) {
    const acoes = criarElemento("div", "acoesAgendamento");
    const botaoCancelar = criarElemento("button", "botaoCancelarAgendamento", "Cancelar agendamento");
    botaoCancelar.type = "button";
    botaoCancelar.dataset.acao = "cancelar";
    botaoCancelar.dataset.id = String(agendamento.id);
    botaoCancelar.setAttribute("aria-label", `Cancelar agendamento ${agendamento.id}`);
    acoes.appendChild(botaoCancelar);
    card.appendChild(acoes);
  }

  return card;
}

function renderizarAgendamentos() {
  const agendamentos = obterAgendamentos().filter((agendamento) => {
    return (
      usuarioAutenticadoId &&
      String(agendamento.usuarioId) === String(usuarioAutenticadoId)
    );
  });

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
  selecionarPeriodoDoAgendamento(agendamento.horarioInicio, agendamento.horarioFim);
  atualizarRecursosDisponiveis();

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

  if (!configuracoesSistemaCarregadas) {
    exibirMensagemFormulario("Aguarde o carregamento das regras de agendamento e tente novamente.", "aviso");
    return;
  }

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

  const diaDaSemana = new Date(`${dataSelecionada}T12:00:00`).getDay();
  if (!configuracoesSistema.permitirFinaisDeSemana && (diaDaSemana === 0 || diaDaSemana === 6)) {
    exibirMensagemFormulario(
      "Agendamentos aos sábados e domingos estão desabilitados nas configurações do sistema.",
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
    recursosPedagogicos: Array.from(recursosSelecionadosAgendamento),
    dataAgendamento: campoDataAgendamento.value,
    horarioInicio: campoHorarioInicio.value,
    horarioFim: campoHorarioFim.value,
    finalidade: formularioAgendamento.elements.finalidade.value.trim(),
  };

  const camposObrigatorios = [
    dadosFormulario.professorResponsavel,
    dadosFormulario.turma,
    dadosFormulario.espacoEscolar,
    dadosFormulario.dataAgendamento,
    dadosFormulario.horarioInicio,
    dadosFormulario.horarioFim,
    dadosFormulario.finalidade,
  ];

  if (camposObrigatorios.some((valor) => !valor)) {
    exibirMensagemFormulario("Preencha todos os campos obrigatórios. A seleção de recursos pedagógicos é opcional.", "erro");
    return;
  }
  if (
    dadosFormulario.horarioInicio < configuracoesSistema.horarioAbertura ||
    dadosFormulario.horarioFim > configuracoesSistema.horarioFechamento
  ) {
    exibirMensagemFormulario(
      `O horário solicitado deve estar dentro do funcionamento da escola: ${configuracoesSistema.horarioAbertura} às ${configuracoesSistema.horarioFechamento}.`,
      "erro",
    );
    campoHorarioInicio.focus();
    return;
  }


  if (existeConflito(dadosFormulario, obterAgendamentos())) {
    adicionarNotificacao(
      "Conflito de horário",
      `Não foi possível reservar ${dadosFormulario.espacoEscolar} em ${formatarData(dadosFormulario.dataAgendamento)}, das ${dadosFormulario.horarioInicio} às ${dadosFormulario.horarioFim}, pois já existe uma reserva nesse período.`,
      "aviso",
    );
    limparMensagemFormulario();
    mostrarToastIndisponibilidade();
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

    // Reconsulta os dados completos, incluindo recursos vinculados, após salvar.
    agendamentosEmMemoria =
      await window.servicoAgendamentosSupabase.listarAgendamentos();

    formularioAgendamento.reset();
    definirDataMinima();

    renderizarAgendamentos();
    atualizarRelatorios();
    renderizarAgendaDiaria();

    limparMensagemFormulario();
    mostrarPopupSucessoAgendamento();
  } catch (erro) {
    console.error("Não foi possível salvar o agendamento no Supabase:", erro);

    if (erro?.code === "23P01") {
      adicionarNotificacao(
        "Conflito de horário",
        "Outra reserva ocupa esse espaço no período solicitado.",
        "aviso",
      );
      limparMensagemFormulario();
      mostrarToastIndisponibilidade();
    } else {
      exibirMensagemFormulario(
        erro?.message?.includes("perfil cadastrado") || erro?.code === "23514"
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

listaAgendamentos.addEventListener("click", async (evento) => {
  const botao = evento.target.closest('button[data-acao="cancelar"]');
  if (!botao || botao.disabled) return;

  const id = botao.dataset.id;
  const agendamento = obterAgendamentos().find((item) => String(item.id) === String(id));

  if (!agendamento ||
      String(agendamento.status).toLowerCase() === "cancelado" ||
      papelUsuarioAutenticado !== "professor" ||
      !usuarioAutenticadoId ||
      String(agendamento.usuarioId) !== String(usuarioAutenticadoId)) {
    window.alert("Você só pode cancelar seus próprios agendamentos confirmados.");
    return;
  }

  if (!window.confirm("Deseja realmente cancelar este agendamento? O espaço e os recursos ficarão disponíveis novamente.")) {
    return;
  }

  botao.disabled = true;
  botao.textContent = "Cancelando...";

  try {
    await window.agendamentosSupabase.cancelarAgendamento(id);
    await atualizarAgendaDiariaDoBanco();
    adicionarNotificacao(
      "Agendamento cancelado",
      `A reserva do espaço ${agendamento.espacoEscolar}, em ${formatarData(agendamento.dataAgendamento)}, foi cancelada.`,
      "aviso",
    );
    window.alert("AGENDAMENTO CANCELADO COM SUCESSO");
  } catch (erro) {
    console.error("Erro ao cancelar agendamento:", erro);
    window.alert(erro?.message || "Não foi possível cancelar o agendamento. Tente novamente.");
    botao.disabled = false;
    botao.textContent = "Cancelar agendamento";
  }
});

// ========================================
// EVENTOS AUXILIARES DO FORMULÁRIO
// ========================================

const horariosFixosAula = [
  ["1", "07:30", "08:30"],
  ["2", "08:30", "09:30"],
  ["3", "09:50", "10:50"],
  ["4", "10:50", "11:50"],
  ["5", "12:50", "13:50"],
  ["6", "13:50", "14:50"],
  ["7", "15:10", "16:10"],
  ["8", "16:10", "17:10"],
];

function aplicarPeriodoAula() {
  const periodo = campoPeriodoAula.value;
  const personalizado = periodo === "outros";

  if (personalizado) {
    campoHorarioInicio.readOnly = false;
    campoHorarioFim.readOnly = false;
    campoHorarioInicio.value = "";
    campoHorarioFim.value = "";
    campoHorarioInicio.focus();
  } else if (periodo) {
    const [, inicio, fim] = periodo.split("|");
    campoHorarioInicio.value = inicio;
    campoHorarioFim.value = fim;
    campoHorarioInicio.readOnly = true;
    campoHorarioFim.readOnly = true;
  } else {
    campoHorarioInicio.value = "";
    campoHorarioFim.value = "";
    campoHorarioInicio.readOnly = true;
    campoHorarioFim.readOnly = true;
  }

  campoHorarioFim.setCustomValidity("");
  limparMensagemFormulario();
}

function selecionarPeriodoDoAgendamento(inicio, fim) {
  const periodo = horariosFixosAula.find(
    ([, horarioInicio, horarioFim]) => horarioInicio === inicio && horarioFim === fim,
  );

  campoPeriodoAula.value = periodo
    ? `${periodo[0]}|${periodo[1]}|${periodo[2]}`
    : "outros";

  if (!periodo) {
    campoHorarioInicio.readOnly = false;
    campoHorarioFim.readOnly = false;
  } else {
    campoHorarioInicio.readOnly = true;
    campoHorarioFim.readOnly = true;
  }
}

campoPeriodoAula.addEventListener("change", () => {
  aplicarPeriodoAula();
  atualizarRecursosDisponiveis();
});

campoHorarioInicio.addEventListener("change", () => {
  campoHorarioFim.setCustomValidity("");

  limparMensagemFormulario();
  atualizarRecursosDisponiveis();
});

campoHorarioFim.addEventListener("change", () => {
  validarHorarios();

  limparMensagemFormulario();
  atualizarRecursosDisponiveis();
});

campoDataAgendamento.addEventListener("change", () => {
  limparMensagemFormulario();
  atualizarRecursosDisponiveis();
});

formularioAgendamento.addEventListener("reset", () => {
  setTimeout(() => {
    campoHorarioFim.setCustomValidity("");
    campoPeriodoAula.value = ""; 
    campoHorarioInicio.readOnly = true;
    campoHorarioFim.readOnly = true;
    campoHorarioInicio.value = "";
    campoHorarioFim.value = "";
    recursosSelecionadosAgendamento.clear();

    const nomeUsuario = String(perfilNome.textContent || "").trim();
    if (nomeUsuario && nomeUsuario !== "Carregando..." && nomeUsuario !== "Não foi possível carregar") {
      formularioAgendamento.elements.professorResponsavel.value = nomeUsuario;
    }

    limparMensagemFormulario();

    definirDataMinima();
    atualizarRecursosDisponiveis();
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
    opcoes.push(new Option("Todos os espaços e recursos", "todos"));
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
    renderizarAgendaSemanal();
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

function renderizarCatalogoRecursos(recursos) {
  const lista = document.querySelector(".listaEspacos");
  if (!lista) return;
  lista.replaceChildren();
  recursos.forEach((recurso) => {
    const card = criarElemento("article", "cardEspaco");
    const cabecalho = criarElemento("div", "cabecalhoCardEspaco");
    cabecalho.appendChild(criarElemento("span", "etiquetaEspaco",
      recurso.tipo === "recurso" ? "Recurso pedagógico" : "Espaço escolar"));
    const conteudo = criarElemento("div", "conteudoCardEspaco");
    conteudo.appendChild(criarElemento("h3", "nomeEspaco", recurso.nome));
    conteudo.appendChild(criarElemento("p", "descricaoEspaco",
      recurso.descricao || (recurso.tipo === "recurso" ? "Recurso pedagógico reservável." : "Espaço escolar reservável.")));
    const rodape = criarElemento("div", "rodapeCardEspaco");
    rodape.appendChild(criarElemento("span", "indicadorEspaco",
      recurso.ativo ? "Disponível para reserva" : "Indisponível no momento"));
    if (recurso.ativo) {
      const link = criarElemento("a", "botaoConsultarEspaco", "Consultar →");
      link.href = "#inicio";
      rodape.appendChild(link);
    }
    card.append(cabecalho, conteudo, rodape);
    if (!recurso.ativo) card.classList.add("recursoInativo");
    lista.appendChild(card);
  });
}

function renderizarControlesEspacos(recursos) {
  const lista = document.querySelector("#listaEspacosConfiguracoes");
  if (!lista) return;
  lista.replaceChildren();
  recursos.forEach((recurso) => {
    const label = document.createElement("label");
    label.className = "opcaoConfiguracao";
    const texto = document.createElement("span");
    texto.appendChild(criarElemento("strong", "", recurso.nome));
    texto.appendChild(criarElemento("small", "", recurso.tipo === "recurso" ? "Recurso pedagógico reservável." : "Espaço escolar reservável."));
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.espacoNome = recurso.nome;
    checkbox.checked = recurso.ativo;
    label.append(texto, checkbox);
    lista.appendChild(label);
  });
}

function renderizarOpcoesRecursosAgendamento(
  recursos,
  mensagemVazia = "Nenhum recurso pedagógico está disponível para reserva.",
) {
  if (!listaRecursosAgendamento) return;

  if (recursos.length === 0) {
    listaRecursosAgendamento.replaceChildren(
      criarElementoAgenda("p", "estadoRecursos", mensagemVazia),
    );
    return;
  }

  const fragmento = document.createDocumentFragment();

  recursos.forEach((recurso) => {
    const label = criarElementoAgenda("label", "opcaoRecursoAgendamento");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "recursosPedagogicos";
    checkbox.value = recurso.id;
    checkbox.dataset.recursoNome = recurso.nome;
    checkbox.dataset.recursoCategoria = recurso.nome.startsWith("Projetor ")
      ? "projetor"
      : recurso.nome.startsWith("Caixa de Som ")
        ? "caixaSom"
        : "outro";
    // A consulta listarEspacos() já retorna somente recursos ativos.
    checkbox.disabled = false;
    checkbox.checked = recursosSelecionadosAgendamento.has(recurso.id);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        recursosSelecionadosAgendamento.add(recurso.id);
      } else {
        recursosSelecionadosAgendamento.delete(recurso.id);
      }

      if (checkbox.checked && checkbox.dataset.recursoCategoria !== "outro") {
        const categoria = checkbox.dataset.recursoCategoria;
        listaRecursosAgendamento
          .querySelectorAll('input[name="recursosPedagogicos"]')
          .forEach((outroCheckbox) => {
            if (
              outroCheckbox !== checkbox &&
              outroCheckbox.dataset.recursoCategoria === categoria
            ) {
              outroCheckbox.checked = false;
              recursosSelecionadosAgendamento.delete(outroCheckbox.value);
            }
          });
      }
    });

    const nome = criarElementoAgenda("span", "nomeOpcaoRecurso", recurso.nome);
    label.append(checkbox, nome);

    fragmento.appendChild(label);
  });

  listaRecursosAgendamento.replaceChildren(fragmento);
}

async function atualizarRecursosDisponiveis() {
  const numeroRequisicao = ++requisicaoDisponibilidadeRecursos;
  const data = campoDataAgendamento.value;
  const inicio = campoHorarioInicio.value;
  const fim = campoHorarioFim.value;

  if (!data || !inicio || !fim || fim <= inicio) {
    renderizarOpcoesRecursosAgendamento(
      [],
      "Selecione a data e o horário para consultar os equipamentos disponíveis.",
    );
    return;
  }

  listaRecursosAgendamento.replaceChildren(
    criarElementoAgenda("p", "estadoRecursos", "Verificando equipamentos disponíveis..."),
  );

  try {
    const agendamentosAtuais =
      await window.servicoAgendamentosSupabase.listarAgendamentos();

    if (numeroRequisicao !== requisicaoDisponibilidadeRecursos) return;

    agendamentosEmMemoria = agendamentosAtuais;

    const recursosOcupados = new Set();

    agendamentosAtuais.forEach((agendamento) => {
      const mesmoDia = agendamento.dataAgendamento === data;
      const confirmado = agendamento.status === "confirmado";
      const outroAgendamento = String(agendamento.id) !== String(agendamentoEmEdicao);
      const horariosSobrepostos =
        inicio < agendamento.horarioFim && fim > agendamento.horarioInicio;

      if (!mesmoDia || !confirmado || !outroAgendamento || !horariosSobrepostos) {
        return;
      }

      (agendamento.recursosPedagogicos || []).forEach((nomeRecurso) => {
        recursosOcupados.add(nomeRecurso);
      });
    });

    const disponiveis = recursosAtivosAgendamento.filter(
      (recurso) => !recursosOcupados.has(recurso.nome),
    );
    const idsDisponiveis = new Set(disponiveis.map((recurso) => recurso.id));
    recursosSelecionadosAgendamento = new Set(
      Array.from(recursosSelecionadosAgendamento).filter((id) => idsDisponiveis.has(id)),
    );

    renderizarOpcoesRecursosAgendamento(
      disponiveis,
      "Todos os equipamentos estão reservados nesse horário. Escolha outro horário.",
    );
  } catch (erro) {
    if (numeroRequisicao !== requisicaoDisponibilidadeRecursos) return;

    console.error("Não foi possível verificar a disponibilidade dos recursos:", erro);
    renderizarOpcoesRecursosAgendamento(
      [],
      "Não foi possível consultar a disponibilidade. Altere o horário ou tente novamente.",
    );
  }
}

async function carregarEspacosNosFiltros() {
  const seletores = [
    formularioAgendamento?.elements.espacoEscolar,
    espacoAgendaDiaria,
    relatorioEspaco,
  ].filter(Boolean);

  seletores.forEach((select) => {
    select.disabled = true;
  });

  try {
    if (!window.servicoAgendamentosSupabase) {
      throw new Error("O serviço de agendamentos não foi carregado.");
    }

    const espacos = await window.servicoAgendamentosSupabase.listarEspacos();
    espacosSistema = await window.servicoAgendamentosSupabase.listarTodosEspacos();
    renderizarCatalogoRecursos(espacosSistema);
    atualizarFiltroItensAgendaSemanal();
    renderizarAgendaSemanal();
    renderizarControlesEspacos(espacosSistema);

    preencherSelectComEspacos(
      formularioAgendamento?.elements.espacoEscolar,
      espacos.filter((item) => item.tipo === "espaco"),
      "Selecione um espaço físico",
    );

    recursosAtivosAgendamento = espacos.filter(
      (item) => item.tipo === "recurso",
    );
    renderizarOpcoesRecursosAgendamento(
      [],
      "Selecione a data e o horário para consultar os equipamentos disponíveis.",
    );
    atualizarRecursosDisponiveis();

    preencherSelectComEspacos(
      espacoAgendaDiaria,
      espacosSistema,
      "Todos os espaços e recursos",
      true,
    );

    preencherSelectComEspacos(
      relatorioEspaco,
      espacosSistema,
      "Todos os espaços e recursos",
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
      "Recursos pedagógicos",
      Array.isArray(agendamento.recursosPedagogicos) &&
        agendamento.recursosPedagogicos.length > 0
        ? agendamento.recursosPedagogicos.join(", ")
        : "Nenhum recurso reservado",
    ),
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

  totalEspacosOcupadosAgenda.textContent = `${espacosOcupados.size} de ${espacoSelecionado === "todos" ? espacosSistema.length : 1}`;

  tituloLinhaTempoAgenda.textContent =
    espacoSelecionado === "todos"
      ? "Programação de todos os espaços e recursos"
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

// Atualiza os dados da agenda diretamente no Supabase antes de renderizar.
async function atualizarAgendaDiariaDoBanco() {
  const numeroRequisicao = ++requisicaoAtualizacaoAgenda;

  if (!dataAgendaDiaria.value) {
    renderizarAgendaDiaria();
    return;
  }

  linhaTempoAgenda.replaceChildren(
    criarElementoAgenda("p", "estadoCarregamento", "Atualizando agenda..."),
  );

  try {
    const agendamentosAtuais =
      await window.servicoAgendamentosSupabase.listarAgendamentos();

    if (numeroRequisicao !== requisicaoAtualizacaoAgenda) return;

    agendamentosEmMemoria = agendamentosAtuais;
    renderizarAgendamentos();
    atualizarRelatorios();
    renderizarAgendaDiaria();
    renderizarAgendaSemanal();
  } catch (erro) {
    if (numeroRequisicao !== requisicaoAtualizacaoAgenda) return;

    console.error("Não foi possível atualizar a agenda diária:", erro);
    exibirAgendaVazia(
      "Não foi possível atualizar a agenda",
      "Verifique sua conexão e tente novamente.",
    );
  }
}

// Atualiza a agenda ao enviar os filtros.
formularioAgendaDiaria.addEventListener("submit", (evento) => {
  evento.preventDefault();
  atualizarAgendaDiariaDoBanco();
});

dataAgendaDiaria.addEventListener("change", () => {
  atualizarAgendaDiariaDoBanco();
});

espacoAgendaDiaria.addEventListener("change", () => {
  atualizarAgendaDiariaDoBanco();
});


// ========================================
// AGENDA SEMANAL — DISPONIBILIDADE
// ========================================
const gradeAgendaSemanal = document.querySelector("#gradeAgendaSemanal");
const filtroItemAgendaSemanal = document.querySelector("#filtroItemAgendaSemanal");
const intervaloSemanaAgenda = document.querySelector("#intervaloSemanaAgenda");
const botaoSemanaAnterior = document.querySelector("#semanaAnterior");
const botaoSemanaProxima = document.querySelector("#semanaProxima");
const botaoSemanaHoje = document.querySelector("#semanaHoje");

const periodosAgendaSemanal = [
  { numero: 1, inicio: "07:30", fim: "08:30" },
  { numero: 2, inicio: "08:30", fim: "09:30" },
  { numero: 3, inicio: "09:50", fim: "10:50" },
  { numero: 4, inicio: "10:50", fim: "11:50" },
  { numero: 5, inicio: "12:50", fim: "13:50" },
  { numero: 6, inicio: "13:50", fim: "14:50" },
  { numero: 7, inicio: "15:10", fim: "16:10" },
  { numero: 8, inicio: "16:10", fim: "17:10" },
];
let inicioSemanaAgenda = obterSegundaFeira(new Date());

function obterSegundaFeira(data) {
  const segunda = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diaSemana = segunda.getDay();
  segunda.setDate(segunda.getDate() + (diaSemana === 0 ? -6 : 1 - diaSemana));
  return segunda;
}

function formatarDataISOAgenda(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarDiaSemanaAgenda(data) {
  return data.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
    .replace(".", "");
}

function atualizarFiltroItensAgendaSemanal() {
  if (!filtroItemAgendaSemanal) return;
  const itensAtivos = (espacosSistema || []).filter((item) => item.ativo);
  const valorAnterior = filtroItemAgendaSemanal.value;
  const opcoes = [
    criarElementoAgenda("option", "", "Selecione um espaço ou recurso"),
    ...itensAtivos.map((item) => {
      const opcao = document.createElement("option");
      opcao.value = item.nome;
      opcao.textContent = item.tipo === "recurso" ? `${item.nome} — Recurso pedagógico` : item.nome;
      return opcao;
    }),
  ];
  filtroItemAgendaSemanal.replaceChildren(...opcoes);
  if (itensAtivos.some((item) => item.nome === valorAnterior)) {
    filtroItemAgendaSemanal.value = valorAnterior;
  } else if (itensAtivos.length) {
    filtroItemAgendaSemanal.value = itensAtivos.find((item) => item.tipo === "espaco")?.nome || itensAtivos[0].nome;
  }
}

function obterAgendamentoDoItemNoPeriodo(itemSelecionado, data, periodo) {
  return obterAgendamentos().find((agendamento) => {
    if (agendamento.dataAgendamento !== data) return false;
    if (String(agendamento.status || "").toLowerCase() === "cancelado") return false;
    const sobrepoe = agendamento.horarioInicio < periodo.fim && agendamento.horarioFim > periodo.inicio;
    if (!sobrepoe) return false;
    const item = (espacosSistema || []).find((registro) => registro.nome === itemSelecionado);
    if (item?.tipo === "recurso") {
      return (agendamento.recursosPedagogicos || []).includes(itemSelecionado);
    }
    return agendamento.espacoEscolar === itemSelecionado;
  });
}

function abrirNovoAgendamentoPelaAgenda(data, periodo, itemSelecionado) {
  const item = (espacosSistema || []).find((registro) => registro.nome === itemSelecionado);
  campoDataAgendamento.value = data;
  const valorPeriodo = `${periodo.numero}|${periodo.inicio}|${periodo.fim}`;
  campoPeriodoAula.value = valorPeriodo;

  recursosSelecionadosAgendamento.clear();
  if (item?.tipo === "recurso") {
    recursosSelecionadosAgendamento.add(item.id);
  }

  campoPeriodoAula.dispatchEvent(new Event("change", { bubbles: true }));

  if (item?.tipo === "espaco") {
    const seletorEspaco = formularioAgendamento?.elements.espacoEscolar;
    if (seletorEspaco) {
      seletorEspaco.value = itemSelecionado;
      seletorEspaco.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } else if (item?.tipo === "recurso") {
    // A seleção é mantida por ID enquanto o sistema consulta a disponibilidade
    // e redesenha os checkboxes do formulário.
    atualizarRecursosDisponiveis();
  }
  mostrarPagina("novoAgendamento");
}

function mostrarDetalhesOcupacaoAgenda(agendamento, item) {
  const recurso = item;
  const detalhes = [
    `Item: ${recurso}`,
    `Horário: ${agendamento.horarioInicio} às ${agendamento.horarioFim}`,
    `Turma: ${agendamento.turma || "Não informada"}`,
    `Professor(a): ${agendamento.professorResponsavel || "Não informado"}`,
    `Finalidade: ${agendamento.finalidade || "Não informada"}`,
  ];
  window.alert(detalhes.join("\n"));
}

function renderizarAgendaSemanal() {
  if (!gradeAgendaSemanal || !filtroItemAgendaSemanal) return;
  atualizarFiltroItensAgendaSemanal();
  const itemSelecionado = filtroItemAgendaSemanal.value;
  if (!itemSelecionado) {
    gradeAgendaSemanal.replaceChildren(criarElementoAgenda("p", "estadoAgendaVazia", "Nenhum espaço ou recurso ativo foi encontrado."));
    return;
  }

  const dias = Array.from({ length: 5 }, (_, indice) => {
    const data = new Date(inicioSemanaAgenda);
    data.setDate(data.getDate() + indice);
    return data;
  });
  const fimSemana = dias[4];
  intervaloSemanaAgenda.textContent = `${formatarDataAgenda(formatarDataISOAgenda(dias[0]))} a ${formatarDataAgenda(formatarDataISOAgenda(fimSemana))}`;

  const tabela = document.createElement("table");
  tabela.className = "tabelaAgendaSemanal";
  const cabecalho = document.createElement("thead");
  const linhaCabecalho = document.createElement("tr");
  const thHorario = criarElementoAgenda("th", "", "Aula / Horário");
  thHorario.scope = "col";
  linhaCabecalho.appendChild(thHorario);
  dias.forEach((dia) => {
    const th = criarElementoAgenda("th", "", formatarDiaSemanaAgenda(dia));
    th.scope = "col";
    linhaCabecalho.appendChild(th);
  });
  cabecalho.appendChild(linhaCabecalho);
  tabela.appendChild(cabecalho);

  const corpo = document.createElement("tbody");
  periodosAgendaSemanal.forEach((periodo) => {
    const linha = document.createElement("tr");
    const th = criarElementoAgenda("th", "", `${periodo.numero}ª AULA`);
    th.scope = "row";
    linha.appendChild(th);

    dias.forEach((dia) => {
      const data = formatarDataISOAgenda(dia);
      const td = document.createElement("td");
      const agendamento = obterAgendamentoDoItemNoPeriodo(itemSelecionado, data, periodo);
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = `celulaAgendaSemanal ${agendamento ? "ocupado" : "disponivel"}`;
      if (agendamento) {
        botao.textContent = `Ocupado\n${agendamento.horarioInicio}–${agendamento.horarioFim}`;
        botao.title = `Ocupado por ${agendamento.professorResponsavel || "usuário"} — clique para ver detalhes`;
        botao.setAttribute("aria-label", `${data}, ${periodo.numero}ª aula, ocupado`);
        botao.addEventListener("click", () => mostrarDetalhesOcupacaoAgenda(agendamento, itemSelecionado));
      } else {
        botao.textContent = "Disponível";
        botao.title = "Clique para iniciar um agendamento neste horário";
        botao.setAttribute("aria-label", `${data}, ${periodo.numero}ª aula, disponível`);
        botao.addEventListener("click", () => abrirNovoAgendamentoPelaAgenda(data, periodo, itemSelecionado));
      }
      td.appendChild(botao);
      linha.appendChild(td);
    });
    corpo.appendChild(linha);
  });
  tabela.appendChild(corpo);
  gradeAgendaSemanal.replaceChildren(tabela);
}

function alterarSemanaAgenda(dias) {
  inicioSemanaAgenda.setDate(inicioSemanaAgenda.getDate() + dias);
  renderizarAgendaSemanal();
}

if (botaoSemanaAnterior) botaoSemanaAnterior.addEventListener("click", () => alterarSemanaAgenda(-7));
if (botaoSemanaProxima) botaoSemanaProxima.addEventListener("click", () => alterarSemanaAgenda(7));
if (botaoSemanaHoje) botaoSemanaHoje.addEventListener("click", () => {
  inicioSemanaAgenda = obterSegundaFeira(new Date());
  renderizarAgendaSemanal();
});
if (filtroItemAgendaSemanal) filtroItemAgendaSemanal.addEventListener("change", renderizarAgendaSemanal);

// ========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ========================================

const linksNavegacao = document.querySelectorAll(".menuLateral a[data-pagina]");

// Menu recolhível em celulares e tablets.
const menuLateral = document.getElementById("menuLateral");
const botaoMenuMobile = document.getElementById("botaoMenuMobile");

function fecharMenuMobile() {
  if (!menuLateral || !botaoMenuMobile) return;
  menuLateral.classList.add("menuFechado");
  botaoMenuMobile.setAttribute("aria-expanded", "false");
  botaoMenuMobile.setAttribute("aria-label", "Abrir menu de navegação");
}

if (menuLateral && botaoMenuMobile) {
  botaoMenuMobile.addEventListener("click", () => {
    const menuEstaAberto = !menuLateral.classList.contains("menuFechado");
    menuLateral.classList.toggle("menuFechado", menuEstaAberto);
    botaoMenuMobile.setAttribute("aria-expanded", String(!menuEstaAberto));
    botaoMenuMobile.setAttribute(
      "aria-label",
      menuEstaAberto ? "Abrir menu de navegação" : "Fechar menu de navegação",
    );
  });
}


const secoesPrincipais = document.querySelectorAll(".areaPrincipal > section");

function mostrarPagina(idPagina) {
  if (idPagina === "configuracoes") {
    if (papelUsuarioAutenticado === null) {
      return;
    }

    if (papelUsuarioAutenticado !== "coordenador") {
      mostrarPagina("inicio");
      return;
    }
  }

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

    if (window.matchMedia("(max-width: 900px)").matches) {
      fecharMenuMobile();
    }
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
// PERFIL DO USUÁRIO AUTENTICADO
// ========================================

function obterIniciais(nome) {
  return String(nome || "U")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toLocaleUpperCase("pt-BR"))
    .join("");
}

function formatarPapelUsuario(papel) {
  const papelNormalizado = String(papel || "professor").trim().toLowerCase();

  if (papelNormalizado === "coordenador") {
    return "Coordenador";
  }

  if (papelNormalizado === "professor") {
    return "Professor";
  }

  return papelNormalizado
    ? papelNormalizado.charAt(0).toLocaleUpperCase("pt-BR") + papelNormalizado.slice(1)
    : "Usuário";
}

async function carregarPerfilUsuario() {
  mensagemPerfil.textContent = "Carregando os dados da sua conta...";
  perfilNome.textContent = "Carregando...";
  perfilEmail.textContent = "Carregando...";
  perfilPapel.textContent = "Carregando...";

  try {
    const { data: dadosAutenticacao, error: erroAutenticacao } =
      await clienteSupabase.auth.getUser();

    if (erroAutenticacao) {
      throw erroAutenticacao;
    }

    const usuario = dadosAutenticacao.user;

    if (!usuario) {
      throw new Error("Não foi possível identificar a conta autenticada. Entre novamente no sistema.");
    }

    const { data: dadosPerfil, error: erroPerfil } = await clienteSupabase
      .from("perfis")
      .select("nome, email, papel")
      .eq("id", usuario.id)
      .single();

    if (erroPerfil) {
      throw erroPerfil;
    }

    usuarioAutenticadoId = usuario.id;
    papelUsuarioAutenticado = String(dadosPerfil.papel || "").trim().toLowerCase();

    const linkConfiguracoes = document.querySelector("#linkConfiguracoes");
    const paginaConfiguracoes = document.querySelector("#configuracoes");
    const podeAcessarConfiguracoes = papelUsuarioAutenticado === "coordenador";

    if (linkConfiguracoes) {
      linkConfiguracoes.hidden = !podeAcessarConfiguracoes;
    }

    if (paginaConfiguracoes) {
      paginaConfiguracoes.hidden = !podeAcessarConfiguracoes;
    }

    const nome = String(dadosPerfil.nome || "").trim() || "Usuário";
    formularioAgendamento.elements.professorResponsavel.value = nome;
    const email = dadosPerfil.email || usuario.email || "E-mail não informado";
    const papel = formatarPapelUsuario(dadosPerfil.papel);
    const iniciais = obterIniciais(nome);

    nomeUsuarioCabecalho.textContent = nome;
    tipoUsuarioCabecalho.textContent = papel;
    avatarUsuarioCabecalho.textContent = iniciais;

    perfilNomeCabecalho.textContent = nome;
    perfilPapelCabecalho.textContent = papel;
    avatarPerfil.textContent = iniciais;

    perfilNome.textContent = nome;
    perfilEmail.textContent = email;
    perfilPapel.textContent = papel;
    mensagemPerfil.textContent = "";
    renderizarAgendamentos();
    inicializarNavegacao();
  } catch (erro) {
    console.error("Não foi possível carregar o perfil do usuário:", erro);

    nomeUsuarioCabecalho.textContent = "Perfil indisponível";
    tipoUsuarioCabecalho.textContent = "Conta autenticada";
    avatarUsuarioCabecalho.textContent = "?";

    perfilNomeCabecalho.textContent = "Perfil indisponível";
    perfilPapelCabecalho.textContent = "";
    avatarPerfil.textContent = "?";

    perfilNome.textContent = "Não foi possível carregar";
    perfilEmail.textContent = "Não foi possível carregar";
    perfilPapel.textContent = "Não foi possível carregar";
    usuarioAutenticadoId = null;
    papelUsuarioAutenticado = null;

    const linkConfiguracoes = document.querySelector("#linkConfiguracoes");
    const paginaConfiguracoes = document.querySelector("#configuracoes");

    if (linkConfiguracoes) linkConfiguracoes.hidden = true;
    if (paginaConfiguracoes) paginaConfiguracoes.hidden = true;

    renderizarAgendamentos();
    mensagemPerfil.textContent =
      "Não foi possível consultar seus dados. Atualize a página ou solicite suporte à administração.";
  }
}

botaoPerfil.addEventListener("click", () => {
  mostrarPagina("perfil");
  carregarPerfilUsuario();
});

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
        !espacoSelecionado || espacoSelecionado === "todos" || espaco === espacoSelecionado;

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
// ========================================
// CONFIGURAÇÕES GERAIS DO SISTEMA
// ========================================

const formularioConfiguracoes = document.querySelector("#formularioConfiguracoes");
const configNomeEscola = document.querySelector("#configNomeEscola");
const configResponsavel = document.querySelector("#configResponsavel");
const configHorarioAbertura = document.querySelector("#configHorarioAbertura");
const configHorarioFechamento = document.querySelector("#configHorarioFechamento");
const configFinaisDeSemana = document.querySelector("#configFinaisDeSemana");
const botaoRestaurarConfiguracoes = document.querySelector("#botaoRestaurarConfiguracoes");
const mensagemConfiguracoes = document.querySelector("#mensagemConfiguracoes");

const idConfiguracaoSistema = "00000000-0000-4000-8000-000000000001";
let configuracoesSistema = {
  nomeEscola: "CETI Dr. Noronha Filho",
  responsavel: "Coordenador",
  horarioAbertura: "07:30",
  horarioFechamento: "18:30",
  permitirFinaisDeSemana: false,
};
let configuracoesSistemaCarregadas = false;

function exibirMensagemConfiguracoes(mensagem, erro = false) {
  mensagemConfiguracoes.textContent = mensagem;
  mensagemConfiguracoes.classList.toggle("erroConfiguracoes", erro);
}

function aplicarNomeEscola(nome) {
  const elementoNomeEscola = document.querySelector(".nomeEscola");
  if (elementoNomeEscola && nome) {
    elementoNomeEscola.textContent = nome;
  }
}

function preencherFormularioConfiguracoes(configuracoes, espacos) {
  configNomeEscola.value = configuracoes.nome_escola || configuracoes.nomeEscola || "";
  configResponsavel.value = configuracoes.responsavel || "";
  configHorarioAbertura.value = String(configuracoes.horario_abertura || configuracoes.horarioAbertura || "07:30").slice(0, 5);
  configHorarioFechamento.value = String(configuracoes.horario_fechamento || configuracoes.horarioFechamento || "18:30").slice(0, 5);
  configFinaisDeSemana.checked = Boolean(configuracoes.finais_de_semana ?? configuracoes.permitirFinaisDeSemana);

  renderizarControlesEspacos(espacos || []);

  configuracoesSistema = {
    nomeEscola: configNomeEscola.value,
    responsavel: configResponsavel.value,
    horarioAbertura: configHorarioAbertura.value,
    horarioFechamento: configHorarioFechamento.value,
    permitirFinaisDeSemana: configFinaisDeSemana.checked,
  };
  aplicarNomeEscola(configuracoesSistema.nomeEscola);
}

async function carregarConfiguracoesSistema() {
  try {
    const servico = window.servicoAgendamentosSupabase;
    if (!servico) throw new Error("Serviço do Supabase indisponível.");

    const [configuracoes, espacos] = await Promise.all([
      servico.obterConfiguracoesSistema(),
      servico.listarTodosEspacos(),
    ]);

    if (!configuracoes) throw new Error("As configurações gerais não foram encontradas.");
    preencherFormularioConfiguracoes(configuracoes, espacos);
    configuracoesSistemaCarregadas = true;
  } catch (erro) {
    console.error("Erro ao carregar configurações:", erro);
    exibirMensagemConfiguracoes("Não foi possível carregar as configurações compartilhadas. Atualize a página.", true);
  }
}

async function salvarConfiguracoes(evento) {
  evento.preventDefault();

  const horarioAbertura = configHorarioAbertura.value;
  const horarioFechamento = configHorarioFechamento.value;
  if (!horarioAbertura || !horarioFechamento || horarioAbertura >= horarioFechamento) {
    exibirMensagemConfiguracoes("O horário de encerramento deve ser posterior ao horário de abertura.", true);
    configHorarioFechamento.focus();
    return;
  }

  const configuracoes = {
    nomeEscola: configNomeEscola.value.trim(),
    responsavel: configResponsavel.value.trim(),
    horarioAbertura,
    horarioFechamento,
    permitirFinaisDeSemana: configFinaisDeSemana.checked,
  };

  if (!configuracoes.nomeEscola || !configuracoes.responsavel) {
    exibirMensagemConfiguracoes("Preencha o nome da escola e o responsável pelo sistema.", true);
    return;
  }

  const botaoSalvar = formularioConfiguracoes.querySelector('[type="submit"]');
  if (botaoSalvar) botaoSalvar.disabled = true;

  try {
    const servico = window.servicoAgendamentosSupabase;
    await servico.salvarConfiguracoesSistema(configuracoes);
    const statusRecursos = Object.fromEntries(
      Array.from(document.querySelectorAll("#listaEspacosConfiguracoes input[data-espaco-nome]"))
        .map((checkbox) => [checkbox.dataset.espacoNome, checkbox.checked]),
    );
    await servico.atualizarStatusEspacos(statusRecursos);

    configuracoesSistema = configuracoes;
    configuracoesSistemaCarregadas = true;
    aplicarNomeEscola(configuracoes.nomeEscola);
    await carregarEspacosNosFiltros();
    exibirMensagemConfiguracoes("Configurações salvas e compartilhadas com todos os usuários.");
    return true;
  } catch (erro) {
    console.error("Erro ao salvar configurações:", erro);
    exibirMensagemConfiguracoes("Não foi possível concluir todas as alterações. Recarregue a página e confira os dados antes de tentar novamente.", true);
    return false;
  } finally {
    if (botaoSalvar) botaoSalvar.disabled = false;
  }
}

async function restaurarConfiguracoes() {
  const confirmou = window.confirm(
    "Deseja restaurar os padrões do sistema? Horários, espaços e regra de finais de semana serão redefinidos. Os agendamentos existentes serão preservados.",
  );
  if (!confirmou) return;

  configNomeEscola.value = "CETI Dr. Noronha Filho";
  configResponsavel.value = "Coordenador";
  configHorarioAbertura.value = "07:30";
  configHorarioFechamento.value = "18:30";
  configFinaisDeSemana.checked = false;
  document.querySelectorAll("#listaEspacosConfiguracoes input[data-espaco-nome]").forEach((checkbox) => {
    checkbox.checked = true;
  });

  const restaurado = await salvarConfiguracoes(new Event("submit", { cancelable: true }));
  if (restaurado) {
    exibirMensagemConfiguracoes("Padrões restaurados. Os agendamentos existentes foram preservados.");
  }
}

formularioConfiguracoes.addEventListener("submit", salvarConfiguracoes);
botaoRestaurarConfiguracoes.addEventListener("click", restaurarConfiguracoes);

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
carregarPerfilUsuario();
carregarEspacosNosFiltros();

carregarConfiguracoesSistema();

atualizarRelatorios();

definirDataMinima();

renderizarAgendamentos();

inicializarAgendaDiaria();
renderizarAgendaSemanal();

inicializarNavegacao();

inicializarNotificacoes();

// Consulta os registros compartilhados no banco após inicializar os componentes.
carregarAgendamentosDoBanco()
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
carregarPerfilUsuario();
carregarEspacosNosFiltros();

preencherFormularioConfiguracoes();

atualizarRelatorios();

definirDataMinima();

renderizarAgendamentos();

inicializarAgendaDiaria();

inicializarNavegacao();

inicializarNotificacoes();

// Consulta os registros compartilhados no banco após inicializar os componentes.
carregarAgendamentosDoBanco();