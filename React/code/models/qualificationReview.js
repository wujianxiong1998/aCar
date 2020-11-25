import {
  factoryListPage,
  getViewFactoryDetail,
  getEditFactory,
  getGroupListForOperationStandard,
  getPlatformItemList,
  getCategoryGroup,
  queryGroup,
  groupDetail,
  productListPage,
  insertOperation,
  updateOperation,
  saveDraft,
  saveStandard,
  detail,
  categoryGroupListPage,
  qualityCancel,
  factoryCancel,
  factoryRecover,
  checkCanEdit,
} from '@/services/qualificationReview';
import { message } from 'ygd';
import router from 'umi/router';

export default {
  nameSpace: 'qualificationReview',
  state: {
    category: [],
    qualificationReviewList: {},
    factoryReviewList: {},
    qualificationNameList: [],
    factoryDetail: {},
    groupListForOperationStandardArr: [],
    platformItemDetailList: {},
    categoryDetailList: {},
    qualificationGroupList: {},
    detailList: {},
    importList: [],
    categoryList: {},
  },
  effects: {
    // 验厂相关接口
    // 验厂列表
    * getfactoryReviewList({payload}, {call, put}) {
      const response = yield call(factoryListPage, payload);
      let arr = response.resultData;
      for (let i = 0;i < arr.length;i++) {
        for (let j = i + 1;j < arr.length;j++) {
          if (arr[i].categoryGroupId === arr[j].categoryGroupId && ((arr[i].statusDesc === '草稿' && arr[j].statusDesc === '正常') || arr[j].statusDesc === '草稿' && arr[i].statusDesc === '正常')) {
            if (arr[i].statusDesc === '正常') {
              arr[i].statusId = '正常';
            } else {
              arr[j].statusId = '正常';
            }
          }
        }
      }
      console.log(arr);
      yield put({
        type: 'factoryReviewList',
        payload: response,
      });
    },
    // 验厂详情
    * getFactoryDetail({payload}, {call, put}) {
      const response = yield call(getViewFactoryDetail, payload);
      yield put({
        type: 'factoryDetail',
        payload: response,
      });
    },
    // 编辑验厂资质回显
    * getFactoryTable({payload, callback}, {call, put}) {
      const response = yield call(getEditFactory, payload);
      if (callback) {callback(response);}
      yield put({
        type: 'factoryTable',
        payload: response,
      });
    },
    // 保存验厂资质草稿
    * saveDraft({payload, callback}, {call, put}) {
      const [error, response] = yield call(saveDraft, payload);
      if (error) {
        message.error(error.error.descp);
      } else {
        message.success('保存成功');
        return response;
      }
    },
    // 提交验厂资质
    * saveStandard({payload, callback}, {call, put}) {
      const [error, response] = yield call(saveStandard, payload);
      if (error) {
        message.error(error.error.descp);
      } else {
        message.success('操作成功');
        return response;
      }
    },

    // 生产经营资质相关接口
    // 查看生产经营资质
    * productListPage({payload}, {call, put}) {
      const response = yield call(productListPage, payload);
      yield put({
        type: 'qualificationReviewList',
        payload: response,
      });
    },
    // 新增生产经营资质
    * insertOperation({payload}, {call, put}) {
      const [error, response] = yield call(insertOperation, payload);
      if (!error) {
        message.success('新增成功');
        router.goBack();
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    // 编辑生产经营资质
    * updateOperation({payload}, {call, put}) {
      const [error, response] = yield call(updateOperation, payload);
      if (!error) {
        message.success('编辑成功');
        router.goBack();
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    * getPlatformItemList({payload, callback}, {call, put}) {
      const response = yield call(getPlatformItemList, payload);
      yield put({
        type: 'platformItemDetailList',
        payload: response,
      });
      if (callback) {callback(response);}
    },
    * getGroupListForOperationStandard({payload, callback}, {call, put, select}) {
      const response = yield call(getGroupListForOperationStandard, payload);
      yield put({
        type: 'groupListForOperationStandardArr',
        payload: response,
      });
      if (callback) {callback(response);}
    },
    * getCategoryGrouparr({payload}, {call, put}) {
      const response = yield call(getCategoryGroup, payload);
      yield put({
        type: 'categoryDetailList',
        payload: response,
      });
    },
    * getCategoryGroup({payload}, {call, put}) {
      const response = yield call(getCategoryGroup, payload);
      yield put({
        type: 'categoryDetailList',
        payload: response,
      });
    },
    * categoryGroupListPage({payload}, {call, put}) {
      const response = yield call(categoryGroupListPage, payload);
      yield put({
        type: 'categoryList',
        payload: response,
      });
    },
    * getTableList({payload, callback}, {call, put}) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: 'qualificationGroupList',
        payload: response,
      });
      if (callback) {callback(response);}
    },
    * getDetailList({payload, callback}, {call, put}) {
      const response = yield call(groupDetail, payload);
      yield put({
        type: 'detailList',
        payload: response,
      });
      if (callback) {callback(response);}
    },
    * restDetailList({payload, callback}, {call, put}) {
      const response = yield call(groupDetail, payload);
      yield put({
        type: 'detailList',
        payload: response,
      });
    },
    * getDetail ({payload, callback}, {call, put}) {
      const [error, response] = yield call(detail, payload);
      if (!error) {
        response.platformItemAttaches.map((item) => {
          item.fileUrlType = item.url.substring(item.url.lastIndexOf('.') + 1, item.url.length);
        });
        // yield put({
        //   type: 'importList',
        //   payload: response,
        // });
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    * factoryCancel ({payload, callback}, {call, put}) {
      const [error, response] = yield call(factoryCancel, payload);
      if (!error) {
        message.success('操作成功');
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    * factoryRecover ({payload, callback}, {call, put}) {
      const [error, response] = yield call(factoryRecover, payload);
      if (!error) {
        message.success('操作成功');
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    * qualityCancel ({payload, callback}, {call, put}) {
      const [error, response] = yield call(qualityCancel, payload);
      if (!error) {
        message.success('操作成功');
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
    * checkCanEdit ({payload}, {call, put}) {
      const [error, response] = yield call(checkCanEdit, payload);
      if (!error) {
        return response;
      } else {
        message.error(error.error.descp);
      }
    },
  },
  reducers: {
    getGroupNameList(state, action) {
      return {
        ...state,
        category: action.payload,
      };
    },
    qualificationReviewList(state, action) {
      return {
        ...state,
        qualificationReviewList: action.payload,
      };
    },
    factoryReviewList(state, action) {
      return {
        ...state,
        factoryReviewList: action.payload,
      };
    },
    qualificationNameList(state, action) {
      return {
        ...state,
        qualificationNameList: action.payload,
      };
    },
    factoryTable(state, action) {
      return {
        ...state,
        factoryTable: action.payload,
      };
    },
    factoryDetail(state, action) {
      return {
        ...state,
        factoryDetail: action.payload,
      };
    },
    platformItemDetailList(state, action) {
      return {
        ...state,
        platformItemDetailList: action.payload,
      };
    },
    groupListForOperationStandardArr(state, action) {
      return {
        ...state,
        groupListForOperationStandardArr: action.payload,
        // newarr,
      };
    },
    categoryDetailList(state, action) {
      return {
        ...state,
        categoryDetailList: action.payload,
      };
    },
    qualificationGroupList(state, action) {
      return {
        ...state,
        qualificationGroupList: action.payload,
      };
    },
    detailList(state, action) {
      return {
        ...state,
        detailList: action.payload,
      };
    },
    importList(state, action) {
      return {
        ...state,
        importList: action.payload,
      };
    },
    categoryList(state, action) {
      return {
        ...state,
        categoryList: action.payload,
      };
    },
  },
};
