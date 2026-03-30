import { useParams, useNavigate } from 'react-router';
import { specialists } from '../data/specialists';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { useBookings } from '../hooks/useBookings';
import { toast } from 'sonner';

export function SpecialistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApp();
  const { createBooking, isLoading } = useBookings();
  const specialist = specialists.find(s => s.id === id);

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
      // Create booking with mock date
      await createBooking({
        specialistId: specialist.id,
        specialistName: specialist.name,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        time: '14:00',
        clientName: user.name,
        clientPhone: user.phone,
      });

      toast.success('Заявка на консультацию отправлена', {
        description: 'Мы свяжемся с вами в ближайшее время',
        duration: 5000
      });

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка создания записи');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 gap-12">
          {/* Фото специалиста */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img 
              src={specialist.photo} 
              alt={specialist.name}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>

          {/* Информация о специалисте */}
          <div className="bg-white rounded-lg p-12">
            <h2 className="mb-6">{specialist.name}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-3">Образование</h3>
                <ul className="space-y-2">
                  {specialist.education.map((edu, index) => (
                    <li key={index} className="text-foreground">{edu}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3">Опыт работы</h3>
                <p className="text-foreground">{specialist.experience}</p>
              </div>

              <div>
                <h3 className="mb-3">Описание</h3>
                <p className="text-foreground leading-relaxed">{specialist.description}</p>
              </div>

              <div>
                <h3 className="mb-3">Методы работы</h3>
                <div className="flex flex-wrap gap-2">
                  {specialist.methods.map((method, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-secondary text-foreground rounded-full"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  size="lg" 
                  onClick={handleBooking}
                  loading={isLoading}
                >
                  Записаться к спец��алисту
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}