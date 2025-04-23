import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Every time when the page is refreshed, the auth provider will be re-rendered
// So with this, we can make sure that the user login status has been checked and the token is updated
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        if (token) {
          await checkAdminStatus();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log('error in auth provider', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [userId, getToken, checkAdminStatus]);

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Loader className='size-8 text-emerald-500 animate-spin' />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
