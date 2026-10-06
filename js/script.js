/* Comportamentos compartilhados. Dados e links ficam em produtos.js. */
(() => {
  "use strict";
  const loja = window.LOJA;
  if (!loja || !Array.isArray(window.PRODUTOS)) {
    document.querySelector("main").innerHTML = '<p class="container notice">Não foi possível carregar o catálogo. Tente atualizar a página.</p>';
    return;
  }
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const e = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dinheiro = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const normalizar = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const ids = new Set();
  const produtos = window.PRODUTOS.filter(p => {
    const valido = p && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id) && !ids.has(p.id)
      && typeof p.titulo === "string" && Number.isFinite(p.precoPor) && p.precoPor >= 0;
    if (valido) ids.add(p.id); else console.warn("Produto ignorado: confira id único, título e preço.");
    return valido;
  });
  const temas = ["verde", "terracota", "dourado", "ameixa"];
  const tema = p => temas.includes(p.tema) ? p.tema : "verde";
  const paginaProduto = p => `produto.html?id=${encodeURIComponent(p.id)}`;
  // Recusa javascript:, dados de exemplo e URLs sem protocolo seguro.
  function urlSegura(valor, base = location.href) {
    if (!valor || String(valor).includes("[EDITAR]")) return "";
    try { const u = new URL(valor, base); return ["https:", "http:"].includes(u.protocol) ? u.href : ""; } catch { return ""; }
  }
  const basePublica = urlSegura(loja.url) || new URL("./", location.href).href;
  const urlPublica = caminho => new URL(caminho, basePublica).href;
  const fimOferta = p => p.ofertaFim ? Date.parse(p.ofertaFim) : null;
  const ofertaInvalida = p => Boolean(p.ofertaFim) && !Number.isFinite(fimOferta(p));
  const expirou = p => fimOferta(p) !== null && Date.now() >= fimOferta(p);
  function checkouts(p) {
    if (p.exemplo || expirou(p) || ofertaInvalida(p)) return [];
    const opcoes = [
      { nome: "Kiwify", chave: "kiwify", valor: p.linkKiwify, hosts: ["pay.kiwify.com.br", "kiwify.app"] },
      { nome: "Hotmart", chave: "hotmart", valor: p.linkHotmart, hosts: ["pay.hotmart.com", "go.hotmart.com"] }
    ].filter(c => {
      c.url = urlSegura(c.valor);
      if (!c.url) return false;
      const u = new URL(c.url);
      return u.protocol === "https:" && c.hosts.includes(u.hostname) && !u.username && !u.password;
    });
    return opcoes.sort((a, b) => Number(b.chave === loja.plataformaPreferida) - Number(a.chave === loja.plataformaPreferida));
  }
  const paths = {
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>',
    chat: '<path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z"/><path d="M8 9c1 4 3 6 7 7l2-2-3-2-1 1-2-2 1-1-2-3z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    pix: '<path d="m12 2 10 10-10 10L2 12zM6 8h3l3 3 3-3h3M6 16h3l3-3 3 3h3"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',
    boleto: '<path d="M3 4v16M6 4v16M10 4v16M12 4v16M16 4v16M19 4v16M21 4v16"/>'
  };
  function icon(nome) { return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[nome] || paths.check}</svg>`; }
  function capa(p, prioridade = false) {
    const imagem = urlSegura(p.imagem);
    if (imagem) return `<div class="book book-image"><img src="${e(imagem)}" alt="Capa do ebook ${e(p.titulo)}" width="600" height="800" loading="${prioridade ? "eager" : "lazy"}" ${prioridade ? 'fetchpriority="high"' : ''} decoding="async"></div>`;
    return `<div class="book book-${tema(p)}" role="img" aria-label="Capa ilustrativa de ${e(p.titulo)}${p.exemplo ? ' — [EDITAR] exemplo fictício' : ''}"><span class="book-label">${e(p.categoria)}</span><div><strong class="book-title">${e(p.titulo)}</strong><span class="book-subtitle">${e(p.subtitulo)}</span></div><span class="book-art" aria-hidden="true"></span><span class="book-label">${p.exemplo ? '[EDITAR] EXEMPLO' : e(loja.marca)} · ${e(p.formato || "Ebook")}</span></div>`;
  }
  function preco(p) {
    if (expirou(p)) return '<p class="price"><strong>Oferta encerrada</strong></p>';
    const anterior = Number.isFinite(p.precoDe) && p.precoDe > p.precoPor;
    return `<p class="price">${anterior ? `<del><span class="sr-only">De </span>${dinheiro(p.precoDe)}</del> <span class="sr-only">por </span>` : ''}<strong>${dinheiro(p.precoPor)}</strong><small>Pagamento único${p.exemplo ? ' · [EDITAR] preço fictício' : ''}</small></p>`;
  }
  function motivoIndisponivel(p) { return expirou(p) ? "Oferta encerrada" : p.exemplo ? "[EDITAR] Exemplo sem venda ativa" : "Compra indisponível no momento"; }
  function botaoCompra(p, opcao, local, secundaria = false) {
    if (!opcao) return `<button class="button" type="button" disabled>Quero este ebook</button><small class="checkout-hint">${motivoIndisponivel(p)}</small>`;
    return `<a class="button ${secundaria ? 'button-outline' : ''}" href="${e(opcao.url)}" target="_blank" rel="noopener noreferrer" data-buy-id="${e(p.id)}" data-platform="${opcao.chave}" data-position="${e(local)}" aria-label="Quero este ebook: ${e(p.titulo)} — ${opcao.nome}, nova aba">Quero este ebook <span aria-hidden="true">↗</span></a>`;
  }
  function acoesCompra(p, local) {
    const opcoes = checkouts(p);
    return `<div class="checkout-actions" data-acoes="${e(p.id)}">${opcoes.length ? opcoes.map((c, i) => `<div class="checkout-option">${botaoCompra(p, c, local, i > 0)}<small class="checkout-hint">Comprar pela ${c.nome} · abre em nova aba</small></div>`).join("") : botaoCompra(p, null, local)}</div>`;
  }
  function pagamentos() { return `<div class="payment-icons" aria-label="Meios sujeitos à disponibilidade no checkout"><span>${icon("pix")}Pix</span><span>${icon("card")}Cartão</span><span>${icon("boleto")}Boleto</span></div><small class="checkout-hint">Confira os meios e as condições no checkout.</small>`; }
  function garantia(p) { return Number.isInteger(p.garantiaDias) && p.garantiaDias > 0 ? `${p.garantiaDias} dias de garantia${p.exemplo ? ' · [EDITAR]' : ''}` : "Consulte o prazo de garantia no checkout"; }
  function faq(itens) { return (itens || []).map(item => `<details><summary>${e(item.pergunta)}</summary><p>${e(item.resposta)}</p></details>`).join(""); }
  function card(p) {
    const opcao = checkouts(p)[0];
    return `<article class="product-card" ${p.id === 'guia-30-dias' ? 'id="oferta"' : ''}>
      <div class="card-visual visual-${tema(p)}">${p.selo ? `<span class="badge">${e(p.selo)}</span>` : ''}${capa(p)}</div>
      <div class="card-body"><p class="category">${e(p.categoria)}</p><h3><a href="${paginaProduto(p)}">${e(p.titulo)}</a></h3><p>${e(p.subtitulo)}</p>
      ${p.exemplo ? '<p class="demo-label">[EDITAR] Produto fictício de exemplo</p>' : ''}
      <ul class="mini-benefits">${(p.beneficios || []).slice(0, 2).map(b => `<li>${e(b)}</li>`).join("")}</ul>
      <div class="card-bottom"><div data-preco="${e(p.id)}">${preco(p)}</div><div data-acoes="${e(p.id)}">${botaoCompra(p, opcao, "vitrine")}</div><a class="text-link card-detail" href="${paginaProduto(p)}">Conhecer o conteúdo →</a></div></div></article>`;
  }
  function metadados(p) {
    const titulo = p ? `${p.titulo} | ${loja.marca}` : `${loja.marca} | Ebooks para o seu próximo passo`;
    const descricao = p ? p.descricao : loja.descricao;
    const url = p ? urlPublica(paginaProduto(p)) : basePublica;
    const imagem = urlSegura(p?.imagem, basePublica) || urlSegura(loja.imagemSocial, basePublica);
    document.title = titulo;
    const meta = (tipo, nome, valor) => {
      let el = $(`meta[${tipo}="${nome}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(tipo, nome); document.head.append(el); }
      el.content = valor;
    };
    meta("name", "description", descricao);
    ["og:title", "twitter:title"].forEach(n => meta(n.startsWith("og:") ? "property" : "name", n, titulo));
    ["og:description", "twitter:description"].forEach(n => meta(n.startsWith("og:") ? "property" : "name", n, descricao));
    meta("property", "og:url", url);
    if (imagem) { meta("property", "og:image", imagem); meta("name", "twitter:image", imagem); }
    else { meta("name", "twitter:card", "summary"); }
    let canonical = $('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = url;
    if (!p) return;
    if (p.exemplo) meta("name", "robots", "noindex,follow");
    const schema = { "@context": "https://schema.org", "@type": "Product", "@id": `${url}#produto`, name: p.titulo, description: p.descricao, category: p.categoria, sku: p.id, url };
    const imagemProduto = urlSegura(p.imagem, basePublica);
    if (imagemProduto) schema.image = [imagemProduto];
    // Sem avaliações inventadas nem ofertas comerciais dos exemplos.
    if (checkouts(p).length) schema.offers = { "@type": "Offer", url, price: p.precoPor.toFixed(2), priceCurrency: "BRL", availability: "https://schema.org/InStock" };
    if (schema.offers && p.ofertaFim) schema.offers.priceValidUntil = p.ofertaFim.slice(0, 10);
    let json = $("#produto-schema");
    if (!json) { json = document.createElement("script"); json.type = "application/ld+json"; json.id = "produto-schema"; document.head.append(json); }
    json.textContent = JSON.stringify(schema);
  }
  function iniciarVitrine() {
    if (!$("#grade-produtos")) return;
    metadados();
    let categoria = "";
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    $("#filtros").innerHTML = ["", ...categorias].map(c => `<button class="filter" type="button" data-category="${e(c)}" aria-pressed="${c === categoria}">${e(c || "Todos os ebooks")}</button>`).join("");
    const desenhar = () => {
      const busca = normalizar($("#busca").value.trim());
      const filtrados = produtos.filter(p => (!categoria || p.categoria === categoria) && normalizar(p.titulo).includes(busca));
      $("#grade-produtos").innerHTML = filtrados.map(card).join("");
      $("#resultado-busca").textContent = `${filtrados.length} ${filtrados.length === 1 ? "ebook encontrado" : "ebooks encontrados"}`;
      $("#sem-resultados").hidden = filtrados.length > 0;
      $$(".filter").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.category === categoria)));
    };
    $("#filtros").addEventListener("click", event => { const b = event.target.closest("button"); if (b) { categoria = b.dataset.category; desenhar(); } });
    $("#busca").addEventListener("input", desenhar);
    $("#limpar-busca").addEventListener("click", () => { categoria = ""; $("#busca").value = ""; desenhar(); $("#busca").focus(); });
    $("#hero-livros").innerHTML = produtos.slice(0, 3).map(p => capa(p, true)).join("");
    $("#faq-geral").innerHTML = faq(loja.faq);
    desenhar();
    // Conserva os links antigos para a oferta original, agora um card do catálogo.
    if (location.hash === "#oferta") requestAnimationFrame(() => $("#oferta")?.scrollIntoView());
  }
  function iniciarProduto() {
    const root = $("#detalhe-produto");
    if (!root) return;
    const p = produtos.find(p => p.id === new URLSearchParams(location.search).get("id"));
    if (!p) {
      document.title = `Ebook não encontrado | ${loja.marca}`;
      const robots = document.createElement("meta"); robots.name = "robots"; robots.content = "noindex,follow"; document.head.append(robots);
      root.innerHTML = '<div class="container section empty-state"><h1>Ebook não encontrado.</h1><p>Esse link pode ter mudado. Explore os materiais disponíveis na vitrine.</p><a class="button" href="index.html#produtos">Ver todos os ebooks</a></div>';
      return;
    }
    root.innerHTML = `<div class="container"><nav class="breadcrumbs" aria-label="Caminho da página"><a href="index.html">Início</a> / <a href="index.html#produtos">Ebooks</a> / <span aria-current="page">${e(p.titulo)}</span></nav>
      <section class="detail-hero"><div class="detail-cover visual-${tema(p)}">${capa(p, true)}</div><div class="detail-copy"><p class="eyebrow">${e(p.categoria)} · ${e(p.formato || "Ebook")}</p><h1>${e(p.titulo)}</h1><p class="lead">${e(p.subtitulo)}</p><p>${e(p.descricao)}</p>
      ${p.exemplo ? '<p class="notice">[EDITAR] Produto fictício de demonstração. Conteúdo, preço e garantia são exemplos; a compra está desativada.</p>' : ''}
      <div class="purchase-box" id="comprar"><div data-preco="${e(p.id)}">${preco(p)}</div>${p.ofertaFim && !ofertaInvalida(p) ? `<p class="countdown" data-countdown="${e(p.id)}"></p>` : ''}${acoesCompra(p, "detalhes")}${pagamentos()}<div class="guarantee">${icon("shield")}<span>${e(garantia(p))}. <a href="reembolso.html">Ver política</a></span></div></div>
      <div class="share-row"><button type="button" id="compartilhar">Compartilhar este ebook ↗</button><span id="share-status" role="status"></span></div></div></section></div>
      <section class="section how-section"><div class="container detail-columns"><div><p class="eyebrow">Por dentro do ebook</p><h2>O que você vai encontrar.</h2><ul class="benefit-grid">${(p.beneficios || []).map(b => `<li>${icon("check")}<span>${e(b)}</span></li>`).join("")}</ul></div><div><p class="eyebrow">Este pode ser seu próximo passo</p><h2>Para quem é?</h2><p class="lead">${e(p.paraQuem || "Para quem se identifica com a proposta e os conteúdos apresentados.")}</p><p class="muted">${e(p.aviso || "Material educacional. Os resultados variam de pessoa para pessoa.")}</p><p class="muted">Acesso digital, com instruções por e-mail após a aprovação do pagamento. Sem envio físico.</p></div></div></section>
      <section class="section"><div class="container author-layout"><div class="author-portrait" data-autor-foto><span aria-hidden="true">ep</span></div><div><p class="eyebrow">Sobre o autor</p><h2>${e(loja.autor.nome)}</h2><p class="lead">${e(loja.autor.resumo)}</p></div></div></section>
      <section class="section"><div class="container faq-layout"><div><p class="eyebrow">Compra com clareza</p><h2>Suas dúvidas, respondidas.</h2><a class="text-link" href="#contato">Preciso de ajuda ↗</a></div><div class="faq">${faq([...(p.faq || []), ...(loja.faq || [])])}</div></div></section>
      <section class="final-cta"><div class="container"><p class="eyebrow">No seu ritmo</p><h2>Comece pela primeira página.</h2><p>${e(p.subtitulo)}</p><a class="button button-gold" href="#comprar">Ver opções de compra ↑</a></div></section>`;
    const mobile = $("#compra-mobile");
    const opcao = checkouts(p)[0];
    if (opcao) {
      mobile.hidden = false;
      mobile.innerHTML = `<div><small>${e(opcao.nome)} · nova aba</small><strong>${dinheiro(p.precoPor)}</strong></div>${botaoCompra(p, opcao, "mobile")}`;
      document.body.classList.add("has-mobile-buy");
    }
    metadados(p);
    $("#compartilhar").addEventListener("click", async () => {
      const url = urlPublica(paginaProduto(p));
      try {
        if (navigator.share) await navigator.share({ title: p.titulo, text: p.subtitulo, url });
        else { await navigator.clipboard.writeText(url); $("#share-status").textContent = "Link copiado!"; }
      } catch (erro) { if (erro.name !== "AbortError") $("#share-status").textContent = `Copie este link: ${url}`; }
    });
  }
  function iniciarEstrutura() {
    $$("[data-marca]").forEach(el => { el.textContent = loja.marca; el.closest("a")?.setAttribute("aria-label", `${loja.marca} — início`); });
    $$("[data-aviso]").forEach(el => el.textContent = loja.aviso);
    if ($("[data-prova-social]")) $("[data-prova-social]").textContent = loja.provaSocial;
    if ($("[data-autor-nome]")) $("[data-autor-nome]").textContent = loja.autor.nome;
    if ($("[data-autor-resumo]")) $("[data-autor-resumo]").textContent = loja.autor.resumo;
    const foto = urlSegura(loja.autor.foto);
    if (foto) $$("#autor-imagem, [data-autor-foto]").forEach(el => el.innerHTML = `<img src="${e(foto)}" alt="${e(loja.autor.nome)}" width="520" height="520" loading="lazy" decoding="async">`);
    const logo = urlSegura(loja.logo);
    if (logo) $$(".brand-mark").forEach(el => el.outerHTML = `<img class="brand-logo" src="${e(logo)}" alt="" width="38" height="38">`);
    const numero = String(loja.whatsapp || "").replace(/\D/g, "");
    const whatsapp = /^55\d{10,11}$/.test(numero) ? `https://wa.me/${numero}?text=${encodeURIComponent(loja.mensagemWhatsapp)}` : "";
    const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(loja.email) ? loja.email : "";
    const sociais = [["Instagram", loja.instagram], ["YouTube", loja.youtube]].filter(([,url]) => urlSegura(url));
    const rodape = $("[data-rodape]");
    if (rodape) rodape.innerHTML = `<div class="footer-grid"><div><a class="brand" href="index.html">${e(loja.marca)}</a><p>${e(loja.descricao)}</p><p>${e(loja.identificacao)}</p></div><div><h2>Atendimento</h2>${email ? `<a href="mailto:${e(email)}">${e(email)}</a>` : '<p>[EDITAR] E-mail de suporte</p>'}${whatsapp ? `<a href="${e(whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp (nova aba)</a>` : ''}${sociais.map(([nome, url]) => `<a href="${e(urlSegura(url))}" target="_blank" rel="noopener noreferrer">${nome} (nova aba)</a>`).join("")}</div><div><h2>Informações</h2><a href="privacidade.html">Política de Privacidade</a><a href="termos.html">Termos de Uso</a><a href="reembolso.html">Política de Reembolso</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${e(loja.marca)}. Conteúdo educacional; resultados variam.</span><button type="button" id="preferencias-cookies">Preferências de privacidade</button></div>`;
    if (whatsapp) document.body.insertAdjacentHTML("beforeend", `<a class="whatsapp" href="${e(whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp, abre em nova aba">${icon("chat")}</a>`);
    $$("[data-icon]").forEach(el => el.innerHTML = icon(el.dataset.icon));
    const menu = $("#menu-principal"), toggle = $(".menu-toggle");
    if (toggle && menu) {
      const fechar = () => { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
      toggle.addEventListener("click", () => { const abriu = menu.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(abriu)); });
      menu.addEventListener("click", event => { if (event.target.closest("a")) fechar(); });
      document.addEventListener("keydown", event => { if (event.key === "Escape" && menu.classList.contains("is-open")) { fechar(); toggle.focus(); } });
      document.addEventListener("click", event => { if (!event.target.closest(".nav")) fechar(); });
    }
    // Mantém o FAQ nativo e apenas uma pergunta aberta por grupo.
    $$(".faq").forEach(grupo => $$("details", grupo).forEach(item => item.addEventListener("toggle", () => {
      if (item.open) $$("details", grupo).forEach(outro => { if (outro !== item) outro.open = false; });
    })));
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("reveal"); observer.unobserve(entry.target); }
      }), { threshold: .08 });
      $$(".steps, .author-layout, .testimonial-layout").forEach(el => observer.observe(el));
      const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$(".nav-links a").forEach(link => { const ativa = link.hash === `#${entry.target.id}`; link.classList.toggle("is-active", ativa); if (ativa) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
      }), { rootMargin: "-20% 0px -65% 0px" });
      $$(".nav-links a").forEach(link => { const alvo = $(link.hash); if (alvo) navObserver.observe(alvo); });
    }
  }
  function iniciarDepoimentos() {
    const el = $("#depoimento"), itens = loja.depoimentos || [];
    if (!el) return;
    const aviso = $("#depoimentos .muted");
    if (aviso) aviso.hidden = !loja.depoimentosExemplo;
    if (!itens.length) { $("#depoimentos").hidden = true; return; }
    let indice = 0;
    const desenhar = () => { const d = itens[indice]; el.innerHTML = `<span class="quote-mark" aria-hidden="true">“</span><blockquote>${e(d.texto)}</blockquote><strong>${e(d.nome)}</strong><small>${e(d.detalhe)}</small>`; $("#depoimento-posicao").textContent = `${indice + 1} / ${itens.length}`; };
    $("#depoimento-anterior").addEventListener("click", () => { indice = (indice - 1 + itens.length) % itens.length; desenhar(); });
    $("#depoimento-proximo").addEventListener("click", () => { indice = (indice + 1) % itens.length; desenhar(); });
    desenhar(); // Sem rotação automática: o leitor controla o carrossel.
  }
  function iniciarOfertas() {
    const comPrazo = produtos.filter(p => p.ofertaFim && !ofertaInvalida(p));
    if (!comPrazo.length) return;
    const encerradas = new Set();
    const atualizar = () => comPrazo.forEach(p => {
      const restante = fimOferta(p) - Date.now();
      $$(`[data-countdown="${p.id}"]`).forEach(el => {
        const minutos = Math.max(0, Math.ceil(restante / 60000));
        const prazo = new Date(fimOferta(p)).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
        el.textContent = restante <= 0 ? "Esta oferta terminou. Aguarde uma nova condição de compra." : `Oferta até ${prazo} (Brasília) · ${Math.floor(minutos / 1440)}d ${Math.floor(minutos % 1440 / 60)}h ${minutos % 60}min restantes.`;
      });
      if (restante > 0 || encerradas.has(p.id)) return;
      encerradas.add(p.id);
      $$(`[data-preco="${p.id}"]`).forEach(el => el.innerHTML = preco(p));
      $$(`[data-acoes="${p.id}"]`).forEach(el => el.innerHTML = botaoCompra(p, null, "encerrada"));
      if ($("#compra-mobile [data-buy-id]")?.dataset.buyId === p.id) {
        $("#compra-mobile").hidden = true;
        $("#compra-mobile").replaceChildren();
        document.body.classList.remove("has-mobile-buy");
      }
      if ($("#produto-schema") && new URLSearchParams(location.search).get("id") === p.id) metadados(p);
    });
    atualizar();
    const intervalo = setInterval(() => { atualizar(); if (encerradas.size === comPrazo.length) clearInterval(intervalo); }, 1000);
  }
  /* Rastreamento opcional: nenhum pixel é carregado antes de aceitar. */
  const tracking = loja.rastreamento || {};
  const gaId = /^G-[A-Z0-9]+$/.test(tracking.googleAnalyticsId) ? tracking.googleAnalyticsId : "";
  const metaId = /^\d+$/.test(tracking.metaPixelId) ? tracking.metaPixelId : "";
  const chaveConsentimento = "ep-consentimento-v1";
  let consentimento = "", iniciado = false;
  try { consentimento = localStorage.getItem(chaveConsentimento) || ""; } catch { /* Navegação privada: escolha vale para esta página. */ }
  function carregarPixels() {
    if (iniciado || consentimento !== "aceito") return;
    iniciado = true;
    const carregar = src => { const script = document.createElement("script"); script.async = true; script.src = src; document.head.append(script); };
    if (gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", gaId);
      carregar(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
    }
    if (metaId) {
      const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      fbq.queue = []; fbq.loaded = true; fbq.version = "2.0";
      window.fbq = fbq; window._fbq = fbq;
      window.fbq("init", metaId); window.fbq("track", "PageView");
      carregar("https://connect.facebook.net/en_US/fbevents.js");
    }
  }
  function painelConsentimento() {
    if ($("#consentimento")) { $("#consentimento button")?.focus(); return; }
    const configurado = Boolean(gaId || metaId);
    document.body.insertAdjacentHTML("beforeend", `<section class="consent" id="consentimento" role="region" aria-label="Preferências de privacidade"><strong>Sua privacidade importa.</strong><p>${configurado ? 'Com sua permissão, usamos Google Analytics e/ou Meta Pixel para medir visitas e cliques e avaliar anúncios. Você pode recusar e continuar navegando.' : 'Os pixels de análise e publicidade estão desativados neste site.'} <a href="privacidade.html">Saiba mais</a>.</p><div class="consent-actions">${configurado ? '<button class="button button-outline" data-consent="recusado" type="button">Recusar</button><button class="button button-outline" data-consent="aceito" type="button">Aceitar</button>' : '<button class="button button-outline" data-consent="fechar" type="button">Fechar</button>'}</div></section>`);
  }
  function limparCookiesMedicao() {
    const partes = location.hostname.split(".");
    const dominios = ["", ...partes.map((_, i) => partes.slice(i).join(".")).filter(d => d.includes("."))];
    document.cookie.split(";").forEach(item => {
      const nome = item.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat|_fbp|_fbc)/.test(nome)) return;
      dominios.forEach(d => { document.cookie = `${nome}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`; });
    });
  }
  function iniciarRastreamento() {
    if (gaId || metaId) { if (consentimento === "aceito") carregarPixels(); else if (!consentimento) painelConsentimento(); }
    $("#preferencias-cookies")?.addEventListener("click", painelConsentimento);
    document.addEventListener("click", event => {
      const escolha = event.target.closest("[data-consent]");
      if (escolha) {
        const valor = escolha.dataset.consent;
        if (valor !== "fechar") {
          consentimento = valor;
          try { localStorage.setItem(chaveConsentimento, valor); } catch { /* Sem persistência, não bloqueia o site. */ }
          if (valor === "aceito") {
            if (gaId) window[`ga-disable-${gaId}`] = false;
            if (iniciado && window.fbq) window.fbq("consent", "grant");
            carregarPixels();
          }
          else if (iniciado) {
            if (gaId) window[`ga-disable-${gaId}`] = true;
            if (window.fbq) window.fbq("consent", "revoke");
            limparCookiesMedicao();
          }
        }
        $("#consentimento").remove(); $("#preferencias-cookies")?.focus();
        return;
      }
      const link = event.target.closest("[data-buy-id]");
      if (!link) return;
      const p = produtos.find(p => p.id === link.dataset.buyId);
      if (!p || !checkouts(p).some(c => c.url === link.href)) { event.preventDefault(); return; }
      const detail = { id: p.id, titulo: p.titulo, valor: p.precoPor, moeda: "BRL", plataforma: link.dataset.platform, posicao: link.dataset.position };
      document.dispatchEvent(new CustomEvent("ebook:checkout", { detail }));
      if (consentimento !== "aceito") return;
      if (gaId && window.gtag) window.gtag("event", "begin_checkout", { currency: "BRL", value: p.precoPor, checkout_platform: detail.plataforma, button_position: detail.posicao, items: [{ item_id: p.id, item_name: p.titulo, price: p.precoPor, quantity: 1 }] });
      if (metaId && window.fbq) window.fbq("track", "InitiateCheckout", { content_ids: [p.id], content_type: "product", value: p.precoPor, currency: "BRL", num_items: 1 });
      // Purchase deve ser configurado no checkout, após pagamento confirmado.
    });
  }
  iniciarVitrine(); iniciarProduto(); iniciarEstrutura(); iniciarDepoimentos(); iniciarOfertas(); iniciarRastreamento();
})();
