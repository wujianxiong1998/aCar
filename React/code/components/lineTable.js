import React, { Component } from 'react';
import router from 'umi/router';
import { Table, Button, Popconfirm, Message } from 'ygd';
import styles from './lineTable.less';
import DetailModal from './detailModal';
import { connect } from 'dva';

@connect(({qualificationReview}) => ({
  qualificationReview,
}))

class LineTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      tableloading: false,
      pageNum: 1,
      total: '',
      pages: '',
      pageSize: 20,
      viewDetailModal: false,
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list.resultData,
      tableloading: nextProps.tableloading,
      // status: nextProps.status,
      pageNum: nextProps.list.pageNum,
      total: nextProps.list.total,
      pages: nextProps.list.pages,
      pageSize: nextProps.list.pageSize,
    });
  }
  // 回调函数，切换下一页
  changePage = (current) => {
    const { handleTablePageSearch } = this.props;
    const page = {
      pageNum: current,
      pageSize: this.state.pageSize,
    };
    handleTablePageSearch(page);
  }
  // 查看验厂详情
  detail = (record) => {
    console.log(record, 'record');
    this.setState({
      viewDetailModal: true,
    });
    // const { dispatch } = this.props;
    // let factoryEvaluationItemId = '';
    // record.factoryEvaluationGroups.map((item) => item.factoryEvaluationItemDTOS.map((cItem) => factoryEvaluationItemId = cItem.factoryEvaluationItemId));
    // dispatch({
    //   type: 'qualificationReview/getFactoryDetail',
    //   payload: {
    //     factoryEvaluationItemId: factoryEvaluationItemId,
    //   },
    // });
    router.push(`/platformCertificationStandards/qualificationReview/viewFactoryDetail?factoryEvaluationStandardId=${record.factoryEvaluationStandardId}`);
  }
  deleteQualification = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'qualificationReview/qualityCancel',
      payload: {
        operationsStandardId: record.operationsStandardId,
        isDelete: record.isDelete === 0 ? 1 : 0,
      },
    }).then((res) => {
      dispatch({
        type: 'qualificationReview/productListPage',
        payload: {
          pageNum: 1,
          pageSize: 20,
        },
      });
    });
  }
  deleteFactory = (record) => {
    const { dispatch } = this.props;
    if (record.status === 1 || record.status === 0) {
      dispatch({
        type: 'qualificationReview/factoryCancel',
        payload: {
          factoryEvaluationStandardId: record.factoryEvaluationStandardId,
        },
      }).then((res) => {
        if (res.retCode === '0000000') {
          const { dispatch } = this.props;
          dispatch({
            type: 'qualificationReview/getfactoryReviewList',
            payload: {
              pageNum: 1,
              pageSize: 20,
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'qualificationReview/factoryRecover',
        payload: {
          factoryEvaluationStandardId: record.factoryEvaluationStandardId,
        },
      }).then((res) => {
        if (res.retCode === '0000000') {
          const { dispatch } = this.props;
          dispatch({
            type: 'qualificationReview/getfactoryReviewList',
            payload: {
              pageNum: 1,
              pageSize: 20,
            },
          });
        }
      });
    }

  }
  viewDetailModalCancel = () => {
    this.setState({
      viewDetailModal: false,
    });
  }
  handleEditFactory = (record) => {
    if (record.status === 2) {
      return;
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'qualificationReview/checkCanEdit',
        payload: {
          factoryEvaluationStandardId: record.factoryEvaluationStandardId,
        },
      }).then((res) => {
        if (res === true) {
          router.push(`/platformCertificationStandards/qualificationReview/addOrEditFactory?factoryEvaluationStandardId=${record.factoryEvaluationStandardId}`);
        } else {
          Message.info('请先编辑草稿');
        }
      });
    }
  }
  render() {
    const { list, tableloading, pageNum, pageSize, total } = this.state;
    const { tableType } = this.props;
    const columns = [
      {title: '类目组', dataIndex: 'groupName'},
      {title: '资质数量', dataIndex: 'itemCount', algin: 'center'},
      {title: '最后一次编辑时间', dataIndex: 'updateTime', algin: 'center'},
      {title: '状态', dataIndex: 'isDelete', render: (text) => text === 1 ? '已注销' : '正常', algin: 'center'},
      {title: '操作', dataIndex: 'option', algin: 'center', render: (text, record) => (
        <div>
          <span style={{ color: '#1E7BE2', cursor: 'pointer', marginRight: 10 }} onClick={() => router.push(`/platformCertificationStandards/qualificationReview/viewQualification?categoryGroupId=${record.categoryGroupId}&operationsStandardId=${record.operationsStandardId}&groupName=${record.groupName}`)}>查看</span>
          <span style={{ color: '#1E7BE2', cursor: 'pointer', marginRight: 10 }} onClick={() => router.push(`/platformCertificationStandards/qualificationReview/addOrEditQualification?groupName=${record.groupName}&operationsStandardId=${record.operationsStandardId}&categoryGroupId=${record.categoryGroupId}`)}>编辑</span>
          <Popconfirm title="确定要删除这行内容吗?" okText="确定" cancelText="取消" onConfirm={() => this.deleteQualification(record)}>
            <Button type="link" className={styles.tableBtn}>{record.isDelete === 1 ? '恢复' : '注销'}</Button>
          </Popconfirm>
        </div>
      )},
    ];
    const columns1 = [
      {title: '类目组', dataIndex: 'groupName'},
      {title: '资质满分', dataIndex: 'totalMark', align: 'center'},
      {title: '最低得分', dataIndex: 'lowestMark', align: 'center'},
      {title: '是否需要视频验厂', dataIndex: 'videoEvaluation', render: (text) => text === 0 ? '是' : '否', align: 'center'},
      {title: '最后一次编辑时间', dataIndex: 'updateTime', align: 'center'},
      {title: '状态', dataIndex: 'status', render: (text) => text === 1 ? '正常' : text === 2 || text === 4 ? '已注销' : text === 0 ? '草稿' : '', align: 'center'},
      {title: '操作', dataIndex: 'option', align: 'center', render: (text, record) => (
        <div>
          <span style={{ color: '#1E7BE2', cursor: 'pointer', marginRight: 10 }} onClick={() => this.detail(record)}>查看</span>
          <span style={record.status === 2 || record.status === 4 || record.statusId === '正常' ? {color: '#ccc', marginRight: 10} : { color: '#1E7BE2', cursor: 'pointer', marginRight: 10 }} onClick={() => this.handleEditFactory(record)}>编辑</span>
          <Popconfirm title="确定要删除这行内容吗?" okText="确定" cancelText="取消" onConfirm={() => this.deleteFactory(record)}>
            <Button type="link" className={styles.tableBtn}>{record.status === 1 ? '注销' : record.status === 0 ? '注销' : '恢复'}</Button>
          </Popconfirm>
        </div>
      )},
    ];
    // 表格分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `总共${total}条`,
      pageSize: pageSize,
      total: total,
      pageNum: pageNum,
      page: pageNum,
      hideOnSinglePage: !(total > 10),
      onChange: (current) => this.changePage(current),
    };
    return (
      <div className={styles.LineTable}>
        {
          tableType === '1'
            ? <Button type="primary" className={styles.btn} onClick={() => router.push('/platformCertificationStandards/QualificationReview/addOrEditQualification')}>新增生产经营资质</Button> : <Button type="primary" className={styles.btn} onClick={() => router.push('/platformCertificationStandards/QualificationReview/addOrEditFactory')}>新增验厂标准</Button>
        }
        <Table
          columns={tableType === '1' ? columns : columns1}
          dataSource={list}
          rowKey={(record) => tableType === '1' ? record.categoryGroupId : record.factoryEvaluationStandardId}
          loading={tableloading}
          pagination={paginationProps}
        />
        <DetailModal viewDetailModal={this.state.viewDetailModal} viewDetailModalCancel={this.viewDetailModalCancel}></DetailModal>
      </div>
    );
  }
}
export default LineTable;
