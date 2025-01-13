import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";
import { RiCalendarTodoLine } from "react-icons/ri";
import { GrCompliance } from "react-icons/gr";
import { DataContext } from "../App";

const Category = ({
  name,
  index,
  tasks,
  moveCategory,
  moveTask,
  onUpdate,
  onDelete,
}) => {
  const [, drop] = useDrop({
    accept: "CATEGORY",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCategory(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: "CATEGORY",
    item: { index },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="border my-3 p-4 bg-gray-100 rounded"
    >
      <h4 className="text-2xl text-gray-500 capitalize ps-4 my-2 flex flex-wrap gap-3 items-center">
        <span className="cursor-move">
          <RxDragHandleHorizontal />
        </span>
        {name}
      </h4>
      {tasks.map((task, taskIndex) => (
        <Task
          key={task.id}
          category={name}
          task={task}
          index={taskIndex}
          moveTask={moveTask}
          onUpdate={onUpdate}
          onDelete={() => onDelete(taskIndex)}
        />
      ))}
    </div>
  );
};

const Task = ({ category, task, index, moveTask, onUpdate, onDelete }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(category, draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: "TASK",
    item: { index },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`px-8 bg-slate-300 my-2 p-3 flex flex-wrap justify-between rounded ${
        task.status === "completed" && "line-through"
      }`}
    >
      <p className="text-md flex  gap-3 items-center w-1/3">
        <span className="cursor-move">
          <RxDragHandleHorizontal />
        </span>
        {task.id}. {task.task}
      </p>
      <p className="text-md flex flex-wrap gap-1 items-center">
        <span className="">
          {task.status === "inprogress" && <FaRegClock className="text-sm" />}
          {task.status === "todo" && <RiCalendarTodoLine className="text-sm" />}
          {task.status === "completed" && <GrCompliance className="text-sm" />}
        </span>
        {task.status}
      </p>
      <div className="flex gap-2 items-center">
        {task.status !== "completed" && (
          <p
            onClick={() => onUpdate(task.id, category, task.task, task.status)}
          >
            <FiEdit className="text-orange-500 cursor-pointer" />
          </p>
        )}
        <p onClick={onDelete}>
          <AiTwotoneDelete className="text-red-600 cursor-pointer" />
        </p>
      </div>
    </div>
  );
};

const TodoList = () => {
  const [category, setCategory] = React.useState("");
  const [task, setTask] = React.useState("");
  const [updateId, setUpdateId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const { data, setData } = React.useContext(DataContext);

  const handleCreate = () => {
    if (!category || !task) {
      setError("Fill the Category and Task");
      return;
    }
    const oldData = { ...data };
    if (oldData[category]) {
      oldData[category].push({
        id: data[category].length + 1,
        task,
        status: "inprogress",
      });
      //   setData(oldData);
    } else {
      oldData[category] = [{ id: 1, task, status: "inprogress" }];
      //   setData({ ...data, [category]: [{ id: 1, task, status: "inprogress" }] });
    }
    setData(oldData);
    // localStorage.setItem("data", JSON.stringify(values));
    setCategory("");
    setTask("");
    setError(null);
  };

  const handleSetUpdateData = (updateId, category, task, status) => {
    setUpdateId(updateId);
    setCategory(category);
    setTask(task);
    setStatus(status);
  };

  const handleUpdate = () => {
    const newState = { ...data };
    newState[category] = newState[category].map((item) =>
      item.id === updateId ? { ...item, task, status } : item
    );
    setData(newState);
    setUpdateId(null);
    setCategory("");
    setTask("");
    setStatus("");
  };

  const moveCategory = (dragIndex, hoverIndex) => {
    const categoryNames = Object.keys(data);
    const reorderedCategories = [...categoryNames];
    const [movedCategory] = reorderedCategories.splice(dragIndex, 1);
    reorderedCategories.splice(hoverIndex, 0, movedCategory);

    const reorderedData = {};
    reorderedCategories.forEach((cat) => {
      reorderedData[cat] = data[cat];
    });

    setData(reorderedData);
  };

  const moveTask = (category, dragIndex, hoverIndex) => {
    const updatedTasks = [...data[category]];
    const [movedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, movedTask);

    setData({ ...data, [category]: updatedTasks });
  };

  return (
    <div className="flex flex-wrap justify-center mt-6">
      <div className="w-2/5 bg-blue-100 p-6">
        <div className="flex flex-wrap justify-between mb-4">
          <h3 className="text-3xl">Todo's List</h3>
        </div>
        <div className="flex flex-wrap flex-col gap-2">
          <div className="flex flex-wrap gap-4">
            <select
              className="flex-1 border-blue-900 h-9 rounded-sm ps-3"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError(null);
              }}
              disabled={updateId}
            >
              <option value={""}>--Select--</option>
              <option value={"learnings"}>learnings</option>
              <option value={"ideas"}>ideas</option>
              <option value={"research"}>research</option>
            </select>
            <input
              placeholder="Enter task"
              className="flex-2 border border-blue-900 h-9 rounded-sm ps-3"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                setError(null);
              }}
            />
          </div>
          {updateId && (
            <select
              className="border-blue-900 h-9 rounded-sm ps-3"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setError(null);
              }}
            >
              <option value={"todo"}>To Do</option>
              <option value={"inprogress"}>In Progress</option>
              <option value={"completed"}>Completed</option>
            </select>
          )}
          <button
            className="text-md bg-blue-900 text-white w-full py-1 uppercase hover:bg-blue-800 active:bg-blue-700 transition-all"
            onClick={updateId ? handleUpdate : handleCreate}
          >
            {updateId ? "Update" : "Create"}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <DndProvider backend={HTML5Backend}>
          {Object.keys(data).map((cat, index) => (
            <Category
              key={cat}
              name={cat}
              index={index}
              tasks={data[cat]}
              moveCategory={moveCategory}
              moveTask={moveTask}
              onUpdate={handleSetUpdateData}
              onDelete={(taskIndex) =>
                setData((prev) => {
                  setCategory("");
                  setTask("");
                  setUpdateId(null);
                  const updatedCategory = [...prev[cat]];
                  updatedCategory.splice(taskIndex, 1);
                  if (updatedCategory.length === 0) {
                    const newData = { ...prev };
                    delete newData[cat];

                    return newData;
                  }
                  return { ...prev, [cat]: updatedCategory };
                })
              }
            />
          ))}
        </DndProvider>
      </div>
    </div>
  );
};

export default TodoList;
