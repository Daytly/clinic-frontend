import { specialists } from '../data/specialists';
import { SpecialistCard } from '../components/SpecialistCard';

export function Specialists() {
  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="mb-12">Наши специалисты</h2>
        
        <div className="grid grid-cols-3 gap-8">
          {specialists.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))}
        </div>
      </div>
    </div>
  );
}