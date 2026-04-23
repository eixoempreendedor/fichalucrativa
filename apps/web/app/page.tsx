export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-10">
        <p className="text-sm font-medium text-brand-primary">Ficha Lucrativa</p>
        <h1 className="mt-2 text-4xl md:text-5xl leading-tight">
          Decida o seu lucro em cada prato.
        </h1>
      </header>

      <section className="space-y-4 text-lg leading-relaxed">
        <p>
          A maior parte do food pequeno no Brasil trabalha no escuro. Chuta o preço, comemora o caixa cheio
          e no fim do mês descobre que não sobrou nada.
        </p>
        <p>
          Ficha Lucrativa existe para acender a luz dentro da sua cozinha. Você conta o que prepara. A
          gente calcula o que custa, o que você ganha e onde está vazando.
        </p>
        <p className="font-medium">Sem planilha. Sem consultor caro. Só pelo WhatsApp.</p>
      </section>

      <div className="mt-10">
        <a
          href="#"
          className="inline-block rounded-md bg-brand-primary px-6 py-3 font-medium text-brand-bg transition hover:opacity-90"
        >
          Testar grátis pelo WhatsApp
        </a>
      </div>

      <footer className="mt-24 border-t border-brand-ink/10 pt-6 text-sm text-brand-ink/60">
        Uma solução idealizada por{" "}
        <a href="https://luizcurti.com.br" className="underline">
          Luiz Curti
        </a>
        , consultor de empreendedores.
      </footer>
    </main>
  );
}
