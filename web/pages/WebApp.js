import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/Contexts/AuthContext';
import WebNav from '../components/WebNav';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

const PAGE_COMPONENTS = {
  home: DashboardPage,
};

export default function WebApp() {
  const { checkAuth } = React.useContext(AuthContext);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [activePage, setActivePage] = React.useState('home');

  React.useEffect(() => {
    const init = async () => {
      const result = await checkAuth();
      setLoggedIn(!!result);
      setLoaded(true);
    };
    init();
  }, []);

  if (!loaded) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashText}>Smart App</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <AuthContext.Consumer>
        {(ctx) => (
          <LoginPage
            onLoginSuccess={() => setLoggedIn(true)}
          />
        )}
      </AuthContext.Consumer>
    );
  }

  const ActivePage = PAGE_COMPONENTS[activePage] ?? DashboardPage;

  return (
    <View style={styles.container}>
      <WebNav activePage={activePage} onNavigate={setActivePage} />
      <View style={styles.content}>
        <View style={styles.topbar}>
          <Text style={styles.pageTitle}>
            {activePage === 'home' ? 'Início' : activePage}
          </Text>
        </View>
        <View style={styles.pageContent}>
          <ActivePage />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3748',
  },
  splashText: {
    color: '#8bc34a',
    fontSize: 32,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f7fafc',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  topbar: {
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pageContent: {
    flex: 1,
  },
});
