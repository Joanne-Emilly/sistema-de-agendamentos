
Regras de Negócio — Sistema de Agendamento Escolar
1. Objetivo
Este documento define as regras de negócio do Sistema de Agendamento Escolar, desenvolvido para organizar e controlar as reservas dos espaços físicos e equipamentos da escola.

O sistema tem como finalidade facilitar o agendamento, evitar conflitos de horários, controlar a disponibilidade dos recursos e permitir que professores e gestão escolar acompanhem as reservas de forma organizada e segura.

2. Escopo do sistema
O sistema deverá permitir o gerenciamento de reservas dos seguintes recursos:

2.1. Espaços escolares
Laboratório de Informática;

Laboratório de Biologia;

Biblioteca;

Salas de aula destinadas a atividades especiais;

Auditório;

Outros espaços cadastrados pela gestão escolar.

2.2. Equipamentos e ferramentas
Projetor multimídia;

Caixa de som;

Notebook;

Microfone;

Cabos e adaptadores;

Outros equipamentos cadastrados pela gestão escolar.

A lista de espaços e equipamentos deverá ser configurável, permitindo que a gestão escolar adicione, edite, desative ou remova recursos conforme as necessidades da instituição.

3. Tipos de usuários
O sistema deverá possuir dois perfis principais de usuários.

3.1. Professor
O professor poderá:

Acessar o sistema utilizando suas credenciais;

Consultar os espaços e equipamentos disponíveis;

Visualizar a disponibilidade por data e horário;

Solicitar reservas;

Informar a turma e a finalidade da utilização;

Consultar suas próprias reservas;

Solicitar o cancelamento de reservas;

Solicitar alterações em agendamentos, quando permitido;

Consultar o status de suas solicitações;

Receber notificações sobre alterações no status das reservas.

O professor não poderá cadastrar novos recursos, alterar as regras gerais do sistema ou aprovar suas próprias reservas, caso a aprovação da gestão seja exigida.

3.2. Gestão escolar
A gestão escolar terá acesso às funcionalidades administrativas e poderá:

Consultar todas as reservas;

Aprovar ou recusar solicitações;

Cancelar reservas quando necessário;

Cadastrar, editar, desativar e remover espaços e equipamentos;

Definir os horários de funcionamento;

Configurar regras de utilização dos recursos;

Bloquear espaços ou equipamentos para manutenção, eventos ou outras atividades;

Gerenciar os usuários e suas permissões;

Consultar o histórico de alterações;

Gerar relatórios de utilização;

Identificar conflitos, indisponibilidades e reservas canceladas.

As ações administrativas deverão ser registradas para permitir a rastreabilidade das operações.

4. Regras gerais de agendamento
RN01 — Autenticação: somente usuários autenticados poderão realizar operações que alterem dados do sistema.

RN02 — Identificação do solicitante: toda reserva deverá estar vinculada ao usuário responsável pelo agendamento.

RN03 — Informações obrigatórias: uma solicitação deverá conter, no mínimo:

Espaço ou equipamento desejado;

Data da utilização;

Horário de início;

Horário de término;

Nome ou identificação do professor responsável;

Turma ou grupo atendido, quando aplicável;

Finalidade da utilização.

RN04 — Validação dos horários: o horário de término deverá ser posterior ao horário de início.

RN05 — Datas válidas: não serão permitidas reservas para datas passadas.

RN06 — Disponibilidade: o sistema deverá verificar se o recurso está disponível antes de aceitar uma solicitação.

RN07 — Conflitos de horário: não poderão existir reservas confirmadas ou pendentes incompatíveis para o mesmo recurso e período, conforme a política de aprovação definida pela escola.

RN08 — Recursos distintos: espaços e equipamentos diferentes poderão ser reservados simultaneamente, desde que não exista conflito de disponibilidade ou outra restrição cadastrada.

RN09 — Consulta de disponibilidade: os usuários deverão poder consultar os horários livres e ocupados antes de solicitar uma reserva.

