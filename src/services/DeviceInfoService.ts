import {NativeModules, Platform} from 'react-native';

const {DeviceInfoModule} = NativeModules;

interface DeviceInfo {
  osVersion?: string;
  manufacturer?: string;
}

export const DeviceInfoService = {
  async getDeviceInfo(): Promise<DeviceInfo> {
    const info: DeviceInfo = {};

    if (!DeviceInfoModule) {
      return info;
    }

    try {
      if (Platform.OS === 'ios') {
        info.osVersion = await new Promise<string>((resolve, reject) => {
          DeviceInfoModule.getOSVersion((error: any, version: string) => {
            if (error) {
              reject(error);
            } else {
              resolve(version);
            }
          });
        });
      } else if (Platform.OS === 'android') {
        info.manufacturer = await new Promise<string>((resolve, reject) => {
          DeviceInfoModule.getManufacturer(
            (error: any, manufacturer: string) => {
              if (error) {
                reject(error);
              } else {
                resolve(manufacturer);
              }
            },
          );
        });
      }

      return info;
    } catch (error) {
      return info;
    }
  },
};

export default DeviceInfoService;
