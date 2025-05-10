/**
 * @format
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

import {it} from '@jest/globals';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

describe('App', () => {
  it('renderiza sem falhas', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
