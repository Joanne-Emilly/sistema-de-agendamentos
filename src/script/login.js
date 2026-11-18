
/* ========================================
   LOGIN - SISTEMA DE AGENDAMENTO ESCOLAR
   ======================================== */

// Elementos do formulário
const formularioLogin = document.getElementById("formularioLogin");

const campoEmail = document.getElementById("emailLogin");
const campoSenha = document.getElementById("senhaLogin");

const botaoMostrarSenha = document.getElementById("botaoMostrarSenha");
const botaoEntrar = document.getElementById("botaoEntrar");

const textoBotaoEntrar = document.getElementById("textoBotaoEntrar");
const indicadorCarregamento = document.getElementById("indicadorCarregamento");

const mensagemLogin = document.getElementById("mensagemLogin");
const botaoReenviarConfirmacao = document.getElementById("botaoReenviarConfirmacao");

// ========================================
// EXIBIR MENSAGENS
// ========================================

function exibirMensagemLogin(mensagem, tipo = "erro") {
    mensagemLogin.textContent = mensagem;

    mensagemLogin.className = `mensagemLogin ${tipo}`;

    mensagemLogin.hidden = false;
}

// ========================================
// OCULTAR MENSAGENS
// ========================================

function ocultarMensagemLogin() {
    mensagemLogin.textContent = "";
    mensagemLogin.className = "mensagemLogin";
    mensagemLogin.hidden = true;
    botaoReenviarConfirmacao.hidden = true;
}

// ========================================
// MOSTRAR OU OCULTAR SENHA
// ========================================

function alternarVisibilidadeSenha() {
    const senhaVisivel = campoSenha.type === "text";

    campoSenha.type = senhaVisivel ? "password" : "text";

    botaoMostrarSenha.textContent = senhaVisivel
        ? "Mostrar"
        : "Ocultar";

    botaoMostrarSenha.setAttribute(
        "aria-label",
        senhaVisivel ? "Mostrar senha" : "Ocultar senha"
    );

    botaoMostrarSenha.setAttribute(
        "aria-pressed",
        String(!senhaVisivel)
    );
}

// ========================================
// CONTROLE DO CARREGAMENTO
// ========================================

function definirEstadoCarregamento(carregando) {
    botaoEntrar.disabled = carregando;

    campoEmail.disabled = carregando;
    campoSenha.disabled = carregando;

    botaoMostrarSenha.disabled = carregando;

    indicadorCarregamento.hidden = !carregando;

    textoBotaoEntrar.textContent = carregando
        ? "Entrando..."
        : "Entrar";
}

// ========================================
// TRATAMENTO DE ERROS DE AUTENTICAÇÃO
// ========================================

function obterMensagemErroLogin(erro) {
    const codigoErro = erro?.code || "";
    const mensagemErro = erro?.message?.toLowerCase() || "";

    if (codigoErro === "email_not_confirmed" || mensagemErro.includes("email not confirmed")) {
        return "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada ou solicite um novo envio abaixo.";
    }

    if (codigoErro === "invalid_credentials" || mensagemErro.includes("invalid login credentials")) {
        return "Não foi possível entrar. Confira o e-mail e a senha. Se você acabou de se cadastrar e ainda não confirmou o e-mail, use a opção de reenvio abaixo.";
    }

    if (codigoErro === "over_email_send_rate_limit" || codigoErro === "email_send_rate_limit_exceeded") {
        return "O limite de envio de e-mails foi atingido. Aguarde um pouco antes de tentar novamente.";
    }

    if (codigoErro === "too_many_requests" || mensagemErro.includes("too many requests")) {
        return "Muitas tentativas de acesso. Aguarde alguns instantes e tente novamente.";
    }

    if (mensagemErro.includes("fetch")) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
    }

    return "Não foi possível realizar o login. Tente novamente.";
}

// ========================================
// AUTENTICAÇÃO COM SUPABASE
// ========================================


