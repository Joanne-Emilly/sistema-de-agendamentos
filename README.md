# Sistema de Reserva de Espaços e Recursos Escolares

Sistema web desenvolvido para organizar a reserva e o acompanhamento do uso dos espaços físicos e dos recursos pedagógicos do **CETI Dr. Noronha Filho**, reduzindo conflitos de horários e facilitando o planejamento das atividades escolares.

**Aplicação em produção:** https://sistema-de-agendamentos-seven.vercel.app

## Sobre o projeto

O sistema foi desenvolvido no contexto do Curso Técnico em Desenvolvimento de Sistemas, com participação dos estudantes do **1º Ano A** e orientação da **Prof.ª Joanne Santos**.

A aplicação permite que professores consultem a agenda compartilhada, solicitem reservas, acompanhem seus próprios agendamentos e consultem relatórios. Usuários com perfil de coordenador também podem administrar configurações gerais e a disponibilidade dos espaços e equipamentos.

## Funcionalidades implementadas

### Acesso e perfis
- Autenticação por e-mail e senha utilizando Supabase Auth.
- Controle de acesso às páginas e funcionalidades conforme o perfil do usuário.
- Identificação automática do perfil pelo domínio institucional do e-mail:
  - `@professor.edu.pi.gov.br`: professor;
  - `@coordenadores.edu.pi.gov.br`: coordenador.
- Contas de professores e coordenadores são criadas manualmente pela administração no Supabase. Não há cadastro público.
- Indicador visual de carregamento durante a autenticação.
- Exibição das informações do usuário autenticado e opção de sair.

### Agenda semanal
- Visualização semanal em formato de calendário, organizada de segunda a sexta-feira.
- Navegação entre semana anterior, semana seguinte e semana atual.
- Filtro para consultar um espaço físico ou recurso pedagógico específico.
- Indicação visual dos períodos disponíveis e ocupados.
- Consulta dos horários de aula por oito períodos:
  
  | Aula | Horário |
  |---|---|
  | 1ª AULA | 07:30–08:30 |
  | 2ª AULA | 08:30–09:30 |
  | 3ª AULA | 09:50–10:50 |
  | 4ª AULA | 10:50–11:50 |
  | 5ª AULA | 12:50–13:50 |
  | 6ª AULA | 13:50–14:50 |
  | 7ª AULA | 15:10–16:10 |
  | 8ª AULA | 16:10–17:10 |

- Seleção de um horário livre para iniciar uma nova solicitação, com data e período preenchidos.
- Seleção de um horário ocupado para consultar os detalhes da reserva.
- Atualização dos dados da agenda a partir do Supabase.

### Novo agendamento
- Identificação automática do professor responsável a partir da sessão autenticada.
- Seleção de turma, espaço físico, data, período/horário e finalidade.
- Turmas disponíveis: 1A, 1B, 2A, 2B, 3A, 3B e 3C.
- Seleção opcional de recursos pedagógicos.
- Preenchimento automático dos horários ao selecionar uma das oito aulas; a opção **Outros horários** permite informar outro intervalo dentro do horário de funcionamento.
- Exibição apenas dos recursos que estejam disponíveis no período selecionado.
- Verificação de conflitos antes da gravação e validação adicional no banco de dados.
- Mensagem de sucesso após a conclusão da reserva.
- Aviso quando o espaço ou equipamento já estiver ocupado.

### Espaços e recursos pedagógicos

**Espaços físicos:**
- Laboratório de Informática;
- Laboratório de Biologia;
- Biblioteca.

**Recursos pedagógicos:**
- Projetor 1, Projetor 2, Projetor 3 e Projetor 4;
- Caixa de Som 1, Caixa de Som 2 e Caixa de Som 3.

Regras para os recursos:
- A reserva de recursos é opcional.
- É permitido selecionar, no máximo, um projetor e uma caixa de som por agendamento.
- Um mesmo equipamento não pode estar associado a duas reservas simultâneas.
- Equipamentos diferentes podem ser reservados no mesmo horário.
- Recursos ocupados não são apresentados como disponíveis para o período consultado.

### Meus Agendamentos
- Consulta das reservas realizadas pelo usuário autenticado.
- Exibição dos dados da reserva e dos recursos pedagógicos associados.
- Acompanhamento do status dos agendamentos.
- Opções de gerenciamento disponibilizadas conforme as permissões do usuário e o estado da reserva.

### Relatórios
- Consulta dos registros de agendamento.
- Aplicação de filtros para análise dos dados.
- Exportação dos resultados em Excel e CSV.
- Impressão dos relatórios ou salvamento em PDF pelo recurso de impressão do navegador.

### Configurações administrativas
Disponível somente para usuários com perfil de coordenador:
- Alterar o nome da escola exibido no sistema.
- Definir o responsável pelo sistema.
- Configurar horário de abertura e encerramento.
- Permitir ou bloquear agendamentos aos finais de semana.
- Ativar ou desativar espaços e recursos pedagógicos.
- Restaurar as configurações padrão sem excluir os agendamentos existentes.

