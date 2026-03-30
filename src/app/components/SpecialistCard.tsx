import { Link } from 'react-router';
import { Specialist } from '../data/specialists';

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <Link 
      to={`/specialist/${specialist.id}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        <img 
          src={specialist.photo} 
          alt={specialist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2">{specialist.name}</h3>
        <p className="text-muted-foreground mb-3">{specialist.experience}</p>
        <p className="text-primary text-sm">Подробнее →</p>
      </div>
    </Link>
  );
}
