import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getCourseById, createCourse, updateCourse } from '../../api/courseApi';
import Loader from '../../components/Loader';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  category: Yup.string()
    .required('Category is required'),
  level: Yup.string()
    .required('Level is required'),
  price: Yup.number()
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  isPublished: Yup.boolean()
});

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(!!id);
  const [initialValues, setInitialValues] = React.useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    isPublished: false
  });

  React.useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await getCourseById(id);
        setInitialValues({
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          price: course.price,
          isPublished: course.isPublished
        });
      } catch (err) {
        toast.error(err.message || 'Failed to load course');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const courseData = {
        ...values,
        title: values.title.trim(),
        description: values.description.trim()
      };

      if (id) {
        await updateCourse(id, courseData);
        toast.success('Course updated successfully');
      } else {
        await createCourse(courseData);
        toast.success('Course created successfully');
      }
      navigate('/courses');
    } catch (err) {
      toast.error(err.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold mb-8">
        {id ? 'Edit Course' : 'Create New Course'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.title && touched.title 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } py-2 px-3 shadow-sm focus:ring focus:ring-opacity-50`}
                />
                {errors.title && touched.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.description && touched.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } py-2 px-3 shadow-sm focus:ring focus:ring-opacity-50`}
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.category && touched.category
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } py-2 px-3 bg-white shadow-sm focus:ring focus:ring-opacity-50`}
                  >
                    <option value="">Select a category</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="data">Data Science</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                  </Field>
                  {errors.category && touched.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="level"
                    name="level"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.level && touched.level
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } py-2 px-3 bg-white shadow-sm focus:ring focus:ring-opacity-50`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Field>
                  {errors.level && touched.level && (
                    <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Field
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      className={`block w-full pl-7 pr-3 py-2 rounded-md border ${
                        errors.price && touched.price
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:ring focus:ring-opacity-50`}
                    />
                  </div>
                  {errors.price && touched.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <Field
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Publish this course
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CourseForm;
