import { Link } from 'react-router';
import { specialists } from '../data/specialists';
import { Button } from '../components/Button';
import { SpecialistCard } from '../components/SpecialistCard';

export function Home() {
  return (
    <div className="w-full">
      {/* О клинике */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="mb-6">О клинике</h2>
          <p className="text-foreground max-w-3xl leading-relaxed">
            Наша клиника предлагает профессиональную психологическую помощь в комфортной и безопасной атмосфере. 
            Мы работаем с широким спектром запросов: от тревоги и депрессии до проблем в отношениях и личностного роста. 
            Все наши специалисты имеют высшее психологическое образование и регулярно проходят супервизию. 
            Мы придерживаемся принципов конфиденциальности и этики в психотерапии.
          </p>
        </div>
      </section>

      {/* Специалисты */}
      <section className="py-20 bg-secondary">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="mb-12">Специалисты</h2>
          
          <div className="grid grid-cols-4 gap-8 mb-12">
            {specialists.slice(0, 4).map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>

          <div className="flex justify-center">
            <Link to="/specialists">
              <Button size="lg">Записаться на консультацию</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Для психологов */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="mb-6">Для психологов</h2>
          <p className="text-foreground max-w-3xl leading-relaxed mb-8">
            Присоединяйтесь к нашей команде профессионалов! Мы предлагаем гибкий график работы, 
            конкурентные условия оплаты и профессиональную поддержку. В нашей клинике вы найдете 
            комьюнити единомышленников, регулярные супервизии и возможности для профессионального роста. 
            Мы ценим этичный подход к работе и заботимся о благополучии наших специалистов.
          </p>
          <Link to="/join-team">
            <Button variant="outline" size="lg">Стать частью команды</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}