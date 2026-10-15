## Regras de Negócio — Sistema Web de Agendamento dos Espaços Escolares
1. Objetivo
Este documento registra as regras que deverão orientar o agendamento dos espaços escolares. As regras serão usadas para planejar o fluxo do sistema, as telas do Figma e, posteriormente, as validações em JavaScript.
Nesta primeira versão, o sistema será um protótipo didático com HTML, CSS, JavaScript e localStorage. Não haverá backend nem PostgreSQL.

## 2. Escopo
O sistema prevê o agendamento dos seguintes espaços:
- Laboratório de Informática;
- Laboratório de Biologia;
- Biblioteca.
O agendamento deverá registrar o professor responsável, a turma, o espaço, a data, os horários de início e término e a finalidade da utilização.
O protótipo deverá prever a visualização da agenda e ações de consulta, edição e cancelamento. Essas ações serão implementadas gradualmente nas próximas etapas.

## 3. Dados obrigatórios
RN01 — Espaço: todo agendamento deverá indicar um dos espaços disponíveis no sistema.
RN02 — Professor responsável: todo agendamento deverá informar o nome ou identificação fictícia do professor responsável.
RN03 — Turma: todo agendamento deverá informar a turma que utilizará o espaço.
RN04 — Data: todo agendamento deverá informar a data de utilização.
RN05 — Horários: todo agendamento deverá informar o horário de início e o horário de término.
RN06 — Finalidade: todo agendamento deverá descrever brevemente a finalidade da utilização do espaço.
Exemplo válido: Laboratório de Informática; Prof.ª Ana; 1º A; 20/11/2026; 08:00–09:00; aula prática de programação.
Exemplo inválido: agendamento sem espaço, professor, data ou horário.

## 4. Validação de data e horário
RN07 — Campos obrigatórios: o sistema não deverá aceitar um agendamento se algum campo obrigatório estiver vazio.
RN08 — Ordem dos horários: o horário final deverá ser posterior ao horário inicial.
- Válido: 08:00–09:00.
- Inválido: 09:00–08:00.
- Inválido: 08:00–08:00.
RN09 — Data passada: a proposta inicial é não permitir agendamentos em datas passadas. A regra deverá ser confirmada com a professora antes da implementação.
RN10 — Horário de funcionamento: os limites de dias e horários em que cada espaço pode ser utilizado ainda precisam ser definidos pela escola. A equipe não deverá inventar esses limites.

## 5. Conflitos de horário
RN11 — Mesmo espaço e mesma data: não deverá haver dois agendamentos ativos com horários sobrepostos para o mesmo espaço e a mesma data.
RN12 — Espaços diferentes: agendamentos em espaços diferentes poderão ocorrer no mesmo período, desde que não exista outra restrição definida pela escola.
RN13 — Horários consecutivos: se um agendamento terminar exatamente quando outro começar, eles poderão ser considerados consecutivos, sem sobreposição, desde que essa interpretação seja aprovada pela professora.
Exemplos para testar a regra
Situação	Exemplo	Resultado esperado
Mesmo espaço, horários sobrepostos	Laboratório de Informática, 08:00–10:00 e 09:00–11:00	Conflito
Mesmo espaço, mesmo horário	Biblioteca, 10:00–11:00 e 10:00–11:00	Conflito
Espaços diferentes, mesmo horário	Biblioteca e Laboratório de Biologia, 10:00–11:00	Permitido, salvo outra restrição
Mesmo espaço, horários consecutivos	Biblioteca, 08:00–09:00 e 09:00–10:00	Confirmar com a professora

## 6. Consulta, edição e cancelamento
RN14 — Consulta: o usuário deverá conseguir visualizar os agendamentos registrados no protótipo.
RN15 — Identificação do registro: cada agendamento deverá ter um identificador único para que possa ser localizado.
RN16 — Edição: ao editar um agendamento, o sistema deverá validar novamente os campos, a data, os horários e a disponibilidade do espaço.
RN17 — Cancelamento: antes de cancelar, o sistema deverá pedir confirmação do usuário.
RN18 — Agendamento cancelado: um agendamento cancelado deverá deixar de ser considerado ativo para a verificação de conflitos. O registro poderá permanecer armazenado com seu status de cancelado.

## 7. Mensagens do sistema
O protótipo deverá prever mensagens claras para as principais situações:
- Sucesso: “Agendamento registrado com sucesso.”
- Campo obrigatório: “Preencha todos os campos obrigatórios.”
- Horário inválido: “O horário final deve ser posterior ao horário inicial.”
- Conflito: “Já existe um agendamento para este espaço nesse período.”
- Confirmação de cancelamento: “Deseja realmente cancelar este agendamento?”
- Cancelamento concluído: “Agendamento cancelado.”
As mensagens poderão ser ajustadas durante a criação do protótipo e os testes.

## 8. Limites da primeira versão
- Os dados de teste deverão ser fictícios.
- O localStorage armazena os dados no navegador e no perfil em que foram cadastrados; não sincroniza automaticamente informações entre computadores.
- Esta versão não terá backend, PostgreSQL, autenticação real nem perfis administrativos.
- As regras serão documentadas nesta semana; não precisam ser programadas agora.
- As validações serão implementadas posteriormente em JavaScript.
- O protótipo não deverá ser apresentado como sistema oficial de reservas da escola.

## 9. Dúvidas para a professora decidir
A equipe deverá registrar as decisões pendentes antes de definir regras definitivas:
- Agendamentos em datas passadas devem ser bloqueados? (proposta: sim)
- Quais são os dias e horários de funcionamento de cada espaço?
- Agendamentos consecutivos, como 08:00–09:00 e 09:00–10:00, serão permitidos?
- O sistema deverá permitir editar ou cancelar qualquer agendamento no protótipo?
- Há limite de duração ou antecedência para uma reserva?
- Existe alguma prioridade entre turmas ou atividades?
- O que deve acontecer quando duas pessoas tentarem reservar o mesmo espaço e horário?
Enquanto essas dúvidas não forem respondidas, a equipe deverá identificá-las como pendentes de decisão, e não tratá-las como regras aprovadas.

## 10. Checklist de revisão da equipe
- [ ] Todos os campos obrigatórios estão documentados.
- [ ] Cada regra pode ser testada com um exemplo.
- [ ] Foram incluídos exemplos válidos e inválidos.
- [ ] As regras de conflito consideram espaço, data e sobreposição de horários.
- [ ] Edição e cancelamento foram descritos.
- [ ] As mensagens de erro e confirmação foram propostas.
- [ ] As dúvidas para a professora foram registradas.
- [ ] O documento está coerente com os requisitos, o fluxo e o protótipo Figma.
- [ ] O arquivo foi salvo como docs/regras_de_negocio.md no repositório do projeto.

## 11. Critério de conclusão
A Task 05 será considerada concluída quando o arquivo docs/regras_de_negocio.md apresentar regras claras e testáveis, exemplos válidos e inválidos, mensagens previstas e dúvidas pendentes identificadas. Não é necessário programar as regras nesta semana.
