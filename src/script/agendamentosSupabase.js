/* ========================================
   SERVIÇO DE AGENDAMENTOS - SUPABASE
   Centraliza o acesso à tabela public.agendamentos.
======================================== */

(function () {
  "use strict";

  function obterClienteSupabase() {
    if (!window.clienteSupabase && typeof clienteSupabase === "undefined") {
      throw new Error("A conexão com o Supabase não foi inicializada.");
    }

    return typeof clienteSupabase !== "undefined"
      ? clienteSupabase
      : window.clienteSupabase;
  }

  function converterAgendamentoParaInterface(registro) {
    return {
      id: registro.id,
      usuarioId: registro.usuario_id,
      espacoId: registro.espaco_id,
      professorResponsavel: registro.professor_responsavel,
      turma: registro.turma,
      espacoEscolar: registro.espacos?.nome || "",
      recursosPedagogicos: (registro.agendamento_recursos || []).map((item) => item.recurso?.nome).filter(Boolean),
      dataAgendamento: registro.data_agendamento,
      horarioInicio: String(registro.horario_inicio || "").slice(0, 5),
      horarioFim: String(registro.horario_fim || "").slice(0, 5),
      finalidade: registro.finalidade,
      status: registro.status,
      criadoEm: registro.criado_em,
      atualizadoEm: registro.atualizado_em,
    };
  }

  async function obterUsuarioAutenticado(cliente) {
    const { data, error } = await cliente.auth.getUser();

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Sua sessão expirou. Entre novamente no sistema.");
    }

    return data.user;
  }

  async function obterEspacoPorNome(cliente, nomeEspaco) {
    const { data, error } = await cliente
      .from("espacos")
      .select("id, nome")
      .eq("nome", nomeEspaco)
      .eq("ativo", true)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("O espaço selecionado não foi encontrado ou está inativo.");
    }

    return data;
  }

  async function listarAgendamentos() {
    const cliente = obterClienteSupabase();

    const { data, error } = await cliente
      .from("agendamentos")
      .select(`
        id,
        usuario_id,
        espaco_id,
        professor_responsavel,
        turma,
        data_agendamento,
        horario_inicio,
        horario_fim,
        finalidade,
        status,
        criado_em,
        atualizado_em,
        espacos!agendamentos_espaco_id_fkey ( nome ),
        agendamento_recursos ( recurso:espacos!agendamento_recursos_recurso_id_fkey ( nome ) )
      `)
      .order("data_agendamento", { ascending: true })
      .order("horario_inicio", { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map(converterAgendamentoParaInterface);
  }

  async function listarEspacos() {
    const cliente = obterClienteSupabase();

    const { data, error } = await cliente
      .from("espacos")
      .select("id, nome, tipo")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async function salvarNovoAgendamento(dadosFormulario) {
    const cliente = obterClienteSupabase();
    const espaco = await obterEspacoPorNome(
      cliente,
      dadosFormulario.espacoEscolar,
    );

    const recursosPedagogicos = Array.isArray(dadosFormulario.recursosPedagogicos)
      ? dadosFormulario.recursosPedagogicos
      : [];

    const { data: agendamentoId, error } = await cliente.rpc(
      "criar_agendamento_com_recursos",
      {
        p_espaco_id: espaco.id,
        p_turma: dadosFormulario.turma,
        p_data: dadosFormulario.dataAgendamento,
        p_horario_inicio: dadosFormulario.horarioInicio,
        p_horario_fim: dadosFormulario.horarioFim,
        p_finalidade: dadosFormulario.finalidade,
        p_recursos: recursosPedagogicos,
      },
    );

    if (error) {
      throw error;
    }

    const { data, error: erroConsulta } = await cliente
      .from("agendamentos")
      .select(`
        id,
        usuario_id,
        espaco_id,
        professor_responsavel,
        turma,
        data_agendamento,
        horario_inicio,
        horario_fim,
        finalidade,
        status,
        criado_em,
        atualizado_em,
        espacos!agendamentos_espaco_id_fkey ( nome ),
        agendamento_recursos ( recurso:espacos!agendamento_recursos_recurso_id_fkey ( nome ) )
      `)
      .eq("id", agendamentoId)
      .single();

    if (erroConsulta) {
      throw erroConsulta;
    }

    return converterAgendamentoParaInterface(data);
  }

  async function atualizarAgendamento(id, dadosFormulario) {
    const cliente = obterClienteSupabase();
    const espaco = await obterEspacoPorNome(
      cliente,
      dadosFormulario.espacoEscolar,
    );

    const alteracoes = {
      espaco_id: espaco.id,
      professor_responsavel: dadosFormulario.professorResponsavel,
      turma: dadosFormulario.turma,
      data_agendamento: dadosFormulario.dataAgendamento,
      horario_inicio: dadosFormulario.horarioInicio,
      horario_fim: dadosFormulario.horarioFim,
      finalidade: dadosFormulario.finalidade,
      atualizado_em: new Date().toISOString(),
    };

    const { data, error } = await cliente
      .from("agendamentos")
      .update(alteracoes)
      .eq("id", id)
      .select(`
        id,
        usuario_id,
        espaco_id,
        professor_responsavel,
        turma,
        data_agendamento,
        horario_inicio,
        horario_fim,
        finalidade,
        status,
        criado_em,
        atualizado_em,
        espacos!agendamentos_espaco_id_fkey ( nome )
      `)
      .single();

    if (error) {
      throw error;
    }

    return converterAgendamentoParaInterface(data);
  }

  async function cancelarAgendamento(id) {
    const cliente = obterClienteSupabase();

    const { data, error } = await cliente
      .from("agendamentos")
      .update({
        status: "cancelado",
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }


  async function obterConfiguracoesSistema() {
    const cliente = obterClienteSupabase();
    const { data, error } = await cliente
      .from("configuracoes")
      .select("id, nome_escola, responsavel, horario_abertura, horario_fechamento, finais_de_semana")
      .order("atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async function salvarConfiguracoesSistema(configuracoes) {
    const cliente = obterClienteSupabase();
    const { data, error } = await cliente
      .from("configuracoes")
      .update({
        nome_escola: configuracoes.nomeEscola,
        responsavel: configuracoes.responsavel,
        horario_abertura: configuracoes.horarioAbertura,
        horario_fechamento: configuracoes.horarioFechamento,
        finais_de_semana: configuracoes.permitirFinaisDeSemana,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-4000-8000-000000000001")
      .select("id")
      .single();

    if (error) throw error;
    return data;
  }

  async function listarTodosEspacos() {
    const cliente = obterClienteSupabase();
    const { data, error } = await cliente
      .from("espacos")
      .select("id, nome, ativo, tipo")
      .order("nome", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function atualizarStatusEspacos(statusPorNome) {
    const cliente = obterClienteSupabase();
    const espacos = await listarTodosEspacos();

    await Promise.all(
      espacos.map((espaco) => {
        const ativo = statusPorNome[espaco.nome];
        if (typeof ativo !== "boolean" || ativo === espaco.ativo) {
          return Promise.resolve();
        }

        return cliente
          .from("espacos")
          .update({ ativo })
          .eq("id", espaco.id)
          .then(({ error }) => {
            if (error) throw error;
          });
      }),
    );
  }

  window.servicoAgendamentosSupabase = Object.freeze({
    listarAgendamentos,
    listarEspacos,
    obterConfiguracoesSistema,
    salvarConfiguracoesSistema,
    listarTodosEspacos,
    atualizarStatusEspacos,
    salvarNovoAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
  });
})();
