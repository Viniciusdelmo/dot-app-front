'use client'

import Link from 'next/link';
import { Form } from 'app/form';
import { SubmitButton } from 'app/submit-button';
import Image from 'next/image'
import authService from 'app/services/authService';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { push } = useRouter();
    async function auth(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await authService.signin({ login: username, password });

      push('/home');
    } catch (error: any) {
      console.error('Erro ao logar:', error.message);
    }
  }
  return (
    <div className="flex flex-col h-screen w-screen bg-teal-950 z-10 overflow-hidden">
      <div className="flex justify-between z-10 mt-4">
      <Image
          src="/assets/uniesquina.svg"
          width={250}
          height={250}
          priority={true}
          alt="Uniesquina"
          className="opacity-75 translate-y-1/3 translate-x-1/3"
        />
      </div>
      <div className='flex h-screen items-center justify-center'>
        <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/assets/clock.svg"
          fill
          priority={true}
          alt="Relógio"
          className="opacity-10 translate-y-1/3 translate-x-1/3"
        />
      </div>
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Entrar</h3>
          <p className="text-sm text-gray-500">
            Insira seu login e senha
          </p>
        </div>
        <Form action={auth}>
          <SubmitButton>Entrar</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Não tem uma conta? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Cadastre-se
            </Link>
          </p>
        </Form>
      </div>
      </div>
    </div>
  );
}