async function entrarNoSistema() {

    ocultarMensagemLogin();

    // Verifica se a conexão está disponível
    if (
        typeof clienteSupabase === "undefined" ||
        !clienteSupabase.auth
    ) {
        exibirMensagemLogin(
            "Não foi possível estabelecer a conexão com o serviço de autenticação."
        );

        return;
    }

    // Obtém os valores dos campos
    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    // Validação do e-mail
    if (!email) {
        exibirMensagemLogin(
            "Informe seu endereço de e-mail."
        );

        campoEmail.focus();
        return;
    }

    if (!campoEmail.checkValidity()) {
        exibirMensagemLogin(
            "Informe um endereço de e-mail válido."
        );

        campoEmail.focus();
        return;
    }

    // Validação da senha
    if (!senha) {
        exibirMensagemLogin(
            "Informe sua senha."
        );

        campoSenha.focus();
        return;
    }

    try {

        definirEstadoCarregamento(true);

        // Autenticação com Supabase
        const { data, error } =
            await clienteSupabase.auth.signInWithPassword({
                email: email,
                password: senha
            });

        if (error) {
            throw error;
        }

        // Verifica se a sessão foi estabelecida
        if (!data.user || !data.session) {
            throw new Error(
                "Não foi possível estabelecer a sessão."
            );
        }

        // Login realizado com sucesso
        window.location.replace("index.html");

    } catch (erro) {

        console.error(
            "Erro ao realizar login:",
            erro
        );

        exibirMensagemLogin(
            obterMensagemErroLogin(erro)
        );

        if (["invalid_credentials", "email_not_confirmed"].includes(erro?.code) ||
            erro?.message?.toLowerCase().includes("invalid login credentials") ||
            erro?.message?.toLowerCase().includes("email not confirmed")) {
            botaoReenviarConfirmacao.hidden = false;
        }

        definirEstadoCarregamento(false);

    }

}



// ========================================
// EVENTOS DO FORMULÁRIO
// ========================================

// Evento de envio do formulário
formularioLogin.addEventListener("submit", function (evento) {

    evento.preventDefault();

    entrarNoSistema();

});

// Evento para mostrar ou ocultar senha
botaoMostrarSenha.addEventListener("click", function () {

    alternarVisibilidadeSenha();

});

// Oculta mensagens quando o usuário altera os campos
campoEmail.addEventListener("input", ocultarMensagemLogin);

campoSenha.addEventListener("input", ocultarMensagemLogin);


// ========================================
// REENVIAR CONFIRMAÇÃO DE E-MAIL
// ========================================

async function reenviarConfirmacaoEmail() {
    const email = campoEmail.value.trim().toLowerCase();

    if (!email || !campoEmail.checkValidity()) {
        exibirMensagemLogin("Informe um e-mail válido para solicitar o reenvio.");
        campoEmail.focus();
        return;
    }

    botaoReenviarConfirmacao.disabled = true;
    botaoReenviarConfirmacao.textContent = "Solicitando envio...";

    try {
        const { error } = await clienteSupabase.auth.resend({
            type: "signup",
            email: email
        });

        if (error) throw error;

        exibirMensagemLogin(
            "Se houver um cadastro pendente para este e-mail, uma nova mensagem de confirmação será enviada. Verifique também a caixa de spam.",
            "sucesso"
        );
        botaoReenviarConfirmacao.hidden = true;
    } catch (erro) {
        console.error("Erro ao reenviar confirmação:", erro);
        const codigo = erro?.code || "";

        if (codigo === "over_email_send_rate_limit" || codigo === "email_send_rate_limit_exceeded") {
            exibirMensagemLogin("O limite de envio de e-mails foi atingido. Aguarde antes de solicitar novamente.");
        } else {
            exibirMensagemLogin("Não foi possível solicitar o reenvio agora. Aguarde um pouco e tente novamente.");
        }
    } finally {
        botaoReenviarConfirmacao.disabled = false;
        botaoReenviarConfirmacao.textContent = "Reenviar e-mail de confirmação";
    }
}

botaoReenviarConfirmacao.addEventListener("click", reenviarConfirmacaoEmail);
