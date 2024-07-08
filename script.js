document.addEventListener('DOMContentLoaded', function() {
    var addProjectButton = document.querySelector('.addProject');
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');
    var projectList = document.getElementById('projectList');
    var projectForm = document.getElementById('projectForm');
    var exampleProjectButton = document.querySelector('.projectButton');
    var projectTitle = document.getElementById('projectTitle');
    var projectDescription = document.getElementById('projectDescription');

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

        var li = document.createElement('li');
        li.classList.add('projectButton');
        li.innerHTML = `${title} <span class="bin-icon"><i class="fas fa-trash"></i></span>`;

        projectList.appendChild(li);

        projectForm.reset();

        modal.style.display = 'none';

        li.querySelector('.bin-icon').addEventListener('click', function(event) {
            event.stopPropagation();
            projectList.removeChild(li);

            if (!document.querySelector('.projectButton.selected')) {
                exampleProjectButton.classList.add('selected');
                projectTitle.textContent = 'Example Project';
                projectDescription.textContent = 'This is an example project description.';
            }
        });

        li.addEventListener('click', function() {
            document.querySelectorAll('.projectButton').forEach(function(btn) {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');

            projectTitle.textContent = title;
            projectDescription.textContent = description;
        });

        li.click();
    });


    exampleProjectButton.addEventListener('click', function() {
        document.querySelectorAll('.projectButton').forEach(function(btn) {
            btn.classList.remove('selected');
        });
        exampleProjectButton.classList.add('selected');


        projectTitle.textContent = 'Example Project';
        projectDescription.textContent = 'This is an example project description.';
    });

    var exampleBinIcon = exampleProjectButton.querySelector('.bin-icon');
    exampleBinIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        exampleProjectButton.remove();

        if (!document.querySelector('.projectButton.selected')) {
            projectTitle.textContent = 'Project Title';
            projectDescription.textContent = 'Project Description';
        }
    });

    exampleProjectButton.classList.add('selected');
    projectTitle.textContent = 'Example Project';
    projectDescription.textContent = 'This is an example project description.';
});
