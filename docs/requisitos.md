### Levantamento de Requisitos do Usuário
## Sistema Web de Agendamento dos Espaços Escolares
## 1. Descrição do projeto
O Sistema Web de Agendamento dos Espaços Escolares tem como objetivo organizar e facilitar a solicitação e a consulta de reservas dos espaços utilizados nas atividades escolares. A proposta é permitir que os usuários visualizem os agendamentos e registrem solicitações de uso, ajudando a evitar conflitos de horários e melhorando a organização das atividades.

# 1.1. Espaços incluídos na primeira versão
- Laboratório de Informática;
- Laboratório de Biologia;
- Biblioteca.
A inclusão de equipamentos, como projetor multimídia e caixa de som, e de outros espaços poderá ser avaliada futuramente, mas não faz parte do escopo inicial definido para esta etapa.

## 2. Objetivo do levantamento
Identificar os usuários previstos, suas necessidades e as funcionalidades necessárias para planejar o sistema. Este documento servirá de referência para as regras de negócio, a estrutura dos dados, o fluxograma e o protótipo no Figma.
Nesta semana, o foco é o levantamento e a documentação dos requisitos. Não é necessário implementar as funcionalidades.

## 3. Usuários previstos
# 3.1. Professor solicitante
Objetivo: solicitar o uso de um espaço escolar para aulas, apresentações e outras atividades pedagógicas.
Necessidades e funcionalidades previstas no protótipo:
- Visualizar os espaços disponíveis;
- Consultar os agendamentos registrados no sistema;
- Preencher uma solicitação de agendamento;
- Informar o espaço, o nome do professor, a turma, a data, o horário de início, o horário de término e a finalidade;
- Visualizar os agendamentos registrados;
- Prever ações para editar ou cancelar um agendamento;
- Receber mensagens de sucesso ou de erro durante o preenchimento e o registro.
  
# 3.2. Responsável pela organização dos espaços
Objetivo: acompanhar a utilização dos espaços e ajudar a manter os agendamentos organizados.
Necessidades identificadas:
- Consultar os agendamentos registrados;
- Identificar possíveis conflitos de horários;
- Conferir se os dados dos agendamentos estão completos;
- Informar à equipe as regras de funcionamento dos espaços que ainda precisam ser definidas.
As permissões administrativas, como aprovar ou recusar solicitações, cadastrar usuários ou bloquear espaços, ainda não estão definidas para a primeira versão e deverão ser discutidas com a professora.

# 3.3. Alunos
A possibilidade de os alunos consultarem ou solicitarem agendamentos não foi definida no escopo inicial. A equipe deverá registrar essa questão como pendente de decisão, sem considerar essas funcionalidades aprovadas nesta etapa.

## 4. Requisitos funcionais
Os requisitos funcionais descrevem o que o sistema deverá permitir fazer.
- RF01 — Visualizar espaços: apresentar os três espaços incluídos na primeira versão: Laboratório de Informática, Laboratório de Biologia e Biblioteca.
- RF02 — Consultar agendamentos: permitir visualizar os agendamentos registrados no protótipo.
- RF03 — Registrar agendamento: permitir preencher e registrar uma solicitação de uso de um espaço.
- RF04 — Informar dados: solicitar espaço, professor responsável, turma, data, horário de início, horário de término e finalidade.
- RF05 — Validar campos: informar quando houver campos obrigatórios não preenchidos.
- RF06 — Validar horário: impedir que o horário final seja igual ou anterior ao horário inicial.
- RF07 — Verificar conflito: verificar se existe outro agendamento ativo para o mesmo espaço, na mesma data e em horário sobreposto.
- RF08 — Editar agendamento: prever a possibilidade de editar um agendamento e validar novamente os dados e a disponibilidade.
- RF09 — Cancelar agendamento: prever o cancelamento de um agendamento, com pedido de confirmação.
- RF10 — Apresentar mensagens: mostrar mensagens claras de sucesso, erro e confirmação.
- RF11 — Armazenar dados localmente: na implementação do protótipo, utilizar localStorage para guardar os agendamentos no navegador utilizado.
A implementação desses requisitos ocorrerá gradualmente na etapa de programação. A documentação nesta semana não significa que as funcionalidades já estejam implementadas.

