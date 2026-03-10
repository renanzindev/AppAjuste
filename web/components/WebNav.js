import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../src/Contexts/AuthContext';

const NAV_ITEMS = [
  { key: 'home', label: 'Início', icon: '🏠' },
  { key: 'pcp', label: 'PCP', icon: '📅', module: 'producao' },
  { key: 'closeService', label: 'Fechar Serviço', icon: '🏷️', module: 'producao' },
  { key: 'closedServices', label: 'Últ. Fechamentos', icon: '📋', module: 'producao' },
  { key: 'myStock', label: 'Meu Estoque', icon: '📦', module: 'producao' },
  { key: 'checkout', label: 'Retirada de Lote', icon: '🔍', module: 'logistica' },
  { key: 'pendingDeliveries', label: 'Lotes em Trânsito', icon: '🚚', module: 'logistica' },
  { key: 'lastDeliveries', label: 'Últimas Entregas', icon: '✅', module: 'logistica' },
  { key: 'faq', label: 'FAQ', icon: 'ℹ️' },
];

export default function WebNav({ activePage, onNavigate }) {
  const { module, logOut, getUser } = React.useContext(AuthContext);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getUser().then(setUser);
  }, []);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.module || item.module === module?.index
  );

  return (
    <View style={styles.sidebar}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.funcionario?.nome?.charAt(0)?.toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {user?.funcionario?.nome ?? 'Usuário'}
        </Text>
      </View>

      <View style={styles.navList}>
        {visibleItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, activePage === item.key && styles.navItemActive]}
            onPress={() => onNavigate(item.key)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                activePage === item.key && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>⏻  Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    height: '100%',
    backgroundColor: '#2d3748',
    flexDirection: 'column',
    paddingVertical: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8bc34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  navList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  navItemActive: {
    backgroundColor: '#4a5568',
  },
  navIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  navLabel: {
    color: '#a0aec0',
    fontSize: 14,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
    marginTop: 8,
  },
  logoutText: {
    color: '#fc8181',
    fontSize: 14,
    fontWeight: '600',
  },
});
