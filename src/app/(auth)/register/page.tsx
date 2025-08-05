import { RegisterForm } from '@/client/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RegisterForm />
      </div>
    </div>
  );
}
