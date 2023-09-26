import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Icon } from '@rneui/themed';
import { AuthContext } from '../Contexts/AuthContext';

export default function BottomTabNavigator() {
  const navigation = useNavigation();
  const route = useRoute();
  const { module } = React.useContext(AuthContext);
  const buttonWidth =
    module && typeof module.tabs !== 'undefined'
      ? 100 / module.tabs.length
      : 100;

  return module && typeof module.tabs !== 'undefined' ? (
    <View style={styles.bottomContainer}>
      {module.tabs.map((tab, i) => (
        <Button
          key={i}
          type="clear"
          icon={
            <View style={{ flexDirection: 'column' }}>
              <Icon
                name={tab.icon}
                type={tab.iconType}
                style={styles.buttonIcon}
                color={route.name == tab.route ? '#8bc34a' : '#999'}
              />
              <Text
                style={
                  route.name == tab.route
                    ? styles.buttonSubtitleActive
                    : styles.buttonSubtitle
                }
              >
                {tab.title}
              </Text>
            </View>
          }
          style
          containerStyle={styles.buttonContainer(buttonWidth)}
          buttonStyle={styles.button}
          onPress={() => {
            navigation.navigate(tab.route);
          }}
        />
      ))}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  buttonContainer(buttonWidth) {
    return {
      flexDirection: 'column',
      minWidth: `${buttonWidth}%`,
      padding: 0,
      margin: 0,
      height: '100%',
    };
  },

  button: {
    height: 60,
  },

  buttonSubtitleActive: {
    fontSize: 12,
    color: '#8bc34a',
  },

  buttonSubtitle: {
    fontSize: 12,
    color: '#999',
  },
});
