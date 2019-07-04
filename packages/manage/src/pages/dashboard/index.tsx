import * as React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import CountCard from './components/CountCard'

interface Props {
  userTotal: number;
  newLastWeekUser: number;
  newThisWeekUser: number;
  topicTotal: number;
  newThisWeekTopic: number;
  newLastWeekTopic: number;
};

@connect(({ app, user, topic }) => ({
  userTotal: user.total,
  newThisWeekUser: user.this_week,
  newLastWeekUser: user.last_week,
  topicTotal: topic.total,
  newThisWeekTopic: topic.this_week,
  newLastWeekTopic: topic.last_week,
}))
export default class Dashboard extends React.Component<Props> {
  render() {
    const { userTotal, newLastWeekUser, newThisWeekUser, topicTotal, newThisWeekTopic, newLastWeekTopic } = this.props

    const data = [
      {
        title: '本周新增用户量',
        icon: 'user',
        color: '#52c41a',
        count: newThisWeekUser,
        last_count: newLastWeekUser,
        rate:  newLastWeekUser === 0 ? '-' : ((newLastWeekUser - newLastWeekUser) / newLastWeekUser) * 100 + '%',
        total: userTotal
      },
      {
        title: '本周新增话题量',
        icon: 'profile',
        color: '#fa8c16',
        count: newThisWeekTopic,
        last_count: newLastWeekTopic,
        rate: newLastWeekTopic === 0 ? '-' : ((newThisWeekTopic - newLastWeekTopic) / newLastWeekTopic) * 100 + '%',
        total: topicTotal
      }
    ];

    return (
      <Row gutter={24}>
        {data.map((item, i) => (
          <Col key={i} xs={24} sm={12} md={12} lg={12} xl={6} style={{ marginBottom: 24 }}>
            <CountCard {...item} />
          </Col>
        ))}
      </Row>
    );
  }
}