## 5. Requisitos não funcionais
Os requisitos não funcionais descrevem características de qualidade esperadas para a interface e o protótipo.
- RNF01 — Usabilidade: apresentar telas claras, organizadas e fáceis de compreender.
- RNF02 — Responsividade: planejar uma interface que se adapte a computadores e celulares.
- RNF03 — Consistência: utilizar rótulos, botões, cores e espaçamentos de maneira coerente entre as telas.
- RNF04 — Clareza das mensagens: explicar ao usuário o que aconteceu e como corrigir um erro, quando necessário.
- RNF05 — Integridade dos dados: validar os dados antes de registrar ou alterar um agendamento.
- RNF06 — Limite de armazenamento: deixar claro que os dados do localStorage ficam no navegador e no perfil utilizados e não são sincronizados automaticamente entre computadores.
Como esta versão é um protótipo didático sem backend, autenticação real ou banco de dados centralizado, ela não deverá ser apresentada como sistema oficial de reservas da escola.

## 6. Dados necessários para um agendamento
Cada solicitação deverá prever os seguintes campos:
Campo	Descrição	Obrigatório
Espaço	Local que será utilizado	Sim
Professor responsável	Nome ou identificação do professor	Sim
Turma	Turma atendida pela atividade	Sim
Data	Dia previsto para a utilização	Sim
Horário de início	Hora em que a utilização começa	Sim
Horário de término	Hora em que a utilização termina	Sim
Finalidade	Motivo pedagógico ou institucional do uso	Sim
Nos exemplos e testes do protótipo, deverão ser utilizados dados fictícios.

## 7. Necessidades gerais dos usuários
- Identificar facilmente os três espaços incluídos no projeto;
- Consultar os agendamentos registrados;
- Informar os dados necessários sem ambiguidade;
- Receber mensagens compreensíveis sobre campos inválidos ou conflitos;
- Evitar dois agendamentos ativos com horários sobrepostos para o mesmo espaço e data;
- Consultar, editar ou cancelar agendamentos conforme as funcionalidades previstas;
- Utilizar uma interface organizada em computador ou celular.

## 8. Limites e decisões pendentes
A primeira versão será um protótipo com HTML, CSS e JavaScript, utilizando localStorage para armazenar os dados no navegador. Não haverá backend nem PostgreSQL nesta etapa.
As seguintes questões precisam ser esclarecidas com a professora antes de serem tratadas como requisitos definitivos:
- Os alunos poderão consultar ou solicitar agendamentos?
- Quem poderá editar ou cancelar um agendamento?
- Será necessária aprovação de um responsável antes de considerar uma reserva confirmada?
- Quais são os dias e horários de funcionamento de cada espaço?
- Agendamentos consecutivos, sem intervalo entre eles, serão permitidos?
- Haverá limites de duração ou de antecedência para as solicitações?
- Equipamentos, como projetor e caixa de som, serão incluídos em uma etapa futura?
As respostas deverão ser registradas e compartilhadas com as equipes responsáveis pelas regras de negócio, estrutura dos dados, fluxo e protótipo.

## 9. Checklist de revisão da equipe
- [ ] O escopo inicial contém somente os três espaços definidos.
- [ ] Os usuários previstos e suas necessidades estão descritos.
- [ ] Os requisitos funcionais estão identificados.
- [ ] Os requisitos não funcionais estão separados dos funcionais.
- [ ] Todos os campos obrigatórios do agendamento estão documentados.
- [ ] Os requisitos estão coerentes com as regras de negócio.
- [ ] As dúvidas que dependem da professora estão registradas.
- [ ] O documento está coerente com o fluxograma e o protótipo Figma.
- [ ] O arquivo foi salvo como docs/requisitos.md no repositório GitHub.

## 10. Critério de conclusão
A Task 04 será considerada concluída quando o arquivo docs/requisitos.md identificar os usuários previstos, listar os requisitos funcionais e não funcionais, descrever os campos necessários para um agendamento e registrar as decisões pendentes. O documento deverá ser compartilhado com as equipes responsáveis pelas regras de negócio, estrutura dos dados, fluxo e protótipo.
