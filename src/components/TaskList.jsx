import React from 'react'
import Task from './Task';

const TaskList = ({date, active, last, maxTasks, changeMaxTasks, tasksData}) => {

    const getDate = date => {
        let day = date.getDate().toString(), month = (date.getMonth() + 1).toString();
        if (day.length < 2) day = "0" + day;
        if (month.length < 2) month = "0" + month;
        return `${day}.${month}`;
    }

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const day = days[ date.getDay() ];
    const month = months[ date.getMonth() ];

    const [tasks, setTasks] = React.useState(tasksData);


    function handleClick(ev) {
        if (ev.target.tagName !== 'INPUT') return; 
        const thisTaskList = ev.target.parentElement.parentElement;
        const firstInput = thisTaskList.querySelector('input:first-of-type');
        firstInput.focus();
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
            const curInput = document.querySelector('input:focus');
            
            if (curInput.value) {
                const thisTaskList = curInput.parentElement.parentElement.parentElement;
                if (thisTaskList.dataset.date == date.getDate()) {
                    console.log(curInput.value)
                    const newTask = curInput.value
                    setTasks(prevTasks => {
                        console.log(newTask, `Prev tasks ${prevTasks}`, {
                            task: newTask,
                            done: false
                        });
                        return [...prevTasks, 
                        {
                            task: newTask,
                            done: false
                        }]}
                    );
                }
                curInput.value = '';
            }
        }
    }

    React.useEffect(() => {
        const thisTaskList = document.querySelector(`.task-list[data-date="${date.getDate()}"]`);
        console.log(thisTaskList);
        const firstInput = thisTaskList.querySelector('input:first-of-type');
        if (firstInput) {
            console.log(firstInput);
            firstInput.removeAttribute('disabled');
            firstInput.focus();
        }
    }, [tasks])


    React.useEffect(() => {


        const thisTaskList = document.querySelector(`.task-list[data-date="${date.getDate()}"]`);
        thisTaskList.addEventListener('click', handleClick);
        thisTaskList.addEventListener('keydown', handleKeyDown);
        return () => {
            thisTaskList.removeEventListener('click', handleClick);
            thisTaskList.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const tasksComponents = [];
    for (let i = 0; i < (last ? maxTasks / 2 : maxTasks); ++i) {
        console.log(i, tasks[i])
        tasksComponents.push(<Task key={i} data={i < tasks.length && tasks[i]}/>);
    }


    return (
        <div className="task-list flex flex-col last:col-start-6 last:col-end-7 " data-date={date.getDate()}>
            <div className={`flex justify-between items-center py-4 border-b-2 ${active ? "border-blue-600" : "border-black"}`}>
                <h2 className={`text-lg lg:text-2xl font-bold  ${active ? "text-blue-600" : "text-gray-600"}`}>{getDate(date)}</h2>
                <h3 className="text-lg lg:text-2xl text-gray-300">{day.slice(0, 3)}</h3>
            </div>

            <div>
                {tasksComponents}
            </div>
        </div>
    )
}

export default TaskList