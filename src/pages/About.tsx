const teamMembers = [
  'Felipe Rodrigues',
  'Ana Clara',
  'Miguel',
  'Guilherme Matias',
  'Guilherme Moia',
  'Giovanna',
  'Enzo',
]

const AboutPage = () => {
  return (
    <div className="container px-4 pt-28 min-h-screen animate-fade-in-up">
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-accent-1">
          Telanix
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-secondary font-display">
          O Futuro do Cinema na Sua Tela.
        </p>
      </section>

      <section className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-accent-1/90 mb-6 text-center">
          Nossa Missão
        </h2>
        <p className="text-secondary leading-relaxed text-lg text-center glassmorphism-dark p-8 rounded-lg border border-accent-1/10">
          Na Telanix, nossa missão é transcender as barreiras da recomendação de
          filmes tradicional. Utilizamos algoritmos de inteligência artificial
          de ponta e uma curadoria humana especializada para conectar você com
          histórias que irão ressoar, inspirar e transformar. Acreditamos que o
          filme certo, na hora certa, pode ser uma experiência transcendental.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-accent-1/90 mb-10 text-center">  
          Nossa Equipe
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          {teamMembers.map((member) => (
            <div key={member} className="text-foreground font-medium text-lg">
              {member}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
