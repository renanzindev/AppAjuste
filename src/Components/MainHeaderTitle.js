import React from 'react';
import { Button, Input } from 'react-native-elements';
import { AuthContext } from '../Contexts/AuthContext';
import { NavigationStyles } from '../Styles/NavigationStyles';

export default function MainHeaderTitle() {
  const {
    module,
    setDisplayModules,
    search,
    setSearch,
    displaySearch,
    searchInput,
  } = React.useContext(AuthContext);

  const searchLeftIcon = {
    name: 'search',
    iconStyle: NavigationStyles.headerIcon,
  };

  const modulesButtonOnPress = () => {
    setDisplayModules(true);
  };
  if (module) {
    return !displaySearch ? (
      <Button
        type="clear"
        animationEnabled={false}
        onPress={modulesButtonOnPress}
        title={module ? module.name : ''}
        titleStyle={NavigationStyles.headerTitle}
        buttonStyle={NavigationStyles.headerTitleButton}
      />
    ) : (
      <Input
        placeholder="Pesquisar"
        placeholderTextColor="#dcdcdc"
        ref={searchInput}
        style={NavigationStyles.searchInput}
        containerStyle={NavigationStyles.searchContainer}
        inputContainerStyle={NavigationStyles.searchInputContainer}
        leftIconContainerStyle={NavigationStyles.searchLeftIconContainer}
        leftIcon={searchLeftIcon}
        autoCapitalize="none"
        onChangeText={setSearch}
        value={search}
      />
    );
  }
  return null;
}
