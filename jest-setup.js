import '@testing-library/jest-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.NativeModules.DeviceInfoModule = {
    getSystemVersion: jest.fn(() => Promise.resolve('15.0')),
    getManufacturer: jest.fn(() => Promise.resolve('Apple')),
  };
  return rn;
});
