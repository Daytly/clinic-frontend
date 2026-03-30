import { Link } from 'react-router';
import type { Specialist } from '../api/specialists.ts';

interface SpecialistCardProps {
  specialist: Specialist;
  index: number;
}

function getInitialsAbbr(initials: string) {
  const parts = initials.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return initials.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
];

export function SpecialistCard({ specialist, index }: SpecialistCardProps) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const abbr = getInitialsAbbr(specialist.initials);

  return (
    <Link
      to={`/specialist/${index}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className={`aspect-[3/4] overflow-hidden ${!specialist.image ? color : ''} flex items-center justify-center`}>
        {specialist.image
          ? <img src={specialist.image} alt={specialist.initials} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <span className="text-6xl font-semibold">{abbr}</span>
        }
      </div>
      <div className="p-6">
        <h3 className="mb-2">{specialist.initials}</h3>
        <p className="text-muted-foreground mb-3">{specialist.practice}</p>
        <p className="text-primary text-sm">Подробнее →</p>
      </div>
    </Link>
  );
}