RN10 — Confirmação: toda solicitação deverá apresentar ao usuário um retorno com seu status atual.

RN11 — Integridade: o sistema deverá validar novamente a disponibilidade no momento de registrar ou confirmar uma reserva, evitando que solicitações simultâneas provoquem duplicidade.

5. Regras de aprovação
RN12 — Política de aprovação: a gestão escolar poderá definir se as reservas serão aprovadas automaticamente ou se precisarão de aprovação manual.

RN13 — Aprovação manual: quando a aprovação for obrigatória, a reserva somente será considerada confirmada após a autorização de um usuário com permissão administrativa.

RN14 — Recusa: uma solicitação recusada deverá registrar o responsável pela decisão e, preferencialmente, o motivo da recusa.

RN15 — Comunicação: o solicitante deverá ser informado quando uma reserva for aprovada, recusada ou cancelada.

RN16 — Reserva pendente: uma solicitação pendente não poderá ser apresentada como reserva confirmada.

RN17 — Conflito durante a aprovação: antes de aprovar uma solicitação, o sistema deverá verificar novamente a disponibilidade do recurso.

6. Regras de cancelamento e alteração
RN18 — Cancelamento pelo professor: o professor poderá solicitar o cancelamento de suas próprias reservas, respeitando os prazos e as regras estabelecidos pela escola.

RN19 — Cancelamento administrativo: a gestão poderá cancelar reservas por motivos justificados, como manutenção, eventos institucionais ou indisponibilidade do recurso.

RN20 — Registro do cancelamento: todo cancelamento deverá registrar a data, o horário, o usuário responsável e o motivo, quando informado.

RN21 — Liberação de horário: após o cancelamento efetivo, o horário deverá voltar a ficar disponível, desde que não exista outro bloqueio ou reserva válida.

RN22 — Alteração de reserva: mudanças de data, horário ou recurso deverão passar por nova validação de disponibilidade.

RN23 — Histórico: alterações não deverão apagar os registros anteriores do histórico da reserva.

7. Regras específicas para espaços escolares
RN24 — Capacidade: quando um espaço possuir limite de ocupação, a quantidade de participantes informada não poderá ultrapassar a capacidade cadastrada.

RN25 — Horário de funcionamento: as reservas deverão respeitar os dias e horários de funcionamento definidos pela escola.

RN26 — Finalidade: o professor deverá informar a finalidade pedagógica ou institucional da utilização.

RN27 — Manutenção: espaços em manutenção deverão ficar indisponíveis para novos agendamentos durante o período bloqueado.

RN28 — Uso simultâneo: um mesmo espaço não poderá ser reservado por grupos diferentes no mesmo período, salvo se a gestão tiver definido uma regra específica que permita o compartilhamento.

RN29 — Restrições de utilização: espaços que exigirem autorização especial ou cuidados específicos poderão possuir regras adicionais cadastradas pela gestão.

8. Regras específicas para equipamentos
RN30 — Identificação: cada equipamento deverá possuir identificação própria, descrição e status de disponibilidade.

RN31 — Quantidade disponível: equipamentos cadastrados em quantidade deverão respeitar o limite de unidades disponíveis para cada período.

RN32 — Reserva de equipamentos: o sistema deverá impedir que a quantidade reservada ultrapasse a quantidade disponível.

RN33 — Indisponibilidade: equipamentos quebrados, extraviados, em manutenção ou temporariamente indisponíveis não poderão ser reservados.

RN34 — Retirada e devolução: caso a escola controle a retirada e a devolução, o sistema deverá permitir registrar o responsável, a data e o horário correspondentes.

RN35 — Equipamento vinculado a um espaço: quando um equipamento for fixo ou pertencer exclusivamente a determinado espaço, sua disponibilidade deverá respeitar as regras desse espaço.

RN36 — Uso conjunto: se uma reserva exigir um espaço e um equipamento específico, todos os recursos necessários deverão estar disponíveis no período solicitado.

