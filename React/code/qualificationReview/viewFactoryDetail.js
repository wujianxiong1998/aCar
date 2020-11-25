import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeader, Card, Input } from 'ygd';

@connect(({qualificationReview}) => ({
  qualificationReview,
}))

class viewFactoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { factoryEvaluationItemId } = this.props.location.query;
    dispatch({
      type: 'qualificationReview/getFactoryDetail',
      payload: {
        factoryEvaluationItemId: factoryEvaluationItemId,
      },
    });
  }
  render () {
    const { factoryDetail } = this.props.qualificationReview;
    return (
      <div>
        <PageHeader title="查看验厂资质" />
        <Card>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质分组名称：</span>
            <span>{factoryDetail ? factoryDetail.groupName : '--'}</span>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质名称：</span>
            <span>{factoryDetail ? factoryDetail.projectName : '--'}</span>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>重点字段：</span>
            <span>{factoryDetail ? factoryDetail.importantFields : '--'}</span>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>最多上传个数：</span>
            <span>{factoryDetail ? factoryDetail.attachMaxNum : '--'}</span>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>是否必填项：</span>
            <span>{factoryDetail ? factoryDetail.required : '--'}</span>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>提交要求：</span>
            <Input value={factoryDetail ? factoryDetail.submissionRequire : ''}/>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>评分标准：</span>
            <Input value={factoryDetail ? factoryDetail.evaluationStandard : ''}/>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资质满分：</span>
            <Input value={factoryDetail ? factoryDetail.mark : ''}/>
          </p>
          <p>
            <span style={{display: 'inline-block', width: 100, textAlign: 'right', paddingRight: 5}}>资料说明：</span>
            <Input value={factoryDetail ? factoryDetail.dataDescription : ''}/>
          </p>
        </Card>
      </div>
    );
  }
}

export default viewFactoryDetail;
