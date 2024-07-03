// Wait for the DOM content to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Find the button element by its class name
    var addProjectButton = document.querySelector('.addProject');

    // Find the modal and close button elements
    var modal = document.getElementById('projectModal');
    var closeButton = modal.querySelector('.close');

    // Add event listener to open the modal
    addProjectButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Add event listener to close the modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Optional: Close modal if user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Prevent form submission (default behavior) and handle form submission
    var projectForm = document.getElementById('projectForm');
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        saveProject();
    });

    // Function to save the project
    function saveProject() {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        
        // Example: Send data to backend or perform further actions
        console.log('Title:', title);
        console.log('Description:', description);
        
        // Close the modal after saving (optional)
        modal.style.display = 'none';
    }
});
