/* eslint-env jest */
const storage = {};

const mockAsyncStorage = {
  getItem: jest.fn(key => Promise.resolve(storage[key] || null)),
  setItem: jest.fn((key, value) => {
    storage[key] = String(value);
    return Promise.resolve(null);
  }),
  removeItem: jest.fn(key => {
    delete storage[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach(k => delete storage[k]);
    return Promise.resolve(null);
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn().mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: null,
    }),
  },
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: null,
  }),
}));

