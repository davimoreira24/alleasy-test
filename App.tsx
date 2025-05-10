
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {
  NativeBaseProvider,
  extendTheme,
  useColorMode,
  Box,
  useColorModeValue,
} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useThemeStore} from './src/store/themeStore';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ThemeToggle from './src/components/ThemeToggle';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#e6f3ff',
      100: '#b3d7ff',
      200: '#80bcff',
      300: '#4da0ff',
      400: '#1a85ff',
      500: '#0066e5',
      600: '#0052b8',
      700: '#003d8a',
      800: '#00295c',
      900: '#00142e',
    },
    darkBg: {
      50: '#18181b',
      100: '#1c1c20',
      200: '#24242b',
      300: '#2c2c35',
      400: '#3a3a47',
      500: '#494959',
      600: '#565666',
      700: '#6e6e80',
      800: '#8d8da0',
      900: '#aeaec0',
    },
    darkText: {
      50: '#f7f7fc',
      100: '#eeeef5',
      200: '#d8d8e3',
      300: '#b6b6c9',
      400: '#9b9bb0',
      500: '#8a8aa3',
      600: '#727287',
      700: '#5c5c6e',
      800: '#3f3f4a',
      900: '#25252d',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      variants: {
        solid: {
          _dark: {
            bg: 'primary.500',
            _hover: {
              bg: 'primary.600',
            },
            _pressed: {
              bg: 'primary.700',
            },
          },
        },
      },
    },
    Input: {
      baseStyle: {
        _dark: {
          bg: 'darkBg.200',
          borderColor: 'darkBg.400',
          color: 'darkText.50',
          _focus: {
            borderColor: 'primary.400',
            bg: 'darkBg.300',
          },
          placeholderTextColor: 'darkText.500',
        },
      },
    },
    Text: {
      baseStyle: {
        _dark: {
          color: 'darkText.50',
        },
      },
      variants: {
        subtitle: {
          _dark: {
            color: 'darkText.300',
          },
        },
      },
    },
    Box: {
      variants: {
        card: {
          _dark: {
            bg: 'darkBg.200',
            shadow: 2,
          },
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

const ThemeManager = ({children}: {children: React.ReactNode}) => {
  const {colorMode} = useThemeStore();
  const {setColorMode} = useColorMode();

  useEffect(() => {
    setColorMode(colorMode);
  }, [colorMode, setColorMode]);

  return <>{children}</>;
};

const AppLayout = ({children}: {children: React.ReactNode}) => {
  const bgColor = useColorModeValue('white', 'darkBg.100');

  return (
    <Box flex={1} safeAreaTop bg={bgColor}>
      <StatusBar
        barStyle={useColorModeValue('dark-content', 'light-content')}
        backgroundColor={useColorModeValue('white', '#1c1c20')}
      />

      
      <Box position="absolute" top={5} right={4} zIndex={10}>
        <ThemeToggle />
      </Box>

      {children}
    </Box>
  );
};

const AppContent: React.FC = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <HomeScreen /> : <LoginScreen />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <ThemeManager>
            <AppLayout>
              <AppContent />
            </AppLayout>
          </ThemeManager>
        </AuthProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

export default App;