### Interface responsiva
- Layout adaptável para computadores, tablets e celulares.
- Menu lateral recolhível em telas menores.
- Controles e formulários adaptados para navegação por dispositivos móveis.
- Agenda semanal com ajustes específicos para telas estreitas.

## Regras de negócio

- Cada agendamento utiliza um único espaço físico.
- Recursos pedagógicos podem ser associados opcionalmente à reserva.
- Não é permitido reservar o mesmo espaço físico em períodos sobrepostos.
- Não é permitido reservar o mesmo equipamento em períodos sobrepostos, mesmo que os espaços físicos sejam diferentes.
- Agendamentos cancelados não bloqueiam a disponibilidade.
- O professor responsável é definido pelo usuário autenticado.
- Os horários devem respeitar o funcionamento configurado pela coordenação.
- A possibilidade de agendar aos finais de semana depende da configuração administrativa.
- Espaços e recursos inativos não podem receber novas reservas.
- As validações são realizadas na interface e também no banco de dados, para evitar conflitos entre solicitações simultâneas.

## Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura das páginas e formulários |
| CSS3 | Estilização, layout e responsividade |
| JavaScript | Regras de interface, navegação, validações e integração com o banco |
| Supabase Auth | Autenticação dos usuários |
| Supabase Database (PostgreSQL) | Armazenamento dos agendamentos, espaços, recursos e configurações |
| Supabase RLS e funções SQL/RPC | Controle de acesso e validações no banco de dados |
| SheetJS | Exportação de relatórios para Excel |
| Git e GitHub | Versionamento do código-fonte |
| Vercel | Hospedagem e publicação da aplicação |
| Figma | Prototipação da interface |

## Organização dos arquivos

```text
.
├── src/
│   ├── html/
│   │   └── index.html
│   ├── css/
│   │   └── styles.css
│   └── script/
│       ├── script.js
│       ├── agendamentosSupabase.js
│       └── protegerAcesso.js
├── supabase/
│   └── supabase.js
└── README.md
```

- `src/html/index.html`: estrutura da aplicação e suas seções.
- `src/css/styles.css`: estilos, componentes visuais e regras responsivas.
- `src/script/script.js`: navegação, renderização da agenda, formulários, relatórios e configurações da interface.
- `src/script/agendamentosSupabase.js`: operações de consulta, criação, edição e cancelamento de agendamentos, além do acesso às configurações e aos espaços.
- `src/script/protegerAcesso.js`: proteção de acesso e controle da sessão/perfil.
- `supabase/supabase.js`: inicialização do cliente Supabase.

## Banco de dados e integração

A aplicação utiliza o Supabase como serviço de autenticação e banco de dados PostgreSQL. Entre as estruturas utilizadas estão:

- `agendamentos`: dados das reservas;
- `espacos`: cadastro de espaços físicos e recursos pedagógicos, incluindo seu tipo e situação;
- `agendamento_recursos`: associação entre agendamentos e recursos reservados;
- `configuracoes`: parâmetros gerais compartilhados do sistema.

A criação de uma reserva com seus recursos é realizada por uma função RPC no banco de dados, permitindo tratar a operação de forma integrada. Regras e políticas do banco complementam as validações realizadas no navegador.

> A chave publicável do Supabase utilizada no cliente não substitui as políticas de segurança. As permissões e operações devem permanecer protegidas pelas políticas RLS e pelas validações do banco. Nunca inclua chaves secretas ou credenciais administrativas no código-fonte.

## Como executar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Joanne-Emilly/sistema-de-agendamentos-ceti-dr-noronha-filho.git
   ```
2. Abra a pasta do projeto no editor de código.
3. Confira a configuração de conexão em `supabase/supabase.js` e utilize as credenciais públicas do projeto Supabase correspondente.
4. Sirva os arquivos por um servidor HTTP local ou utilize a hospedagem configurada. Como os caminhos dos arquivos são absolutos a partir da raiz (`/src/...`), execute a aplicação na raiz do site.
5. Crie previamente as contas dos usuários no Supabase Authentication e configure os dados e as permissões correspondentes no banco.

A aplicação é construída com HTML, CSS e JavaScript puros; não utiliza etapa de compilação de framework.

## Repositório e publicação

- **GitHub:** https://github.com/Joanne-Emilly/sistema-de-agendamentos-ceti-dr-noronha-filho
- **Produção:** https://sistema-de-agendamentos-seven.vercel.app
- **Hospedagem:** Vercel

## Instituição e equipe

**Instituição:** CETI Dr. Noronha Filho  
**Curso:** Técnico em Desenvolvimento de Sistemas  
**Turma participante:** 1º Ano A  
**Professora orientadora:** Prof.ª Joanne Santos

---

Projeto educacional desenvolvido para apoiar a organização dos espaços e recursos escolares e aplicar, na prática, conhecimentos de análise, desenvolvimento, banco de dados, interface e versionamento de software.
