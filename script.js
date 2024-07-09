document.addEventListener('DOMContentLoaded', function() {
    var addProjectButton = document.querySelector('.addProject');
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');
    var projectList = document.getElementById('projectList');
    var projectForm = document.getElementById('projectForm');
    var projectTitle = document.getElementById('projectTitle');
    var projectDescription = document.getElementById('projectDescription');
    var editButton = document.querySelector('.edit');
    var projects = [];
    var newProjectFormContainer = document.getElementById('newProjectFormContainer');

    addProjectButton.addEventListener('click', function() {
        if (newProjectFormContainer.style.display === 'block') {
            newProjectFormContainer.style.display = 'none';
        } else {
            newProjectFormContainer.style.display = 'block';
            renderNewProjectForm();
        }
    });

    function renderNewProjectForm() {
        newProjectFormContainer.innerHTML = `
            <div class="form-group">
                <label for="newProjectTitle">Project Name:</label>
                <input type="text" id="newProjectTitle" name="newProjectTitle" required>
            </div>
            <div class="form-group">
                <label for="newProjectDescription">Project Description:</label>
                <input type="text" id="newProjectDescription" name="newProjectDescription" required>
            </div>
            <button class="submit-btn" id="submitNewProject">Submit</button>
            <button class="cancel-btn" id="cancelNewProject">Cancel</button>
        `;

        document.getElementById('submitNewProject').addEventListener('click', function() {
            var title = document.getElementById('newProjectTitle').value;
            var description = document.getElementById('newProjectDescription').value;

            if (title && description) {
                addNewProject(title, description);
                newProjectFormContainer.style.display = 'none';
                newProjectFormContainer.innerHTML = '';
            }
        });

        document.getElementById('cancelNewProject').addEventListener('click', function() {
            newProjectFormContainer.style.display = 'none';
            newProjectFormContainer.innerHTML = '';
        });
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
        }
    }

    function clearProjectInfo() {
        projectTitle.textContent = 'Select a project';
        projectDescription.textContent = 'Project description will appear here.';
    }

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
            description: description
        };

        projects.push(project);
        saveProjects();
        addProjectToList(project);

        projectForm.reset();
        modal.style.display = 'none';
    });

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

    function renderProjects() {
        projectList.innerHTML = '';
        projects.forEach(addProjectToList);
    }

    loadProjects();
});

document.addEventListener('DOMContentLoaded', function() {
    var addTaskButton = document.querySelector('.addTask');
    var taskFormContainer = document.getElementById('taskFormContainer');
    var taskList = document.getElementById('taskList');
    var selectedProjectId = null;
    var projects = JSON.parse(localStorage.getItem('projects')) || [];

    addTaskButton.addEventListener('click', function() {
        if (taskFormContainer.style.display === 'block') {
            taskFormContainer.style.display = 'none';
        } else {
            taskFormContainer.style.display = 'block';
            renderNewTaskForm();
        }
    });

    function renderNewTaskForm() {
        taskFormContainer.innerHTML = `
            <div class="form-group">
                <label for="newTaskTitle">Task Name:</label>
                <input type="text" id="newTaskTitle" name="newTaskTitle" required>
            </div>
            <button class="submit-btn" id="submitNewTask">Submit</button>
            <button class="cancel-btn" id="cancelNewTask">Cancel</button>
        `;

        document.getElementById('submitNewTask').addEventListener('click', function() {
            var title = document.getElementById('newTaskTitle').value;

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
            project.tasks.push(task);
            saveProjects();
            renderTaskList(project.tasks);
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

    function renderTaskList(tasks) {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            var li = document.createElement('li');
            li.dataset.id = task.id;
            li.textContent = task.title;

            var binIcon = document.createElement('span');
            binIcon.classList.add('bin-icon');
            binIcon.innerHTML = '<i class="fas fa-trash"></i>';
            binIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                removeTask(task.id);
            });

            li.appendChild(binIcon);
            taskList.appendChild(li);
        });
    }

    function saveProjects() {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function loadProjects() {
        var storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            projects = JSON.parse(storedProjects);
        }
    }

    // Initial load
    loadProjects();
});
