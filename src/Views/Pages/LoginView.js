import React from 'react';
import { View, Image, Keyboard } from 'react-native';
import { Input, Button } from 'react-native-elements';
import ErrorMessage from '../../Components/ErrorMessage';
import Loading from '../../Components/Loading';
import { LoginStyles } from '../../Styles/LoginStyle';
import { AuthContext } from '../../Contexts/AuthContext';

export function LoginView() {
  const { logIn, checkAuth } = React.useContext(AuthContext);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const signIn = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    setLoading(true);

    const result = await logIn(username, password);
    if (result !== true) {
      setLoading(false);
      setErrorMessage(result);
    }
    checkAuth();
  };

  return (
    <View style={LoginStyles.mainBody}>
      <View style={LoginStyles.bodyInner}>
        <View style={LoginStyles.cardWhite}>
          <Image
            style={LoginStyles.logoLogin}
            source={require('../../Assets/Img/logo.png')}
          />
          <Input
            placeholder="Login"
            style={LoginStyles.input}
            containerStyle={LoginStyles.inputContainer}
            inputContainerStyle={LoginStyles.inputContainer2}
            leftIconContainerStyle={LoginStyles.inputLeftIconContainer}
            leftIcon={{
              type: 'font-awesome',
              name: 'user',
              iconStyle: LoginStyles.inputIcon,
            }}
            autoCapitalize="none"
            onChangeText={setUsername}
            value={username}
          />
          <Input
            placeholder="Senha"
            style={LoginStyles.input}
            containerStyle={LoginStyles.inputContainer}
            inputContainerStyle={LoginStyles.inputContainer2}
            leftIconContainerStyle={LoginStyles.inputLeftIconContainer}
            secureTextEntry
            leftIcon={{
              type: 'font-awesome',
              name: 'lock',
              iconStyle: LoginStyles.inputIcon,
            }}
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />
          <Button
            title="ENTRAR"
            disabledStyle={LoginStyles.buttonDisabled}
            disabledTitleStyle={LoginStyles.buttonDisabledTitle}
            containerStyle={LoginStyles.buttonContainer}
            buttonStyle={LoginStyles.button}
            disabled={!username || !password || loading}
            onPress={() => {
              signIn();
            }}
          />
          <Loading show={loading} size={100} />
          <ErrorMessage message={errorMessage} />
        </View>
      </View>
      <View style={LoginStyles.bodyInnerBefore} />
    </View>
  );
}
