import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'

const teamMembers = [
  {
    name: 'Felipe Rodrigues',
    role: 'Lead Developer & Project Architect',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
  },
  {
    name: 'Ana Clara',
    role: 'UI/UX Designer',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
  },
  {
    name: 'Miguel',
    role: 'Frontend Developer',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=3',
  },
  {
    name: 'Guilherme Matias',
    role: 'Backend Developer',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=4',
  },
  {
    name: 'Guilherme Moia',
    role: 'AI & Machine Learning Engineer',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=5',
  },
  {
    name: 'Giovanna',
    role: 'QA & Testing Specialist',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=6',
  },
  {
    name: 'Enzo',
    role: 'DevOps Engineer',
    imageUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=7',
  },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-accent-2">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>
                  <Users />
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold mt-4 text-lg text-foreground">
                {member.name}
              </h3>
              <p className="text-sm text-accent-2">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
