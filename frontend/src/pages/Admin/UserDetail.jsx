import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  Tabs, 
  List, 
  Avatar, 
  Tag, 
  Button, 
  Modal, 
  Form, 
  Input,
  message,
  Timeline
} from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  HistoryOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import * as userService from '../../services/userService.api';
import * as analyticsService from '../../services/analyticsService.api';
import * as courseService from '../../services/courseService';

const { TabPane } = Tabs;

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUser(userId);
        setUser(userData);
        form.setFieldsValue({
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Start polling user analytics
    const unsubscribeAnalytics = analyticsService.startUserAnalyticsPolling(
      userId,
      (data) => setUserAnalytics(data)
    );

    // Fetch enrolled courses if user is a student
    const fetchEnrolledCourses = async () => {
      if (user?.role === 'student') {
        try {
          const courses = await courseService.getEnrolledCourses(userId);
          setEnrolledCourses(courses);
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
        }
      }
    };

    fetchUserData();
    fetchEnrolledCourses();
    setLoading(false);

    return () => {
      unsubscribeAnalytics();
    };
  }, [userId]);

  const handleEditUser = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      await userService.updateUser(userId, values);
      setIsEditModalVisible(false);
      message.success('User updated successfully');
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <Avatar size={64} icon={<UserOutlined />} src={user.photoURL} />
            <div>
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2">
                <Tag color={
                  user.role === 'admin' ? 'red' :
                  user.role === 'instructor' ? 'blue' :
                  'green'
                }>
                  {user.role.toUpperCase()}
                </Tag>
                <Tag color={user.status === 'active' ? 'success' : 'error'}>
                  {user.status.toUpperCase()}
                </Tag>
              </div>
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleEditUser}
          >
            Edit Profile
          </Button>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<span><BookOutlined />Enrolled Courses</span>}
            key="1"
          >
            <List
              dataSource={enrolledCourses}
              renderItem={course => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BookOutlined />}
                    title={course.title}
                    description={`Enrolled: ${new Date(course.enrolledAt?.toDate()).toLocaleDateString()}`}
                  />
                  <div>
                    <Tag color="blue">{course.progress || 0}% Complete</Tag>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane
            tab={<span><HistoryOutlined />Activity History</span>}
            key="2"
          >
            <Timeline>
              {activities.map(activity => (
                <Timeline.Item key={activity.id}>
                  {activity.description}
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(activity.timestamp?.toDate()).toLocaleString()}
                  </span>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="displayName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
          >
            <Input.Group compact>
              <Button
                type={user.status === 'active' ? 'danger' : 'primary'}
                onClick={async () => {
                  try {
                    await userService.updateUser(userId, {
                      status: user.status === 'active' ? 'inactive' : 'active'
                    });
                    message.success('User status updated successfully');
                  } catch (error) {
                    message.error('Failed to update user status');
                  }
                }}
              >
                {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </Button>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetail;