import { useState } from 'react';
import { Navigate } from 'react-router';
import { User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

export function StaffProfile() {
  const { user, isAuthenticated, isStaff } = useApp();
  const [activeTab, setActiveTab] = useState<'personal-info' | 'profile'>('personal-info');

  if (!isAuthenticated || !user || !isStaff) {
    return <Navigate to="/staff-auth" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Приветствие */}
        <div className="bg-white rounded-lg p-8 mb-6">
          <h1 className="mb-2">Добро пожаловать, {user.name}</h1>
          <p className="text-muted-foreground">
            Панель управления специалиста
          </p>
        </div>

        {/* Навигация */}
        <div className="bg-white rounded-lg mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('personal-info')}
            className={`
              flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2
              ${activeTab === 'personal-info' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground hover:bg-secondary'
              }
            `}
          >
            <User size={20} />
            Личная информация
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`
              flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2
              ${activeTab === 'profile' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground hover:bg-secondary'
              }
            `}
          >
            <User size={20} />
            Профиль
          </button>
        </div>

        {/* Личная информация */}
        {activeTab === 'personal-info' && (
          <div className="bg-white rounded-lg p-12">
            <div className="max-w-[800px]">
              <h1 className="mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-8">Практикующий психолог, гештальт-терапевт</p>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3">Образование:</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>МГУ им. М.В. Ломоносова, факультет психологии</li>
                    <li>Институт Гештальт-терапии</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3">О себе:</h3>
                  <p className="text-foreground leading-relaxed">
                    Общий стаж работы — 8 лет. Специализируюсь на работе с тревожными расстройствами, 
                    депрессией и сложностями в отношениях. В своей практике помогаю клиентам находить 
                    внутренние ресурсы, опираться на собственные силы и обретать гармонию с собой и окружающими.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3">Методы работы:</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-secondary text-foreground rounded-full">
                      Гештальт-терапия
                    </span>
                    <span className="px-4 py-2 bg-secondary text-foreground rounded-full">
                      Когнитивно-поведенческая терапия (КПТ)
                    </span>
                    <span className="px-4 py-2 bg-secondary text-foreground rounded-full">
                      Работа с тревогой
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <Button size="lg">
                    Записаться на консультацию
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Профиль сотрудника */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg p-12">
            <h2 className="mb-8">Информация о сотруднике</h2>

            <div className="space-y-6 max-w-[600px]">
              <div>
                <label className="block mb-2 text-muted-foreground">ФИО</label>
                <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">
                  {user.name}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">Корпоративная почта</label>
                <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">Номер телефона</label>
                <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">
                  {user.phone}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">ID специалиста</label>
                <p className="text-foreground py-3 px-4 bg-secondary rounded-lg font-mono">
                  {user.specialistId}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">Роль</label>
                <p className="text-foreground py-3 px-4 bg-primary/10 text-primary rounded-lg inline-block">
                  Специалист клиники
                </p>
              </div>

              <div className="pt-6">
                <Button size="lg">
                  Редактировать профиль
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}