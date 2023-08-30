import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, View, Keyboard, Text } from 'react-native';
import { useCallback, useReducer, useRef } from 'react';
import { AuthRoutes } from '../navigations/routes';
import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import { StatusBar } from 'expo-status-bar';
import { WHITE } from '../colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../components/SafeInputView';

import Button from '../components/Button';
import TextButton from '../components/TextButton';
import HR from '../components/HR';

import {
  authFormReducer,
  AuthFormTypes,
  initAuthForm,
} from '../reducers/authFormReducer';

//firebase api
import { getAuthErrorMessages, signIn } from '../api/auth';

const SignInScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const passwordRef = useRef();

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  useFocusEffect(
    useCallback(() => {
      return () => dispatch({ type: AuthFormTypes.RESET });
    }, [])
  );

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled = !newForm.email || !newForm.password;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });

      try {
        const user = await signIn(form);
        console.log('유저 로긴 테스트1', user);
      } catch (e) {
        const message = getAuthErrorMessages(e.code);
        Alert.alert('로그인 실패', message);
      }
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
    }
  };

  return (
    <SafeInputView>
      <StatusBar style="auto" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={[styles.form, { paddingBottom: bottom }]}>
          <Input
            value={form.email}
            onChangeText={(text) => updateForm({ email: text.trim() })}
            inputType={InputTypes.EMAIL}
            returnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordRef.current.focus()}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={passwordRef}
            value={form.password}
            onChangeText={(text) => updateForm({ password: text.trim() })}
            inputType={InputTypes.PASSWORD}
            returnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{ container: { marginBottom: 20 } }}
          />

          <Button
            title="로그인"
            onPress={onSubmit}
            disabled={form.disabled}
            isLoading={form.isLoading}
            styles={{
              container: [{ marginTop: 20 }],
            }}
          />

          <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />

          <TextButton
            title={'회원가입'}
            onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
          />
        </View>
      </View>
    </SafeInputView>
  );
};

const inputStyles = StyleSheet.create({
  container: { marginBottom: 20, paddingHorizontal: 20 },
  input: { borderWidth: 1 }, //아웃라인
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    //borderTopRightRadius: 20,
  },
});

export default SignInScreen;
