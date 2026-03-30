import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/Button.tsx';
import { useBookings } from '../hooks/useBookings.ts';
import { toast } from 'sonner';

export function SpecialistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, specialists, specialistsLoading } = useApp();
  const { createBooking, isLoading: bookingLoading } = useBookings();

  const specialist = specialists[Number(id)];

  if (specialistsLoading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-white rounded-lg p-12 max-w-2xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
        <p>Специалист не найден</p>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Войдите в систему для записи на консультацию');
      navigate('/login');
      return;
    }

    try {
      await createBooking({
        specialistId: String(id),
        specialistName: specialist.initials,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        time: '14:00',
        clientName: user.initials,
        clientPhone: user.phone_number,
      });

      toast.success('Заявка на консультацию отправлена', {
        description: 'Мы свяжемся с вами в ближайшее время',
        duration: 5000,
      });

      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка создания записи');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-white rounded-lg overflow-hidden">
            {specialist.image
              ? <img src={specialist.image} alt={specialist.initials} className="w-full aspect-[3/4] object-cover" />
              : <div className="w-full aspect-[3/4] flex items-center justify-center bg-violet-100 text-violet-700">
                  <span className="text-8xl font-semibold">{specialist.initials.slice(0, 2).toUpperCase()}</span>
                </div>
            }
          </div>
        <div className="bg-white rounded-lg p-12">
          <h2 className="mb-6">{specialist.initials}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3">Образование</h3>
              <p className="text-foreground">{specialist.education}</p>
            </div>

            <div>
              <h3 className="mb-3">Опыт работы</h3>
              <p className="text-foreground">{specialist.practice}</p>
            </div>

            <div>
              <h3 className="mb-3">Описание</h3>
              <p className="text-foreground leading-relaxed">{specialist.description}</p>
            </div>

            {specialist.link && (
              <div>
                <h3 className="mb-3">Ссылка</h3>
                <a
                  href={specialist.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {specialist.link}
                </a>
              </div>
            )}

            <div>
              <h3 className="mb-3">Методы работы</h3>
              <div className="flex flex-wrap gap-2">
                {specialist.work_methods.map((method, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-secondary text-foreground rounded-full"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
