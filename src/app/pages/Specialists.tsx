import { useApp } from '../context/AppContext.tsx';
import { SpecialistCard } from '../components/SpecialistCard.tsx';

function SpecialistCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4 mb-3" />
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="h-4 bg-muted rounded w-1/4" />
    </div>
  );
}

export function Specialists() {
  const { specialists, specialistsLoading, specialistsError } = useApp();

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="mb-12">Наши специалисты</h2>

        {specialistsError && (
          <p className="text-destructive mb-6">{specialistsError}</p>
        )}

        <div className="grid grid-cols-3 gap-8">
          {specialistsLoading
            ? Array.from({ length: 3 }).map((_, i) => <SpecialistCardSkeleton key={i} />)
            : specialists.map((specialist, index) => (
                <SpecialistCard key={index} specialist={specialist} index={index} />
              ))}
        </div>
      </div>
    </div>
  );
}
