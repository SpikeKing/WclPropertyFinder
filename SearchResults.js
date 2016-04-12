/**
 * 搜索的结果页面
 *
 * Created by wangchenlong on 16/4/11.
 */

'use strict';

var React = require('react-native');

// 详细明细
var PropertyView = require('./PropertyView');

var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
  } = React;

/**
 * 搜索结果组件
 * props的listings参数, 在调用时传递.
 */
class SearchResults extends Component {

  /**
   * 构造器, 通过Navigator调用传递参数(passProps)
   * @param props 状态属性
   */
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid}
    );
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
  }

  /**
   * 点击每行, 通过行数选择信息
   * @param propertyGuid 行ID
   */
  rowPressed(propertyGuid) {
    var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];

    this.props.navigator.push({
      title: '房产信息',
      component: PropertyView,
      passProps: {property: property}
    });
  }

  /**
   * 渲染列表视图的每一行
   * @param rowData 行数据
   * @param sectionID 块ID
   * @param rowID 行ID
   * @returns {XML} 页面
   */
  renderRow(rowData, sectionID, rowID) {
    var price = rowData.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight
        onPress={()=>this.rowPressed(rowData.guid)}
        underlayColor='#dddddd'>
        <View style={styles.rowContainer}>
          <Image style={styles.thumb} source={{uri:rowData.img_url}}/>
          <View style={styles.textContainer}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.title} numberOfLines={1}>
              {rowData.title}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * 渲染, 每行使用renderRow渲染
   * @returns {XML} 结果页面的布局
   */
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        />
    );
  }
}

// 样式
var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
    color: '#48BBEC'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

module.exports = SearchResults;
