// Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button.tsx';
import { Input } from '../components/Input.tsx';
import { useApp } from '../context/AppContext.tsx';
import { toast } from 'sonner';
import { parseDRFError } from '../utils/drfErrors.ts'; // ← импортируем утилиту

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, isLoading } = useApp();

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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
    setFieldErrors({}); // очищаем ошибки перед новой попыткой

    try {
      const user = await login(loginPhone, loginPassword);
      toast.success('Вход выполнен успешно');
      navigate(user.is_specialist ? '/staff-profile' : '/profile');
    } catch (error) {
      // Парсим ошибку для детального отображения
      const parsed = parseDRFError(error);

      // Если есть ошибки полей — показываем их под инпутами
      if (Object.keys(parsed.fieldErrors).length > 0) {
        const formattedErrors: Record<string, string> = {};

        // Маппинг полей DRF на поля формы
        const fieldMapping: Record<string, string> = {
          'phone_number': 'phone',
          'password': 'password',
        };

        for (const [drfField, messages] of Object.entries(parsed.fieldErrors)) {
          const formField = fieldMapping[drfField] || drfField;
          formattedErrors[formField] = messages.join(' ');
        }
        setFieldErrors(formattedErrors);
      }

      // Общие ошибки показываем в toast
      if (parsed.nonFieldErrors.length > 0) {
        parsed.nonFieldErrors.forEach(msg => toast.error(msg));
      } else if (parsed.detail) {
        toast.error(parsed.detail);
      } else if (Object.keys(parsed.fieldErrors).length === 0) {
        // Фолбэк, если ничего не распарсилось
        toast.error(error instanceof Error ? error.message : 'Ошибка входа');
      }
    }
  };

  return (
      <div className="min-h-[calc(100vh-88px)] bg-secondary flex items-center justify-center py-20 px-8">
        <div className="max-w-[480px] w-full">
          <div className="bg-white rounded-lg p-12">
            <h2 className="mb-8">Вход</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                    label="Номер телефона"
                    value={loginPhone}
                    onChange={(e) => {
                      setLoginPhone(formatPhone(e.target.value));
                      if (fieldErrors.phone) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.phone;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="+7 (___) ___-__-__"
                    required
                    error={fieldErrors.phone} // ← передаём ошибку в Input
                />
              </div>

              <div className="relative">
                <Input
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.password;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="••••••••"
                    required
                    error={fieldErrors.password} // ← передаём ошибку в Input
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[44px] text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Блок для общих ошибок (non-field-errors) */}
              {fieldErrors.nonField && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
                    <AlertCircle size={16} />
                    <span>{fieldErrors.nonField}</span>
                  </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                Войти
              </Button>

              <div className="text-center">
                <span className="text-muted-foreground">Нет аккаунта? </span>
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}