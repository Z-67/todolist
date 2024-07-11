document.addEventListener('DOMContentLoaded', function() {
    var addProjectButton = document.querySelector('.addProject');
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');
    var projectList = document.getElementById('projectList');
    var projectForm = document.getElementById('projectForm');
    var projectTitle = document.getElementById('projectTitle');
    var projectDescription = document.getElementById('projectDescription');
    var editButton = document.querySelector('.edit');
    var addTaskButton = document.querySelector('.addTask');
    var taskFormContainer = document.getElementById('taskFormContainer');
    var taskList = document.getElementById('taskList');
    var selectedProjectId = null;
    var projects = JSON.parse(localStorage.getItem('projects')) || [];

    // Handle add project button click
    addProjectButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;

        var project = {
            id: Date.now(),
            title: title,
            description: description,
            tasks: []
        };

        projects.push(project);
        saveProjects();
        addProjectToList(project);

        projectForm.reset();
        modal.style.display = 'none';
    });

    // New code for adding tasks
    function renderNewTaskForm() {
        taskFormContainer.innerHTML = `
            <div class="form-group">
                <label for="newTaskTitle">Task Name:</label>
                <input type="text" id="newTaskTitle" name="newTaskTitle" required>
            </div>
            <button class="submit-btn" id="submitNewTask">Submit</button>
            <button class="cancel-btn" id="cancelNewTask">Cancel</button>
        `;

        document.getElementById('submitNewTask').addEventListener('click', function(event) {
            event.preventDefault();
            var title = document.getElementById('newTaskTitle').value.trim();

            if (title) {
                addNewTask(title);
                taskFormContainer.style.display = 'none';
                taskFormContainer.innerHTML = '';
            }
        });

        document.getElementById('cancelNewTask').addEventListener('click', function() {
            taskFormContainer.style.display = 'none';
            taskFormContainer.innerHTML = '';
        });
    }

    function addNewTask(title) {
        var task = {
            id: Date.now(),
            title: title
        };

        var project = projects.find(p => p.id === selectedProjectId);
        if (project) {
            project.tasks = project.tasks || [];
            project.tasks.push(task);
            saveProjects();
            renderTaskList(project.tasks);
        }
    }

    function saveProjects() {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function loadProjects() {
        var savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
            projects = JSON.parse(savedProjects);
            projects.forEach(function(project) {
                addProjectToList(project);
            });
        }
    }

    function addProjectToList(project) {
        var li = document.createElement('li');
        li.classList.add('projectButton');
        li.dataset.id = project.id;
        li.textContent = project.title;

        var binIcon = document.createElement('span');
        binIcon.classList.add('bin-icon');
        binIcon.innerHTML = '<i class="fas fa-trash"></i>';
        binIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            removeProject(project.id);
        });

        li.appendChild(binIcon);
        projectList.appendChild(li);

        li.addEventListener('click', function() {
            selectProject(project.id);
        });
    }

    function removeProject(id) {
        projects = projects.filter(function(project) {
            return project.id !== id;
        });
        saveProjects();
        renderProjects();
        if (!document.querySelector('.projectButton.selected')) {
            clearProjectInfo();
        }
    }

    function selectProject(id) {
        selectedProjectId = id;
        var project = projects.find(function(project) {
            return project.id === id;
        });
        if (project) {
            document.querySelectorAll('.projectButton').forEach(function(btn) {
                btn.classList.remove('selected');
            });

            document.querySelector(`li[data-id="${id}"]`).classList.add('selected');

            projectTitle.textContent = project.title;
            projectDescription.textContent = project.description;
            renderTaskList(project.tasks);
        }
    }

    function clearProjectInfo() {
        projectTitle.textContent = 'Select a project';
        projectDescription.textContent = 'Project description will appear here.';
    }

    function renderProjects() {
        projectList.innerHTML = '';
        projects.forEach(addProjectToList);
    }

    editButton.addEventListener('click', function() {
        var selectedProjectId = document.querySelector('.projectButton.selected')?.dataset.id;
        if (!selectedProjectId) return;

        var project = projects.find(function(p) {
            return p.id == selectedProjectId;
        });

        var titleText = project.title;
        var descriptionText = project.description;

        projectTitle.innerHTML = `<input type="text" id="editTitle" class="editable-input" value="${titleText}">`;
        projectDescription.innerHTML = `<textarea id="editDescription" class="editable-input">${descriptionText}</textarea>`;

        var editButtonsDiv = document.createElement('div');
        editButtonsDiv.classList.add('edit-buttons');
        editButtonsDiv.innerHTML = `
            <button class="submit-btn">Submit</button>
            <button class="cancel-btn">Cancel</button>
        `;
        projectDescription.appendChild(editButtonsDiv);

        document.querySelector('.submit-btn').addEventListener('click', function() {
            var newTitle = document.getElementById('editTitle').value;
            var newDescription = document.getElementById('editDescription').value;

            project.title = newTitle;
            project.description = newDescription;
            saveProjects();
            renderProjects();

            projectTitle.textContent = newTitle;
            projectDescription.textContent = newDescription;

            editButtonsDiv.remove();
        });

        document.querySelector('.cancel-btn').addEventListener('click', function() {
            projectTitle.textContent = titleText;
            projectDescription.textContent = descriptionText;

            editButtonsDiv.remove();
        });
    });

    addTaskButton.addEventListener('click', function() {
        if (taskFormContainer.style.display === 'block') {
            taskFormContainer.style.display = 'none';
        } else {
            taskFormContainer.style.display = 'block';
            renderNewTaskForm();
        }
    });

    function renderTaskList(tasks) {
        taskList.innerHTML = '';
    
        tasks.forEach(task => {
            var li = document.createElement('li');
            li.classList.add('task-item');
            li.dataset.id = task.id;
    
            var taskLeftDiv = document.createElement('div');
            taskLeftDiv.classList.add('task-left');
    
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox'); 
    
            var titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;
            titleSpan.classList.add('task-title');
    
            taskLeftDiv.appendChild(checkbox);
            taskLeftDiv.appendChild(titleSpan);
    
            var taskIconsDiv = document.createElement('div');
            taskIconsDiv.classList.add('task-icons');
    
            var editIcon = document.createElement('span');
            editIcon.classList.add('edit-icon');
            editIcon.innerHTML = '<i class="fas fa-pen"></i>';
            editIcon.addEventListener('click', function() {
                editTask(task.id);
            });
    
            var binIcon = document.createElement('span');
            binIcon.classList.add('bin-icon');
            binIcon.innerHTML = '<i class="fas fa-trash"></i>';
            binIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                removeTask(task.id);
            });
    
            taskIconsDiv.appendChild(binIcon);
            taskIconsDiv.appendChild(editIcon);

    
            li.appendChild(taskLeftDiv);
            li.appendChild(taskIconsDiv);
            taskList.appendChild(li);
        });
    }
    

    function editTask(taskId) {
        var project = projects.find(p => p.id === selectedProjectId);
        if (project) {
            var task = project.tasks.find(t => t.id === taskId);
            var taskItem = document.querySelector(`li[data-id='${taskId}']`);
            taskItem.innerHTML = `
                <input type="text" value="${task.title}" class="edit-task-input">
                <button class="submit-task-edit">Save</button>
                <button class="cancel-task-edit">Cancel</button>
            `;

            taskItem.querySelector('.submit-task-edit').addEventListener('click', function() {
                var newTitle = taskItem.querySelector('.edit-task-input').value.trim();
                if (newTitle) {
                    task.title = newTitle;
                    saveProjects();
                    renderTaskList(project.tasks);
                }
            });

            taskItem.querySelector('.cancel-task-edit').addEventListener('click', function() {
                renderTaskList(project.tasks);
            });
        }
    }

    function removeTask(taskId) {
        var project = projects.find(p => p.id === selectedProjectId);
        if (project) {
            project.tasks = project.tasks.filter(task => task.id !== taskId);
            saveProjects();
            renderTaskList(project.tasks);
        }
    }

    loadProjects();
});
