window.onload = function () {

    let name = localStorage.getItem("emberName");
    let avatar = localStorage.getItem("emberAvatar");

    if (name) {
        document.getElementById("sidebarName").innerText = name;
    }

    if (avatar) {
        document.getElementById("sidebarAvatar").src = avatar;
    }

}
function createPost() {

    let input = document.getElementById("postInput");

    if (input.value.trim() == "") return;

    let post = document.createElement("div");

    post.className = "post";

    post.innerHTML = `
<div class="post-header">
<img src="user.png">
<div>
<b>You</b>
<p>@you • now</p>
</div>
</div>

<p>${input.value}</p>
`;

    document.getElementById("posts").prepend(post);

    input.value = "";

}
function loadProfile() {

    let name = localStorage.getItem("emberName");
    let image = localStorage.getItem("emberAvatar");

    if (name) {
        document.getElementById("nameInput").value = name;
    }

    if (image) {
        document.getElementById("imageInput").value = image;
        document.getElementById("profilePreview").src = image;
    }

}

function saveProfile() {

    let name = document.getElementById("nameInput").value;
    let image = document.getElementById("imageInput").value;

    localStorage.setItem("emberName", name);
    localStorage.setItem("emberAvatar", image);

    document.getElementById("profilePreview").src = image;

    alert("Profile Saved!");

}

if (document.getElementById("nameInput")) {
    loadProfile();
}