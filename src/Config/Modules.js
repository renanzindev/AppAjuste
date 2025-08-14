export const appModules = [5, 16];
export const appModulesTabs = {
  producao: [
    {
      icon: 'home',
      iconType: 'material',
      title: 'INÍCIO',
      route: 'HomeView',
    },
    // {
    //   icon: 'cart',
    //   iconType: 'material-community',
    //   title: 'REQUISITAR',
    //   route: 'RequestProductsView',
    // },
    {
      icon: 'calendar-today',
      iconType: 'material',
      title: 'PCP',
      route: 'PcpView',
    },
    {
      icon: 'tag-multiple',
      iconType: 'material-community',
      title: 'FECHAR SERV.',
      route: 'CloseServiceView',
    },
  ],
  logistica: [
    {
      icon: 'home',
      iconType: 'material',
      title: 'INÍCIOs',
      route: 'HomeView',
    },
    {
      icon: 'barcode-scan',
      iconType: 'material-community',
      title: 'RETIRADA LOTE',
      route: 'ConfirmCheckoutView',
    },
    {
      icon: 'truck-delivery',
      iconType: 'material-community',
      title: 'EM TRÂNSITO',
      route: 'PendingDeliveriesView',
    }
  ],
};
