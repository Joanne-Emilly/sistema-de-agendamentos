
# Levantamento de Requisitos do Usuário

## Sistema Web de Agendamento dos Espaços Escolares

## 1. Descrição do Projeto

O Sistema Web de Agendamento dos Espaços Escolares tem como objetivo organizar e facilitar a solicitação e a consulta de reservas dos espaços utilizados nas atividades escolares.

A proposta é permitir que os usuários visualizem os agendamentos e registrem solicitações de uso, ajudando a evitar conflitos de horários e melhorando a organização das atividades.

### 1.1. Espaços Incluídos na Primeira Versão

- Laboratório de Informática;
- Laboratório de Biologia;
- Biblioteca.

A inclusão de equipamentos, como projetor multimídia e caixa de som, e de outros espaços poderá ser avaliada futuramente, mas não faz parte do escopo inicial.

## 2. Objetivo do Levantamento

Identificar os usuários previstos, suas necessidades e as funcionalidades necessárias para planejar o sistema.

Este documento servirá como referência para a definição das regras de negócio, da estrutura dos dados, do fluxograma e do protótipo no Figma.

**Escopo da atividade:** nesta semana, o foco é o levantamento e a documentação dos requisitos. Não é necessário implementar as funcionalidades.

## 3. Usuários Previstos

### 3.1. Professor Solicitante

**Objetivo:** solicitar o uso de um espaço escolar para aulas, apresentações e outras atividades pedagógicas.

**Necessidades e funcionalidades previstas:**

- Visualizar os espaços disponíveis;
- Consultar os agendamentos registrados;
- Preencher uma solicitação de agendamento;
- Informar espaço, professor, turma, data, horário de início, horário de término e finalidade;
- Visualizar os agendamentos registrados;
- Prever ações para editar ou cancelar um agendamento;
- Receber mensagens de sucesso ou erro durante o preenchimento e o registro.

### 3.2. Responsável pela Organização dos Espaços

**Objetivo:** acompanhar a utilização dos espaços e ajudar a manter os agendamentos organizados.

**Necessidades identificadas:**

- Consultar os agendamentos registrados;
- Identificar possíveis conflitos de horários;
- Conferir se os dados dos agendamentos estão completos;
- Informar à equipe as regras de funcionamento dos espaços que ainda precisam ser definidas.

As permissões administrativas, como aprovar ou recusar solicitações, cadastrar usuários ou bloquear espaços, ainda não estão definidas para a primeira versão e deverão ser discutidas com a professora.

### 3.3. Alunos

A possibilidade de os alunos consultarem ou solicitarem agendamentos ainda não foi definida no escopo inicial.

A equipe deverá registrar essa questão como pendente de decisão, sem considerar essas funcionalidades aprovadas nesta etapa.

## 4. Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deverá oferecer.

| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Visualizar espaços | Apresentar os três espaços: Laboratório de Informática, Laboratório de Biologia e Biblioteca. |
| RF02 | Consultar agendamentos | Permitir visualizar os agendamentos registrados no protótipo. |
| RF03 | Registrar agendamento | Permitir preencher e registrar uma solicitação de uso de um espaço. |
| RF04 | Informar dados | Solicitar espaço, professor responsável, turma, data, horários de início e término e finalidade. |
| RF05 | Validar campos | Informar quando houver campos obrigatórios não preenchidos. |
| RF06 | Validar horário | Impedir que o horário final seja igual ou anterior ao horário inicial. |
| RF07 | Verificar conflito | Verificar se existe outro agendamento ativo para o mesmo espaço, na mesma data e em horário sobreposto. |
| RF08 | Editar agendamento | Permitir prever a edição de um agendamento, validando novamente os dados e a disponibilidade. |
| RF09 | Cancelar agendamento | Prever o cancelamento de um agendamento, com pedido de confirmação. |
| RF10 | Apresentar mensagens | Mostrar mensagens claras de sucesso, erro e confirmação. |
| RF11 | Armazenar dados localmente | Utilizar `localStorage` para guardar os agendamentos no navegador durante a implementação do protótipo. |

A implementação desses requisitos ocorrerá gradualmente durante a etapa de programação.

**Importante:** documentar um requisito não significa que a funcionalidade já esteja implementada.

## 5. Requisitos Não Funcionais

Os requisitos não funcionais descrevem as características de qualidade esperadas para a interface e o protótipo.

| ID | Requisito | Descrição |
|---|---|---|
| RNF01 | Usabilidade | Apresentar telas claras, organizadas e fáceis de compreender. |
| RNF02 | Responsividade | Planejar uma interface que se adapte a computadores e celulares. |
| RNF03 | Consistência | Utilizar rótulos, botões, cores e espaçamentos de maneira coerente entre as telas. |
| RNF04 | Clareza das mensagens | Explicar ao usuário o que aconteceu e como corrigir um erro, quando necessário. |
| RNF05 | Integridade dos dados | Validar os dados antes de registrar ou alterar um agendamento. |
| RNF06 | Limite de armazenamento | Informar que os dados do `localStorage` ficam no navegador e no perfil utilizados e não são sincronizados automaticamente entre computadores. |

