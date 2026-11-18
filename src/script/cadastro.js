/* ========================================
   CADASTRO INSTITUCIONAL
   ======================================== */

const formularioCadastro = document.getElementById("formularioCadastro");
const campoNomeCadastro = document.getElementById("nomeCadastro");
const campoEmailCadastro = document.getElementById("emailCadastro");
const campoSenhaCadastro = document.getElementById("senhaCadastro");
const campoConfirmarSenhaCadastro = document.getElementById("confirmarSenhaCadastro");
const botaoMostrarSenhaCadastro = document.getElementById("botaoMostrarSenhaCadastro");
const botaoCadastrar = document.getElementById("botaoCadastrar");
const textoBotaoCadastrar = document.getElementById("textoBotaoCadastrar");
const indicadorCadastro = document.getElementById("indicadorCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

const DOMINIOS_INSTITUCIONAIS = [
    "professor.edu.pi.gov.br",
    "coordenadores.edu.pi.gov.br"
];

function exibirMensagemCadastro(mensagem, tipo = "erro") {
    mensagemCadastro.textContent = mensagem;
    mensagemCadastro.className = `mensagemLogin ${tipo}`;
    mensagemCadastro.hidden = false;
}

function ocultarMensagemCadastro() {
    mensagemCadastro.textContent = "";
    mensagemCadastro.className = "mensagemLogin";
    mensagemCadastro.hidden = true;
}

function definirCarregamentoCadastro(carregando) {
    botaoCadastrar.disabled = carregando;
    campoNomeCadastro.disabled = carregando;
    campoEmailCadastro.disabled = carregando;
    campoSenhaCadastro.disabled = carregando;
    campoConfirmarSenhaCadastro.disabled = carregando;
    botaoMostrarSenhaCadastro.disabled = carregando;
    indicadorCadastro.hidden = !carregando;
    textoBotaoCadastrar.textContent = carregando ? "Criando cadastro..." : "Criar cadastro";
}

function alternarSenhaCadastro() {
    const mostrar = campoSenhaCadastro.type === "password";
    campoSenhaCadastro.type = mostrar ? "text" : "password";
    campoConfirmarSenhaCadastro.type = mostrar ? "text" : "password";
    botaoMostrarSenhaCadastro.textContent = mostrar ? "Ocultar" : "Mostrar";
    botaoMostrarSenhaCadastro.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
    botaoMostrarSenhaCadastro.setAttribute("aria-pressed", String(mostrar));
}

function validarDominioInstitucional(email) {
    const partes = email.toLowerCase().split("@");
    if (partes.length !== 2 || !partes[0]) return false;
    return DOMINIOS_INSTITUCIONAIS.includes(partes[1]);
}

function obterMensagemErroCadastro(erro) {
    const mensagem = String(erro?.message || "").toLowerCase();

    if (mensagem.includes("already registered") || mensagem.includes("user already registered")) {
        return "Já existe uma conta cadastrada com esse e-mail. Tente entrar ou recuperar o acesso.";
    }

    if (mensagem.includes("password")) {
        return "A senha não atende aos requisitos definidos pelo serviço de autenticação.";
    }

    if (mensagem.includes("rate limit") || mensagem.includes("too many requests")) {
        return "Muitas tentativas de cadastro. Aguarde alguns instantes e tente novamente.";
    }

    if (mensagem.includes("fetch")) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
    }

    return "Não foi possível concluir o cadastro. Confira os dados e tente novamente. Se o problema persistir, procure a coordenação.";
}

async function cadastrarUsuario() {
    ocultarMensagemCadastro();

    if (typeof clienteSupabase === "undefined" || !clienteSupabase.auth) {
        exibirMensagemCadastro("Não foi possível estabelecer conexão com o serviço de cadastro.");
        return;
    }

    const nome = campoNomeCadastro.value.trim().replace(/\s+/g, " ");
    const email = campoEmailCadastro.value.trim().toLowerCase();
    const senha = campoSenhaCadastro.value;
    const confirmarSenha = campoConfirmarSenhaCadastro.value;

    if (nome.length < 3) {
        exibirMensagemCadastro("Informe seu nome completo.");
        campoNomeCadastro.focus();
        return;
    }

    if (!campoEmailCadastro.checkValidity() || !validarDominioInstitucional(email)) {
        exibirMensagemCadastro("Utilize um e-mail terminado em @professor.edu.pi.gov.br ou @coordenadores.edu.pi.gov.br.");
        campoEmailCadastro.focus();
        return;
    }

    if (senha.length < 8) {
        exibirMensagemCadastro("A senha deve ter pelo menos 8 caracteres.");
        campoSenhaCadastro.focus();
        return;
    }

    if (senha !== confirmarSenha) {
        exibirMensagemCadastro("As senhas informadas não são iguais.");
        campoConfirmarSenhaCadastro.focus();
        return;
    }

    try {
        definirCarregamentoCadastro(true);

        const { data, error } = await clienteSupabase.auth.signUp({
            email,
            password: senha,
            options: {
                data: { nome },
                emailRedirectTo: window.location.origin + "/src/html/login.html"
            }
        });

        if (error) throw error;

        if (!data.user) {
            throw new Error("Não foi possível criar a conta.");
        }

        if (data.session) {
            await clienteSupabase.auth.signOut();
        }

        formularioCadastro.reset();
        exibirMensagemCadastro(
            "Cadastro iniciado com sucesso! Enviamos um link de confirmação para seu e-mail institucional. Confirme o endereço antes de entrar no sistema.",
            "sucesso"
        );
    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        exibirMensagemCadastro(obterMensagemErroCadastro(erro));
    } finally {
        definirCarregamentoCadastro(false);
    }
}

formularioCadastro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    cadastrarUsuario();
});

botaoMostrarSenhaCadastro.addEventListener("click", alternarSenhaCadastro);

[campoNomeCadastro, campoEmailCadastro, campoSenhaCadastro, campoConfirmarSenhaCadastro]
    .forEach((campo) => campo.addEventListener("input", ocultarMensagemCadastro));
