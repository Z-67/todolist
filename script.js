document.addEventListener('DOMContentLoaded', function() {
    var addProjectButton = document.querySelector('.addProject');
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');
    var projectList = document.getElementById('projectList');
    var projectForm = document.getElementById('projectForm');
    var exampleProjectButton = document.querySelector('#exampleProject');
    var projectTitle = document.getElementById('projectTitle');
    var projectDescription = document.getElementById('projectDescription');
    var editButton = document.querySelector('.edit');

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

        var li = document.createElement('li');
        li.classList.add('projectButton');
        li.innerHTML = `${title} <span class="bin-icon"><i class="fas fa-trash"></i></span>`;

        projectList.appendChild(li);

        projectForm.reset();

        modal.style.display = 'none';

        // event listener for bin icon
        li.querySelector('.bin-icon').addEventListener('click', function(event) {
            event.stopPropagation();
            projectList.removeChild(li);

            if (!document.querySelector('.projectButton.selected')) {
                exampleProjectButton.classList.add('selected');
            }
        });

        // Add event listener for selecting the project
        li.addEventListener('click', function() {
            document.querySelectorAll('.projectButton').forEach(function(btn) {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Add click event for the example project button
    exampleProjectButton.addEventListener('click', function() {
        document.querySelectorAll('.projectButton').forEach(function(btn) {
            btn.classList.remove('selected');
        });
        exampleProjectButton.classList.add('selected');
    });

    // Add click event for the example project bin icon
    var exampleBinIcon = exampleProjectButton.querySelector('.bin-icon');
    exampleBinIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        exampleProjectButton.remove();

        if (!document.querySelector('.projectButton.selected')) {
            exampleProjectButton.classList.add('selected');
        }
    });

    // Ensure example project is selected by default
    exampleProjectButton.classList.add('selected');

    // Edit functionality
    editButton.addEventListener('click', function() {
        var titleText = projectTitle.innerText;
        var descriptionText = projectDescription.innerText;

        projectTitle.innerHTML = `<input type="text" id="editTitle" class="editable-input" value="${titleText}">`;
        projectDescription.innerHTML = `<textarea id="editDescription" class="editable-input">${descriptionText}</textarea>`;

        var editButtonsDiv = document.createElement('div');
        editButtonsDiv.classList.add('edit-buttons');
        editButtonsDiv.innerHTML = `
            <button class="submit-btn">Submit</button>
            <button class="cancel-btn">Cancel</button>
        `;
        projectDescription.appendChild(editButtonsDiv);

        var hrElement = document.querySelector('.pd');

        document.querySelector('.submit-btn').addEventListener('click', function() {
            var newTitle = document.getElementById('editTitle').value;
            var newDescription = document.getElementById('editDescription').value;

            projectTitle.innerHTML = newTitle;
            projectDescription.innerHTML = newDescription;

            // Ensure there's only one <hr> under project description
            if (!document.querySelector('.pd')) {
                projectDescription.insertAdjacentHTML('afterend', '<hr class="pd">');
            }

            editButtonsDiv.remove();
        });

        document.querySelector('.cancel-btn').addEventListener('click', function() {
            projectTitle.innerHTML = titleText;
            projectDescription.innerHTML = descriptionText;

            // Ensure there's only one <hr> under project description
            if (!document.querySelector('.pd')) {
                projectDescription.insertAdjacentHTML('afterend', '<hr class="pd">');
            }

            editButtonsDiv.remove();
        });
    });
});
