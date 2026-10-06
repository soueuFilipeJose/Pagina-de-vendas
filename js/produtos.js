/* EDITE ESTE ARQUIVO para manter a vitrine. Valores monetários usam ponto.
   Os três exemplos são fictícios. Troque os dados e use exemplo: false.
   Não coloque senhas, tokens privados ou dados de compradores aqui. */
window.LOJA = {
  marca: "EntrePáginas", // [EDITAR] Nome da sua marca
  descricao: "Ebooks práticos para aprender, organizar a rotina e dar o próximo passo.",
  url: "", // [EDITAR] URL final com /. Vazio usa o endereço atual da publicação.
  logo: "", // [EDITAR] Caminho de uma imagem; vazio usa o símbolo de livro
  imagemSocial: "assets/compartilhamento.png", // [EDITAR] Imagem social 1200 × 630
  aviso: "Acesso por e-mail após a aprovação do pagamento",
  provaSocial: "[EDITAR] Inclua aqui uma avaliação real, com autorização do leitor.",
  whatsapp: "", // [EDITAR] Apenas números: 55 + DDD + número
  mensagemWhatsapp: "Olá! Gostaria de saber mais sobre os ebooks.",
  email: "", // [EDITAR] E-mail real de suporte
  identificacao: "[EDITAR] Nome ou razão social · CPF/CNPJ · endereço de atendimento",
  instagram: "", // [EDITAR] URL completa; links vazios não são exibidos
  youtube: "",
  plataformaPreferida: "kiwify", // Se indisponível, usa a outra plataforma
  autor: {
    nome: "[EDITAR] Nome do autor ou da equipe",
    resumo: "[EDITAR] Apresente sua experiência real, a origem dos materiais e como você pode ajudar o leitor. Inclua apenas credenciais que possa comprovar.",
    foto: "" // [EDITAR] Opcional; imagem quadrada
  },
  rastreamento: {
    googleAnalyticsId: "", // [EDITAR] G-XXXXXXXXXX
    metaPixelId: "" // [EDITAR] ID numérico do Meta Pixel
  },
  depoimentosExemplo: true, // [EDITAR] false somente depois de inserir relatos reais autorizados
  depoimentos: [
    { nome: "[EDITAR] Nome do leitor", texto: "[EDITAR] Substitua este exemplo por um depoimento real sobre a clareza e a utilidade do material.", detalhe: "Exemplo fictício · organização financeira" },
    { nome: "[EDITAR] Nome da leitora", texto: "[EDITAR] Conte aqui uma experiência real de uso, sem prometer que outras pessoas terão o mesmo resultado.", detalhe: "Exemplo fictício · receitas" },
    { nome: "[EDITAR] Nome do leitor", texto: "[EDITAR] Publique a avaliação somente com autorização. Não invente resultados, estrelas ou números de vendas.", detalhe: "Exemplo fictício · aprendizado" }
  ],
  faq: [
    { pergunta: "Como posso pagar?", resposta: "As opções disponíveis, como Pix, cartão ou boleto, aparecem no checkout da Kiwify ou da Hotmart. Parcelamento, taxas e prazo de aprovação dependem da oferta e do meio escolhido." },
    { pergunta: "Como recebo meu ebook?", resposta: "Após a aprovação do pagamento, siga as instruções enviadas pela plataforma ao e-mail informado na compra. Confira também a pasta de spam. O boleto pode levar mais tempo para ser aprovado." },
    { pergunta: "Os materiais são em PDF?", resposta: "Confira o formato informado na página de cada produto. Os exemplos desta vitrine são ebooks em PDF, para leitura em celular, tablet ou computador. Não há envio de livro físico." },
    { pergunta: "Como funciona a garantia?", resposta: "O prazo informado em cada produto deve corresponder à oferta do checkout, sem limitar seus direitos legais. Consulte a Política de Reembolso para saber como solicitar atendimento." },
    { pergunta: "E se eu precisar de ajuda?", resposta: "Use os canais de suporte no rodapé ou o atendimento identificado no comprovante da compra. Nunca envie senha ou dados completos do cartão." },
    { pergunta: "O resultado é garantido?", resposta: "Não. Os conteúdos são educacionais. Os resultados dependem do contexto e da aplicação de cada pessoa; não há promessa de renda, emagrecimento ou quitação de dívidas." }
  ]
};

