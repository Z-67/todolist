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
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the project name and description
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;

        // Create a new list item for the project
        var li = document.createElement('li');
        li.innerHTML = `${title} <i class="fas fa-trash bin-icon"></i>`;

        // Append the new project to the project list
        projectList.appendChild(li);

        // Clear the form fields
        projectForm.reset();

        // Close the modal
        modal.style.display = 'none';

        // Add event listener to the bin icon
        li.querySelector('.bin-icon').addEventListener('click', function() {
            projectList.removeChild(li);
        });
    });
});
