import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Button, Radio, Modal, PageHeader, Popconfirm, Card, Form, Select, Input, Checkbox, InputNumber, message, Message } from 'ygd';
import DetailModal from '../components/detailModal';
import styles from './addOrEditFactory.less';
import moment from 'moment';
const CheckboxGroup = Checkbox.Group;

@connect(({qualificationReview, loading, user}) => ({
  qualificationReview,
  user,
  istableLoading: loading.effects['qualificationReview/getFactoryTable'],
}))

class addOrEditFactory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addGroupVisible: false,
      addVisible: false,
      batchSetVisible: false,
      viewDetailModal: false,
      required: 0,
      attachMaxNum: 1,
      mark: '',
      groupName: '',
      grouparrName: '',
      projectName: '',
      factoryEvaluationGroupId: '',
      platformInformationGroupId: '',
      platformInformationItemId: '',
      factoryTable: [], // 页面显示的数组
      categoryGroupId: '',
      lowestMark: '',
      importantFieldsMap: [],
      importantFields: '',
      categoryGroupVO: {},
      showThree: true,
      batchGroupName: '',
      batchMark: '',
      batchMax: 1,
      batchrequired: 0,
      currentObj: {},
      arrtemp: [],
      disabled: false,
      batchIndex: 0,
      factoryIndex: 0,
      // childrenIndex: 0,
      submissionRequire: '',
      evaluationStandard: '',
      dataDescription: '',
      factoryEvaluationItemId: '', // 控制是编辑资质还是添加资质
      parentKey: '',
      objtemp: {},
      operateType: '',
      factoryEvaluationStandardId: '',
      parent: '',
      videoEvaluation: false,
      ischecked: false,
      checkedList: [],
      time: '',
      oldObj: {},
      groupOprateType: '',
      // qualificationGroupList:[],
      // flag: '',
      newParent: '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { factoryEvaluationStandardId } = this.props.location.query;
    // let times = new Date(+new Date() + 8 * 3600 * 1000).toISOString()
    //   .replace(/T/g, '')
    //   .replace(/\.[\d]{3}Z/, '');
    let times = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      time: times,
    }, console.log(this.state.time, 'df'));
    if (factoryEvaluationStandardId) {
      dispatch({
        type: 'qualificationReview/getFactoryTable',
        payload: {
          factoryEvaluationStandardId: factoryEvaluationStandardId,
        },
        callback: ((res) => {
          if (res) {
            res.pageFactoryEvaluationGroups.resultData = res.pageFactoryEvaluationGroups.resultData.map((item) => ({
              ...item,
              parent: 'parent',
              key: item.factoryEvaluationGroupId,
              children: item.factoryEvaluationItemDTOS.map((cItem) => ({
                ...cItem,
                key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                childerKey: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                parentMemberId: item.factoryEvaluationGroupId,
              })),
            }));
            this.setState({
              factoryEvaluationStandardId,
              factoryTable: res.pageFactoryEvaluationGroups.resultData,
              arrtemp: res.pageFactoryEvaluationGroups.resultData,
              categoryGroupVO: res.categoryGroupVO,
              videoEvaluation: res.videoEvaluation !== 1,
              lowestMark: res.lowestMark,
              categoryGroupId: res.categoryGroupId,
            }, () => {
              console.log(this.state.factoryTable, 'dksjf');
            });
          }
        }),
      });
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'qualificationReview/categoryGroupListPage',
        payload: {},
      });
    }
  }
  // 选择类目组
  handleonChangeCategoryGroupID = (e) => {
    const { dispatch } = this.props;
    this.setState({
      categoryGroupId: e,
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
  // 最大上传数
  uploadNumChange = (e) => {
    this.setState({
      attachMaxNum: e,
    });
  }
  // 是否必需
  radioChange = (e) => {
    this.setState({
      required: e.target.value,
    });
  }
  // 是否需要视频验厂
  videoEvaluation = (e) => {
    this.setState({
      videoEvaluation: e.target.checked,
    });
  }
  // 最低评分要求
  lowestMarkChange = (e) => {
    this.setState({
      lowestMark: e.target.value,
    });
  }
  // 重点字段
  importantFieldsChange = (data) => {
    console.log(data, this.state.importantFieldsMap);
    let importstring = data.join(',');
    console.log(importstring, 'importstring');
    let arr = this.state.importantFieldsMap.filter((item) => item.value === importstring * 1);
    console.log(arr);
    let a = arr.map((item) => item.label);
    this.setState({
      checkedList: data,
      importantFields: a,
    }, () => {
      console.log(this.state.checkedList, this.state.importantFields);
    });
  }
  // 显示更多
  showMoreAxis =() => {
    this.setState({showThree: !this.state.showThree});
  };
  // 删除分组
  handleDelete = (record) => {
    let deletarr = this.state.factoryTable.filter((item) => item.factoryEvaluationGroupId !== record.factoryEvaluationGroupId);
    this.setState({
      factoryTable: deletarr,
    });
  }
  // 移除分组项
  handleRemove = (record, index) => {
    console.log(record, 'deletarr');
    let deletarr = this.state.factoryTable;
    let indexs = this.state.factoryTable.findIndex((item) => item.factoryEvaluationGroupId === record.parentMemberId);
    deletarr[indexs].children.splice(index, 1);
    deletarr[indexs].factoryEvaluationItemDTOS[index].operateType = 0;
    this.setState({
      factoryTable: deletarr,
    }, () => {
      console.log(this.state.factoryTable, 'sdfl');
    });
  }
  addGroup = () => {// 新增分组
    console.log(this.state.arrtemp.length, this.state.factoryTable.length, 'njcd');
    if (this.state.arrtemp.length !== this.state.factoryTable.length) {
      // let arr = this.state.factoryTable.map((item) => ({
      //   groupName: item.groupName,
      //   factoryEvaluationGroupId: item.factoryEvaluationGroupId,
      //   operateType: item.operateType,
      // }));
      const { dispatch } = this.props;
      let params = {
        categoryGroupId: this.state.categoryGroupId,
        channelId: '0',
        videoEvaluation: this.state.videoEvaluation === true ? 0 : 1,
        lowestMark: this.state.lowestMark,
        required: this.state.required,
        factoryEvaluationGroupDTOList: this.state.factoryTable,
      };
      dispatch({
        type: 'qualificationReview/saveDraft',
        payload: params,
      }).then((res) => {
        router.goBack();
      });
    } else {
      this.props.form.validateFields(['categoryGroup', 'lowestMark'], (err, values) => {
        if (!err) {
          this.setState({
            addGroupVisible: true,
            groupName: '',
            factoryEvaluationGroupId: '',
          });
        }
      });
    }
  }
  editGroup = (record) => {// 编辑分组
    // this.props.form.setFieldsValue({
    //   groupName: this.state.groupName,
    // })
    this.setState({
      addGroupVisible: true,
      factoryEvaluationGroupId: record.factoryEvaluationGroupId,
      groupName: record.groupName,
    }, () => {
      console.log(this.state.groupName, 'df');
    });
  }
  groupNameChange = (e) => {
    this.setState({
      groupName: e.target.value,
    });
  }
  handleAddGroupOk = () => {
    if (this.state.factoryEvaluationGroupId) {// 编辑分组
      this.state.factoryTable.forEach((item) => {
        if (item.factoryEvaluationGroupId === this.state.factoryEvaluationGroupId) {
          item.groupName = this.state.groupName;
        }
      });
      this.setState({
        addGroupVisible: false,
        factoryEvaluationGroupId: '',
      });
    } else {// 新增分组
      this.setState({
        arrtemp: this.state.factoryTable,
      }, () => {
        console.log(this.state.arrtemp, 'arrtemp');
      });
      let arr = [];

      arr.push({groupName: this.state.groupName, factoryEvaluationGroupId: (this.state.factoryTable.length + 1) * -1, key: (this.state.factoryTable.length + 1) * -1, operateType: 1, parent: 'parent', children: [], newParent: 'newParent'});
      let arr2 = this.state.factoryTable.concat(arr);
      this.setState({
        factoryTable: arr2,
        addGroupVisible: false,
      }, () => {
        console.log(this.state.factoryTable, 'factoryTable');
      });
    }
  }
  batchuploadNumChange = (e) => {
    this.setState({
      batchMax: e,
    });
  }
  batchMark = (e) => {
    this.setState({
      batchMark: e.target.value,
    }, () => {
      console.log(this.state.batchMark);
    });
  }
  batchRadioChange = (e) => {
    this.setState({
      batchrequired: e.target.value,
    });
  }
  batchSet = (record, index) => {// 批量设置
    console.log(record);
    this.setState({
      batchSetVisible: true,
      batchGroupName: record.groupName,
      currentObj: record,
      batchIndex: index,
      batchMark: '',
      batchMax: 1,
      batchrequired: 0,
    });
  }
  handleBatchSetOk = () => {
    let children = {
      mark: this.state.batchMark,
      attachMaxNum: this.state.batchMax,
      required: this.state.batchrequired,
    };
    console.log(this.state.factoryTable);
    this.state.factoryTable[this.state.batchIndex].children.forEach((item) => {
      item.mark = this.state.batchMark;
      item.attachMaxNum = this.state.batchMax;
      item.required = this.state.batchrequired;
    });
    if (this.state.factoryTable[this.state.batchIndex].factoryEvaluationItemDTOS) {
      this.state.factoryTable[this.state.batchIndex].factoryEvaluationItemDTOS.forEach((item) => {
        item.mark = this.state.batchMark;
        item.attachMaxNum = this.state.batchMax;
        item.required = this.state.batchrequired;
      });
    } else if (this.state.factoryTable[this.state.batchIndex].factoryEvaluationItemDTOS) {
      this.state.factoryTable[this.state.batchIndex].factoryEvaluationItemDTOS.forEach((item) => {
        item.mark = this.state.batchMark;
        item.attachMaxNum = this.state.batchMax;
        item.required = this.state.batchrequired;
      });
    }

    console.log(this.state.factoryTable);

    let arr1 = this.state.factoryTable;
    arr1[this.state.batchIndex].params = children;

    this.setState({
      batchSetVisible: false,
      factoryTable: arr1,
    });
  }
  // 查看
  viewDetail = (record) => {
    console.log(record, 'record');
    this.setState({
      viewDetailModal: true,
      objtemp: record,
    });
  }
  viewDetailModalCancel = () => {
    this.setState({
      viewDetailModal: false,
    });
  }
  handleChangeGroupNameId = (e) => {// 资质分组名称
    const { dispatch } = this.props;
    this.setState({
      platformInformationGroupId: e,
      projectName: '',
      platformInformationItemId: '',
      checkedList: [],
      importantFieldsMap: [],
      importantFields: '',
    }, () => {
      this.props.form.setFieldsValue({
        projectName: '',
        platformInformationItemId: '',
      });
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
    const { dispatch } = this.props;
    this.setState({
      platformInformationItemId: e,
    }, () => {
      dispatch({
        type: 'qualificationReview/getDetail',
        payload: {
          platformInformationItemId: this.state.platformInformationItemId,
        },
      }).then((res) => {
        console.log(res, 'res');
        let plainOptions = res && res.platformItemProps && res.platformItemProps.map((item) => ({
          value: item.platformItemPropId,
          label: item.propName,
        }));
        console.log(plainOptions);
        this.setState({
          importantFieldsMap: plainOptions,
        });
      });
    });
  }
  addFactoryQuality = (record, index, type) => { // 验厂资质弹框显示
    console.log(type);
    // console.log(record,'record')
    const { dispatch } = this.props;
    if (this.state.factoryEvaluationStandardId) {// 编辑资质
      // if(type === 'add'){ // xz
      // // alert('jh')
      // if(record.newParent) {
      //   this.setState({
      //     newParent: record.newParent,
      //   })
      // }
      // this.setState({
      //   addVisible: true,
      //   factoryIndex: index,
      //   flag: 'add',
      //   parentKey: record.childerKey ? record.childerKey.split('_')[1] : '',
      // });

      // }else{ // 编辑
      //   alert('8')
      //   this.setState({
      //     addVisible: true,
      //     childrenIndex: index,
      //     flag: 'edit',
      //     factoryEvaluationItemId: record.factoryEvaluationItemId,
      //     parentKey: record.key ? record.key.split('_')[1] : '',
      //     groupOprateType: record.operateType,
      //   });
      // }
      this.setState({
        addVisible: true,
        factoryIndex: index,
        parentKey: record.childerKey ? record.childerKey.split('_')[1] : '',
      });
      if (record.factoryEvaluationItemId) {// 编辑
        this.setState({
          addVisible: true,
          factoryIndex: index,
          factoryEvaluationItemId: record.factoryEvaluationItemId,
          parentKey: record.key ? record.key.split('_')[1] : '',
        });
      }
    } else { // 新增资质
      if (record.factoryEvaluationItemId) {
        this.setState({
          addVisible: true,
          factoryIndex: index,
          factoryEvaluationItemId: record.factoryEvaluationItemId,
          parentKey: record.key ? record.key.split('_')[1] : '',
        });
      } else {
        this.setState({
          addVisible: true,
          factoryIndex: index,
          parentKey: '',

        });
      }
    }
    dispatch({
      type: 'qualificationReview/getTableList',
      payload: {},
      // callback:(res)=>{
      //   console.log(res,'kdfk')
      //   this.setState({
      //     qualificationGroupList:res.resultData
      //   })
      // }
    });

    if (record.parent) { // 添加资质 新增
      this.props.form.resetFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'dataDescription', 'mark', 'importantFields']);
      this.setState({
        factoryEvaluationGroupId: '',
        factoryEvaluationItemId: '',
        platformInformationItemId: '', // 资质id
        grouparrName: '',
        projectName: '',
        attachMaxNum: 1,
        required: 0,
        submissionRequire: '',
        evaluationStandard: '',
        dataDescription: '',
        mark: '',
        importantFields: '',
        checkedList: [],
        importantFieldsMap: [],
        factoryIndex: index,
      });
    } else {
      console.log(record, 'record');
      if (record.factoryEvaluationItemId) {// 编辑回显
        let id = '';
        if (record.operateType === 1) {
          id = record.importantFieldsMap.map((item) => item.value);
          this.setState({
            importantFieldsMap: record.importantFieldsMap,
            checkedList: this.state.checkedList,
          });
        } else {
          let plainOptions = record.importantFieldsMap.map((item) => ({
            value: item.platformItemPropId,
            label: item.propName,
          }));
          console.log(plainOptions, 'dksjf');
          id = plainOptions.map((item) => item.value);
          this.setState({
            importantFieldsMap: plainOptions,
            checkedList: id,
          });
        }
        let params = {
          projectName: record.projectName,
          grouparrName: record.itemGroupName,
          dataDescription: record.dataDescription,
          attachMaxNum: record.attachMaxNum,
          evaluationStandard: record.evaluationStandard,
          mark: record.mark,
          required: record.required,
          submissionRequire: record.submissionRequire,
        };
        console.log(params, 'dkfj');
        this.props.form.setFieldsValue({
          projectName: record.projectName,
          grouparrName: record.itemGroupName,
          dataDescription: record.dataDescription,
          attachMaxNum: record.attachMaxNum,
          evaluationStandard: record.evaluationStandard,
          mark: record.mark,
          required: record.required,
          submissionRequire: record.submissionRequire,
        });
        this.setState({
          factoryEvaluationItemId: record.factoryEvaluationItemId,
          factoryEvaluationGroupId: record.factoryEvaluationGroupId,
          platformInformationItemId: record.platformInformationItemId, // 资质id
          projectName: record.projectName,
          grouparrName: record.itemGroupName,
          factoryIndex: index,
          dataDescription: record.dataDescription,
          attachMaxNum: record.attachMaxNum,
          evaluationStandard: record.evaluationStandard,
          mark: record.mark,
          required: record.required,
          submissionRequire: record.submissionRequire,
          oldObj: params,
        }, () => {
          console.log(this.state.projectName, this.state.grouparrName);
        });
        if (record.params) {
          this.setState({
            required: record.params.required,
            attachMaxNum: record.params.attachMaxNum,
            mark: record.params.mark,
          });
        }
      }
    }
  }
  handleAddFactoryQualityOk = () => {// 验厂资质弹框确定
    const { detailList, qualificationGroupList } = this.props.qualificationReview;
    this.props.form.validateFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'mark', 'dataDescription'], (err, values) => {
      if (!err) {
        console.log(values, 'values484');
        if (this.state.factoryEvaluationStandardId) { // 编辑验厂标准
          console.log(this.state.groupOprateType, 'jdhf');
          if (this.state.parentKey !== '' && this.state.groupOprateType !== 1) { // 直接去已有的数据中编辑资质
            console.log(this.state.factoryTable, 'this.state.factoryTable');
            let arr = this.state.factoryTable.filter((item) => this.state.parentKey === `${item.key}`);
            if (values.projectName === this.state.oldObj.projectName || values.grouparrName === this.state.oldObj.grouparrName) {
              arr[0].children[this.state.factoryIndex].projectName = values.projectName;
              arr[0].children[this.state.factoryIndex].itemGroupName = values.grouparrName;
            } else {
              let temparr = this.state.factoryTable.map((item) => item);
              console.log(temparr, values.projectName);
              let isHave = temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
              console.log(isHave, 'ishave');
              if (isHave.length) {
                Message.warn('不能添加重复资质');
                this.props.form.resetFields();
              } else {
                const { detailList, qualificationGroupList } = this.props.qualificationReview;
                let groupname = '';
                qualificationGroupList && qualificationGroupList.resultData.forEach((item) => {
                  if (item.platformInformationGroupId === values.grouparrName) {
                    groupname = item.groupName;
                  }
                });
                let name = '';
                detailList && detailList.resultData.forEach((item) => {
                  if (item.platformInformationItemId === values.projectName) {
                    name = item.projectName;
                  }
                });
                arr[0].children[this.state.factoryIndex].projectName = name;
                arr[0].children[this.state.factoryIndex].itemGroupName = groupname;
                arr[0].children[this.state.factoryIndex].platformInformationItemId = values.projectName;
                arr[0].children[this.state.factoryIndex].operateType = 2;
              }
            }
            arr[0].children[this.state.factoryIndex].importantFields = this.state.checkedList.join(',');
            arr[0].children[this.state.factoryIndex].attachMaxNum = values.attachMaxNum;
            arr[0].children[this.state.factoryIndex].evaluationStandard = values.evaluationStandard;
            arr[0].children[this.state.factoryIndex].submissionRequire = values.submissionRequire;
            arr[0].children[this.state.factoryIndex].required = values.required;
            arr[0].children[this.state.factoryIndex].mark = values.mark;
            arr[0].children[this.state.factoryIndex].dataDescription = values.dataDescription;
            arr[0].factoryEvaluationItemDTOS = arr[0].children;
            this.setState({
              factoryTable: this.state.factoryTable,
              addVisible: false,
              factoryEvaluationGroupId: '',
              factoryEvaluationItemId: '',
              platformInformationItemId: '', // 资质id
              grouparrName: '',
              projectName: '',
              attachMaxNum: 1,
              required: 0,
              submissionRequire: '',
              evaluationStandard: '',
              dataDescription: '',
              mark: '',
              importantFields: '',
              checkedList: [],
              importantFieldsMap: [],
            }, () => {
              console.log(this.state.factoryTable, 'djkfk');
            });
            this.props.form.resetFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'dataDescription', 'mark', 'importantFields']);
          } else { // 添加资质
            console.log(this.state.parentKey, 'this.state.parentKey');
            if (this.state.parentKey !== '' && this.state.groupOprateType === 1) { // 编辑中新添加资质中的编辑
              if (this.state.newParent) {
                let temparr = this.state.factoryTable.map((item) => item);
                console.log(temparr[0].children, values.projectName);
                let isHave = temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
                console.log(isHave, 'ishave');
                if (isHave.length) {
                  Message.warn('不能添加重复资质');
                  this.props.form.resetFields();
                } else {
                  let name = '';
                  detailList.resultData.forEach((item) => {
                    if (item.platformInformationItemId === values.projectName) {
                      name = item.projectName;
                    }
                  });
                  let groupname = '';
                  qualificationGroupList.resultData.forEach((item) => {
                    if (item.platformInformationGroupId === values.grouparrName) {
                      groupname = item.groupName;
                    }
                  });
                  console.log(this.state.importantFieldsMap, this.state.factoryTable, this.state.factoryIndex, 'this.state.importantFieldsMap');
                  const { user: { baseInfo } } = this.props;
                  let params = {
                    platformInformationItemId: values.projectName,
                    importantFields: this.state.checkedList.join(','),
                    importantFieldsMap: this.state.importantFieldsMap,
                    factoryEvaluationItemId: this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS ? (this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS.length + 1) * -1 : 1,
                    projectName: name,
                    itemGroupName: groupname,
                    attachMaxNum: values.attachMaxNum,
                    evaluationStandard: values.evaluationStandard,
                    submissionRequire: values.submissionRequire,
                    required: values.required,
                    mark: values.mark,
                    dataDescription: values.dataDescription,
                    operateType: 1,
                    updateTime: this.state.time,
                    createName: baseInfo.accountName,
                  };
                  let arr1 = this.state.factoryTable;
                  if (arr1[this.state.factoryIndex].factoryEvaluationItemDTOS) {
                    arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
                  } else {
                    arr1[this.state.factoryIndex].factoryEvaluationItemDTOS = [];
                    arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
                  }
                  let arr2 = arr1.map((item) => ({
                    ...item,
                    key: item.factoryEvaluationGroupId,
                    children: item.factoryEvaluationItemDTOS ? item.factoryEvaluationItemDTOS.map((cItem) => ({
                      ...cItem,
                      key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                      parentMemberId: item.factoryEvaluationGroupId,
                    })) : [],
                  }));
                  this.setState({
                    factoryTable: arr2,
                    importantFields: '',
                    // newParent: '',
                    addVisible: false,
                  }, console.log(this.state.factoryTable, 'dkf'));
                }
              } else {
                let arr = this.state.factoryTable.filter((item) => this.state.parentKey === `${item.key}`);
                if (values.projectName === this.state.oldObj.projectName || values.grouparrName === this.state.oldObj.grouparrName) {
                  arr[0].children[this.state.factoryIndex].projectName = values.projectName;
                  arr[0].children[this.state.factoryIndex].itemGroupName = values.grouparrName;
                } else {
                  let temparr = this.state.factoryTable.map((item) => item);
                  console.log(temparr, values.projectName);
                  let isHave = temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
                  console.log(isHave, 'ishave');
                  if (isHave.length) {
                    Message.warn('不能添加重复资质');
                    this.props.form.resetFields();
                  } else {
                    const { detailList, qualificationGroupList } = this.props.qualificationReview;
                    let groupname = '';
                    qualificationGroupList && qualificationGroupList.resultData.forEach((item) => {
                      if (item.platformInformationGroupId === values.grouparrName) {
                        groupname = item.groupName;
                      }
                    });
                    let name = '';
                    detailList && detailList.resultData.forEach((item) => {
                      if (item.platformInformationItemId === values.projectName) {
                        name = item.projectName;
                      }
                    });
                    arr[0].children[this.state.factoryIndex].projectName = name;
                    arr[0].children[this.state.factoryIndex].itemGroupName = groupname;
                    arr[0].children[this.state.factoryIndex].platformInformationItemId = values.projectName;
                    arr[0].children[this.state.factoryIndex].operateType = 2;
                  }
                }
                arr[0].children[this.state.factoryIndex].importantFields = this.state.checkedList.join(',');
                arr[0].children[this.state.factoryIndex].attachMaxNum = values.attachMaxNum;
                arr[0].children[this.state.factoryIndex].evaluationStandard = values.evaluationStandard;
                arr[0].children[this.state.factoryIndex].submissionRequire = values.submissionRequire;
                arr[0].children[this.state.factoryIndex].required = values.required;
                arr[0].children[this.state.factoryIndex].mark = values.mark;
                arr[0].children[this.state.factoryIndex].dataDescription = values.dataDescription;
                arr[0].factoryEvaluationItemDTOS = arr[0].children;
                this.setState({
                  factoryTable: this.state.factoryTable,
                  addVisible: false,
                  factoryEvaluationGroupId: '',
                  factoryEvaluationItemId: '',
                  platformInformationItemId: '', // 资质id
                  grouparrName: '',
                  projectName: '',
                  attachMaxNum: 1,
                  required: 0,
                  submissionRequire: '',
                  evaluationStandard: '',
                  dataDescription: '',
                  mark: '',
                  importantFields: '',
                  checkedList: [],
                  importantFieldsMap: [],
                }, () => {
                  console.log(this.state.factoryTable, 'djkfk');
                });
                this.props.form.resetFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'dataDescription', 'mark', 'importantFields']);
              }

            } else {
              let temparr = this.state.factoryTable.map((item) => item);
              console.log(temparr, 'values');
              let isHave = temparr[this.state.factoryIndex].factoryEvaluationItemDTOS && temparr[this.state.factoryIndex].factoryEvaluationItemDTOS.filter((i) => values.projectName === i.platformInformationItemId * 1);
              console.log(isHave);
              if (isHave && isHave.length) {
                Message.warn('不能添加重复资质');
                this.props.form.resetFields();
              } else {
                let name = '';
                detailList.resultData.forEach((item) => {
                  if (item.platformInformationItemId === values.projectName) {
                    name = item.projectName;
                  }
                });
                let groupname = '';
                qualificationGroupList.resultData.forEach((item) => {
                  if (item.platformInformationGroupId === values.grouparrName) {
                    groupname = item.groupName;
                  }
                });
                console.log(this.state.importantFieldsMap, 'this.state.importantFieldsMap');
                const { user: { baseInfo } } = this.props;
                let params = {
                  platformInformationItemId: values.projectName,
                  importantFields: this.state.checkedList.join(','),
                  importantFieldsMap: this.state.importantFieldsMap,
                  factoryEvaluationItemId: this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS ? (this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS.length + 1) * -1 : 1,
                  projectName: name,
                  itemGroupName: groupname,
                  attachMaxNum: values.attachMaxNum,
                  evaluationStandard: values.evaluationStandard,
                  submissionRequire: values.submissionRequire,
                  required: values.required,
                  mark: values.mark,
                  dataDescription: values.dataDescription,
                  operateType: 1,
                  updateTime: this.state.time,
                  createName: baseInfo.accountName,
                };
                let arr1 = this.state.factoryTable;
                if (arr1[this.state.factoryIndex].factoryEvaluationItemDTOS) {
                  arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
                } else {
                  arr1[this.state.factoryIndex].factoryEvaluationItemDTOS = [];
                  arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
                }
                let arr2 = arr1.map((item) => ({
                  ...item,
                  key: item.factoryEvaluationGroupId,
                  children: item.factoryEvaluationItemDTOS ? item.factoryEvaluationItemDTOS.map((cItem) => ({
                    ...cItem,
                    key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                    parentMemberId: item.factoryEvaluationGroupId,
                  })) : [],
                }));
                this.setState({
                  factoryTable: arr2,
                  importantFields: '',
                  newParent: '',
                  addVisible: false,
                }, console.log(this.state.factoryTable, 'dkf'));
              }
            }
          }
        } else { // 新增验厂标准
          console.log(this.state.parentKey, 'parentkey');
          if (this.state.parentKey !== '') { // 编辑资质
            let temparr = this.state.factoryTable.map((item) => item);
            let isHave = temparr[0].children && temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
            if (isHave && isHave.length) {
              Message.warn('不能添加重复资质');
              this.props.form.resetFields();
            } else {
              let name = '';
              detailList.resultData.forEach((item) => {
                if (item.platformInformationItemId === values.projectName) {
                  name = item.projectName;
                }
              });
              let groupname = '';
              qualificationGroupList.resultData.forEach((item) => {
                if (item.platformInformationGroupId === values.grouparrName) {
                  groupname = item.groupName;
                }
              });
              let arr = this.state.factoryTable.filter((item) => this.state.parentKey === item.key.toString());
              arr[0].children[this.state.factoryIndex].importantFields = this.state.checkedList.join(',');
              arr[0].children[this.state.factoryIndex].platformInformationItemId = values.projectName;
              arr[0].children[this.state.factoryIndex].projectName = name;
              arr[0].children[this.state.factoryIndex].itemGroupName = groupname;
              arr[0].children[this.state.factoryIndex].attachMaxNum = values.attachMaxNum;
              arr[0].children[this.state.factoryIndex].evaluationStandard = values.evaluationStandard;
              arr[0].children[this.state.factoryIndex].submissionRequire = values.submissionRequire;
              arr[0].children[this.state.factoryIndex].required = values.required;
              arr[0].children[this.state.factoryIndex].mark = values.mark;
              arr[0].children[this.state.factoryIndex].dataDescription = values.dataDescription;
              arr[0].children[this.state.factoryIndex].operateType = 1;
              arr[0].factoryEvaluationItemDTOS = arr[0].children;
              this.setState({
                factoryTable: this.state.factoryTable,
                factoryEvaluationItemId: '',
                addVisible: false,
                importantFields: '',
              }, () => {
                console.log(this.state.factoryTable, 'this.state.factoryTable');
              });
            }
          } else { // 添加资质
            let temparr = this.state.factoryTable.map((item) => item);
            let isHave = temparr[this.state.factoryIndex].factoryEvaluationItemDTOS && temparr[this.state.factoryIndex].factoryEvaluationItemDTOS.filter((i) => values.projectName === i.platformInformationItemId * 1);
            if (isHave && isHave.length) {
              Message.warn('不能添加重复资质');
              this.props.form.resetFields();
            } else {
              let name = '';
              detailList.resultData.forEach((item) => {
                if (item.platformInformationItemId === values.projectName) {
                  name = item.projectName;
                }
              });
              let groupname = '';
              qualificationGroupList.resultData.forEach((item) => {
                if (item.platformInformationGroupId === values.grouparrName) {
                  groupname = item.groupName;
                }
              });
              const { user: { baseInfo } } = this.props;
              let params = {
                platformInformationItemId: values.projectName,
                importantFields: this.state.checkedList.join(','),
                importantFieldsMap: this.state.importantFieldsMap,
                checkedList: this.state.checkedList,
                factoryEvaluationItemId: this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS ? (this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS.length + 1) * -1 : 1,
                projectName: name,
                itemGroupName: groupname,
                attachMaxNum: values.attachMaxNum,
                evaluationStandard: values.evaluationStandard,
                submissionRequire: values.submissionRequire,
                required: values.required,
                mark: values.mark,
                dataDescription: values.dataDescription,
                operateType: 1,
                updateTime: this.state.time,
                createName: baseInfo.accountName,
              };
              let arr1 = this.state.factoryTable;
              if (arr1[this.state.factoryIndex].factoryEvaluationItemDTOS) {
                arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
              } else {
                arr1[this.state.factoryIndex].factoryEvaluationItemDTOS = [];
                arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
              }
              let arr2 = arr1.map((item) => ({
                ...item,
                key: item.factoryEvaluationGroupId,
                children: item.factoryEvaluationItemDTOS ? item.factoryEvaluationItemDTOS.map((cItem) => ({
                  ...cItem,
                  key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                  childerKey: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
                  parentMemberId: item.factoryEvaluationGroupId,
                })) : [],
              }));
              this.setState({
                factoryTable: arr2,
                addVisible: false,
              }, () => {
                console.log(this.state.factoryTable, 'factorytable');
              });
            }
          }
        }
      }
    });
  }
  // handleAddFactoryQualityOk = () => {
  //   // const { detailList, qualificationGroupList } = this.props.qualificationReview;
  //   const { qualificationGroupList, factoryIndex, childrenIndex } = this.state
  //   this.props.form.validateFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'mark', 'dataDescription'], (err, values) => {
  //     if (!err) {
  //       console.log(values, 'values484');
  //       if (this.state.factoryEvaluationStandardId) { // 编辑验厂标准
  //           let arr = {};
  //           console.log(childrenIndex,'childrenIndex')
  //           childrenIndex ? (arr = this.state.factoryTable[factoryIndex].children[childrenIndex]) : (arr = this.state.factoryTable[factoryIndex]);
  //           console.log(this.state.factoryTable[factoryIndex].children[childrenIndex],'arr')
  //           if(values.projectName === this.state.oldObj.projectName || values.grouparrName === this.state.oldObj.grouparrName) {
  //             alert('0')
  //             arr.projectName = values.projectName;
  //             arr.itemGroupName = values.grouparrName;
  //           } else {
  //             alert('po')
  //             let temparr = this.state.factoryTable.map((item) => item);
  //             console.log(temparr, values.projectName);
  //             let isHave = temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
  //             console.log(isHave, 'ishave');
  //             if (isHave.length) {
  //               Message.warn('不能添加重复资质');
  //               this.props.form.resetFields();
  //             } else {
  //               // const { detailList, qualificationGroupList } = this.props.qualificationReview;
  //               console.log(values.grouparrName,qualificationGroupList)

  //               let groupname = '';
  //               qualificationGroupList && qualificationGroupList.forEach((item) => {
  //                 if (item.platformInformationGroupId === values.grouparrName) {
  //                   groupname = item.groupName;
  //                 }
  //               });
  //               console.log(arr)
  //               // let name = '';
  //               // detailList && detailList.resultData.forEach((item) => {
  //               //   if (item.platformInformationItemId === values.projectName) {
  //               //     name = item.projectName;
  //               //   }
  //               // });
  //               // console.log(arr,'arr')
  //             // arr.projectName = name;
  //             arr.itemGroupName = groupname;
  //             // arrChildren.platformInformationItemId = values.projectName;
  //             }
  //           }

  //           if(this.state.flag === 'add'){
  //             let params = {
  //               platformInformationItemId: values.projectName,
  //               importantFields: this.state.checkedList.join(','),
  //               importantFieldsMap: this.state.importantFieldsMap,
  //               checkedList: this.state.checkedList,
  //               factoryEvaluationItemId: this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS ? (this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS.length + 1) * -1 : 1,
  //               // projectName: name,
  //               // itemGroupName: groupname,
  //               attachMaxNum: values.attachMaxNum,
  //               evaluationStandard: values.evaluationStandard,
  //               submissionRequire: values.submissionRequire,
  //               required: values.required,
  //               mark: values.mark,
  //               dataDescription: values.dataDescription,
  //               operateType: 1,
  //               updateTime: this.state.time,
  //               // createName: baseInfo.accountName,
  //             };
  //             arr.importantFields = this.state.checkedList.join(',');
  //             arr.attachMaxNum = values.attachMaxNum;
  //             arr.evaluationStandard = values.evaluationStandard;
  //             arr.submissionRequire = values.submissionRequire;
  //             arr.required = values.required;
  //             arr.mark = values.mark;
  //             arr.dataDescription = values.dataDescription;
  //             arr.children.push(params);
  //             arr.factoryEvaluationItemDTOS = arrChildren.children

  //           } else {
  //             console.log(arr.children[this.state.childrenIndex],'arrChildren')
  //             arr.importantFields = this.state.checkedList.join(',');
  //             arr.attachMaxNum = values.attachMaxNum;
  //             arr.evaluationStandard = values.evaluationStandard;
  //             arr.submissionRequire = values.submissionRequire;
  //             arr.required = values.required;
  //             arr.mark = values.mark;
  //             arr.dataDescription = values.dataDescription;
  //             arr.operateType = 2;
  //             arr.factoryEvaluationItemDTOS = arr.children
  //           }
  //           this.setState({
  //             factoryTable: this.state.factoryTable,
  //             addVisible: false,
  //             factoryEvaluationGroupId: '',
  //             factoryEvaluationItemId: '',
  //             platformInformationItemId: '', // 资质id
  //             grouparrName: '',
  //             projectName: '',
  //             attachMaxNum: 1,
  //             required: 0,
  //             submissionRequire: '',
  //             evaluationStandard: '',
  //             dataDescription: '',
  //             mark: '',
  //             importantFields: '',
  //             checkedList: [],
  //             importantFieldsMap: [],
  //           }, () => {
  //             console.log(this.state.factoryTable, 'djkfk');
  //           });
  //           this.props.form.resetFields(['grouparrName', 'projectName', 'attachMaxNum', 'required', 'submissionRequire', 'evaluationStandard', 'dataDescription', 'mark', 'importantFields']);

  //       } else { // 新增验厂标准
  //         console.log(this.state.parentKey, 'parentkey');
  //         if (this.state.parentKey !== '') { // 编辑资质
  //           let temparr = this.state.factoryTable.map((item) => item);
  //           let isHave = temparr[0].children && temparr[0].children.filter((item) => values.projectName === item.platformInformationItemId * 1);
  //           if (isHave && isHave.length) {
  //             Message.warn('不能添加重复资质');
  //             this.props.form.resetFields();
  //           } else {
  //             let name = '';
  //             detailList.resultData.forEach((item) => {
  //               if (item.platformInformationItemId === values.projectName) {
  //                 name = item.projectName;
  //               }
  //             });
  //             let groupname = '';
  //             qualificationGroupList.resultData.forEach((item) => {
  //               if (item.platformInformationGroupId === values.grouparrName) {
  //                 groupname = item.groupName;
  //               }
  //             });
  //             let arr = this.state.factoryTable.filter((item) => this.state.parentKey === item.key.toString());
  //             arr.importantFields = this.state.checkedList.join(',');
  //             arr.platformInformationItemId = values.projectName;
  //             arr.projectName = name;
  //             arr.itemGroupName = groupname;
  //             arr.attachMaxNum = values.attachMaxNum;
  //             arr.evaluationStandard = values.evaluationStandard;
  //             arr.submissionRequire = values.submissionRequire;
  //             arr.required = values.required;
  //             arr.mark = values.mark;
  //             arr.dataDescription = values.dataDescription;
  //             arr.operateType = 1;
  //             arr[0].factoryEvaluationItemDTOS = arr[0].children;
  //             this.setState({
  //               factoryTable: this.state.factoryTable,
  //               factoryEvaluationItemId: '',
  //               addVisible: false,
  //               importantFields: '',
  //             }, () => {
  //               console.log(this.state.factoryTable, 'this.state.factoryTable');
  //             });
  //           }
  //         } else { // 添加资质
  //           let temparr = this.state.factoryTable.map((item) => item);
  //           let isHave = temparr[this.state.factoryIndex].factoryEvaluationItemDTOS && temparr[this.state.factoryIndex].factoryEvaluationItemDTOS.filter((i) => values.projectName === i.platformInformationItemId * 1);
  //           if (isHave && isHave.length) {
  //             Message.warn('不能添加重复资质');
  //             this.props.form.resetFields();
  //           } else {
  //             let name = '';
  //             detailList.resultData.forEach((item) => {
  //               if (item.platformInformationItemId === values.projectName) {
  //                 name = item.projectName;
  //               }
  //             });
  //             let groupname = '';
  //             qualificationGroupList.resultData.forEach((item) => {
  //               if (item.platformInformationGroupId === values.grouparrName) {
  //                 groupname = item.groupName;
  //               }
  //             });
  //             const { user: { baseInfo } } = this.props;
  //             let params = {
  //               platformInformationItemId: values.projectName,
  //               importantFields: this.state.checkedList.join(','),
  //               importantFieldsMap: this.state.importantFieldsMap,
  //               checkedList: this.state.checkedList,
  //               factoryEvaluationItemId: this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS ? (this.state.factoryTable[this.state.factoryIndex].factoryEvaluationItemDTOS.length + 1) * -1 : 1,
  //               projectName: name,
  //               itemGroupName: groupname,
  //               attachMaxNum: values.attachMaxNum,
  //               evaluationStandard: values.evaluationStandard,
  //               submissionRequire: values.submissionRequire,
  //               required: values.required,
  //               mark: values.mark,
  //               dataDescription: values.dataDescription,
  //               operateType: 1,
  //               updateTime: this.state.time,
  //               createName: baseInfo.accountName,
  //             };
  //             let arr1 = this.state.factoryTable;
  //             if (arr1[this.state.factoryIndex].factoryEvaluationItemDTOS) {
  //               arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
  //             } else {
  //               arr1[this.state.factoryIndex].factoryEvaluationItemDTOS = [];
  //               arr1[this.state.factoryIndex].factoryEvaluationItemDTOS.push(params);
  //             }
  //             let arr2 = arr1.map((item) => ({
  //               ...item,
  //               key: item.factoryEvaluationGroupId,
  //               children: item.factoryEvaluationItemDTOS ? item.factoryEvaluationItemDTOS.map((cItem) => ({
  //                 ...cItem,
  //                 key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
  //                 childerKey: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
  //                 parentMemberId: item.factoryEvaluationGroupId,
  //               })) : [],
  //             }));
  //             this.setState({
  //               factoryTable: arr2,
  //               addVisible: false,
  //             }, () => {
  //               console.log(this.state.factoryTable, 'factorytable');
  //             });
  //           }
  //         }
  //       }
  //     }
  //   });

  // }

  // 保存草稿
  formSave = () => {
    const { dispatch } = this.props;
    const { factoryEvaluationStandardId } = this.props.location.query;
    console.log(this.state.factoryTable);
    let editfactoryEvaluationGroupDTOList = this.state.factoryTable.map((item) => {
      if (item.children) {
        delete item.children;
      }
      return item;
    });
    console.log(editfactoryEvaluationGroupDTOList);
    let addfactoryEvaluationGroupDTOList = this.state.factoryTable.map((item) => {
      if (item.children) {
        delete item.children;
      }
      return item;
    });
    let addParams = {
      categoryGroupId: this.state.categoryGroupId,
      channelId: '0',
      videoEvaluation: this.state.videoEvaluation === true ? 0 : 1,
      lowestMark: this.state.lowestMark,
      required: this.state.required,
      factoryEvaluationGroupDTOList: addfactoryEvaluationGroupDTOList,
    };
    let editParams = {
      factoryEvaluationStandardId,
      categoryGroupId: this.state.categoryGroupId,
      channelId: '0',
      videoEvaluation: this.state.videoEvaluation === true ? 0 : 1,
      lowestMark: this.state.lowestMark,
      required: this.state.required,
      factoryEvaluationGroupDTOList: editfactoryEvaluationGroupDTOList,
    };
    console.log(addParams, editParams, 'addParams，editParams');
    this.props.form.validateFieldsAndScroll(['categoryGroup', 'lowestMark'], (err, values) => {
      if (!err) {
        if (factoryEvaluationStandardId) {
          dispatch({
            type: 'qualificationReview/saveDraft',
            payload: editParams,
          }).then((res) => {
            router.goBack();
          });
        } else {
          dispatch({
            type: 'qualificationReview/saveDraft',
            payload: addParams,
          }).then((res) => {
            router.goBack();
          });
        }
      }
    });
  }
  // 提交
  formSubmit = () => {
    const { factoryEvaluationStandardId } = this.props.location.query;
    if (factoryEvaluationStandardId) {
      this.props.form.validateFieldsAndScroll(['categoryGroup', 'lowestMark'], (err, values) => {
        if (!err) {
          let factoryEvaluationGroupDTOList = this.state.factoryTable.map((item) => ({
            factoryEvaluationItemDTOS: item.factoryEvaluationItemDTOS,
            factoryEvaluationGroupId: item.factoryEvaluationGroupId,
            groupName: item.groupName,
            operateType: item.operateType,
          }));
          const { dispatch } = this.props;
          let params = {
            factoryEvaluationStandardId: this.props.location.query.factoryEvaluationStandardId,
            categoryGroupId: this.state.categoryGroupId,
            channelId: 0,
            videoEvaluation: this.state.videoEvaluation === true ? 0 : 1,
            lowestMark: this.state.lowestMark,
            required: '',
            factoryEvaluationGroupDTOList,
          };
          dispatch({
            type: 'qualificationReview/saveStandard',
            payload: params,
          }).then((res) => {
            router.goBack();
          });
        }
      });
    } else {
      this.props.form.validateFieldsAndScroll(['categoryGroup', 'lowestMark'], (err, values) => {
        if (!err) {
          let factoryEvaluationGroupDTOList = this.state.factoryTable.map((item) => ({
            factoryEvaluationItemDTOS: item.factoryEvaluationItemDTOS,
            factoryEvaluationGroupId: item.factoryEvaluationGroupId,
            groupName: item.groupName,
            operateType: item.operateType,
          }));
          const { dispatch } = this.props;
          let params = {
            factoryEvaluationStandardId: '',
            categoryGroupId: this.state.categoryGroupId,
            channelId: 0,
            videoEvaluation: this.state.videoEvaluation === true ? 0 : 1,
            lowestMark: this.state.lowestMark,
            required: '',
            factoryEvaluationGroupDTOList,
          };
          dispatch({
            type: 'qualificationReview/saveStandard',
            payload: params,
          }).then((res) => {
            router.goBack();
          });
        }
      });
    }
  }
  formCancel = () => {
    this.props.form.resetFields();
    router.goBack();
  }
  handleCancel = (e) => {
    this.setState({
      groupName: '',
      checkedList: [],
      addVisible: false,
      addGroupVisible: false,
      batchSetVisible: false,
    });
  }
  // 改变table页码
  hadlePageNumChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const { factoryEvaluationStandardId } = this.props.location.query;
    let params = {
      pageNum: page,
      pageSize: pageSize,
      factoryEvaluationStandardId: factoryEvaluationStandardId,
    };
    dispatch({
      type: 'qualificationReview/getFactoryTable',
      payload: params,
      callback: ((res) => {
        if (res) {
          res.pageFactoryEvaluationGroups.resultData = res.pageFactoryEvaluationGroups.resultData.map((item) => ({
            ...item,
            parent: 'parent',
            key: item.factoryEvaluationGroupId,
            children: item.factoryEvaluationItemDTOS.map((cItem) => ({
              ...cItem,
              key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
              parentMemberId: item.factoryEvaluationGroupId,
            })),
          }));
          this.setState({
            factoryTable: res.pageFactoryEvaluationGroups.resultData,
            categoryGroupVO: res.categoryGroupVO,
            videoEvaluation: res.videoEvaluation !== 1,
            lowestMark: res.lowestMark,
          }, () => {
          });
        }
      }),
    });
  }
  // 改变table数据条数
  hadlePageSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { factoryEvaluationStandardId } = this.props.location.query;
    let param = {
      factoryEvaluationStandardId: factoryEvaluationStandardId,
      pageNum: current,
      pageSize: size,
    };
    dispatch({
      type: 'qualificationReview/getFactoryTable',
      payload: param,
      callback: ((res) => {
        if (res) {
          res.pageFactoryEvaluationGroups.resultData = res.pageFactoryEvaluationGroups.resultData.map((item) => ({
            ...item,
            parent: 'parent',
            key: item.factoryEvaluationGroupId,
            children: item.factoryEvaluationItemDTOS.map((cItem) => ({
              ...cItem,
              key: `${cItem.factoryEvaluationItemId}_${item.factoryEvaluationGroupId}`,
              parentMemberId: item.factoryEvaluationGroupId,
            })),
          }));
          this.setState({
            factoryTable: res.pageFactoryEvaluationGroups.resultData,
            categoryGroupVO: res.categoryGroupVO,
            videoEvaluation: res.videoEvaluation !== 1,
            lowestMark: res.lowestMark,
          }, () => {
          });
        }
      }),
    });
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'qualificationReview/getCategoryGrouparr',
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { factoryEvaluationStandardId } = this.props.location.query;
    const { istableLoading } = this.props;
    const { categoryDetailList, qualificationGroupList, detailList, importList, categoryList } = this.props.qualificationReview;
    let topThree = [];
    if (categoryDetailList && categoryDetailList.categoryVOS && categoryDetailList.categoryVOS.length > 3 && this.state.showThree) {
      topThree = categoryDetailList.categoryVOS.slice(0, 3);
    } else if (categoryDetailList && categoryDetailList.categoryVOS) {
      topThree = categoryDetailList.categoryVOS;
    } else {
      topThree = [];
    }
    let editTopThree = [];
    if (this.state.categoryGroupVO && this.state.categoryGroupVO.categoryVOS && this.state.categoryGroupVO.categoryVOS.length > 3 && this.state.showThree) {
      editTopThree = this.state.categoryGroupVO.categoryVOS.slice(0, 3);
    } else if (this.state.categoryGroupVO && this.state.categoryGroupVO.categoryVOS) {
      editTopThree = this.state.categoryGroupVO.categoryVOS;
    } else {
      editTopThree = [];
    }
    const columns = [{
      title: '分组名称',
      dataIndex: 'groupName',
    }, {
      title: '资料项名称',
      dataIndex: 'projectName',
      align: 'center',
    }, {
      title: '最新编辑时间',
      dataIndex: 'updateTime',
      align: 'center',
    }, {
      title: '创建人',
      dataIndex: 'createName',
      align: 'center',
    }, {
      title: '是否必填',
      dataIndex: 'required',
      align: 'center',
      render: (text) => text === 1 ? '否' : text === 0 ? '是' : '',
    }, {
      title: '资质满分',
      dataIndex: 'mark',
      align: 'center',
    }, {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (text, record, index) => {
        if (record.parent) {
          return (
            <div>
              <span style={{color: '#1E7BE2', cursor: 'pointer', paddingRight: 5}} onClick={() => this.addFactoryQuality(record, index, 'add')}>添加资质</span>
              <span style={{color: '#1E7BE2', cursor: 'pointer'}} onClick={() => this.editGroup(record)}>编辑</span>
              <Popconfirm title="是否确认将该资料从当前列表中移除" onConfirm={() => this.handleDelete(record)} onCancel={this.cancelDelete} okText="确定" cancelText="取消">
                <Button type="link" className={styles.tableBtn}>删除</Button>
              </Popconfirm>
              {/* <Button type="link" onClick={() => this.batchSet(record)} disabled={record.factoryEvaluationItemDTOS ? false : true}>批量设置</Button> */}
              <span style={{color: '#1E7BE2', cursor: 'pointer'}} onClick={() => this.batchSet(record, index)}>批量设置</span>
            </div>
          );
        } else {
          return (
            <div>
              <span style={{color: '#1E7BE2', cursor: 'pointer', paddingRight: 5}} onClick={() => this.viewDetail(record)}>查看</span>
              <span style={{color: '#1E7BE2', cursor: 'pointer'}} onClick={() => this.addFactoryQuality(record, index, 'edit')}>编辑</span>
              <Popconfirm title="是否确认将该资料从当前列表中移除" onConfirm={() => this.handleRemove(record, index)} onCancel={this.cancelDelete} okText="确定" cancelText="取消">
                <Button type="link" className={styles.tableBtn}>移除</Button>
              </Popconfirm>
            </div>
          );
        }
      },
    }];
    return (
      <div>
        <PageHeader title={factoryEvaluationStandardId ? '编辑验厂标准' : '新增验厂标准'} />
        <Card bordered={false} style={{marginBottom: 10}}>
          {
            factoryEvaluationStandardId ? (
              <Form className={styles.categoryForm}>
                <Form.Item label="类目组名称">
                  {this.state.categoryGroupVO.groupName}
                </Form.Item>
                <Form.Item label="包含类目数">
                  {this.state.categoryGroupVO.categoryNum}
                </Form.Item>
                <Form.Item label="类目名称">
                  {
                    editTopThree && editTopThree.length === 0 ? '--' : editTopThree && editTopThree.map((item) => (
                      <p key={item.categoryId}>{item.categoryName}</p>
                    ))
                  }
                </Form.Item>
                {
                  this.state.categoryGroupVO && this.state.categoryGroupVO.categoryVOS && this.state.categoryGroupVO.categoryVOS.length > 3
                    ? <div onClick={this.showMoreAxis} style={{position: 'absolute', bottom: 38, right: 10, color: '#476AC6'}}>{this.state.showThree === true ? '展开>>' : '收起<<'}</div> : ''
                }
              </Form>
            ) : (
              <Form className={styles.categoryForm} onSubmit={this.addGroup}>
                <Form.Item label="选择类目组">
                  {
                    getFieldDecorator('categoryGroup', {
                      rules: [{required: true, message: '请选择类目组'}],
                    })(
                      <Select
                        placeholder="请选择"
                        onChange={this.handleonChangeCategoryGroupID}
                      >
                        {
                          categoryList && categoryList.resultData && categoryList.resultData.map((i, index) => (
                            <Select.Option value={i.categoryGroupId} key={i.categoryGroupId} >{i.groupName}</Select.Option>
                          ))
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
          <p style={{fontSize: 14, fontWeight: 700, color: '#333'}}>资质验厂配置</p>
          <Form layout="inline" style={{marginTop: 10, marginBottom: 10}}>
            <Form.Item>
              <Checkbox onChange={(e) => this.videoEvaluation(e)} checked={this.state.videoEvaluation}>需要视频验厂</Checkbox>
            </Form.Item>
            <Form.Item label="资质评分最低要求">
              {
                getFieldDecorator('lowestMark', {
                  rules: [{required: true, pattern: new RegExp(/^[1-9]\d{0,2}$/g), message: '请填写资质评分且最多只能输入3位数字'}],
                  initialValue: this.state.lowestMark,
                })(
                  <Input onChange={this.lowestMarkChange} autoComplete="off"/>
                )
              }
            </Form.Item>
          </Form>
          <Button type="primary" onClick={this.addGroup} style={{marginTop: 10, marginBottom: 10}} disabled={this.state.disabled}>新增分组</Button>
          <Table
            dataSource={this.state.factoryTable}
            columns={columns}
            loading={istableLoading}
            rowKey={(record) => record.key}
            pagination={{ // 分页
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `总共 ${total} 条记录`,
              total: this.state.factoryTable.total,
              current: this.state.factoryTable.pageNum,
              pageSize: this.state.factoryTable.pageSize,
              hideOnSinglePage: !(this.state.factoryTable.total > 10),
              onChange: this.hadlePageNumChange,
              onShowSizeChange: this.hadlePageSizeChange,
            }}
          />
        </Card>
        <Modal
          title={this.state.factoryEvaluationItemId ? '编辑验厂资质' : '新增验厂资质'}
          visible={this.state.addVisible}
          onOk={this.handleAddFactoryQualityOk}
          onCancel={this.handleCancel}
        >
          <Form className={styles.addFactory} onSubmit={this.handleAddFactoryQualityOk}>
            <Form.Item label="资质分组名称">
              {
                getFieldDecorator('grouparrName', {
                  initialValue: this.state.grouparrName,
                })(
                  <Select onChange={this.handleChangeGroupNameId}>
                    {
                      qualificationGroupList && qualificationGroupList.resultData ? qualificationGroupList.resultData.map((i, index) => (
                        <Select.Option value={i.platformInformationGroupId} key={i.platformInformationGroupId} >{i.groupName }</Select.Option>
                      )) : []
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="资质名称">
              {
                getFieldDecorator('projectName', {
                  rules: [{required: true, message: '请选择资质名称'}],
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
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="重点字段">
              <CheckboxGroup options={this.state.importantFieldsMap} value={this.state.checkedList} onChange={this.importantFieldsChange}/>
            </Form.Item>
            <Form.Item label="最多上传个数">
              {
                getFieldDecorator('attachMaxNum', {
                  rules: [{required: true, message: '请填写最多上传个数'}],
                  initialValue: this.state.attachMaxNum,
                })(
                  <InputNumber min={1} max={10} onChange={this.uploadNumChange} />
                )
              }
            </Form.Item>
            <Form.Item label="是否必填">
              {
                getFieldDecorator('required', {
                  rules: [{required: true, message: '请选择'}],
                  initialValue: this.state.required,
                })(
                  <Radio.Group onChange={this.radioChange}>
                    <Radio value={0}>是</Radio>
                    <Radio value={1}>否</Radio>
                  </Radio.Group>
                )
              }
            </Form.Item>
            <Form.Item label="提交要求">
              {
                getFieldDecorator('submissionRequire', {
                  rules: [{required: true, message: '请填写提交要求'}],
                  initialValue: this.state.submissionRequire,
                })(
                  <Input autoComplete='off' maxLength={30} placeholder="最多输入30个字"/>
                )
              }
            </Form.Item>
            <Form.Item label="评分标准">
              {
                getFieldDecorator('evaluationStandard', {
                  rules: [{required: true, message: '请填写评分标准'}],
                  initialValue: this.state.evaluationStandard,
                })(
                  <Input autoComplete='off' maxLength={30} placeholder="最多输入30个字"/>
                )
              }
            </Form.Item>
            <Form.Item label="资质满分">
              {
                getFieldDecorator('mark', {
                  rules: [{required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请填写资质满分且只能输入数字'}],
                  initialValue: this.state.mark,
                })(
                  <Input autoComplete='off'/>
                )
              }
            </Form.Item>
            <Form.Item label="资质说明">
              {
                getFieldDecorator('dataDescription', {
                  initialValue: this.state.dataDescription,
                })(
                  <Input autoComplete='off' maxLength={30} placeholder="最多输入30个字"/>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={this.state.factoryEvaluationGroupId ? '编辑分组' : '新增分组'}
          visible={this.state.addGroupVisible}
          onOk={this.handleAddGroupOk}
          onCancel={this.handleCancel}
        >
          <Form className={styles.addFactory}>
            <Form.Item label="分组名称">
              <Input value={this.state.groupName} onChange={this.groupNameChange}/>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="批量设置"
          visible={this.state.batchSetVisible}
          onOk={this.handleBatchSetOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.handleBatchSetOk}>
            保存
            </Button>,
          ]}
        >
          <Form className={styles.addFactory} onSubmit={this.handleBatchSetOk}>
            <Form.Item label="分组名称">
              <span>{this.state.batchGroupName}</span>
            </Form.Item>
            <Form.Item label="资质满分">
              <Input value={this.state.batchMark} onChange={this.batchMark}/>
            </Form.Item>
            <Form.Item label="最多上传个数">
              <InputNumber min={1} max={10} value={this.state.batchMax} onChange={this.batchuploadNumChange} />
            </Form.Item>
            <Form.Item label="是否必填">
              <Radio.Group value={this.state.batchrequired} onChange={this.batchRadioChange}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
        <div className={styles.formBtn}>
          <Button onClick={this.formCancel} className={styles.m20}>取消</Button>
          <Button onClick={this.formSave} className={styles.m20}>保存</Button>
          <Button type="primary" onClick={this.formSubmit}>提交</Button>
        </div>
        <DetailModal viewDetailModal={this.state.viewDetailModal} viewDetailModalCancel={this.viewDetailModalCancel} objtemp={this.state.objtemp}></DetailModal>
      </div>
    );
  }
}

export default Form.create()(addOrEditFactory);
