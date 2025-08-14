import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useApi } from '../../axios/useApi.js'
import interactionPlugin from "@fullcalendar/interaction";
import {toast } from 'sonner';
import { ShieldAlert , Trash, LayoutList } from 'lucide-react';
import TaskModal from '../Modal/TaskModal.jsx';
import ConfirmDialog from '../Modal/ConfirmDialog.jsx';
import ScheduledTasks from '../tasks/ScheduledTasks.jsx';

function CalendarView() {
    const api = useApi()
    const [tasks , setTasks] = useState([]);
    const [selectedDate , setSelectedDate ] = useState(null);
    const [showModal , setShowModal] = useState(false);
    const [selectedTask , setSelectedTask ] = useState(null);
    const [ showConfirm , setShowConfirm ] = useState(false);
    const [taskIdToDelete , setTaskIdToDelete ] = useState(null);
    const [loading  , setLoading ] = useState(false);
    console.log(tasks, 'tasks in calendar view');
    useEffect(() => {
        fetchEvents()
    },[])
    const fetchEvents = async() => {
        try {
            setLoading(true)
            const res = await api.get('/task/list');
            console.log(res.data)
            const currentTasks = res.data.tasks;
            setTasks(currentTasks)
        }catch(error) {
            console.error("error fetching the tasks", error);

        }
    }

    const handleDateClick = (info) => {
        console.log('click event got trigered!!')
        setSelectedDate(info.dateStr);
        setShowModal(true);
    }

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); 
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getCalendarEvents = () => {
    return tasks
        .map((task) => ({
        id: task.id || task._id,
        title: task.title.slice(0 , 14) + "..." ,
        date: formatDate(task.due_date),
        backgroundColor:
            task.priority === "high"
            ? "#ef4444"
            : task.priority === "medium"
            ? "#f59e0b"
            : "#10b981",
        borderColor:
            task.priority === "high"
            ? "#dc2626"
            : task.priority === "medium"
            ? "#d97706"
            : "#059669",
        extendedProps: {
            status: task.status,
            priority: task.priority,
            description: task.description,
        },
        }))
        .filter((event) => event.date);
    };

    const handleOpenDelete = (taskId) => {
        setTaskIdToDelete(taskId);
        setShowConfirm(true);
    }

    console.log(tasks)
    const handleDelete = async () => {
        try {
            setLoading(true);
            await api.delete(`/task/delete/${taskIdToDelete}`);
            toast.success('Task deleted successfully!', {
                icon: <ShieldAlert className="w-4 h-4" />
            });
            fetchEvents();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error('Failed to delete task');
        } finally {
            setShowConfirm(false);
            setLoading(false);
        }
    };

  return (

   <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5">

        <div className="bg-gray-900 rounded-2xl p-4 text-white">

            <div className='flex justify-content-center' >
                <h2 className='font-semibold text-xl text-gray-300 mx-auto' > Scheduled Tasks
                <LayoutList size={27} className='inline ml-2'/>    
                </h2>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-white to-gray-500 my-4"></div>

            <div>
            
            </div>
            <ScheduledTasks tasks={tasks} />
        </div>
        <div className='lg:col-span-2' >


            <FullCalendar
                plugins={[ dayGridPlugin , interactionPlugin ]}
                initialView='dayGridMonth'
                events={getCalendarEvents()}
                headerToolbar={{

                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth"
                }}
                eventDisplay='block'
                height="auto"
                validRange={{
                    start: new Date().toISOString().split("T")[0],
                }}
                dateClick={handleDateClick}
                eventClick={(info) => {
                    console.log(tasks , 'takks in event')
                    const task = tasks.find(
                        (t) => (t.id || t._id) == info.event.id
                    );
                    if (task) {
                        setSelectedTask(task);
                        setShowModal(true);
                    }
                }}
                eventContent={(arg) => (
                    <div style={{ position: 'relative' }}>
                    <span>{arg.event.title}</span>
                    <button
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                        }}
                        onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(arg.event.id);
                        }}
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                    </div>
                )}
                dayCellClassNames="hover:bg-gray-800 transition-colors cursor-pointer text-white"
            />
        </div>

        <TaskModal
            show={showModal}
            onClose={() => setShowModal(false)}
            selectedDate={selectedDate}
            fetchEvents={fetchEvents}
        />
        
        {selectedTask && (

            <TaskModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedTask(null);
                }}
                selectedDate={selectedDate}
                selectedTask={selectedTask}
                fetchEvents={fetchEvents}
                
            />
        )}
        <ConfirmDialog
            open={showConfirm}
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            onClose={() => setShowConfirm(false)}
            onConfirm={handleDelete}
            confirmText="Delete"
            cancelText="Cancel"
        />
    </div>
  )
}

export default CalendarView
