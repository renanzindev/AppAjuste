import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../Contexts/AuthContext';
import { NavigationStyles } from '../Styles/NavigationStyles';

export default function MainHeaderLeft() {
  const navigation = useNavigation();
  const { module, displaySearch } = React.useContext(AuthContext);

  const menuButtonIcon = (
    <Icon name="menu" size={30} iconStyle={NavigationStyles.headerIcon} />
  );

  const menuButtonOnPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return module ? (
    <View style={NavigationStyles.headerRightView}>
      <Button
        type="clear"
        onPress={menuButtonOnPress}
        icon={menuButtonIcon}
        containerStyle={NavigationStyles.menuButtonContainer}
      />

      {!displaySearch ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomeView');
          }}
        >
          <Image
            style={NavigationStyles.headerLogo}
            source={require('../Assets/Img/logo-badge.png')}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  ) : null;
}