9. Regras de prioridade e conflitos
RN37 — Conflito de horário: duas reservas incompatíveis não poderão ser confirmadas para o mesmo recurso no mesmo período.

RN38 — Prioridade institucional: a gestão poderá definir critérios de prioridade para atividades pedagógicas, avaliações, eventos institucionais e outras necessidades da escola.

RN39 — Critério de desempate: quando duas solicitações tiverem a mesma prioridade, a escola poderá utilizar a ordem de solicitação como critério de desempate.

RN40 — Ausência de regra de prioridade: se não houver prioridade previamente definida, a gestão deverá analisar o conflito antes de autorizar uma reserva incompatível.

RN41 — Bloqueios administrativos: períodos bloqueados para eventos, manutenção ou outras atividades institucionais não poderão ser reservados pelos professores.

10. Status das reservas
Cada reserva deverá possuir um status que represente sua situação atual.

Pendente: solicitação aguardando análise da gestão;

Aprovada: solicitação autorizada;

Recusada: solicitação não autorizada;

Cancelada: reserva cancelada pelo solicitante ou pela gestão;

Concluída: utilização encerrada, quando o sistema controlar essa etapa.

O sistema deverá apresentar os status de forma clara e atualizar as informações conforme as ações realizadas.

Uma reserva recusada ou cancelada não deverá ocupar permanentemente a disponibilidade do recurso. O status de cada reserva deverá ser mantido no histórico para fins de consulta e auditoria.

11. Notificações
RN42 — Confirmação de solicitação: o sistema deverá informar que a solicitação foi registrada.

RN43 — Mudança de status: o sistema deverá informar o professor quando sua reserva for aprovada, recusada ou cancelada.

RN44 — Alterações administrativas: quando a gestão modificar ou cancelar uma reserva, o solicitante deverá ser notificado.

RN45 — Lembretes: o sistema poderá oferecer lembretes antes do horário agendado, conforme as configurações disponíveis.

As notificações poderão ser exibidas dentro do sistema. O envio por e-mail ou outros canais dependerá da implementação e da disponibilidade desses serviços.

12. Relatórios e consultas
RN46 — Consulta de reservas: a gestão deverá poder consultar as reservas por data, horário, professor, turma, espaço, equipamento e status.

RN47 — Histórico individual: o sistema deverá permitir consultar as reservas anteriores de cada professor.

RN48 — Relatório de utilização: a gestão deverá poder identificar quais espaços e equipamentos são mais utilizados.

RN49 — Cancelamentos e recusas: os relatórios poderão apresentar a quantidade de reservas canceladas e recusadas.

RN50 — Exportação: quando implementada, a exportação dos relatórios deverá respeitar as permissões de acesso e a proteção dos dados.

13. Segurança e permissões
RN51 — Controle de acesso: cada usuário deverá acessar apenas as funcionalidades permitidas para seu perfil.

RN52 — Proteção das credenciais: as senhas deverão ser armazenadas de forma segura, utilizando mecanismos apropriados de hash, e nunca em texto simples.

RN53 — Ações administrativas: operações críticas deverão ser registradas, incluindo o usuário responsável e a data e hora da ação.

RN54 — Proteção dos dados: informações pessoais e dados das reservas deverão ser acessíveis somente a usuários autorizados.

RN55 — Sessões: o sistema deverá possuir mecanismos apropriados para encerrar sessões e impedir acessos indevidos.

RN56 — Dados pessoais: o tratamento das informações deverá respeitar a legislação aplicável, incluindo a Lei Geral de Proteção de Dados Pessoais (LGPD).

14. Requisitos não funcionais relacionados às regras
Além das regras de negócio, o sistema deverá atender aos seguintes critérios de qualidade:

RNF01 — Usabilidade: apresentar interface simples, clara e intuitiva.

RNF02 — Responsividade: funcionar adequadamente em computadores, tablets e celulares.

RNF03 — Desempenho: realizar consultas e operações comuns em tempo adequado, sem atrasos desnecessários.

