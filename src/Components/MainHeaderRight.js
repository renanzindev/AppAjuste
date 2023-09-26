import React from 'react';
import { Button, Icon } from '@rneui/themed';
import { AuthContext } from '../Contexts/AuthContext';
import { NavigationStyles } from '../Styles/NavigationStyles';

export default function MainHeaderRight() {
  const { module, displaySearch, setDisplaySearch } = React.useContext(
    AuthContext
  );

  const searchIcon = (
    <Icon
      name={!displaySearch ? 'search' : 'close'}
      size={30}
      color="white"
      style={NavigationStyles.headerIcon}
    />
  );

  const searchOnPress = () => {
    setDisplaySearch(!displaySearch);
  };

  return module ? (
    <Button
      type="clear"
      onPress={searchOnPress}
      icon={searchIcon}
      containerStyle={NavigationStyles.searchButtonContainer}
    />
  ) : null;
}
