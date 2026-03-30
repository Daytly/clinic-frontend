import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { toast } from 'sonner';

type EditingField = 'name' | 'phone' | 'email' | null;

export function Profile() {
  const { user, isAuthenticated, updateUser, updatePassword, isLoading } = useApp();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  
  // Состояние для смены пароля
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const startEditing = (field: EditingField) => {
    setEditingField(field);
    setHasChanges(true);
    if (field === 'name') setEditedName(user.name);
    if (field === 'phone') setEditedPhone(user.phone);
    if (field === 'email') setEditedEmail(user.email);
  };

  const handleSave = async () => {
    const updates: any = {};
    if (editingField === 'name' && editedName !== user.name) updates.name = editedName;
    if (editingField === 'phone' && editedPhone !== user.phone) updates.phone = editedPhone;
    if (editingField === 'email' && editedEmail !== user.email) updates.email = editedEmail;

    if (Object.keys(updates).length > 0) {
      try {
        await updateUser(updates);
        toast.success('Данные успешно обновлены');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ошибка обновления');
      }
    }
    
    setEditingField(null);
    setHasChanges(false);
  };

  const handlePasswordChange = async () => {
    if (!passwordEmail || !currentPassword || !newPassword || !confirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await updatePassword(passwordEmail, currentPassword, newPassword);
      toast.success('Пароль успешно изменён');
      setShowPasswordForm(false);
      setPasswordEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка смены пароля');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Навигация */}
        <div className="bg-white rounded-lg mb-6 p-2 flex gap-2">
          <div className="flex-1 py-3 px-6 rounded-lg bg-primary text-primary-foreground">
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
            {/* ФИО */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {editingField === 'name' ? (
                  <Input
                    label="ФИО"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <label className="block mb-2">ФИО</label>
                    <p className="text-foreground py-3">{user.name}</p>
                  </>
                )}
              </div>
              {editingField !== 'name' && (
                <button
                  onClick={() => startEditing('name')}
                  className="mt-8 text-primary hover:text-accent transition-colors"
                >
                  <Pencil size={20} />
                </button>
              )}
            </div>

            {/* Номер телефона */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {editingField === 'phone' ? (
                  <Input
                    label="Номер телефона"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <label className="block mb-2">Номер телефона</label>
                    <p className="text-foreground py-3">{user.phone}</p>
                  </>
                )}
              </div>
              {editingField !== 'phone' && (
                <button
                  onClick={() => startEditing('phone')}
                  className="mt-8 text-primary hover:text-accent transition-colors"
                >
                  <Pencil size={20} />
                </button>
              )}
            </div>

            {/* Электронная почта */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {editingField === 'email' ? (
                  <Input
                    label="Электронная почта"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <label className="block mb-2">Электронная почта</label>
                    <p className="text-foreground py-3">{user.email}</p>
                  </>
                )}
              </div>
              {editingField !== 'email' && (
                <button
                  onClick={() => startEditing('email')}
                  className="mt-8 text-primary hover:text-accent transition-colors"
                >
                  <Pencil size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || editingField === null}
                size="lg"
              >
                Сохранить изменения
              </Button>
              
              {hasChanges && (
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    (Неактивна по умолчанию)
                  </span>
                  <Button
                    variant="primary"
                    size="lg"
                  >
                    Активна при наличии изменений
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Форма смены пароля */}
          {showPasswordForm && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="mb-4">Смена пароля</h3>
              <div className="space-y-4 max-w-[600px]">
                <Input
                  label="Электронная почта"
                  type="email"
                  value={passwordEmail}
                  onChange={(e) => setPasswordEmail(e.target.value)}
                  placeholder="Введите вашу почту"
                />
                <Input
                  label="Текущий пароль"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <Input
                  label="Новый пароль"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                />
                <Input
                  label="Подтверждение нового пароля"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                />
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handlePasswordChange}
                    size="lg"
                  >
                    Изменить пароль
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordEmail('');
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Кнопка открытия формы смены пароля */}
          {!showPasswordForm && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button
                onClick={() => setShowPasswordForm(true)}
                variant="outline"
                size="lg"
              >
                Изменить пароль
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}