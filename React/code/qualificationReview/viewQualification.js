import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeader, Table, Card, Form, Select } from 'ygd';

@connect(({ qualificationReview }) => ({
  qualificationReview,
}))

class viewQualification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThree: true,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { categoryGroupId, operationsStandardId } = this.props.location.query;

    dispatch({
      type: 'qualificationReview/getPlatformItemList',
      payload: {
        operationsStandardId,
      },
    });
    // dispatch({
    //     type: 'qualificationReview/getGroupListForOperationStandard',
    //     payload: {
    //         groupName,
    //     },
    // });
    dispatch({
      type: 'qualificationReview/getCategoryGroup',
      payload: {
        categoryGroupId,
      },
    });
  }
  showMoreAxis =() => { // 显示更多
    this.setState({showThree: !this.state.showThree});
  };
  render () {
    const columns = [{
      title: '资料项名称',
      dataIndex: 'projectName',
    }, {
      title: '资料项编码',
      dataIndex: 'itemCode',
      align: 'center',
    }, {
      title: '是否有效期',
      dataIndex: 'requiredValidDate',
      align: 'center',
    }, {
      title: '资质级别',
      dataIndex: 'certType',
      render: (text) => text === 1 ? '企业级' : '类目级',
      align: 'center',
    }, {
      title: '最新编辑时间',
      dataIndex: 'updateTime',
      align: 'center',
    }, {
      title: '创建人',
      dataIndex: 'createName',
      align: 'center',
    }];
    const { groupName } = this.props.location.query;
    const { platformItemDetailList, categoryDetailList } = this.props.qualificationReview;
    let topThree = [];
    console.log(categoryDetailList, 'categoryDetailList');
    if (categoryDetailList && categoryDetailList.categoryVOS && categoryDetailList.categoryVOS.length > 3 && this.state.showThree) {
      topThree = categoryDetailList.categoryVOS.slice(0, 3);
    } else if (categoryDetailList && categoryDetailList.categoryVOS) {
      topThree = categoryDetailList.categoryVOS;
    } else {
      topThree = [];
    }
    return (
      <div>
        <PageHeader title="查看生产经营资质" />
        <Card bordered={false} style={{marginBottom: 10}}>
          <Form>
            <Form.Item label="选择类目组">
              <Select
                placeholder="请选择"
                defaultValue={groupName}
              >
                <Select.Option disabled value={groupName}>{groupName}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="包含类目数">
              <span>{categoryDetailList && categoryDetailList.categoryNum}</span>
            </Form.Item>
            <Form.Item label="类目名称">
              {
                topThree && topThree.length === 0 ? '--' : topThree && topThree.map((item) => (
                  <p key={item.categoryId}>{item.categoryName}</p>
                ))
              }
            </Form.Item>
            {
              categoryDetailList && categoryDetailList.categoryVOS && categoryDetailList.categoryVOS.length > 3
                ? <div onClick={this.showMoreAxis} style={{position: 'absolute', bottom: 38, right: 10, color: '#476AC6', cursor: 'pointer'}}>{this.state.showThree === true ? '展开>>' : '收起<<'}</div> : ''
            }
          </Form>
        </Card>
        <Card bordered={false}>
          <Table
            dataSource={platformItemDetailList ? platformItemDetailList.resultData : []}
            columns={columns}
            rowKey={(record) => record.platformInformationItemId}
            pagination={false}
          />
        </Card>
      </div>
    );
  }
}

export default viewQualification;
