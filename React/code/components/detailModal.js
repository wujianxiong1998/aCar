import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Input } from 'ygd';
import styles from '../qualificationReview/addOrEditFactory.less';

@connect(({qualificationReview}) => ({
  qualificationReview,
}))

class detailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
handleCancel = () => {
  this.props.viewDetailModalCancel();
}
render () {
  const { viewDetailModal, objtemp } = this.props;
  console.log(objtemp, 'objtemp');
  return (
    <div >

      <Modal
        title="查看详情"
        visible={viewDetailModal}
        footer={null}
        onCancel={this.handleCancel}
        className={styles.detailModal}
      >
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质分组名称：</span>
          <span>{objtemp && objtemp.itemGroupName ? objtemp.itemGroupName : '--'}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质名称：</span>
          <span>{objtemp && objtemp.projectName ? objtemp.projectName : '--'}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>重点字段：</span>
          <span>{objtemp && objtemp && objtemp.importantFieldsMap && objtemp.importantFieldsMap.map((item, index) => <span key={index}>{item.label ? item.label : item.propName}&nbsp;&nbsp;&nbsp;</span>)}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>最多上传个数：</span>
          <span>{objtemp && objtemp.attachMaxNum ? objtemp.attachMaxNum : '--'}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>是否必填项：</span>
          <span>{objtemp && objtemp ? objtemp.required === 0 ? '是' : '否' : '--'}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>提交要求：</span>
          <Input value={objtemp && objtemp.submissionRequire ? objtemp.submissionRequire : ''}/>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>评分标准：</span>
          <Input value={objtemp && objtemp.evaluationStandard ? objtemp.evaluationStandard : ''}/>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质满分：</span>
          {/* <Input value={objtemp.mark ? objtemp.mark : ''}/> */}
          <span>{objtemp && objtemp.mark ? objtemp.mark : ''}</span>
        </p>
        <p>
          <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资料说明：</span>
          <Input value={objtemp && objtemp.dataDescription ? objtemp.dataDescription : ''}/>
        </p>
      </Modal>

    </div>

  );
}
}

export default detailModal;

