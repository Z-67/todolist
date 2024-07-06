document.addEventListener('DOMContentLoaded', function() {
    var addProjectButton = document.querySelector('.addProject');
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');
    var projectList = document.getElementById('projectList');
    var projectForm = document.getElementById('projectForm');

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
        li.innerHTML = `${title} <i class="fas fa-trash bin-icon"></i>`;

        projectList.appendChild(li);

        projectForm.reset();

        modal.style.display = 'none';

        li.querySelector('.bin-icon').addEventListener('click', function() {
            projectList.removeChild(li);
        });
    });
});
