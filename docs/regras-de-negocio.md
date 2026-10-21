
# Regras de Negócio
## Sistema Web de Agendamento dos Espaços Escolares

## 1. Objetivo

Este documento registra as regras que deverão orientar o agendamento dos espaços escolares. As regras serão utilizadas para planejar o fluxo do sistema, as telas do Figma e, posteriormente, as validações em JavaScript.

Nesta primeira versão, o sistema será um protótipo didático desenvolvido com HTML, CSS, JavaScript e `localStorage`. Não haverá backend nem PostgreSQL.

## 2. Escopo

O sistema prevê o agendamento dos seguintes espaços:

- Laboratório de Informática;
- Laboratório de Biologia;
- Biblioteca.

Cada agendamento deverá registrar as seguintes informações:

- Professor responsável;
- Turma;
- Espaço;
- Data;
- Horário de início;
- Horário de término;
- Finalidade da utilização.

O protótipo deverá prever a visualização da agenda e ações de consulta, edição e cancelamento. Essas funcionalidades serão implementadas gradualmente nas próximas etapas.

## 3. Dados Obrigatórios

As regras a seguir definem as informações necessárias para registrar um agendamento.

- **RN01 — Espaço:** todo agendamento deverá indicar um dos espaços disponíveis no sistema.
- **RN02 — Professor responsável:** todo agendamento deverá informar o nome ou a identificação fictícia do professor responsável.
- **RN03 — Turma:** todo agendamento deverá informar a turma que utilizará o espaço.
- **RN04 — Data:** todo agendamento deverá informar a data de utilização.
- **RN05 — Horários:** todo agendamento deverá informar os horários de início e término.
- **RN06 — Finalidade:** todo agendamento deverá descrever brevemente a finalidade da utilização do espaço.

### 3.1. Exemplos

**Exemplo válido:**

- Espaço: Laboratório de Informática;
- Professor responsável: Prof.ª Ana;
- Turma: 1º A;
- Data: 20/11/2026;
- Horário: 08:00–09:00;
- Finalidade: aula prática de programação.

**Exemplo inválido:**

Agendamento sem espaço, professor responsável, data ou horário.

**Resultado esperado:** o sistema deverá impedir o registro enquanto houver campos obrigatórios não preenchidos.

## 4. Validação de Data e Horário

- **RN07 — Campos obrigatórios:** o sistema não deverá aceitar um agendamento se algum campo obrigatório estiver vazio.
- **RN08 — Ordem dos horários:** o horário final deverá ser posterior ao horário inicial.
- **RN09 — Data passada:** a proposta inicial é não permitir agendamentos em datas passadas. Essa regra deverá ser confirmada com a professora antes da implementação.
- **RN10 — Horário de funcionamento:** os limites de dias e horários em que cada espaço poderá ser utilizado ainda precisam ser definidos pela escola. A equipe não deverá inventar esses limites.

### 4.1. Exemplos de Validação de Horário

| Horário informado | Resultado esperado |
|---|---|
| 08:00–09:00 | Válido |
| 09:00–08:00 | Inválido: horário final anterior ao inicial |
| 08:00–08:00 | Inválido: horários iguais |

## 5. Conflitos de Horário

- **RN11 — Mesmo espaço e mesma data:** não deverá haver dois agendamentos ativos com horários sobrepostos para o mesmo espaço e a mesma data.
- **RN12 — Espaços diferentes:** agendamentos em espaços diferentes poderão ocorrer no mesmo período, desde que não exista outra restrição definida pela escola.
- **RN13 — Horários consecutivos:** se um agendamento terminar exatamente quando outro começar, eles poderão ser considerados consecutivos, sem sobreposição, desde que essa interpretação seja aprovada pela professora.

### 5.1. Exemplos para Testar a Regra

| Situação | Exemplo | Resultado esperado |
|---|---|---|
| Mesmo espaço, horários sobrepostos | Laboratório de Informática: 08:00–10:00 e 09:00–11:00 | Conflito |
| Mesmo espaço, mesmo horário | Biblioteca: 10:00–11:00 e 10:00–11:00 | Conflito |
| Espaços diferentes, mesmo horário | Biblioteca e Laboratório de Biologia: 10:00–11:00 | Permitido, salvo outra restrição |
| Mesmo espaço, horários consecutivos | Biblioteca: 08:00–09:00 e 09:00–10:00 | Confirmar com a professora |

### 5.2. Critério para Identificar Sobreposição

Para verificar se dois agendamentos entram em conflito, deverão ser considerados o espaço, a data e os horários.

A verificação deverá identificar se o horário de início de um agendamento ocorre antes do término do outro e se o horário de término ocorre depois do início do outro.

A regra deverá ser aplicada somente aos agendamentos ativos.

