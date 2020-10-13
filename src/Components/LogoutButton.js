import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { Button, Divider, Icon } from 'react-native-elements';
import { AuthContext } from '../Contexts/AuthContext';

export default function LogoutButton(props) {
  const { logOut } = React.useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        style={{
          flex: 1,
          width: '100%',
          alignContent: 'center',
        }}
        label={() => (
          <>
            <Divider />
            <Button
              title="SAIR"
              type="clear"
              titleStyle={{ color: 'red' }}
              buttonStyle={{ justifyContent: 'flex-start' }}
              icon={
                <Icon
                  name="logout"
                  size={20}
                  color="red"
                  style={{ marginRight: 10 }}
                />
              }
              onPress={logOut}
            />
          </>
        )}
      />
    </DrawerContentScrollView>
  );
}
