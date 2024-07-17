document.addEventListener('DOMContentLoaded', function() {
    class Task {
        constructor(id, title) {
            this.id = id;
            this.title = title;
        }

        static fromObject(obj) {
            return new Task(obj.id, obj.title);
        }
    }

    class Project {
        constructor(id, title, description, tasks = []) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.tasks = tasks.map(task => Task.fromObject(task));
        }

        static fromObject(obj) {
            return new Project(obj.id, obj.title, obj.description, obj.tasks);
        }

        addTask(title) {
            const task = new Task(Date.now(), title);
            this.tasks.push(task);
        }

        removeTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        }

        updateTask(taskId, newTitle) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.title = newTitle;
            }
        }
    }

    class ProjectManager {
        constructor() {
            this.projects = JSON.parse(localStorage.getItem('projects'))?.map(Project.fromObject) || [];
            this.selectedProjectId = null;

            this.initElements();
            this.bindEvents();
            this.loadProjects();
        }

        initElements() {
            this.addProjectButton = document.querySelector('.addProject');
            this.modal = document.getElementById('projectModal');
            this.closeButton = this.modal.querySelector('.close');
            this.projectList = document.getElementById('projectList');
            this.projectForm = document.getElementById('projectForm');
            this.projectTitle = document.getElementById('projectTitle');
            this.projectDescription = document.getElementById('projectDescription');
            this.editButton = document.querySelector('.edit');
            this.addTaskButton = document.querySelector('.addTask');
            this.taskFormContainer = document.getElementById('taskFormContainer');
            this.taskList = document.getElementById('taskList');
        }

        bindEvents() {
            this.addProjectButton.addEventListener('click', () => this.showModal());
            this.closeButton.addEventListener('click', () => this.hideModal());
            window.addEventListener('click', event => {
                if (event.target === this.modal) {
                    this.hideModal();
                }
            });

            this.projectForm.addEventListener('submit', event => this.addProject(event));

            this.editButton.addEventListener('click', () => this.editProject());
            this.addTaskButton.addEventListener('click', () => this.toggleTaskForm());
        }

        showModal() {
            this.modal.style.display = 'block';
        }

        hideModal() {
            this.modal.style.display = 'none';
        }

        addProject(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            const project = new Project(Date.now(), title, description);
            this.projects.push(project);
            this.saveProjects();
            this.addProjectToList(project);

            this.projectForm.reset();
            this.hideModal();
        }

        saveProjects() {
            localStorage.setItem('projects', JSON.stringify(this.projects));
        }

        loadProjects() {
            this.projects.forEach(project => this.addProjectToList(project));
        }

        addProjectToList(project) {
            const li = document.createElement('li');
            li.classList.add('projectButton');
            li.dataset.id = project.id;
            li.textContent = project.title;

            const binIcon = document.createElement('span');
            binIcon.classList.add('bin-icon');
            binIcon.innerHTML = '<i class="fas fa-trash"></i>';
            binIcon.addEventListener('click', event => {
                event.stopPropagation();
                this.removeProject(project.id);
            });

            li.appendChild(binIcon);
            this.projectList.appendChild(li);

            li.addEventListener('click', () => this.selectProject(project.id));
        }

        removeProject(id) {
            this.projects = this.projects.filter(project => project.id !== id);
            this.saveProjects();
            this.renderProjects();
            if (!document.querySelector('.projectButton.selected')) {
                this.clearProjectInfo();
            }
        }

        selectProject(id) {
            this.selectedProjectId = id;
            const project = this.projects.find(project => project.id === id);
            if (project) {
                document.querySelectorAll('.projectButton').forEach(btn => btn.classList.remove('selected'));
                document.querySelector(`li[data-id="${id}"]`).classList.add('selected');

                this.projectTitle.textContent = project.title;
                this.projectDescription.textContent = project.description;
                this.renderTaskList(project.tasks);
            }
        }

        clearProjectInfo() {
            this.projectTitle.textContent = 'Select a project';
            this.projectDescription.textContent = 'Project description will appear here.';
        }

        renderProjects() {
            this.projectList.innerHTML = '';
            this.projects.forEach(project => this.addProjectToList(project));
        }

        editProject() {
            const selectedProjectId = document.querySelector('.projectButton.selected')?.dataset.id;
            if (!selectedProjectId) return;

            const project = this.projects.find(p => p.id == selectedProjectId);

            const titleText = project.title;
            const descriptionText = project.description;

            this.projectTitle.innerHTML = `<input type="text" id="editTitle" class="editable-input" value="${titleText}">`;
            this.projectDescription.innerHTML = `<textarea id="editDescription" class="editable-input">${descriptionText}</textarea>`;

            const editButtonsDiv = document.createElement('div');
            editButtonsDiv.classList.add('edit-buttons');
            editButtonsDiv.innerHTML = `
                <button class="submit-btn">Submit</button>
                <button class="cancel-btn">Cancel</button>
            `;
            this.projectDescription.appendChild(editButtonsDiv);

            document.querySelector('.submit-btn').addEventListener('click', () => {
                const newTitle = document.getElementById('editTitle').value;
                const newDescription = document.getElementById('editDescription').value;

                project.title = newTitle;
                project.description = newDescription;
                this.saveProjects();
                this.renderProjects();

                this.projectTitle.textContent = newTitle;
                this.projectDescription.textContent = newDescription;

                editButtonsDiv.remove();
            });

            document.querySelector('.cancel-btn').addEventListener('click', () => {
                this.projectTitle.textContent = titleText;
                this.projectDescription.textContent = descriptionText;

                editButtonsDiv.remove();
            });
        }

        toggleTaskForm() {
            if (this.taskFormContainer.style.display === 'block') {
                this.taskFormContainer.style.display = 'none';
            } else {
                this.taskFormContainer.style.display = 'block';
                this.renderNewTaskForm();
            }
        }

        renderNewTaskForm() {
            this.taskFormContainer.innerHTML = `
                <div class="form-group">
                    <label for="newTaskTitle">Task Name:</label>
                    <input type="text" id="newTaskTitle" name="newTaskTitle" required>
                </div>
                <button class="submit-btn" id="submitNewTask">Submit</button>
                <button class="cancel-btn" id="cancelNewTask">Cancel</button>
            `;

            document.getElementById('submitNewTask').addEventListener('click', event => {
                event.preventDefault();
                const title = document.getElementById('newTaskTitle').value.trim();

                if (title) {
                    this.addNewTask(title);
                    this.taskFormContainer.style.display = 'none';
                    this.taskFormContainer.innerHTML = '';
                }
            });

            document.getElementById('cancelNewTask').addEventListener('click', () => {
                this.taskFormContainer.style.display = 'none';
                this.taskFormContainer.innerHTML = '';
            });
        }

        addNewTask(title) {
            const project = this.projects.find(p => p.id === this.selectedProjectId);
            if (project) {
                project.addTask(title);
                this.saveProjects();
                this.renderTaskList(project.tasks);
            }
        }

        renderTaskList(tasks) {
            this.taskList.innerHTML = '';
            tasks.forEach(task => this.addTaskToList(task));
        }

        addTaskToList(task) {
            const li = document.createElement('li');
            li.classList.add('task-item');
            li.dataset.id = task.id;

            const taskLeftDiv = document.createElement('div');
            taskLeftDiv.classList.add('task-left');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');

            const titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;
            titleSpan.classList.add('task-title');

            taskLeftDiv.appendChild(checkbox);
            taskLeftDiv.appendChild(titleSpan);

            const taskIconsDiv = document.createElement('div');
            taskIconsDiv.classList.add('task-icons');

            const editIcon = document.createElement('span');
            editIcon.classList.add('edit-icon');
            editIcon.innerHTML = '<i class="fas fa-pen"></i>';
            editIcon.addEventListener('click', () => this.editTask(task.id));

            const binIcon = document.createElement('span');
            binIcon.classList.add('bin-icon');
            binIcon.innerHTML = '<i class="fas fa-trash"></i>';
            binIcon.addEventListener('click', event => {
                event.stopPropagation();
                this.removeTask(task.id);
            });

            taskIconsDiv.appendChild(editIcon);
            taskIconsDiv.appendChild(binIcon);

            li.appendChild(taskLeftDiv);
            li.appendChild(taskIconsDiv);
            this.taskList.appendChild(li);
        }

        editTask(taskId) {
            const project = this.projects.find(p => p.id === this.selectedProjectId);
            if (project) {
                const task = project.tasks.find(t => t.id === taskId);
                const taskItem = document.querySelector(`li[data-id='${taskId}']`);
                taskItem.innerHTML = `
                    <input type="text" value="${task.title}" class="edit-task-input">
                    <button class="submit-task-edit">Save</button>
                    <button class="cancel-task-edit">Cancel</button>
                `;

                taskItem.querySelector('.submit-task-edit').addEventListener('click', () => {
                    const newTitle = taskItem.querySelector('.edit-task-input').value.trim();
                    if (newTitle) {
                        task.title = newTitle;
                        this.saveProjects();
                        this.renderTaskList(project.tasks);
                    }
                });

                taskItem.querySelector('.cancel-task-edit').addEventListener('click', () => {
                    this.renderTaskList(project.tasks);
                });
            }
        }

        removeTask(taskId) {
            const project = this.projects.find(p => p.id === this.selectedProjectId);
            if (project) {
                project.removeTask(taskId);
                this.saveProjects();
                this.renderTaskList(project.tasks);
            }
        }
    }

    new ProjectManager();
});
