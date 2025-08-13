import React , {useState , useEffect} from "react";
import { CheckCircle, Clock } from "lucide-react";

    const ScheduledTasks = ({ tasks }) => {
        const [timeLeft, setTimeLeft] = useState({});
        const getPriorityColor = (priority) => {
            switch (priority) {
            case "high": return "text-red-500 border-red-500";
            case "medium": return "text-yellow-500 border-yellow-500";
            case "low": return "text-green-500 border-green-500";
            default: return "text-gray-400 border-gray-400";
        }
    };

    const calculateTimeLeft = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff <= 0) return "Due!";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        return `${days}d ${hours}h ${minutes}m`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
        const updated = {};
        tasks.forEach((task) => {
            updated[task.id || task._id] = calculateTimeLeft(task.due_date);
        });
        setTimeLeft(updated);
        }, 60000);

        const initial = {};
        tasks.forEach((task) => {
        initial[task.id || task._id] = calculateTimeLeft(task.due_date);
        });
        setTimeLeft(initial);

        return () => clearInterval(interval);
    }, [tasks]);


  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id || task._id} 
          className={`border rounded-xl p-4 shadow-sm flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            
            {task.status === "completed" ? (
              <CheckCircle className={`w-5 h-5 ${getPriorityColor(task.priority)}`} />
            ) : (
              <Clock className={`w-5 h-5 ${getPriorityColor(task.priority)}`} />
            )}
          </div>

          {/* Description if available */}
          {task.description && (
            <p className="text-sm text-gray-400">{task.description}</p>
          )}

          <div className="flex justify-between text-xs text-gray-500">
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            <span className="text-xs font-medium text-blue-400">
                Time left: {timeLeft[task.id || task._id] || "Loading..."}
            </span>


          </div>

        <div className="w-1/3 text-center text-xs font-medium px-1 py-2 rounded border border-gray-400 text-gray-300">
            {task.status}
        </div>

        </div>
      ))}
    </div>
  );
};

export default ScheduledTasks;
