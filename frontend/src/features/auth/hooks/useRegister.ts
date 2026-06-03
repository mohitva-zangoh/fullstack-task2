import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api';
import type { RegisterPayload } from '../../../types/index.ts';

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  });
};
