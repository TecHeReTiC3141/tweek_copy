import React, {useEffect, useState} from 'react'
import TaskList from './TaskList.jsx'
import {useLoaderData, useSearchParams} from "react-router-dom";
import { onSnapshot, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../../scripts/firebase.js";
import AuthContext, { useAuth } from "../../contexts/AuthContext.jsx";
import { reOrderTasks, getUserTasks } from "../../scripts/api.js";


// TODO: defer loading tasks and add spinner loading component
export const loader = AuthContext => async () => {
    const { currentUser } = AuthContext;
    console.log(currentUser, currentUser?.uid);
    const userTasks = await getUserTasks(currentUser?.uid);
    console.log(userTasks);
    return userTasks;
}

function formDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const TaskListContainer = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [curDate, setCurDate] = useState(new Date());

    const [tasks, setTasks] = useState(useLoaderData());

    const [maxTasks, setMaxTasks] = React.useState(10);

    const changeMaxTasks = (newTasks) => {
        // TODO: set maxTasks more precise in case of long "last" task list
        if (newTasks > maxTasks) setMaxTasks(newTasks);
    }

    function reorderTasks(listInd) {
        return async ev => {
            console.log(ev);
            const oldIndex = ev.oldIndex, newIndex = ev.newIndex;

            const curListTasks = [...tasksData[formDate(dates[listInd])]];
            const temp = curListTasks[oldIndex];
            curListTasks.splice(curListTasks.indexOf(curListTasks[oldIndex]), 1);
            curListTasks.splice(newIndex, 0, temp);


            console.log(tasksData[formDate(dates[listInd])], curListTasks);
            await reOrderTasks(curListTasks);
        }
    }

    const { currentUser } = useAuth();
    // console.log(tasks.length, tasks);

    useEffect(() => {

        const taskColRef = collection(db, "tasks");
        const q = query(taskColRef,
            where("uid", "==", currentUser?.uid || "null"), orderBy("order"));
        return onSnapshot(q, snapshot => {
            setTasks(snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                date: new Date(doc.data().date),
            })))
        })
    }, [currentUser]);

    useEffect(() => {
        setInterval(() => {
            const openedBlur = document.querySelector(".blur-bg.active");
            document.body.style.overflowY = openedBlur ? "hidden" : "auto";
        }, 50);
    }, []);

    useEffect(() => {
        if (searchParams.has("weekShift")) {
            const shift = +searchParams.get("weekShift") * 7;
            console.log(shift);
            setCurDate((prevCurDate) => {
                const newDate = new Date();
                newDate.setDate(newDate.getDate() + shift);
                return newDate;
            })
        }

    }, [searchParams.get("weekShift")]);

    const dayOfWeek = (curDate.getDay() - 1) % 7;
    const dates = [];
    const tasksData = {};
    for (let i = -dayOfWeek; i < -dayOfWeek + 7; ++i) {
        const newDate = new Date(+curDate);
        newDate.setDate(newDate.getDate() + i);
        dates.push(newDate);
        tasksData[formDate(newDate)] = tasks.filter(task => formDate(task.date) === formDate(newDate));
        changeMaxTasks(tasksData[formDate(newDate)].length + 1);
    }
    // console.log(tasksData);


    return (
        <div className="w-full padding-x flex flex-col lg:flex-row gap-6 py-4 max-lg:mt-10 dark:bg-black dark:text-white">
            {
                dates.slice(0, 5).map((date, index) => (
                    <TaskList date={date} key={index} ind={index} active={formDate(new Date()) === formDate(date)}
                              last={false} reorderTasks={reorderTasks(index)}
                              maxTasks={maxTasks} changeMaxTasks={changeMaxTasks} tasksData={tasksData[formDate(date)]}/>
                ))
            }
            <div className="flex-1 ">
                {
                    dates.slice(5).map((date, index) => (
                        <TaskList date={date} key={index} ind={index} active={formDate(new Date()) === formDate(date)}
                                  last={true} reorderTasks={reorderTasks(index)}
                                  maxTasks={maxTasks} changeMaxTasks={changeMaxTasks} tasksData={tasksData[formDate(date)]}/>
                    ))
                }
            </div>
        </div>
    )
}

export default TaskListContainer