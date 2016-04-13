# React Native 实例 - 房产搜索App

> 欢迎Follow我的GitHub: https://github.com/SpikeKing

[React Native](http://facebook.github.io/react-native/docs/getting-started.html) 开发已经初见端倪, 可以完成最基本的功能. 通过开发一些简单的应用, 可以更加熟练的掌握 RN 的知识. 本文介绍非常简单的一款**房产搜索**的App, 通过调用公开的搜索服务, 把网络的数据展示在应用中. 通过代码更多的了解 RN 的特性.

![Logo](http://7xsdo5.com1.z0.glb.clouddn.com/160412-rn-property-image.png)

已经实现 iOS 版本, 仅供学习和参考, 可以直接运行, 但是 RN 变化较快, 可能不兼容. 关于在运行项目中可能出现的问题, 请[参考](http://www.wangchenlong.org/2016/04/11/1604/111-rn-open-project/).

主要内容:

1. 使用**Navigator**栈跳转页面.
2. 使用**fetch**请求网络数据.
3. 使用**ListView**展示列表数据.

本文源码的GitHub[下载地址](https://github.com/SpikeKing/WclPropertyFinder)

---

## 配置项目

初始化 React Native 的项目.

``` bash
react-native init WclPropertyFinder
```

修改 Android 的 Gradle 构建版本.

``` gradle
dependencies {
    classpath 'com.android.tools.build:gradle:1.2.3'
}
```

运行 iOS 和 Android 项目. 

> 调试: iOS 模拟机, ``Cmd + R`` 重新加载, ``Cmd + D`` 模拟晃动; Android, 晃动手机. 

修改``index.ios.js``的内容, 设置启动模块. 使用**NavigatorIOS**加载组件搜索页**SearchPage**. 

``` js
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
```

注册组件**WclPropertyFinderApp**至应用**WclPropertyFinder**.

```js
React.AppRegistry.registerComponent('WclPropertyFinder', () => WclPropertyFinderApp);
```

---

## 首页搜索

**搜索页(SearchPage)**包含一个搜索库, 可以使用地址或邮编搜索英国的房产信息.

通过输入框的参数创建网络请求URL, 并把请求发送出去, 获取信息.

``` js
function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };

  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
  return 'http://api.nestoria.co.uk/api?' + querystring;
}
```

在获取网络请求URL后, 使用**fetch**函数获取数据. 

``` js
  _executeQuery(query) {
    console.log(query);
    this.setState({isLoading: true});

    // 网络请求
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error
      }));
  }
```

处理返回的Json数据, 使用**Navigator**跳转到搜索结果**SearchResults**页面.


``` js
  _handleResponse(response) {
    this.setState({isLoading: false, message: ''});
    if (response.application_response_code.substr(0, 1) === '1') {
      console.log('Properties found: ' + response.listings.length);

      // 使用listings调用结果页面SearchResults
      this.props.navigator.push({
        title: '搜索结果',
        component: SearchResults,
        passProps: {listings: response.listings}
      });
    } else {
      this.setState({message: 'Location not recognized; please try again.'});
    }
  }
```

---

## 搜索结果

把获取的房产信息, 逐行渲染并显示于**ListView**中.

``` js
  renderRow(rowData, sectionID, rowID) {
    var price = rowData.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight
        onPress={()=>this.rowPressed(rowData.guid)}
        underlayColor='#dddddd'>
		 // 布局...
      </TouchableHighlight>
    );
  }
```

ListView设置数据源**dataSource**, 每行渲染**renderRow**.

``` js
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        />
    );
  }
```

点击ListView的行, 可以跳转至**房产信息**页面.

``` js
  rowPressed(propertyGuid) {
    var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];
    this.props.navigator.push({
      title: '房产信息',
      component: PropertyView,
      passProps: {property: property}
    });
  }
```

---

## 房产信息

房产信息是单纯显示页面, 显示图片和文字内容.

``` js
class PropertyView extends Component {
  render() {
    var property = this.props.property; // 由SearchResult传递的搜索结果
    var stats = property.bedroom_number + ' bed ' + property.property_type;
    if (property.bathroom_number) {
      stats += ', ' + property.bathroom_number + ' ' +
        (property.bathroom_number > 1 ? 'bathrooms' : 'bathroom');
    }

    var price = property.price_formatted.split(' ')[0];

    return (
       // 布局...
    );
  }
}
```

最终效果

![动画](http://7xsdo5.com1.z0.glb.clouddn.com/160412-rn-property-anim.gif)
 
---

使用 RN 开发应用非常快捷, 复用逻辑到多个平台, 节省开发成本, 不过目前正在完善中.

> 本文参考我的朋友Tom的一篇[文章](https://www.raywenderlich.com/u/tomelliott). 

OK, that's all! Enjoy it!
