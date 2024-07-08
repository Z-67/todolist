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

    // Edit functionality
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
