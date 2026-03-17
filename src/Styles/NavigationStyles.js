import { StyleSheet } from 'react-native';

const headerColors = {
  admin: '#8BC34A',
  estoque: '#676158',
  financeiro: '#d8a51f',
  plotter: '#009688',
  producao: '#58984E',
  rh: '#00BCD4',
  vendas: '#58984E',
  supervisao: '#ad3232',
  suporte: '#3b6f9c',
  compras: '#740001',
  concessionaria: '#6497b1',
  factoring: '#005b96',
  supervisao_tecnica: '#317873',
  logistica: '#317873',
};

export const NavigationStyles = StyleSheet.create({
  headerIcon: {
    color: 'white',
  },
  headerTitle: {
    color: 'white',
    textTransform: 'uppercase',
  },
  headerTitleButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: 'auto',
    right: 0,
  },
  headerLogo: {
    height: 50,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  header: (module) => {
    const index = module && typeof module === 'object' ? module.index : undefined;
    return {
      backgroundColor: index != null && headerColors[index]
        ? headerColors[index]
        : '#8BC34A',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      elevation: 4,
    };
  },
  searchInput: {
    color: '#fff',
    margin: 0,
    padding: 0,
  },
  searchContainer: {
    color: '#fff',
    margin: 0,
    padding: 0,
    height: 50,
  },
  searchInputContainer: {
    borderColor: '#fff',
    margin: 0,
    padding: 0,
  },
  searchLeftIconContainer: {
    color: '#fff',
    margin: 0,
    padding: 0,
  },
  searchButtonContainer: {
    width: 50,
    marginRight: 10,
  },
  headerRightView: {
    flexDirection: 'row',
  },
  menuButtonContainer: {
    width: 50,
    marginLeft: 5,
  },
});
