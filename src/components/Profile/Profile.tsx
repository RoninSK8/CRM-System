import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProfile } from '../../store/User/user.slice';
import { useGetProfileQuery } from '../../store/User/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (profile) {
      dispatch(setProfile({ userProfile: profile }));
    }
  }, [dispatch, profile]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    // TODO Отрефакторить вёрстку - мб заменить антовский кард на другой компонент
    <Card size='small' style={{ margin: '8px 0px' }}>
      <Row>
        <Col
          span={18}
          style={{
            display: 'flex',
            justifyContent: 'start',
            gap: '20px',
          }}
        >
          <Row>
            <label
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <span>Имя пользователя</span>
              <span>{profile?.username}</span>
            </label>
          </Row>
        </Col>
        <Col
          span={18}
          style={{
            display: 'flex',
            justifyContent: 'start',
            gap: '20px',
          }}
        >
          <Row>
            <label
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <span>Телефон</span>
              <span>{profile?.phoneNumber}</span>
            </label>
          </Row>
        </Col>
        <Col
          span={18}
          style={{
            display: 'flex',
            justifyContent: 'start',
            gap: '20px',
          }}
        >
          <Row>
            <label
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <span>Почтовый адрес</span>
              <span>{profile?.email}</span>
            </label>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Profile;
