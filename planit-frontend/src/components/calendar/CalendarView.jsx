import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useApi } from '../../axios/useApi'
import interactionPlugin from "@fullcalendar/interaction";
import {toast} from 'sonner';
import { ShieldAlert } from 'lucide-react';
import TaskModal from '../Modal/TaskModal';

function CalendarView() {
    const api = useApi()
    const [tasks , setTasks] = useState([]);
    const [selectedDate , setSelectedDate ] = useState(null);
    const [showModal , setShowModal] = useState(false);
    const [selectedTask , setSelectedTask ] = useState(null);
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
        title: task.title,
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

  return (

    <div>
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
                console.log(task, 'task in event click');
                if (task){
                    setSelectedTask(task);
                    setShowModal(true);
                }else{
                    console.log("Task not found for event click", info.event.id);
                }
            }}
            dayCellClassNames="hover:bg-gray-800 transition-colors cursor-pointer text-white"

        />

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
        
    </div>
  )
}

export default CalendarView
