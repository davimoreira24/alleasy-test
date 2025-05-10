import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
