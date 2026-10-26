import {Platform} from 'react-native';

export const BASE_URL = 'http://172.16.10.152:3000';

const androidModel =
  Platform.OS === 'android' ? Platform.constants.Model.toLowerCase() : '';
const isAndroidEmulator =
  Platform.OS === 'android' &&
  /emulator|sdk_gphone|android sdk built for/.test(androidModel);

export const API_BASE_URL = isAndroidEmulator
  ? 'http://10.0.2.2:3000'
  : BASE_URL;

export const TIMEOUT = 10000;
