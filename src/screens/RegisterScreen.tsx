import React, {useState} from 'react';
import {
  Box,
  Center,
  Image,
  VStack,
  Text,
  HStack,
  Pressable,
  useColorModeValue,
  ScrollView,
  KeyboardAvoidingView,
  useToast,
  Alert,
  Icon,
  CloseIcon,
} from 'native-base';
import {Platform, Dimensions} from 'react-native';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAuth} from '../contexts/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import * as yup from 'yup';
import {AxiosError} from 'axios';

const {height} = Dimensions.get('window');

const registerSchema = yup.object({
  name: yup.string().required('O nome é obrigatório'),
  email: yup
    .string()
    .required('O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterScreen: React.FC<{
  onToggleRegister: () => void;
}> = ({onToggleRegister}) => {
  const toast = useToast();
  const {registerUser, isLoading: authLoading} = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {control, handleSubmit} = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const bgColor = useColorModeValue('white', 'darkBg.100');
  const highlightColor = useColorModeValue('primary.500', 'primary.400');
  const textColor = useColorModeValue('gray.800', 'darkText.50');
  const subTextColor = useColorModeValue('gray.500', 'darkText.300');
  const formBgColor = useColorModeValue('white', 'darkBg.200');
  const successToastBg = useColorModeValue('primary.500', 'primary.600');
  const errorToastBg = useColorModeValue('red.500', 'red.600');
  const tipBgColor = useColorModeValue('blue.50', 'darkBg.300');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setIsSubmitting(true);

      await registerUser(data.email, data.password, data.name);

      toast.show({
        title: 'Cadastro realizado com sucesso!',
        description: 'Bem-vindo ao aplicativo.',
        placement: 'top',
        duration: 3000,
        backgroundColor: successToastBg,
      });
    } catch (err) {
      if ((err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            setError(
              'Email ou senha inválidos. Use eve.holt@reqres.in e pistol',
            );
          } else {
            setError(`Erro no servidor: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          setError(
            'Falha na comunicação com o servidor. Verifique sua conexão.',
          );
        } else {
          setError(`Erro inesperado: ${axiosError.message}`);
        }
      } else {
        setError('Ocorreu um erro ao tentar fazer cadastro. Tente novamente.');
      }

      toast.show({
        title: 'Erro ao fazer cadastro',
        description: 'Verifique os dados e tente novamente.',
        placement: 'top',
        duration: 3000,
        backgroundColor: errorToastBg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Box flex={1} bg={bgColor} safeArea>
          <VStack
            space={4}
            alignItems="center"
            justifyContent="center"
            px={6}
            py={6}
            height={height}>
            
            <Center mb={4}>
              <Image
                source={require('../assets/images/logo.png')}
                alt="Logo"
                size="lg"
                resizeMode="contain"
              />
              <Text fontSize="2xl" fontWeight="bold" mt={3} color={textColor}>
                Crie sua conta
              </Text>
              <Text
                fontSize="md"
                color={subTextColor}
                textAlign="center"
                mt={1}
                variant="subtitle">
                Preencha os dados abaixo para começar
              </Text>
            </Center>

            
            {error && (
              <Alert w="100%" status="error" mb={2} rounded="md">
                <HStack
                  space={2}
                  alignItems="center"
                  justifyContent="space-between"
                  w="100%">
                  <HStack space={2} alignItems="center">
                    <Alert.Icon />
                    <Text color="red.600" fontSize="sm" fontWeight="medium">
                      {error}
                    </Text>
                  </HStack>
                  <Pressable onPress={() => setError(null)}>
                    <Icon as={<CloseIcon />} size="xs" color="red.600" />
                  </Pressable>
                </HStack>
              </Alert>
            )}

            
            <Box
              width="100%"
              py={4}
              px={5}
              bg={formBgColor}
              borderRadius="xl"
              shadow={3}
              _dark={{
                shadow: 'none',
                borderWidth: 1,
                borderColor: 'darkBg.300',
              }}>
              <VStack space={3} width="100%" alignItems="center">
                <CustomInput
                  name="name"
                  control={control}
                  label="Nome"
                  leftIcon="person-outline"
                  placeholder="Seu nome"
                  autoCapitalize="words"
                />

                <CustomInput
                  name="email"
                  control={control}
                  label="E-mail"
                  leftIcon="mail-outline"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <CustomInput
                  name="password"
                  control={control}
                  label="Senha"
                  leftIcon="lock-outline"
                  placeholder="Sua senha"
                  isPassword
                />

                <CustomInput
                  name="confirmPassword"
                  control={control}
                  label="Confirmar senha"
                  leftIcon="lock-outline"
                  placeholder="Confirme sua senha"
                  isPassword
                />

                
                <Box
                  w="100%"
                  bg={tipBgColor}
                  p={2}
                  borderRadius="md"
                  borderLeftWidth={4}
                  borderLeftColor="primary.500">
                  <Text fontSize="xs" color={subTextColor} fontWeight="medium">
                    API de teste: use email{' '}
                    <Text fontWeight="bold">eve.holt@reqres.in</Text> e senha{' '}
                    <Text fontWeight="bold">pistol</Text>
                  </Text>
                </Box>

                <CustomButton
                  title="Cadastrar"
                  size="lg"
                  onPress={handleSubmit(onSubmit)}
                  width="100%"
                  mb={2}
                  isLoading={isSubmitting || authLoading}
                  isLoadingText="Cadastrando..."
                  borderRadius="lg"
                  _dark={{
                    bg: 'primary.500',
                    _pressed: {bg: 'primary.600'},
                  }}
                />

                <HStack space={1} mt={1}>
                  <Text color={subTextColor}>Já tem uma conta?</Text>
                  <Pressable onPress={onToggleRegister}>
                    <Text color={highlightColor} fontWeight="medium">
                      Faça login
                    </Text>
                  </Pressable>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
