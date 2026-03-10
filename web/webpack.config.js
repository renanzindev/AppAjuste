const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(appDirectory, 'index.js'),
    path.resolve(appDirectory, 'App.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
    path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
    path.resolve(appDirectory, 'node_modules/react-native-screens'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/@rneui'),
    path.resolve(appDirectory, 'node_modules/apisauce'),
    path.resolve(appDirectory, 'node_modules/@react-native-async-storage'),
    path.resolve(appDirectory, 'node_modules/@react-native-picker'),
    path.resolve(appDirectory, 'node_modules/dayjs'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      plugins: [
        ['module-resolver', {
          alias: {
            'react-native$': 'react-native-web',
            'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/dist/MaterialIcons',
            'react-native-vector-icons/MaterialCommunityIcons': 'react-native-vector-icons/dist/MaterialCommunityIcons',
          },
        }],
        'react-native-reanimated/plugin',
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

const ttfLoaderConfiguration = {
  test: /\.ttf$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        name: '[name].[ext]',
      },
    },
  ],
  include: path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
};

module.exports = {
  entry: path.join(__dirname, 'index.web.js'),
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      ttfLoaderConfiguration,
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};
