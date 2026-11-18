/* ========================================
   LOGIN - SISTEMA DE AGENDAMENTO ESCOLAR
   Acesso somente para contas criadas pela coordenação no Supabase.
   ======================================== */

const formularioLogin = document.getElementById("formularioLogin");
const campoEmail = document.getElementById("emailLogin");
const campoSenha = document.getElementById("senhaLogin");
const botaoMostrarSenha = document.getElementById("botaoMostrarSenha");
const botaoEntrar = document.getElementById("botaoEntrar");
const textoBotaoEntrar = document.getElementById("textoBotaoEntrar");
const indicadorCarregamento = document.getElementById("indicadorCarregamento");
const mensagemLogin = document.getElementById("mensagemLogin");

function exibirMensagemLogin(mensagem, tipo = "erro") {
    mensagemLogin.textContent = mensagem;
    mensagemLogin.className = `mensagemLogin ${tipo}`;
    mensagemLogin.hidden = false;
}

function ocultarMensagemLogin() {
    mensagemLogin.textContent = "";
    mensagemLogin.className = "mensagemLogin";
    mensagemLogin.hidden = true;
}

function alternarVisibilidadeSenha() {
    const senhaVisivel = campoSenha.type === "text";
    campoSenha.type = senhaVisivel ? "password" : "text";
    botaoMostrarSenha.textContent = senhaVisivel ? "Mostrar" : "Ocultar";
    botaoMostrarSenha.setAttribute("aria-label", senhaVisivel ? "Mostrar senha" : "Ocultar senha");
    botaoMostrarSenha.setAttribute("aria-pressed", String(!senhaVisivel));
}

function definirEstadoCarregamento(carregando) {
    botaoEntrar.disabled = carregando;
    campoEmail.disabled = carregando;
    campoSenha.disabled = carregando;
    botaoMostrarSenha.disabled = carregando;
    indicadorCarregamento.hidden = !carregando;
    textoBotaoEntrar.textContent = carregando ? "Entrando..." : "Entrar";
}

function obterMensagemErroLogin(erro) {
    const codigoErro = erro?.code || "";
    const mensagemErro = String(erro?.message || "").toLowerCase();

    if (codigoErro === "email_not_confirmed" || mensagemErro.includes("email not confirmed")) {
        return "Esta conta ainda não está liberada para acesso. Procure a coordenação para verificar o cadastro.";
    }

    if (codigoErro === "invalid_credentials" || mensagemErro.includes("invalid login credentials")) {
        return "E-mail ou senha incorretos. Se você ainda não recebeu acesso ao sistema, procure a coordenação.";
    }

    if (codigoErro === "too_many_requests" || mensagemErro.includes("too many requests")) {
        return "Muitas tentativas de acesso. Aguarde alguns instantes e tente novamente.";
    }

    if (mensagemErro.includes("fetch")) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
    }

    return "Não foi possível realizar o login. Tente novamente ou procure a coordenação.";
}

async function entrarNoSistema() {
    ocultarMensagemLogin();

    if (typeof clienteSupabase === "undefined" || !clienteSupabase.auth) {
        exibirMensagemLogin("Não foi possível estabelecer a conexão com o serviço de autenticação.");
        return;
    }

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (!email) {
        exibirMensagemLogin("Informe seu endereço de e-mail.");
        campoEmail.focus();
        return;
    }

    if (!campoEmail.checkValidity()) {
        exibirMensagemLogin("Informe um endereço de e-mail válido.");
        campoEmail.focus();
        return;
    }

    if (!senha) {
        exibirMensagemLogin("Informe sua senha.");
        campoSenha.focus();
        return;
    }

    try {
        definirEstadoCarregamento(true);

        const { data, error } = await clienteSupabase.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error) throw error;

        if (!data.user || !data.session) {
            throw new Error("Não foi possível estabelecer a sessão.");
        }

        window.location.replace("/index.html");
    } catch (erro) {
        console.error("Erro ao realizar login:", erro);
        exibirMensagemLogin(obterMensagemErroLogin(erro));
        definirEstadoCarregamento(false);
    }
}

formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    entrarNoSistema();
});

botaoMostrarSenha.addEventListener("click", alternarVisibilidadeSenha);
campoEmail.addEventListener("input", ocultarMensagemLogin);
campoSenha.addEventListener("input", ocultarMensagemLogin);
