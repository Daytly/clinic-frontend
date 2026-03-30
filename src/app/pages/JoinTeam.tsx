import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../components/Button.tsx';
import { Input } from '../components/Input.tsx';
import { useTeam } from '../hooks/useTeam.ts';
import { toast } from 'sonner';

export function JoinTeam() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { submitApplication, isLoading } = useTeam();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Неподдерживаемый формат файла');
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error('Размер файла превышает 10 МБ');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Некорректный формат email');
      return;
    }

    if (!file) {
      toast.error('Пожалуйста, загрузите резюме');
      return;
    }

    try {
      const response = await submitApplication({ email, resume: file });
      toast.success("Заявка отправлена", {
        duration: 5000
      });

      // Reset form
      setEmail('');
      setFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка отправки заявки');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-secondary py-20 px-8">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-white rounded-lg p-12">
          <h2 className="mb-6">Стать частью команды</h2>
          
          <p className="text-foreground leading-relaxed mb-8">
            Мы ищем опытных психологов с высшим профильным образованием и стажем работы от 3 лет. 
            Наши специалисты регулярно проходят супервизию, участвуют в профессиональных сообществах 
            и придерживаются этических стандартов психотерапии. Мы предлагаем конкурентные условия, 
            гибкий график и поддержку коллег. Если вы разделяете наши ценности и хотите помогать людям 
            в комфортной профессиональной среде, отправьте заявку.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Электронная почта"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
              <p className="text-muted-foreground mt-2">Обязательно наличие @ и домена</p>
            </div>

            {/* Поле загрузки файла */}
            <div>
              <label className="block mb-2">
                Резюме <span className="text-destructive">*</span>
              </label>
              
              {!file ? (
                <label className="
                  flex flex-col items-center justify-center
                  w-full h-40
                  border-2 border-dashed border-border
                  rounded-lg
                  cursor-pointer
                  hover:border-primary hover:bg-secondary
                  transition-all
                ">
                  <Upload size={32} className="text-muted-foreground mb-2" />
                  <span className="text-foreground mb-1">Выбрать файл</span>
                  <span className="text-muted-foreground">или перетащите сюда</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="
                  flex items-center justify-between
                  p-4
                  border border-border
                  rounded-lg
                  bg-secondary
                ">
                  <span className="text-foreground">{file.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <p className="text-muted-foreground mt-2">
                Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 10 МБ
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              Отправить заявку
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}