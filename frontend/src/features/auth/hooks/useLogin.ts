import { useMutation } from '@tanstack/react-query';
import { loginApi, getMeApi } from '../api';
import { useAuthStore } from '../../../stores';
import type { LoginPayload } from '../../../types/index.ts';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const authRes = await loginApi(payload);
      // Temporarily set token in localStorage so getMeApi can read it via interceptor
      localStorage.setItem('auth_token', authRes.access_token);
      
      try {
        const userRes = await getMeApi();
        setAuth({ id: userRes.id, email: userRes.email }, authRes.access_token);
        return userRes;
      } catch (err) {
        localStorage.removeItem('auth_token');
        throw err;
      }
    },
  });
};
