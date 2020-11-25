import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, PageHeader, Form, Select, Tabs } from 'ygd';
import LineTable from '../components/lineTable';
import styles from './qualificationReview.less';
const TabPane = Tabs.TabPane;

class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      status: null,
    };
  }
  handleReset = () => {
    this.props.childForm.resetFields();
  }
  handleSearch = () => {
    if (this.props.tableType === '1') {
      this.props.childForm.validateFields((err, values) => {
        if (!err) {
          let params = {
            groupName: values.groupName ? values.groupName : '',
            isDelete: values.status,
            pageNum: 1,
            pageSize: 20,
          };
          this.props.handleFormSearch({
            ...params,
          });
        }
      });
    } else {
      this.props.childForm.validateFields((err, values) => {
        if (!err) {
          let params = {
            groupName: values.groupName ? values.groupName : '',
            status: values.status,
            pageNum: 1,
            pageSize: 20,
          };
          this.props.handleFormSearch({
            ...params,
          });
        }
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.childForm;
    const { categoryGroupList } = this.props;
    const resultData = categoryGroupList.resultData ? categoryGroupList.resultData : [];
    return (
      <div className={styles.productionForm}>
        <Form layout="inline">
          <Form.Item label="类目组名称">
            {getFieldDecorator('groupName', {})(
              <Select style={{ width: 180 }} placeholder="请选择">
                {
                  resultData ? resultData.map((i, index) => (
                    <Select.Option value={i.groupName} key={i.categoryGroupId} >{i.groupName}</Select.Option>
                  )) : []
                }
              </Select>
            )}
          </Form.Item>
          {
            this.props.tableType === '1'
              ? <Form.Item label="状态">
                {getFieldDecorator('status', {
                  initialValue: this.state.status,
                })(
                  <Select style={{ width: 180 }}>
                    <Select.Option value={null}>全部</Select.Option>
                    <Select.Option value={0}>正常</Select.Option>
                    <Select.Option value={1}>注销</Select.Option>
                  </Select>
                )}
              </Form.Item>
              : <Form.Item label="状态">
                {getFieldDecorator('status', {
                  initialValue: this.state.status,
                })(
                  <Select style={{ width: 180 }}>
                    <Select.Option value={null}>全部</Select.Option>
                    <Select.Option value={1}>正常</Select.Option>
                    <Select.Option value={2}>注销</Select.Option>
                    <Select.Option value={0}>草稿</Select.Option>
                  </Select>
                )}
              </Form.Item>
          }

          <Form.Item label=" ">
            <Button type="primary" onClick={this.handleSearch}>搜索</Button>
            <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

@connect(({ qualificationReview, categoryGroup, loading }) => ({
  qualificationReviewList: qualificationReview.qualificationReviewList,
  factoryReviewList: qualificationReview.factoryReviewList,
  categoryGroupList: categoryGroup.categoryGroupList,
  tableloading: loading.effects['qualificationReview/productListPage'] || loading.effects['qualificationReview/getfactoryReviewList'],
}))

class qualificationReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableType: '1',
    };
  }
  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryGroup/getTableList',
      payload: {
        groupName: '',
        pageNum: 1,
        pageSize: 0,
      },
    });
    dispatch({
      type: 'qualificationReview/groupNameList',
    });
    dispatch({
      type: 'qualificationReview/productListPage',
      payload: {
        pageNum: 1,
        pageSize: 20,
      },
    });
  }
  handleFormSearch = (params) => {
    const { dispatch } = this.props;
    if (this.state.tableType === '1') {
      this.setState({
        groupName: params.groupName,
        status: params.isDelete,
      });
      dispatch({
        type: 'qualificationReview/productListPage',
        payload: params,
      });
    } else {
      this.setState({
        groupName: params.groupName,
        status: params.status,
      });
      dispatch({
        type: 'qualificationReview/getfactoryReviewList',
        payload: params,
      });
    }
  }

  Tabscallback=(key) => {
    this.setState({
      tableType: key,
    }, () => {
      const {form, dispatch} = this.props;
      if (this.state.tableType === '1') {
        form.resetFields();
        dispatch({
          type: 'qualificationReview/productListPage',
          payload: {
            pageNum: 1,
            pageSize: 20,
            groupName: '',
            status: '',
          },
        });
      } else {
        form.resetFields();
        dispatch({
          type: 'qualificationReview/getfactoryReviewList',
          payload: {
            pageNum: 1,
            pageSize: 20,
            groupName: '',
            status: '',
          },
        });
      }
    });
  }
  // 分页
  handleTablePageSearch=(page) => {
    const { dispatch } = this.props;
    const {groupName, status} = this.state;
    this.setState({
      page,
    });
    dispatch({
      type: 'qualificationReview/getfactoryReviewList',
      payload: {
        'groupName': groupName,
        'status': status,
        'pageSize': page.pageSize,
        'pageNum': page.pageNum,
        // tableType: this.state.tableType,
      },
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { categoryGroupList, qualificationReviewList, factoryReviewList, tableloading } = this.props;
    return (
      <div>
        <PageHeader title="资质审核标准" />
        <Card bordered={false}>
          <Tabs onChange={this.Tabscallback} animated={false}>
            <TabPane tab="生产经营资质" key="1">
              <FilterForm
                childForm={this.props.form}
                getFieldDecorator={getFieldDecorator}
                categoryGroupList={categoryGroupList}
                handleFormSearch={this.handleFormSearch}
                tableType={this.state.tableType}
              />
            </TabPane>
            <TabPane tab="验厂资质标准" key="2">
              <FilterForm
                childForm={this.props.form}
                getFieldDecorator={getFieldDecorator}
                categoryGroupList={categoryGroupList}
                handleFormSearch={this.handleFormSearch}
                tableType={this.state.tableType}
              />
            </TabPane>
          </Tabs>
          {
            this.state.tableType === '1'
              ? <LineTable onRef={(ref) => {this.child = ref;}} tableType={this.state.tableType} list={qualificationReviewList} tableloading={tableloading} handleTablePageSearch={this.handleTablePageSearch}/>
              : <LineTable onRef={(ref) => {this.child = ref;}} tableType={this.state.tableType} list={factoryReviewList} tableloading={tableloading} handleTablePageSearch={this.handleTablePageSearch}/>
          }
        </Card>
      </div>
    );
  }
}

export default Form.create()(qualificationReview);
