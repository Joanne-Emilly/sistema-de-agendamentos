
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
    const mensagemErro = erro.message?.toLowerCase() || "";

    if (
        mensagemErro.includes("invalid login credentials")
    ) {
        return "E-mail ou senha incorretos. Verifique suas credenciais.";
    }

    if (
        mensagemErro.includes("email not confirmed")
    ) {
        return "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";
    }

    if (
        mensagemErro.includes("too many requests")
    ) {
        return "Muitas tentativas de acesso. Aguarde alguns instantes e tente novamente.";
    }

    if (
        mensagemErro.includes("fetch")
    ) {
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
