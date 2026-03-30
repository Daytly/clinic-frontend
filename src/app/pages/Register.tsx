import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button.tsx';
import { Input } from '../components/Input.tsx';
import { useApp } from '../context/AppContext.tsx';
import { toast } from 'sonner';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useApp();

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 1) return '+7';
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const nameParts = registerName.trim().split(' ');
    if (nameParts.length < 2 || /\d/.test(registerName)) {
      toast.error('ФИО должно содержать минимум 2 слова и не содержать цифр');
      return;
    }

    const phoneNumbers = registerPhone.replace(/\D/g, '');
    if (phoneNumbers.length !== 11) {
      toast.error('Номер телефона должен содержать 11 цифр');
      return;
    }

    if (!registerEmail.includes('@') || !registerEmail.includes('.')) {
      toast.error('Некорректный формат email');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await register(registerName, registerPhone, registerEmail, registerPassword);
      navigate('/login');
      toast.success('Регистрация прошла успешно', {
        description: 'Войдите в свой аккаунт',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary flex items-center justify-center py-20 px-8">
      <div className="max-w-[480px] w-full">
        <div className="bg-white rounded-lg p-12">
          <h2 className="mb-8">Регистрация</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="ФИО"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Иванова Мария Петровна"
                required
              />
              <p className="text-muted-foreground mt-2">Минимум 2 слова, без цифр</p>
            </div>

            <div>
              <Input
                label="Номер телефона"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(formatPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                required
              />
              <p className="text-muted-foreground mt-2">11 цифр с учетом кода страны</p>
            </div>

            <div>
              <Input
                label="Электронная почта"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
              <p className="text-muted-foreground mt-2">Обязательно наличие @ и домена</p>
            </div>

            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[44px] text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <p className="text-muted-foreground mt-2">Минимум 6 символов</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              Зарегистрироваться
            </Button>

            <div className="text-center">
              <span className="text-muted-foreground">Уже есть аккаунт? </span>
              <Link to="/login" className="text-primary hover:underline">
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}