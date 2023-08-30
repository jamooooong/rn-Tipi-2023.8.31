import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

import { initFirebase } from '../api/firebase';

const Navigation = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Asset.fromModule().downloadAsync();

        const app = initFirebase();
        console.log('firebase app: ', app);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('firebase error : ', e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const onReady = async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady}>
      <AuthStack />
    </NavigationContainer>
  );
};

export default Navigation;
