document.addEventListener('DOMContentLoaded', function () {
    var roleDropdown = document.getElementById('inputRole');
    var originalRoleOptions = Array.from(document.querySelectorAll('#inputRole option[data-department]'));
    function updateRoles() {
        var selectedDepartmentName = document.getElementById('inputDepartment').value;
        roleDropdown.innerHTML = '<option selected>Select Role</option>';

        originalRoleOptions.forEach(function (roleOption) {
            var roleDepartmentName = roleOption.getAttribute('data-department');
            if (roleDepartmentName === selectedDepartmentName && selectedDepartmentName !== 'Department') {
                roleDropdown.appendChild(roleOption.cloneNode(true));
            }
        });
    }

    document.getElementById('inputDepartment').addEventListener('change', updateRoles);

    updateRoles();
});