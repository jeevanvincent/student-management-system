// Local Storage Helper Functions
const getStudentsFromStorage = () => JSON.parse(localStorage.getItem('students')) || [];
const saveStudentsToStorage = (students) => localStorage.setItem('students', JSON.stringify(students));

// DOM Elements
const form = document.querySelector('#studentForm');
const studentIdInput = document.querySelector('#studentId');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const ageInput = document.querySelector('#age');
const gradeInput = document.querySelector('#grade');
const submitBtn = document.querySelector('#submitBtn');
const cancelBtn = document.querySelector('#cancelBtn');
const searchInput = document.querySelector('#searchInput');
const tableBody = document.querySelector('#studentTableBody');

// Render Students Table (Uses ES6 .map & Template Literals)
const renderStudents = (studentsToRender = getStudentsFromStorage()) => {
  if (studentsToRender.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No students found.</td></tr>`;
    return;
  }

  // ES6 .map() and Destructuring
  tableBody.innerHTML = studentsToRender.map(({ id, name, email, age, grade }) => `
    <tr>
      <td>${id}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${age}</td>
      <td>${grade}</td>
      <td>
        <button class="btn-edit" onclick="editStudent('${id}')">Edit</button>
        <button class="btn-delete" onclick="deleteStudent('${id}')">Delete</button>
      </td>
    </tr>
  `).join('');
};

// Add or Update Student
const saveStudent = (e) => {
  e.preventDefault();

  const id = studentIdInput.value;
  const newStudent = {
    id: id || Date.now().toString(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    age: ageInput.value.trim(),
    grade: gradeInput.value.trim()
  };

  const students = getStudentsFromStorage();

  if (id) {
    // Edit existing student using .map()
    const updatedStudents = students.map(student => student.id === id ? newStudent : student);
    saveStudentsToStorage(updatedStudents);
  } else {
    // Add new student
    students.push(newStudent);
    saveStudentsToStorage(students);
  }

  resetForm();
  renderStudents();
};

// Prepare Form for Editing (Exposed globally for HTML onclick)
window.editStudent = (id) => {
  const students = getStudentsFromStorage();
  
  // ES6 .find() and Destructuring
  const studentToEdit = students.find(student => student.id === id);
  if (!studentToEdit) return;

  const { name, email, age, grade } = studentToEdit;

  studentIdInput.value = id;
  nameInput.value = name;
  emailInput.value = email;
  ageInput.value = age;
  gradeInput.value = grade;

  submitBtn.textContent = 'Update Student';
  cancelBtn.style.display = 'inline-block';
};

// Delete Student (Exposed globally for HTML onclick)
window.deleteStudent = (id) => {
  if (confirm('Are you sure you want to delete this student?')) {
    const students = getStudentsFromStorage();
    
    // ES6 .filter()
    const filteredStudents = students.filter(student => student.id !== id);
    
    saveStudentsToStorage(filteredStudents);
    renderStudents();
  }
};

// Search Students by Name (Uses ES6 .filter)
const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  const students = getStudentsFromStorage();

  // ES6 .filter()
  const filteredStudents = students.filter(({ name }) => 
    name.toLowerCase().includes(searchTerm)
  );

  renderStudents(filteredStudents);
};

// Reset Form State
const resetForm = () => {
  form.reset();
  studentIdInput.value = '';
  submitBtn.textContent = 'Add Student';
  cancelBtn.style.display = 'none';
};

// Event Listeners
form.addEventListener('submit', saveStudent);
cancelBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', handleSearch);

// Initial Render on Page Load
document.addEventListener('DOMContentLoaded', () => renderStudents());