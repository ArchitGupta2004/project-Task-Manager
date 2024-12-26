document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority-select");
    const addBtn = document.getElementById("add-btn");
    const taskList = document.getElementById("task-list");
    const allBtn = document.getElementById("all-btn");
    const activeBtn = document.getElementById("active-btn");
    const completedBtn = document.getElementById("completed-btn");
    const taskCount = document.getElementById("task-count");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Update task count for total, active, and completed tasks
    function updateTaskCount(filter = 'all') {
        const totalTasks = tasks.length;
        const activeTasks = tasks.filter(task => !task.completed).length;
        const completedTasks = tasks.filter(task => task.completed).length;

        if (filter === "all") {
            // For "All", only display the total number of tasks
            taskCount.textContent = `Total Tasks: ${totalTasks}`;
        } else if (filter === "active") {
            // For "Active", show the number of active tasks
            taskCount.textContent = `Active Tasks: ${activeTasks}`;
        } else if (filter === "completed") {
            // For "Completed", show the number of completed tasks
            taskCount.textContent = `Completed Tasks: ${completedTasks}`;
        }
    }

    // Render tasks based on the selected filter (All, Active, Completed)
    function renderTasks(filter = 'all') {
        taskList.innerHTML = "";  // Clear the task list

        let filteredTasks = [];
        if (filter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);  // Show only active tasks
        } else if (filter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);  // Show only completed tasks
        } else {
            filteredTasks = tasks;  // Show all tasks for "All"
        }

        // Render filtered tasks
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.toggle("completed", task.completed);
            li.classList.add(task.priority + "-priority"); // Add the priority class (e.g., "high-priority")

            const taskText = document.createElement("span");
            taskText.classList.add("task-text");
            taskText.textContent = task.text;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks(filter);  // Re-render tasks based on the current filter
                updateTaskCount(filter);  // Update task count
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter(t => t !== task); // Remove the task from the list
                saveTasks();
                renderTasks(filter);  // Re-render tasks after deletion
                updateTaskCount(filter);  // Update task count
            });

            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Add task to the list
    addBtn.addEventListener("click", () => {
        if (taskInput.value.trim() !== "") {
            const newTask = {
                text: taskInput.value.trim(),
                completed: false,
                priority: prioritySelect.value  // Save the selected priority
            };

            tasks.push(newTask);
            saveTasks();
            taskInput.value = "";  // Clear the input field
            renderTasks();  // Re-render tasks with the updated list
            updateTaskCount();  // Update task count for "All"
        }
    });

    // Filter tasks based on button click (All, Active, Completed)
    allBtn.addEventListener("click", () => {
        renderTasks("all");
        updateTaskCount("all");
    });

    activeBtn.addEventListener("click", () => {
        renderTasks("active");
        updateTaskCount("active");
    });

    completedBtn.addEventListener("click", () => {
        renderTasks("completed");
        updateTaskCount("completed");
    });

    // Initial render
    renderTasks("all");
    updateTaskCount("all");
});





