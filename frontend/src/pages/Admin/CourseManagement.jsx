import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import * as courseService from '../../services/courseService';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const { Option } = Select;
const { TextArea } = Input;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  useEffect(() => {
    const unsubscribe = courseService.startCoursesPolling((updatedCourses) => {
      setCourses(updatedCourses.data || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCourse = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await courseService.createCourse(values);
      form.resetFields();
      setIsModalVisible(false);
      message.success('Course created successfully');
    } catch (error) {
      message.error('Failed to create course');
    }
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <a onClick={() => handleCourseClick(record.id)}>{text}</a>
      )
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
      render: (instructor) => instructor?.name || 'Not assigned'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Programming', value: 'programming' },
        { text: 'Design', value: 'design' },
        { text: 'Business', value: 'business' }
      ],
      onFilter: (value, record) => record.category === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrolledCount',
      key: 'enrolledCount',
      sorter: (a, b) => (a.enrolledCount || 0) - (b.enrolledCount || 0)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date?.toDate()).toLocaleString(),
      sorter: (a, b) => a.createdAt - b.createdAt
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button.Group>
          <Button onClick={() => handleCourseClick(record.id)}>View</Button>
          <Button 
            danger 
            onClick={(e) => {
              e.stopPropagation();
              Modal.confirm({
                title: 'Delete Course',
                content: 'Are you sure you want to delete this course?',
                onOk: async () => {
                  try {
                    await courseService.deleteCourse(record.id);
                    message.success('Course deleted successfully');
                  } catch (error) {
                    message.error('Failed to delete course');
                  }
                }
              });
            }}
          >
            Delete
          </Button>
        </Button.Group>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCourse}
        >
          Add Course
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search courses..."
          prefix={<SearchOutlined />}
          onChange={(e) => {
            // Implement course search
          }}
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="id"
        onChange={(pagination, filters, sorter) => {
          // Handle table changes if needed
        }}
      />

      <Modal
        title="Add New Course"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Course Title"
            rules={[{ required: true, message: 'Please enter course title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter course description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select>
              <Option value="programming">Programming</Option>
              <Option value="design">Design</Option>
              <Option value="business">Business</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="instructorId"
            label="Instructor"
            rules={[{ required: true, message: 'Please select instructor' }]}
          >
            <Select
              showSearch
              placeholder="Select instructor"
              optionFilterProp="children"
            >
              {/* Instructor list will be populated from the database */}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (in hours)"
            rules={[{ required: true, message: 'Please enter course duration' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: 'Please enter course price' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;