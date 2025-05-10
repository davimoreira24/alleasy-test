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
import {loginSchema, LoginFormData} from '../utils/validationSchemas';
import {AxiosError} from 'axios';
import RegisterScreen from './RegisterScreen';

const {height} = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const toast = useToast();
  const {signIn, isLoading: authLoading} = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {control, handleSubmit} = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  const toggleRegisterMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsSubmitting(true);

      await signIn(data.email, data.password);

      toast.show({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao aplicativo.',
        placement: 'top',
        duration: 3000,
        backgroundColor: successToastBg,
      });
    } catch (err) {
      if ((err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          if (
            axiosError.response.status === 400 ||
            axiosError.response.status === 401
          ) {
            setError(
              'Email ou senha inválidos. Use eve.holt@reqres.in e cityslicka',
            );
          } else if (axiosError.response.status === 404) {
            setError('Usuário não encontrado. Verifique o email informado.');
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
        setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }

      toast.show({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        placement: 'top',
        duration: 3000,
        backgroundColor: errorToastBg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegisterMode) {
    return <RegisterScreen onToggleRegister={toggleRegisterMode} />;
  }

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
                Bem-vindo de volta!
              </Text>
              <Text
                fontSize="md"
                color={subTextColor}
                textAlign="center"
                mt={1}
                variant="subtitle">
                Faça login em sua conta para continuar
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
                    <Text fontWeight="bold">cityslicka</Text>
                  </Text>
                </Box>

                <HStack width="100%" justifyContent="flex-end" mb={1}>
                  <Pressable>
                    <Text
                      color={highlightColor}
                      fontWeight="medium"
                      fontSize="sm">
                      Esqueceu a senha?
                    </Text>
                  </Pressable>
                </HStack>

                <CustomButton
                  title="Entrar"
                  size="lg"
                  onPress={handleSubmit(onSubmit)}
                  width="100%"
                  mb={2}
                  isLoading={isSubmitting || authLoading}
                  isLoadingText="Entrando..."
                  borderRadius="lg"
                  _dark={{
                    bg: 'primary.500',
                    _pressed: {bg: 'primary.600'},
                  }}
                />

                <HStack space={1} mt={1}>
                  <Text color={subTextColor}>Não tem uma conta?</Text>
                  <Pressable onPress={toggleRegisterMode}>
                    <Text color={highlightColor} fontWeight="medium">
                      Cadastre-se
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

export default LoginScreen;
