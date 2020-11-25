import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Button, Radio, Modal, PageHeader, Popconfirm, Card, Form, Select, Input, Message } from 'ygd';
import styles from './addOrEditQualification.less';
const { TextArea } = Input;

@connect(({ qualificationReview }) => ({
  qualificationReview,
}))

class addOrEditQualification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      categoryId: '',
      isRequired: 1,
      reason: '',
      isDelArr: [],
      addList: [],
      saveArr: [],
      categoryGroupId: '',
      platformInformationGroupId: '',
      platformInformationItemId: '',
      arr1: [],
      showThree: true,
      projectName: '',
      groupName: '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { operationsStandardId, categoryGroupId } = this.props.location.query;
    if (operationsStandardId) {// 编辑
      dispatch({
        type: 'qualificationReview/getCategoryGroup',
        payload: {
          categoryGroupId: categoryGroupId,
          pageNum: '',
          pageSize: '',
        },
      });
      dispatch({
        type: 'qualificationReview/getPlatformItemList',
        payload: {
          operationsStandardId: operationsStandardId,
          pageNum: 1,
          pageSize: 10,
        },
        callback: (res) => {
          let addlist = res.resultData.map((item) => ({
            ...item,
            operType: 3,
          }));
          this.setState({
            addList: addlist,
          }, () => {
            console.log(this.state.addList);
          });
        },
      });
    } else {// 新增
      dispatch({
        type: 'qualificationReview/getCategoryGrouparr',
      });
      dispatch({
        type: 'qualificationReview/getGroupListForOperationStandard',
        payload: {
        },
      });
    }
  }
  // 字数限制
  TextAreaChange = (e) => {
    let reason = e.target.value;
    this.setState({
      reason,
    });
  }
  handleRemove = (id, index) => {
    if (id) {
      const { addList } = this.state;
      let arr1 = addList.filter((item) => item.id !== id);
      let arr = addList.filter((item) => item.id === id);
      arr.forEach((item) => {
        item.operType = 0;
      });
      this.setState({
        addList: arr1, // 页面展示的数据
        isDelArr: this.state.isDelArr.concat(arr), // 已删除的数据
      }, () => {
        console.log(this.state.isDelArr);
      });
    } else {
      let arr = this.state.addList;
      arr.splice(index, 1);
      let arr1 = this.state.saveArr;
      arr1.splice(index, 1);
      this.setState({
        addList: arr,
        saveArr: arr1,
      });
    }
  }
  addQuality = (e) => {
    e.preventDefault();
    this.props.form.resetFields(['groupName', 'qulityName']);
    const that = this;
    this.props.form.validateFieldsAndScroll(['Group', 'qulityName'], (err, values) => {
      if (!err) {
        const { dispatch } = that.props;
        that.setState({
          addVisible: true,
        });
        dispatch({
          type: 'qualificationReview/getTableList',
          payload: {},
        });
      }
    });
  }
   // 提交
   formSubmit = () => {
     const { dispatch } = this.props;
     const { operationsStandardId } = this.props.location.query;
     let addParams = {
       categoryGroupId: this.state.categoryId,
       channelId: '0',
       itemRealList: this.state.saveArr,
     };
     let arrTemp = this.state.saveArr.concat(this.state.isDelArr);
     let itemRealList = arrTemp.map((item) => ({
       operType: item.operType,
       id: item.id,
       platformInformationItemId: item.platformInformationItemId,
       dataDescription: item.dataDescription,
       required: item.required,
     }));
     let editParams = {
       operationsStandardId,
       itemRealList: itemRealList,
     };
     if (operationsStandardId) {// 编辑
       this.props.form.validateFieldsAndScroll(['Group'], (err, values) => {
         if (!err) {
           dispatch({
             type: 'qualificationReview/updateOperation',
             payload: editParams,
           });
         }
       });
     } else {
       this.props.form.validateFieldsAndScroll(['Group'], (err, values) => {
         if (!err) {
           dispatch({
             type: 'qualificationReview/insertOperation',
             payload: addParams,
           });
         }
       });
     }
   }
  // 确认添加
  handleOk = (e) => {
    e.preventDefault();
    const { operationsStandardId } = this.props.location.query;
    const { detailList } = this.props.qualificationReview;
    const { addList } = this.state;
    this.props.form.validateFieldsAndScroll(['qulityName', 'reason', 'isRequired'], (err, values) => {
      if (!err) {
        if (operationsStandardId) {
          let arr = [];
          detailList && detailList.resultData && detailList.resultData.forEach((item) => {
            if (item.platformInformationItemId === values.qulityName) {
              item.operType = 1;
              item.required = values.isRequired;
              item.dataDescription = values.reason ? values.reason : '';
              arr.push(item);
            }
          });
          let isHave = this.state.addList.filter((item, index) => values.qulityName === item.platformInformationItemId);
          if (isHave.length) {
            Message.warn('不能重复添加');
          } else {
            let save = [];
            save.push({platformInformationItemId: values.qulityName, dataDescription: values.reason ? values.reason : '', required: values.isRequired, operType: 1 });
            const array = arr.concat(addList);
            const array1 = save.concat(addList);
            this.setState({
              addVisible: false,
              addList: array,
              saveArr: array1,
            });
          }

        } else {
          let arr = [];
          detailList.resultData.forEach((item) => {
            if (item.platformInformationItemId === values.qulityName) {
              item.operType = 1;
              arr.push(item);
            }
          });
          let isHave = this.state.addList.filter((item, index) => values.qulityName === item.platformInformationItemId);
          if (isHave.length) {
            Message.warn('不能重复添加');
          } else {
            let arr1 = arr.concat(this.state.addList);
            let save = [];
            save.push({platformInformationItemId: this.state.platformInformationItemId, dataDescription: values.reason ? values.reason : '', required: values.isRequired});
            let savearr1 = save.concat(this.state.saveArr);
            this.setState({
              addList: arr1,
              addVisible: false,
              saveArr: savearr1,
            }, () => {
              const { dispatch } = this.props;
              dispatch({
                type: 'qualificationReview/restDetailList',
              });
            });
          }
        }
      }
    });
    this.props.form.resetFields(['groupName', 'qulityName', 'isRequired', 'reason']);
  }

  handleCancel = (e) => {
    this.props.form.resetFields(['groupName', 'qulityName', 'isRequired', 'reason']);
    this.setState({
      addVisible: false,
    }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'qualificationReview/restDetailList',
      });
    });
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  formCancel = () => {
    this.props.form.resetFields();
    router.goBack();
  }

  handleonChangeNameID = (e) => {
    const { dispatch } = this.props;
    this.setState({
      categoryId: e,
    });
    dispatch({
      type: 'qualificationReview/getCategoryGroup',
      payload: {
        categoryGroupId: e,
        pageNum: '',
        pageSize: '',
      },
    });
  }
  handleChangeGroupNameId = (e) => {
    const { dispatch } = this.props;
    this.setState({
      platformInformationGroupId: e,
    }, () => {
      dispatch({
        type: 'qualificationReview/getDetailList',
        payload: {
          platformInformationGroupId: this.state.platformInformationGroupId.toString(),
          pageSize: '0',
          pageNum: '1',
        },
      });
    });
  }
  handleChangeProjectNameId = (e) => {
    this.setState({
      platformInformationItemId: e,
    }, () => {
      console.log(this.state.platformInformationItemId, 'platformInformationItemId');
    });
  }
  showMoreAxis =() => { // 显示更多
    this.setState({showThree: !this.state.showThree});
  };
  // 改变table页码
  hadlePageNumChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const { operationsStandardId } = this.props.location.query;
    dispatch({
      type: 'qualificationReview/getPlatformItemList',
      payload: {
        operationsStandardId: operationsStandardId,
        pageNum: page,
        pageSize: pageSize,
      },
      callback: (res) => {
        this.setState({
          addList: res.resultData,
        });
      },
    });
  }
    // 改变table数据条数
    hadlePageSizeChange = (current, size) => {
      const { dispatch } = this.props;
      const { operationsStandardId } = this.props.location.query;
      dispatch({
        type: 'qualificationReview/getPlatformItemList',
        payload: {
          operationsStandardId: operationsStandardId,
          pageNum: current,
          pageSize: size,
        },
        callback: (res) => {
          this.setState({
            addList: res.resultData,
          });
        },
      });
    }
    componentWillUnmount = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'qualificationReview/getCategoryGrouparr',
      });
    }
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
        render: (text) => text === 1 ? '是' : text === 0 ? '否' : '',
      }, {
        title: '资质级别',
        dataIndex: 'certType',
        align: 'center',
        render: (text) => text === 1 ? '企业级' : text === 2 ? '类目级' : '',
      }, {
        title: '最新编辑时间',
        dataIndex: 'updateTime',
        align: 'center',
      }, {
        title: '创建人',
        dataIndex: 'createName',
        align: 'center',
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record, index) => (
          <div>
            <Popconfirm title="是否确认将该资料从当前列表中移除" onConfirm={() => this.handleRemove(record.id, index)} okText="确定" cancelText="取消">
              <Button type="link" style={{ color: '#476AC6', cursor: 'pointer' }}>移除</Button>
            </Popconfirm>
          </div>
        ),
      }];
      const { operationsStandardId } = this.props.location.query;
      const { getFieldDecorator } = this.props.form;
      const { groupListForOperationStandardArr, categoryDetailList, qualificationGroupList, detailList } = this.props.qualificationReview;
      const { addList } = this.state;
      let topThree = [];
      if (categoryDetailList && categoryDetailList.categoryVOS && categoryDetailList.categoryVOS.length > 3 && this.state.showThree) {
        topThree = categoryDetailList.categoryVOS.slice(0, 3);
      } else if (categoryDetailList && categoryDetailList.categoryVOS) {
        topThree = categoryDetailList.categoryVOS;
      } else {
        topThree = [];
      }
      return (
        <div>
          <PageHeader title={operationsStandardId ? '编辑生产经营资质' : '新增生产经营资质'} />
          <Card bordered={false} style={{marginBottom: 10}}>
            {
              operationsStandardId ? (
                <Form className={styles.categoryForm} onSubmit={this.formSubmit}>
                  <Form.Item label="类目组名称">
                    {categoryDetailList && categoryDetailList.groupName}
                  </Form.Item>
                  <Form.Item label="包含类目">
                    {
                      topThree && topThree.map((item) => (
                        <p key={item.categoryId}>{item.categoryName}</p>
                      ))
                    }
                  </Form.Item>
                  {
                    categoryDetailList && categoryDetailList.categoryVOS && categoryDetailList.categoryVOS.length > 3
                      ? <div onClick={this.showMoreAxis} style={{position: 'absolute', bottom: 38, right: 10, color: '#476AC6'}}>{this.state.showThree === true ? '展开>>' : '收起<<'}</div> : ''
                  }
                </Form>
              ) : (
                <Form className={styles.categoryForm} onSubmit={this.addQuality}>
                  <Form.Item label="选择类目组">
                    {
                      getFieldDecorator('Group', {
                        rules: [{required: true, message: '请选择类目组'}],
                        initialValue: this.state.groupName,
                      })(
                        <Select
                          placeholder="请选择"
                          onChange={this.handleonChangeNameID}
                        >
                          {
                            groupListForOperationStandardArr ? groupListForOperationStandardArr.map((i, index) => (
                              <Select.Option value={i.categoryGroupId} key={i.categoryGroupId} >{i.groupName}</Select.Option>
                            )) : []
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                  <Form.Item label="包含类目数">
                    <span>{categoryDetailList && categoryDetailList.categoryNum ? categoryDetailList.categoryNum : '--'}</span>
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
                      ? <div onClick={this.showMoreAxis} style={{position: 'absolute', bottom: 38, right: 10, color: '#476AC6'}}>{this.state.showThree === true ? '展开>>' : '收起<<'}</div> : ''
                  }
                </Form>
              )
            }
          </Card>
          <Card bordered={false}>
            <Button onClick={this.addQuality} type="primary" style={{marginBottom: 10}}>添加生产经营资质</Button>
            <Table
              dataSource={addList ? addList : []}
              columns={columns}
              rowKey={(record) => record.platformInformationItemId}
              pagination={{ // 分页
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总共 ${total} 条记录`,
                total: addList.total,
                current: addList.pageNum,
                pageSize: addList.pageSize,
                hideOnSinglePage: !(addList.total > 10),
                onChange: this.hadlePageNumChange,
                onShowSizeChange: this.hadlePageSizeChange,
              }}
            />
          </Card>
          <Modal
            title="添加生产经营资质"
            visible={this.state.addVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form className={styles.addForm} onSubmit={this.handleOk}>
              <Form.Item label="资质分组名称">
                {
                  getFieldDecorator('groupName', {
                  })(
                    <Select onChange={this.handleChangeGroupNameId}>
                      {
                        qualificationGroupList && qualificationGroupList.resultData ? qualificationGroupList.resultData.map((i, index) => (
                          <Select.Option value={i.platformInformationGroupId} key={i.platformInformationGroupId} >{i.groupName}</Select.Option>
                        )) : []
                      }
                    </Select>
                  )
                }
              </Form.Item>
              <Form.Item label="资质名称">
                {getFieldDecorator('qulityName', {
                  rules: [{ required: !!this.state.addVisible, message: '请选择资质名称' }],
                  initialValue: this.state.projectName,
                })(
                  <Select
                    showSearch
                    placeholder="请选择，支持搜索"
                    onChange={this.handleChangeProjectNameId}>
                    {
                      detailList && detailList.resultData ? detailList.resultData.map((i, index) => (
                        <Select.Option value={i.platformInformationItemId} key={i.platformInformationItemId} >{i.projectName}</Select.Option>
                      )) : []
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="是否必填">
                {
                  getFieldDecorator('isRequired', {
                    initialValue: this.state.isRequired,
                  })(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )
                }

              </Form.Item>
              <Form.Item label="资料说明">
                {
                  getFieldDecorator('reason')(
                    <TextArea
                      placeholder="最多输入30个字"
                      maxLength={30}
                      onChange={this.TextAreaChange}
                    />
                  )
                }
              </Form.Item>
            </Form>
          </Modal>
          <div className={styles.formBtn}>
            <Button onClick={this.formCancel} className={styles.m20}>取消</Button>
            <Button type="primary" onClick={this.formSubmit}>提交</Button>
          </div>
        </div>
      );
    }
}

export default Form.create()(addOrEditQualification);
