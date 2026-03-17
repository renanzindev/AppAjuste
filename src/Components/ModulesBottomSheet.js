import React from 'react';
import { BottomSheet, Divider, ListItem } from '@rneui/themed';
import { AuthContext } from '../Contexts/AuthContext';

export default function ModulesBottomSheet() {
  const {
    changeModule,
    userModules,
    displayModules,
    setDisplayModules,
  } = React.useContext(AuthContext);

  const cancelListItemOnPress = () => {
    setDisplayModules(false);
  };

  const modules = Array.isArray(userModules) ? userModules : [];

  return modules.length > 0 ? (
    <BottomSheet
      isVisible={displayModules}
      modalProps={{
        animationType: 'none',
        onRequestClose: cancelListItemOnPress,
      }}
    >
      {modules.map((module) => (
        <ListItem
          key={module.id}
          onPress={() => {
            changeModule(module);
            setDisplayModules(false);
          }}
        >
          <ListItem.Content>
            <ListItem.Title style={{ textTransform: 'uppercase' }}>
              {module.name}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
      <Divider />
      <ListItem onPress={cancelListItemOnPress}>
        <ListItem.Content>
          <ListItem.Title style={{ color: 'red' }}>FECHAR</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  ) : null;
}
