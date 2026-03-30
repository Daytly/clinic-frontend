import { useState } from 'react';
import { Navigate } from 'react-router';
import { User, Briefcase } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import { toast } from 'sonner';

type EditingField = 'initials' | 'email' | null;

export function StaffProfile() {
  const { user, isAuthenticated, isStaff, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'personal-info' | 'profile'>('personal-info');

  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editedValue, setEditedValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !user || !isStaff) {
    return <Navigate to="/login" replace />;
  }

  const startEditing = (field: EditingField, currentValue: string) => {
    setEditingField(field);
    setEditedValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditedValue('');
  };

  const handleSave = async () => {
    if (!editingField) return;

    const originalMap: Record<string, string> = {
      initials: user.initials,
      email: user.email,
      phone_number: user.phone_number,
    };

    if (editedValue === originalMap[editingField]) {
      cancelEditing();
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({ [editingField]: editedValue });
      toast.success('Данные обновлены');
      cancelEditing();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка обновления');
    } finally {
      setIsSaving(false);
    }
  };

  const methods = Array.isArray(user.work_methods)
    ? user.work_methods
    : user.work_methods?.split(',').map(m => m.trim()) ?? [];

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Приветствие */}
        <div className="bg-white rounded-lg p-8 mb-6">
          <h1 className="mb-2">Добро пожаловать, {user.initials}</h1>
          <p className="text-muted-foreground">Панель управления специалиста</p>
        </div>

        {/* Навигация */}
        <div className="bg-white rounded-lg mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('personal-info')}
            className={`flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personal-info'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <User size={20} />
            Личная информация
          </button>
          <button
            onClick={() => { setActiveTab('profile'); cancelEditing(); }}
            className={`flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Briefcase size={20} />
            Профиль сотрудника
          </button>
        </div>

        {/* Личная информация */}
        {activeTab === 'personal-info' && (
          <div className="bg-white rounded-lg p-12">
            <div className="max-w-[800px]">
              <h2 className="mb-8">{user.initials}</h2>

              <div className="space-y-6">
                {user.education && (
                  <div>
                    <h3 className="mb-3">Образование</h3>
                    <p className="text-foreground">{user.education}</p>
                  </div>
                )}

                {user.practice && (
                  <div>
                    <h3 className="mb-3">Опыт работы</h3>
                    <p className="text-foreground">{user.practice}</p>
                  </div>
                )}

                {user.description && (
                  <div>
                    <h3 className="mb-3">О себе</h3>
                    <p className="text-foreground leading-relaxed">{user.description}</p>
                  </div>
                )}

                {methods.length > 0 && (
                  <div>
                    <h3 className="mb-3">Методы работы</h3>
                    <div className="flex flex-wrap gap-2">
                      {methods.map((method, i) => (
                        <span key={i} className="px-4 py-2 bg-secondary text-foreground rounded-full">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!user.education && !user.practice && !user.description && methods.length === 0 && (
                  <p className="text-muted-foreground">Информация ещё не заполнена</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Профиль сотрудника */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg p-12">
            <h2 className="mb-8">Информация о сотруднике</h2>

            <div className="space-y-6 max-w-[600px]">
              {/* ФИО */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  {editingField === 'initials' ? (
                    <Input
                      label="ФИО"
                      value={editedValue}
                      onChange={e => setEditedValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <label className="block mb-2 text-muted-foreground">ФИО</label>
                      <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">{user.initials}</p>
                    </>
                  )}
                </div>
                {editingField !== 'initials' && (
                  <button
                    onClick={() => startEditing('initials', user.initials)}
                    className="mb-1 text-primary hover:text-accent transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  {editingField === 'email' ? (
                    <Input
                      label="Корпоративная почта"
                      type="email"
                      value={editedValue}
                      onChange={e => setEditedValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <label className="block mb-2 text-muted-foreground">Корпоративная почта</label>
                      <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">{user.email}</p>
                    </>
                  )}
                </div>
                {editingField !== 'email' && (
                  <button
                    onClick={() => startEditing('email', user.email)}
                    className="mb-1 text-primary hover:text-accent transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                )}
              </div>

              {/* Телефон */}
              <div>
                <label className="block mb-2 text-muted-foreground">Номер телефона</label>
                <p className="text-foreground py-3 px-4 bg-secondary rounded-lg">{user.phone_number}</p>
              </div>

              {/* Роль */}
              <div>
                <label className="block mb-2 text-muted-foreground">Роль</label>
                <p className="py-3 px-4 bg-primary/10 text-primary rounded-lg inline-block">
                  Специалист клиники
                </p>
              </div>

              {/* Кнопки */}
              {editingField && (
                <div className="flex gap-4 pt-2">
                  <Button size="lg" onClick={handleSave} loading={isSaving}>
                    Сохранить
                  </Button>
                  <Button size="lg" variant="outline" onClick={cancelEditing} disabled={isSaving}>
                    Отмена
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
