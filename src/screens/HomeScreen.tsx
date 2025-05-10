import React, {useEffect, useState} from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  ScrollView,
  Pressable,
  Avatar,
  Divider,
  Badge,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/AuthContext';
import {DeviceInfoService} from '../services/DeviceInfoService';
import {Platform} from 'react-native';

interface DeviceInfo {
  osVersion?: string;
  manufacturer?: string;
}

const HomeScreen: React.FC = () => {
  const {user, signOut} = useAuth();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({});
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'darkBg.100');
  const cardBgColor = useColorModeValue('gray.50', 'darkBg.200');
  const textColor = useColorModeValue('gray.800', 'darkText.50');
  const subTextColor = useColorModeValue('gray.500', 'darkText.300');
  const primaryColor = useColorModeValue('primary.500', 'primary.400');

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await DeviceInfoService.getDeviceInfo();
        setDeviceInfo(info);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    getDeviceInfo();
  }, []);

  const getInitials = () => {
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} p={6}>
          <HStack space={4} alignItems="center" justifyContent="space-between">
            <HStack space={3} alignItems="center">
              <Avatar bg="primary.500">{getInitials()}</Avatar>
              <VStack>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {user?.name || user?.email?.split('@')[0] || 'Usuário'}
                </Text>
                <Text fontSize="sm" color={subTextColor}>
                  {user?.email || 'email@exemplo.com'}
                </Text>
              </VStack>
            </HStack>
            <Pressable onPress={handleSignOut}>
              <Icon
                as={<MaterialIcons name="logout" />}
                size={6}
                color={primaryColor}
              />
            </Pressable>
          </HStack>

          <Divider my={2} />

          <Box
            bg={cardBgColor}
            rounded="lg"
            p={4}
            shadow={1}
            _dark={{borderWidth: 1, borderColor: 'darkBg.300'}}>
            <VStack space={3}>
              <HStack alignItems="center" space={2}>
                <Icon
                  as={<MaterialIcons name="devices" />}
                  size={5}
                  color={primaryColor}
                />
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  Informações do Dispositivo
                </Text>
              </HStack>

              <Divider />

              <VStack space={2}>
                <HStack justifyContent="space-between">
                  <Text color={subTextColor}>Plataforma</Text>
                  <Badge
                    colorScheme={Platform.OS === 'ios' ? 'blue' : 'emerald'}
                    rounded="lg"
                    variant="subtle">
                    <Text fontWeight="medium">
                      {Platform.OS === 'ios' ? 'iOS' : 'Android'}
                    </Text>
                  </Badge>
                </HStack>

                {deviceInfo.osVersion && (
                  <HStack justifyContent="space-between">
                    <Text color={subTextColor}>Versão do Sistema</Text>
                    <Text fontWeight="medium" color={textColor}>
                      {deviceInfo.osVersion}
                    </Text>
                  </HStack>
                )}

                {deviceInfo.manufacturer && (
                  <HStack justifyContent="space-between">
                    <Text color={subTextColor}>Fabricante</Text>
                    <Text fontWeight="medium" color={textColor}>
                      {deviceInfo.manufacturer}
                    </Text>
                  </HStack>
                )}

                {loading && (
                  <HStack justifyContent="center" p={2}>
                    <Text color={subTextColor}>Carregando informações...</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default HomeScreen;
