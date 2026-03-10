import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../../src/Contexts/AuthContext';

export default function LoginPage() {
  const { logIn, checkAuth } = React.useContext(AuthContext);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Informe usuário e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await logIn(username, password);
      if (result) {
        await checkAuth();
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'web' ? undefined : 'padding'}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart App</Text>
          <Text style={styles.subtitle}>Gestão Inteligente</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Digite seu usuário"
            autoCapitalize="none"
            autoComplete="username"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
            autoComplete="current-password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    outlineStyle: 'none',
  },
  error: {
    color: '#e53e3e',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8bc34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#c6e2a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
