'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
    } else {
      router.push('/home');
    }
  }, [router]);

  return null;
}