// Sample data for this front-end project. A real website would load this from a database.
const students = [
  {
    name: "Ananya Patel",
    course: "BCA, Year 2",
    teaches: ["Python basics", "HTML", "Study notes"],
    learns: ["Public speaking"],
    availability: "Weekdays after 4:00 PM"
  },
  {
    name: "Rahul Mehta",
    course: "BSc Physics, Year 1",
    teaches: ["Guitar basics", "Physics"],
    learns: ["Python", "Web design"],
    availability: "Saturday morning"
  },
  {
    name: "Sara Khan",
    course: "BA English, Year 2",
    teaches: ["English writing", "Presentation skills"],
    learns: ["French"],
    availability: "Sunday afternoon"
  },
  {
    name: "Vikram Singh",
    course: "BCom, Year 3",
    teaches: ["Basic accounting", "Excel"],
    learns: ["Graphic design"],
    availability: "Weekdays after 6:00 PM"
  },
  {
    name: "Meera Iyer",
    course: "BDes, Year 1",
    teaches: ["Canva", "Poster design"],
    learns: ["Maths"],
    availability: "Friday and Saturday"
  },
  {
    name: "Arjun Das",
    course: "BTech, Year 2",
    teaches: ["Maths", "C programming"],
    learns: ["Guitar", "English speaking"],
    availability: "Sunday morning"
  }
];

const profileGrid = document.getElementById("profileGrid");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const requestDialog = document.getElementById("requestDialog");
const requestForm = document.getElementById("requestForm");
const dialogProfile = document.getElementById("dialogProfile");
const formMessage = document.getElementById("formMessage");

let selectedStudent = "";

function skillTags(skills, type) {
  return skills.map((skill) => `<span class="tag ${type}">${skill}</span>`).join("");
}

function matchesStudent(student, query, type) {
  if (!query) return true;

  const teaching = student.teaches.join(" ").toLowerCase();
  const learning = student.learns.join(" ").toLowerCase();

  if (type === "teach") return teaching.includes(query);
  if (type === "learn") return learning.includes(query);
  return teaching.includes(query) || learning.includes(query) || student.name.toLowerCase().includes(query);
}

function renderProfiles() {
  const query = searchInput.value.trim().toLowerCase();
  const type = filterType.value;
  const filteredStudents = students.filter((student) => matchesStudent(student, query, type));

  profileGrid.innerHTML = filteredStudents.map((student) => {
    const initials = student.name.split(" ").map((part) => part[0]).join("");
    return `
      <article class="profile-card">
        <div class="profile-top">
          <div class="avatar" aria-hidden="true">${initials}</div>
          <div>
            <h3>${student.name}</h3>
            <p class="course">${student.course}</p>
          </div>
        </div>
        <p class="skill-row"><span class="skill-label">Can teach</span>${skillTags(student.teaches, "teach")}</p>
        <p class="skill-row"><span class="skill-label">Wants to learn</span>${skillTags(student.learns, "learn")}</p>
        <p class="availability"><strong>Available:</strong> ${student.availability}</p>
        <button class="button primary request-button" type="button" data-name="${student.name}">Request a session</button>
      </article>`;
  }).join("");

  resultCount.textContent = `${filteredStudents.length} student${filteredStudents.length === 1 ? "" : "s"} found`;
  emptyState.hidden = filteredStudents.length !== 0;
}

function openRequest(studentName) {
  selectedStudent = studentName;
  dialogProfile.textContent = `You are sending a request to ${studentName}.`;
  formMessage.textContent = "";
  requestForm.reset();
  requestDialog.showModal();
}

searchInput.addEventListener("input", renderProfiles);
filterType.addEventListener("change", renderProfiles);

document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "all";
  renderProfiles();
  searchInput.focus();
});

profileGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-name]");
  if (button) openRequest(button.dataset.name);
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const time = document.getElementById("sessionTime").value;
  const message = document.getElementById("requestMessage").value.trim();

  if (!time || !message) return;

  formMessage.textContent = `Request sent to ${selectedStudent} for ${time}.`;
  requestForm.reset();
  window.setTimeout(() => requestDialog.close(), 1600);
});

document.getElementById("closeDialog").addEventListener("click", () => requestDialog.close());

renderProfiles();
