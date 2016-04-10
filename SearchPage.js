/**
 * Created by wangchenlong on 16/4/8.
 */

'use strict';

var React = require('react-native');

// 用于去掉React的前缀, 不用写React.Text, 直接写Text
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  } = React;

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

class SearchPage extends Component {
  // 构造器
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'London',
      isLoading: false
    };
  }

  // 搜索文本改变, 状态的搜索词改变
  onSearchTextChanged(event) {
    //console.log('onSearchTextChanged');
    this.setState({searchString: event.nativeEvent.text});
    console.log(this.state.searchString);
  }

  // 执行查询, 下划线表示私有
  _executeQuery(query) {
    console.log(query);
    this.setState({isLoading: true});
  }

  // 点击查询
  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  // 渲染
  render() {
    //console.log('SearchPage.render');
    var spinner = this.state.isLoading ?
      (<ActivityIndicatorIOS size='large'/>) : (<View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)} // bind确保使用组件的实例
            placeholder='Search via name or postcode'/>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#99d9f4'
            onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={styles.button}
          underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>
            Location
          </Text>
        </TouchableHighlight>
        <Image source={require('./resources/house.png')}
               style={styles.image}/>
        {spinner}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center' // 子元素居中
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1, // 比例
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4, // 比例
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

module.exports = SearchPage;