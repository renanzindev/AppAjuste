import React from 'react';
import { Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import { OsServiceContext } from '../../../Contexts/OsServiceContext';
import OsServiceService from '../../../Services/OsServiceService';
import LastClosedTab from '../../Layout/Tabs/LastClosedTab';
import PendingServicesTab from '../../Layout/Tabs/PendingServicesTab';

const initialLayout = { width: Dimensions.get('window').width };

export default function ClosedServicesView() {
  const isFocused = useIsFocused();
  const [closedServices, setClosedServices] = React.useState([]);
  const [reprovedServices, setReprovedServices] = React.useState([]);
  const [pendingServices, setPendingServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'lastClosed', title: 'FINALIZADOS' },
    { key: 'pending', title: 'PENDENTES' },
  ]);

  const renderScene = SceneMap({
    lastClosed: LastClosedTab,
    pending: PendingServicesTab,
  });

  const getPageData = async () => {
    setLoading(true);

    const [ok, response] = await OsServiceService.index();

    if (ok) {
      setClosedServices(response?.aprovados);
      setReprovedServices(response?.recusados);
      setPendingServices(response?.pendentes);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    getPageData();
  }, [isFocused]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      activeColor="#007d71"
      inactiveColor="#5d585c"
      indicatorStyle={{ backgroundColor: '#007d71' }}
      style={{ backgroundColor: 'white' }}
    />
  );

  const GetDataOnRefresh = React.useCallback(() => {
    getPageData();
  }, []);

  const contextMemo = React.useMemo(
    () => ({
      closedServices,
      reprovedServices,
      pendingServices,
      loading,
      getPageData,
      GetDataOnRefresh,
    }),
    [closedServices, reprovedServices, pendingServices, loading]
  );

  return (
    <OsServiceContext.Provider value={contextMemo}>
      <TabView
        lazy
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
      <BottomTabNavigator />
    </OsServiceContext.Provider>
  );
}
