import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

/**
 * Error Boundary para capturar erros de renderização e evitar
 * que o app feche sem feedback (especialmente em release).
 */
export default class AppErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('AppErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.message}>
            O aplicativo encontrou um erro. Tente fechar e abrir novamente.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.detail}>{String(this.state.error.message)}</Text>
          )}
          <Button
            title="Tentar novamente"
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  detail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});
