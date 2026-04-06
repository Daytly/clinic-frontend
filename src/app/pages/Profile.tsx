import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import { toast } from 'sonner';

type EditingField = 'initials' | 'phone_number' | 'email' | null;

export function Profile() {
  const { user, isAuthenticated, updateUser } = useApp();

  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editedValue, setEditedValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthenticated || !user) {
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
      phone_number: user.phone_number,
      email: user.email,
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

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Заполните все поля');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Новые пароли не совпадают');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({ password: newPassword } as any);
      toast.success('Пароль изменён');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка смены пароля');
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { key: EditingField; label: string; value: string; type?: string }[] = [
    { key: 'initials', label: 'ФИО', value: user.initials },
    { key: 'email', label: 'Электронная почта', value: user.email, type: 'email' },
  ];

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Навигация */}
        <div className="bg-white rounded-lg mb-6 p-2 flex gap-2">
          <div className="flex-1 py-3 px-6 rounded-lg bg-primary text-primary-foreground text-center">
            Профиль
          </div>
          <Link
            to="/specialists"
            className="flex-1 py-3 px-6 rounded-lg text-center text-foreground hover:bg-secondary transition-all"
          >
            Записаться на консультацию
          </Link>
        </div>

        {/* Профиль */}
        <div className="bg-white rounded-lg p-12">
          <h2 className="mb-8">Профиль</h2>

          <div className="space-y-6 mb-8">
            {fields.map(({ key, label, value, type }) => (
              <div key={key} className="flex items-end gap-4">
                <div className="flex-1">
                  {editingField === key ? (
                    <Input
                      label={label}
                      type={type}
                      value={editedValue}
                      onChange={e => setEditedValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <label className="block mb-2">{label}</label>
                      <p className="text-foreground py-3">{value}</p>
                    </>
                  )}
                </div>
                {editingField !== key && (
                  <button
                    onClick={() => startEditing(key, value)}
                    className="mb-1 text-primary hover:text-accent transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {editingField && (
            <div className="flex gap-4 mb-8">
              <Button size="lg" onClick={handleSave} loading={isSaving}>
                Сохранить
              </Button>
              <Button size="lg" variant="outline" onClick={cancelEditing} disabled={isSaving}>
                Отмена
              </Button>
            </div>
          )}

          {/* Смена пароля */}
          <div className="pt-8 border-t border-border">
            {showPasswordForm ? (
              <div className="space-y-4 max-w-[600px]">
                <h3 className="mb-4">Смена пароля</h3>
                <Input
                  label="Текущий пароль"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <Input
                  label="Новый пароль"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
                />
                <Input
                  label="Подтверждение пароля"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                />
                <div className="flex gap-4 pt-2">
                  <Button size="lg" onClick={handlePasswordChange} loading={isSaving}>
                    Изменить пароль
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="lg" onClick={() => setShowPasswordForm(true)}>
                Изменить пароль
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
