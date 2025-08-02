import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../axios/useApi';

export default function TaskModal({ show, onClose, selectedDate=null , selectedTask = null , fetchEvents=null }) {
    const api = useApi();
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            due_date: selectedDate || '',
            status: 'pending',
            priority: 'low',
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().max(200).required('Title is required'),
            description: Yup.string(),
            due_date: Yup.date().required('Due date is required'),
            status: Yup.string().oneOf(['pending', 'in-progress', 'completed']),
            priority: Yup.string().oneOf(['low', 'medium', 'high']),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    ...values,
                    user_id: String(currentUser?.id),
                    due_date: new Date(values.due_date).toISOString(),
                };
                console.log(payload);
                if (selectedTask) {
                    payload.id = String(selectedTask.id);
                    await api.patch (`/task/update/${selectedTask.id}`, payload);
                    fetchEvents();
                    alert('Task updated successfully!');
                }else{
                    await api.post('/task/create', payload);    
                    fetchEvents();
                    alert('Task created successfully!');
                }
                resetForm();
                onClose();
            } catch (err) {
                console.log(err , 'error while creating task')
                alert('Failed to create task');
            }
        },
    });
    console.log(selectedTask, 'selected task in modal');
    useEffect(() => {
        if (selectedTask) {
            console.log('due date in selected task', selectedTask.due_date);
            formik.setValues({
                title: selectedTask.title || '',
                description: selectedTask.description || '',
                due_date: selectedTask.due_date ? new Date(selectedTask.due_date).toISOString().split('T')[0] : '',
                status: selectedTask.status || 'pending',
                priority: selectedTask.priority || 'low',
            });
        } else {
            formik.resetForm();
            formik.setFieldValue('due_date', selectedDate || '');
        }

    },[selectedTask, selectedDate]);
    console.log(formik.values, 'formik values');
    
    if (!show) return null;
    
    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="shadow-lg bg-gray-100 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Create Task</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Title</label>
                        <input
                            name="title"
                            className="w-full p-2 border rounded"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="text-red-500 text-sm">{formik.errors.title}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">Description</label>
                        <textarea
                            name="description"
                            className="w-full p-2 border rounded"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div>
                        <label className="block">Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            className="w-full p-2 border rounded"
                            value={formik.values.due_date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.due_date && formik.errors.due_date && (
                            <div className="text-red-500 text-sm">{formik.errors.due_date}</div>
                        )}
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label className="block">Status</label>
                            <select
                                name="status"
                                className="w-full p-2 border rounded"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block">Priority</label>
                            <select
                                name="priority"
                                className="w-full p-2 border rounded"
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}