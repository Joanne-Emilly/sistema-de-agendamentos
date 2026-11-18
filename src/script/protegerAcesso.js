
/* ========================================
   PROTEÇÃO DE ACESSO - SISTEMA DE AGENDAMENTO
======================================== */

async function verificarAutenticacao() {
    try {
        // Confere a existência de um usuário autenticado
        const { data, error } = await clienteSupabase.auth.getUser();

        if (error || !data.user) {
            window.location.replace("/login.html");
            return;
        }

        // Redireciona para o login caso a sessão seja encerrada
        clienteSupabase.auth.onAuthStateChange((evento) => {
            if (evento === "SIGNED_OUT") {
                window.location.replace("/login.html");
            }
        });

        // Carrega o sistema somente depois da autenticação
        const scriptAplicacao = document.createElement("script");

        scriptAplicacao.src = "/src/script/script.js";

        scriptAplicacao.onload = () => {
            document.body.style.visibility = "visible";
        };

        scriptAplicacao.onerror = () => {
            console.error("Não foi possível carregar o sistema.");
            document.body.style.visibility = "visible";
        };

        document.body.appendChild(scriptAplicacao);

    } catch (erro) {
        console.error("Erro ao verificar autenticação:", erro);
        window.location.replace("/src/html/login.html");
    }
}

// Impede a exibição da aplicação antes da validação
document.body.style.visibility = "hidden";

verificarAutenticacao();
/*  */