import React from 'react';
import {
  HStack,
  Switch,
  useColorMode,
  useColorModeValue,
  Icon,
  Pressable,
} from 'native-base';
import {useThemeStore} from '../store/themeStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ThemeToggle: React.FC = () => {
  const {toggleColorMode} = useThemeStore();
  const {colorMode, setColorMode: nativeBaseSetColorMode} = useColorMode();
  const isDark = colorMode === 'dark';

  const handleToggle = () => {
    toggleColorMode();
    const newMode = isDark ? 'light' : 'dark';
    nativeBaseSetColorMode(newMode);
  };

  return (
    <Pressable onPress={handleToggle}>
      <HStack
        space={2}
        alignItems="center"
        bg={useColorModeValue(
          'rgba(255, 255, 255, 0.9)',
          'rgba(36, 36, 43, 0.9)',
        )}
        px={3}
        py={2}
        rounded="full"
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'darkBg.400')}
        shadow={isDark ? 0 : 2}>
        <Icon
          as={<MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} />}
          size={5}
          color={useColorModeValue('primary.600', 'primary.400')}
          mr={1}
        />
        <Switch
          size="sm"
          isChecked={isDark}
          onToggle={handleToggle}
          colorScheme="primary"
          offTrackColor={useColorModeValue('gray.200', 'darkBg.500')}
          onTrackColor="primary.500"
          onThumbColor="white"
          offThumbColor="white"
        />
      </HStack>
    </Pressable>
  );
};

export default ThemeToggle;
