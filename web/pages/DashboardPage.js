import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AuthContext } from '../../src/Contexts/AuthContext';
import EmployeeService from '../../src/Services/EmployeeService';

dayjs.locale('pt-br');

export default function DashboardPage() {
  const { getUser } = React.useContext(AuthContext);
  const [user, setUser] = React.useState(null);
  const [birthdays, setBirthdays] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const load = async () => {
    setLoading(true);
    const u = await getUser();
    setUser(u);
    const bd = await EmployeeService.birthdays();
    setBirthdays(bd ?? []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={load} colors={['#8bc34a']} />
      }
    >
      {user?.funcionario && (
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user.funcionario.nome?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user.funcionario.nome}</Text>
            <Text style={styles.profileRole}>
              {user.funcionario.cargo_atual?.[0]?.nome ?? ''}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ANIVERSARIANTES DO MÊS</Text>
        <View style={styles.divider} />
        {loading ? (
          <ActivityIndicator color="#8bc34a" style={styles.loading} />
        ) : birthdays.length === 0 ? (
          <Text style={styles.empty}>Nenhum aniversariante este mês.</Text>
        ) : (
          birthdays.map((emp, i) => (
            <View key={i} style={styles.birthdayRow}>
              <Text style={styles.birthdayName}>{emp.nome}</Text>
              <View style={styles.birthdayRight}>
                <Text style={styles.birthdayRole}>
                  {emp.cargo_atual?.[0]?.nome ?? ''}
                </Text>
                <Text style={styles.birthdayDate}>
                  {dayjs(emp.data_nascimento).format('DD/MM')}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  content: { padding: 24 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8bc34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  profileName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileRole: { color: '#a0aec0', fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568',
    letterSpacing: 1,
    textAlign: 'center',
  },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  birthdayName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2d3748' },
  birthdayRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  birthdayRole: { fontSize: 12, color: '#718096', maxWidth: 140 },
  birthdayDate: { fontSize: 12, fontWeight: '700', color: '#8bc34a', minWidth: 40, textAlign: 'right' },
  loading: { marginVertical: 20 },
  empty: { textAlign: 'center', color: '#718096', marginVertical: 16 },
});