Como esta versão será um protótipo didático sem backend, autenticação real ou banco de dados centralizado, ela **não deverá ser apresentada como sistema oficial de reservas da escola**.

## 6. Dados Necessários para um Agendamento

Cada solicitação deverá prever os seguintes campos:

| Campo | Descrição | Obrigatório |
|---|---|---|
| Espaço | Local que será utilizado. | Sim |
| Professor responsável | Nome ou identificação do professor. | Sim |
| Turma | Turma atendida pela atividade. | Sim |
| Data | Dia previsto para a utilização. | Sim |
| Horário de início | Hora em que a utilização começa. | Sim |
| Horário de término | Hora em que a utilização termina. | Sim |
| Finalidade | Motivo pedagógico ou institucional do uso. | Sim |

**Observação:** nos exemplos e testes do protótipo, deverão ser utilizados dados fictícios.

## 7. Necessidades Gerais dos Usuários

O sistema deverá considerar as seguintes necessidades:

- Identificar facilmente os três espaços incluídos no projeto;
- Consultar os agendamentos registrados;
- Informar os dados necessários sem ambiguidade;
- Receber mensagens compreensíveis sobre campos inválidos ou conflitos;
- Evitar dois agendamentos ativos com horários sobrepostos para o mesmo espaço e data;
- Consultar, editar ou cancelar agendamentos conforme as funcionalidades previstas;
- Utilizar uma interface organizada em computador ou celular.

## 8. Limites e Decisões Pendentes

### 8.1. Limites da Primeira Versão

A primeira versão será um protótipo desenvolvido com:

- **HTML:** estrutura das páginas;
- **CSS:** aparência e organização visual;
- **JavaScript:** comportamento e validação das funcionalidades;
- **`localStorage`:** armazenamento dos dados no navegador.

Nesta etapa, não haverá backend nem PostgreSQL.

O armazenamento local permite manter os dados no navegador e no perfil utilizados, mas não oferece sincronização automática entre diferentes computadores ou navegadores.

### 8.2. Decisões Pendentes de Definição

As seguintes questões deverão ser esclarecidas com a professora antes de serem tratadas como requisitos definitivos.

| ID | Questão pendente | Responsável pela definição |
|---|---|---|
| DP01 | Os alunos poderão consultar ou solicitar agendamentos? | Professora |
| DP02 | Quem poderá editar ou cancelar um agendamento? | Professora |
| DP03 | Será necessária aprovação de um responsável antes de considerar uma reserva confirmada? | Professora |
| DP04 | Quais são os dias e horários de funcionamento de cada espaço? | Professora |
| DP05 | Agendamentos consecutivos, sem intervalo entre eles, serão permitidos? | Professora |
| DP06 | Haverá limites de duração ou de antecedência para as solicitações? | Professora |
| DP07 | Equipamentos, como projetor e caixa de som, serão incluídos em uma etapa futura? | Professora |

As respostas deverão ser registradas e compartilhadas com as equipes responsáveis pelas regras de negócio, estrutura dos dados, fluxo e protótipo.

**Atenção:** até que essas questões sejam respondidas, a equipe deverá evitar transformar suposições em regras definitivas do sistema.

## 9. Checklist de Revisão da Equipe

Antes de concluir a atividade, a equipe deverá verificar os seguintes itens:

- [ ] O escopo inicial contém somente os três espaços definidos.
- [ ] Os usuários previstos e suas necessidades estão descritos.
- [ ] Os requisitos funcionais estão identificados.
- [ ] Os requisitos não funcionais estão separados dos funcionais.
- [ ] Todos os campos obrigatórios do agendamento estão documentados.
- [ ] Os requisitos estão coerentes com as regras de negócio.
- [ ] As dúvidas que dependem da professora estão registradas.
- [ ] O documento está coerente com o fluxograma e o protótipo Figma.
- [ ] O arquivo foi salvo como `docs/requisitos.md` no repositório GitHub.

## 10. Critério de Conclusão

A **Task 04** será considerada concluída quando o arquivo `docs/requisitos.md`:

1. Identificar os usuários previstos e suas necessidades;
2. Listar os requisitos funcionais e não funcionais;
3. Descrever os campos necessários para um agendamento;
4. Registrar os limites do protótipo;
5. Documentar as decisões pendentes de definição;
6. Estiver organizado e coerente com o escopo do projeto.

Ao finalizar, o documento deverá ser compartilhado com as equipes responsáveis pelas regras de negócio, estrutura dos dados, fluxo e protótipo.

---

**Arquivo de destino:** `docs/requisitos.md`

**Tecnologias previstas:** HTML, CSS, JavaScript e `localStorage`.

**Etapa atual:** levantamento e documentação dos requisitos.

**Status esperado ao concluir a Task 04:** requisitos documentados e compartilhados com as equipes envolvidas.
