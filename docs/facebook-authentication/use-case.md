# Autenticação do Facebook

> ## Dados:
* Token de Acesso

> ## Fluxo primário
1. Obter dados (nome, email e Facebook ID) da API do Facebook;
2. Consultar se existe um usuário com o e-mail recebido acima;
3. Criar uma conta para o usuário com os dados recebidos do Facebook;
4. Criar um token de acesso, a partir do ID do usuário, com expiração de 30 minutos;
5. Retornar o token de acesso gerado.

> ## Fluxo alternativo: Usuário já existe
3. Atualizar a conta do usuário com os dados recebidos do Facebook (Facebook ID e nome - só atualizar se não houver nome)

> ## Fluxo de exceção: Token inválido ou expirado
1. Retornar um erro de autenticação