window.PRODUTOS = [
  {
    id: "mes-no-verde",
    titulo: "Mês no verde",
    subtitulo: "Um passo por dia para organizar seu dinheiro.",
    categoria: "Finanças pessoais",
    descricao: "Um roteiro educativo de 30 dias para mapear gastos, entender as dívidas e construir um orçamento possível. Não promete quitar dívidas em 30 dias.",
    beneficios: ["Mapa de entradas, gastos e dívidas", "Exercícios para definir prioridades", "Roteiro de revisão semanal", "Modelo de orçamento para preencher"],
    precoDe: 39.90, // [EDITAR] Use apenas um preço anterior verdadeiro
    precoPor: 24.90,
    imagem: "", // [EDITAR] Ex.: assets/mes-no-verde.webp; vazio usa capa CSS
    selo: "[EDITAR] Novo",
    linkKiwify: "[EDITAR]",
    linkHotmart: "",
    garantiaDias: 7,
    faq: [{ pergunta: "Preciso entender de finanças?", resposta: "O exemplo foi pensado para iniciantes. [EDITAR] Ajuste à linguagem e ao conteúdo efetivo do seu ebook." }],
    exemplo: true,
    tema: "verde",
    formato: "PDF",
    paraQuem: "Para quem quer sair do improviso e enxergar melhor o próprio orçamento.",
    aviso: "Conteúdo educacional; não substitui orientação financeira individualizada.",
    ofertaFim: null // Opcional: "2026-12-31T23:59:59-03:00". Deve ser uma oferta real.
  },
  {
    id: "cozinha-fit",
    titulo: "Leve à mesa",
    subtitulo: "Receitas fit para uma rotina com mais sabor.",
    categoria: "Receitas fit",
    descricao: "Ideias de refeições, organização da semana e uma lista de compras para facilitar o dia a dia na cozinha, sem dietas milagrosas.",
    beneficios: ["Receitas com ingredientes acessíveis", "Sugestões para organizar a semana", "Lista de compras prática", "Orientações de preparo descritas passo a passo"],
    precoDe: 34.90,
    precoPor: 19.90,
    imagem: "",
    selo: "[EDITAR] Novo",
    linkKiwify: "[EDITAR]",
    linkHotmart: "",
    garantiaDias: 7,
    faq: [{ pergunta: "É uma dieta personalizada?", resposta: "Não. É um exemplo de livro de receitas. Restrições alimentares e necessidades individuais devem ser avaliadas com um profissional habilitado." }],
    exemplo: true,
    tema: "terracota",
    formato: "PDF",
    paraQuem: "Para quem busca ideias de refeições e quer planejar melhor as compras.",
    aviso: "Não substitui acompanhamento nutricional. Verifique ingredientes e alergênicos.",
    ofertaFim: null
  },
  {
    id: "primeira-renda-extra",
    titulo: "Além do salário",
    subtitulo: "Explore uma ideia de renda extra com os pés no chão.",
    categoria: "Renda extra",
    descricao: "Um guia para identificar habilidades, avaliar custos e testar uma ideia em pequena escala. Sem fórmulas de enriquecimento nem promessa de ganhos.",
    beneficios: ["Inventário de habilidades e recursos", "Exercício para avaliar uma ideia", "Lista de custos para considerar", "Roteiro para uma primeira oferta"],
    precoDe: 47.00,
    precoPor: 27.00,
    imagem: "",
    selo: "[EDITAR] Novo",
    linkKiwify: "",
    linkHotmart: "[EDITAR]",
    garantiaDias: 7,
    faq: [{ pergunta: "Quanto posso ganhar?", resposta: "Não é possível prever renda. Procura, custos, execução e outros fatores influenciam o resultado. O material não oferece garantia de retorno." }],
    exemplo: true,
    tema: "dourado",
    formato: "PDF",
    paraQuem: "Para quem quer avaliar uma atividade extra antes de investir tempo e dinheiro.",
    aviso: "Toda atividade envolve custos e riscos. Não há garantia de vendas ou lucro.",
    ofertaFim: null
  },
  {
    // Produto original preservado. Confirme formato, prazo de garantia e preço no checkout.
    id: "guia-30-dias",
    titulo: "Guia dos 30 Dias",
    subtitulo: "Uma rotina mais leve e possível.",
    categoria: "Hábitos e bem-estar",
    descricao: "Organize sua alimentação, observe o comer emocional e construa hábitos sustentáveis, um passo de cada vez.",
    beneficios: ["Plano prático de 30 dias e 30 receitas", "Lista de compras", "Estratégias para observar o comer emocional", "Orientações de movimento", "Diários de acompanhamento", "Sono, gerenciamento do estresse e manutenção"],
    precoDe: null,
    precoPor: 14.99,
    imagem: "",
    selo: "",
    linkKiwify: "",
    linkHotmart: "https://pay.hotmart.com/E107895298A",
    garantiaDias: null, // Não informada no site original; confirme antes de preencher
    faq: [
      { pergunta: "Preciso fazer academia?", resposta: "Não. O material apresenta alternativas de movimento que podem ser adaptadas à rotina." },
      { pergunta: "Preciso seguir uma dieta rígida?", resposta: "Não. A proposta é trabalhar organização e construção de hábitos." },
      { pergunta: "O resultado é garantido?", resposta: "Não. Resultados relacionados a alimentação, atividade física e peso variam entre indivíduos." },
      { pergunta: "O guia substitui um profissional de saúde?", resposta: "Não. O conteúdo é educacional e não substitui avaliação ou acompanhamento médico, nutricional ou psicológico." }
    ],
    exemplo: false,
    tema: "ameixa",
    formato: "Digital",
    paraQuem: "Para quem deseja organizar a rotina e acompanhar pequenas mudanças de hábitos.",
    aviso: "Material educacional. Não substitui orientação individualizada de profissionais de saúde.",
    ofertaFim: null
  }
];