## 6. Consulta, Edição e Cancelamento

- **RN14 — Consulta:** o usuário deverá conseguir visualizar os agendamentos registrados no protótipo.
- **RN15 — Identificação do registro:** cada agendamento deverá ter um identificador único para que possa ser localizado.
- **RN16 — Edição:** ao editar um agendamento, o sistema deverá validar novamente os campos, a data, os horários e a disponibilidade do espaço.
- **RN17 — Cancelamento:** antes de cancelar, o sistema deverá pedir confirmação ao usuário.
- **RN18 — Agendamento cancelado:** um agendamento cancelado deverá deixar de ser considerado ativo para a verificação de conflitos. O registro poderá permanecer armazenado com seu status de cancelado.

## 7. Mensagens do Sistema

O protótipo deverá prever mensagens claras para as principais situações.

| Situação | Mensagem prevista |
|---|---|
| Registro concluído | "Agendamento registrado com sucesso." |
| Campo obrigatório vazio | "Preencha todos os campos obrigatórios." |
| Horário inválido | "O horário final deve ser posterior ao horário inicial." |
| Conflito de horário | "Já existe um agendamento para este espaço nesse período." |
| Confirmação de cancelamento | "Deseja realmente cancelar este agendamento?" |
| Cancelamento concluído | "Agendamento cancelado." |

As mensagens poderão ser ajustadas durante a criação do protótipo e a realização dos testes.

## 8. Limites da Primeira Versão

A primeira versão do sistema deverá respeitar os seguintes limites:

- Os dados utilizados nos testes deverão ser fictícios.
- O `localStorage` armazenará os dados no navegador e no perfil em que foram cadastrados.
- Os dados não serão sincronizados automaticamente entre computadores.
- Esta versão não terá backend, PostgreSQL, autenticação real nem perfis administrativos.
- As regras serão documentadas nesta semana; não precisam ser programadas agora.
- As validações serão implementadas posteriormente em JavaScript.
- O protótipo não deverá ser apresentado como sistema oficial de reservas da escola.

## 9. Dúvidas para a Professora Decidir

A equipe deverá registrar as decisões pendentes antes de definir regras definitivas.

| ID | Questão pendente | Proposta ou observação |
|---|---|---|
| DP01 | Agendamentos em datas passadas devem ser bloqueados? | Proposta: sim. |
| DP02 | Quais são os dias e horários de funcionamento de cada espaço? | Aguardando definição da escola. |
| DP03 | Agendamentos consecutivos, como 08:00–09:00 e 09:00–10:00, serão permitidos? | Aguardando confirmação. |
| DP04 | O sistema deverá permitir editar ou cancelar qualquer agendamento no protótipo? | Aguardando definição da professora. |
| DP05 | Há limite de duração ou antecedência para uma reserva? | Aguardando definição da escola. |
| DP06 | Existe alguma prioridade entre turmas ou atividades? | Aguardando definição da professora. |
| DP07 | O que deve acontecer quando duas pessoas tentarem reservar o mesmo espaço e horário? | Aguardando definição da professora. |

Enquanto essas dúvidas não forem respondidas, a equipe deverá identificá-las como pendentes de decisão, e não tratá-las como regras aprovadas.

## 10. Checklist de Revisão da Equipe

Antes de concluir a atividade, a equipe deverá verificar os seguintes itens:

- [ ] Todos os campos obrigatórios estão documentados.
- [ ] Cada regra pode ser testada com um exemplo.
- [ ] Foram incluídos exemplos válidos e inválidos.
- [ ] As regras de conflito consideram espaço, data e sobreposição de horários.
- [ ] A edição e o cancelamento foram descritos.
- [ ] As mensagens de erro e confirmação foram propostas.
- [ ] As dúvidas para a professora foram registradas.
- [ ] O documento está coerente com os requisitos, o fluxo e o protótipo Figma.
- [ ] O arquivo foi salvo como `docs/regras_de_negocio.md` no repositório do projeto.

## 11. Critério de Conclusão

A **Task 05** será considerada concluída quando o arquivo `docs/regras_de_negocio.md` apresentar:

1. Regras de negócio claras e testáveis;
2. Exemplos válidos e inválidos;
3. Critérios de validação de data, horário e conflitos;
4. Regras de consulta, edição e cancelamento;
5. Mensagens previstas para as principais situações;
6. Dúvidas pendentes identificadas.

**Não é necessário programar as regras nesta semana.**

---

**Arquivo de destino:** `docs/regras_de_negocio.md`

**Tecnologias previstas:** HTML, CSS, JavaScript e `localStorage`.

**Etapa atual:** documentação das regras de negócio.

**Status esperado ao concluir a Task 05:** regras documentadas, exemplos definidos e decisões pendentes registradas.
