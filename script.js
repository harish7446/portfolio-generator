let imageData = "";

/* Photo Preview */
function previewPhoto(){

  const file = document.getElementById("photo").files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(e){
    imageData = e.target.result;
  };

  reader.readAsDataURL(file);
}


/* Load on start */
window.onload = function(){
  showSaved();
};


/* Generate + Save */
function generate(){

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const email = document.getElementById("email").value.trim();
  const skills = document.getElementById("skills").value.trim();

  if(!name || !role || !email || !skills){
    alert("Fill all fields!");
    return;
  }

  const data = {
    id: Date.now(),
    name,
    role,
    email,
    skills,
    photo: imageData
  };

  let list = JSON.parse(localStorage.getItem("profiles")) || [];

  list.push(data);

  localStorage.setItem("profiles", JSON.stringify(list));

  showSaved();
  showResult(data);
}


/* Show Saved Profiles */
function showSaved(){

  const box = document.getElementById("savedList");

  let list = JSON.parse(localStorage.getItem("profiles")) || [];

  if(list.length === 0){
    box.innerHTML = "<p>No profiles saved</p>";
    return;
  }

  let html = "";

  list.forEach(p=>{

    html += `
      <div style="
        padding:8px;
        border:1px solid #ccc;
        margin:5px 0;
        border-radius:5px;
        background:#f9f9f9;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <span onclick="loadProfile(${p.id})"
          style="cursor:pointer;">
          ${p.name} - ${p.role}
        </span>

        <button onclick="deleteProfile(${p.id})"
          style="
            background:red;
            color:white;
            border:none;
            border-radius:3px;
            padding:3px 8px;
            cursor:pointer;
          ">
          Delete
        </button>

      </div>
    `;
  });

  box.innerHTML = html;
}


/* Load Profile */
function loadProfile(id){

  let list = JSON.parse(localStorage.getItem("profiles")) || [];

  const data = list.find(p => p.id === id);

  if(!data) return;

  document.getElementById("name").value = data.name;
  document.getElementById("role").value = data.role;
  document.getElementById("email").value = data.email;
  document.getElementById("skills").value = data.skills;

  imageData = data.photo || "";

  showResult(data);
}


/* DELETE PROFILE (IMPORTANT FIX) */
function deleteProfile(id){

  if(!confirm("Do you want to delete this profile?")){
    return;
  }

  let list = JSON.parse(localStorage.getItem("profiles")) || [];

  // Remove selected profile
  list = list.filter(p => p.id !== id);

  // Save back
  localStorage.setItem("profiles", JSON.stringify(list));

  // Refresh list
  showSaved();

  // Clear output
  document.getElementById("result").innerHTML = "";
}


/* Show Output */
function showResult(data){

  const list = data.skills.split(",");

  let items = "";

  list.forEach(s=>{
    items += "<li>" + s.trim() + "</li>";
  });

  const html = `
    <div class="portfolio-card">

      ${data.photo ? `
        <img src="${data.photo}"
        style="
          width:100px;
          height:100px;
          border-radius:50%;
          display:block;
          margin:0 auto 10px;
        ">
      ` : ""}

      <h2>${data.name}</h2>
      <h3>${data.role}</h3>

      <h4>Skills</h4>
      <ul>${items}</ul>

      <p>Email: ${data.email}</p>

    </div>
  `;

  const result = document.getElementById("result");

  result.innerHTML = html;
  result.style.display = "block";
}