RNF04 — Confiabilidade: validar os dados e impedir inconsistências nas reservas.

RNF05 — Segurança: proteger os dados e aplicar controle de acesso por perfil.

RNF06 — Disponibilidade: estar disponível conforme a infraestrutura e os horários de operação definidos pela escola.

RNF07 — Integridade: evitar duplicidade e perda de informações em operações simultâneas.

RNF08 — Manutenibilidade: permitir correções e melhorias sem comprometer as funcionalidades existentes.

RNF09 — Compatibilidade: funcionar nos navegadores modernos definidos como alvo do projeto.

RNF10 — Recuperação: prever cópias de segurança e procedimentos de recuperação dos dados.

RNF11 — Acessibilidade: buscar compatibilidade com boas práticas de acessibilidade digital.

RNF12 — Auditoria: manter registros das operações relevantes, respeitando os limites de acesso e retenção de dados.

15. Tratamento de erros e situações excepcionais
RN57 — Dados inválidos: o sistema deverá informar quais campos precisam ser corrigidos quando uma solicitação possuir informações inválidas ou incompletas.

RN58 — Recurso indisponível: se um espaço ou equipamento estiver indisponível, o sistema deverá informar o motivo quando essa informação puder ser divulgada ao usuário.

RN59 — Falha durante a operação: se uma reserva não puder ser registrada, o sistema deverá informar que a operação não foi concluída e evitar a criação de registros incompletos.

RN60 — Solicitações simultâneas: quando dois usuários tentarem reservar o mesmo recurso no mesmo período, o sistema deverá garantir que as regras de disponibilidade sejam respeitadas.

RN61 — Exclusão de recursos: um espaço ou equipamento que possua reservas futuras ou histórico relevante deverá ser desativado ou ter sua remoção bloqueada, conforme a política de integridade definida para o sistema.

RN62 — Falha de notificação: se uma notificação não puder ser enviada, a reserva deverá manter seu estado correto, e a falha deverá ser registrada quando houver suporte para isso.

16. Diretrizes de implementação
As regras de disponibilidade deverão ser verificadas no servidor, e não apenas na interface do usuário.

As operações que confirmam reservas deverão ser protegidas contra condições de concorrência.

As permissões deverão ser verificadas em todas as operações administrativas.

Os status e as transições permitidas deverão ser definidos de forma consistente.

Os registros históricos relevantes não deverão ser apagados de maneira que comprometa a auditoria.

Os parâmetros que podem variar entre escolas, como horários de funcionamento, antecedência máxima e prazos de cancelamento, deverão ser configuráveis sempre que possível.

As funcionalidades de notificação, exportação e controle de retirada e devolução deverão ser implementadas conforme o escopo aprovado do projeto.

17. Premissas e decisões pendentes
Para evitar regras contraditórias, os seguintes parâmetros deverão ser definidos na configuração do sistema ou durante o planejamento técnico:

Se todas as reservas exigirão aprovação ou se algumas poderão ser aprovadas automaticamente;

Quantos dias de antecedência serão permitidos para os agendamentos;

Qual será o prazo mínimo para cancelamento ou alteração;

Quais horários e dias estarão disponíveis para reservas;

Quais critérios de prioridade serão adotados;

Quais notificações serão disponibilizadas;

Se haverá controle de retirada e devolução de equipamentos;

Por quanto tempo os registros e históricos deverão ser mantidos;

Quais formatos de relatório e exportação serão necessários;

Quem será responsável pela administração e manutenção do sistema.

Esses parâmetros não deverão ser tratados como valores fixos enquanto não forem definidos pela escola ou pela equipe responsável pelo projeto.

18. Considerações finais
Este documento estabelece a base das regras de negócio do Sistema de Agendamento Escolar. Seu cumprimento deverá orientar o desenvolvimento das funcionalidades, as validações de dados, o controle de acesso e os testes do sistema.

Qualquer alteração nas regras deverá ser documentada para manter a consistência entre os requisitos, a implementação e o comportamento esperado do sistema.
