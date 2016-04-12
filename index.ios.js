/**
 * React Native App - 搜索房产应用
 * https://github.com/facebook/react-native
 */

'use strict';

var React = require('react-native');

// 搜索页面
var SearchPage = require('./SearchPage')

// 使用Navigator管理组件, 注意: 不要纠结于跨平台, 学习为主
class WclPropertyFinderApp extends React.Component {
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: '搜房产',
          component: SearchPage,
        }}/>
    );
  }
}

// 样式
var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

// 注册组件
React.AppRegistry.registerComponent('WclPropertyFinder', () => WclPropertyFinderApp);
