/**
 * Fetches data from the GitHub API and dynamically creates HTML elements to display the fetched data on a web page.
 * 
 * @param {string} USER - The GitHub username.
 * @returns {void}
 */
const fetchAndDisplayProjects = (USER) => {
  const projectsRow = document.querySelector(".projects .container .rows");

  fetch(`https://api.github.com/users/${USER}/repos`)
    .then((response) => response.json())
    .then(async (data) => {
      const fragment = document.createDocumentFragment();
      const promises = data
        .filter((repo) => !repo.fork)
        .map((repo) => {
          const projectCol = document.createElement("div");
          projectCol.className = "col-md-4";
          const projectCard = document.createElement("div");
          projectCard.className = "card";
          projectCol.appendChild(projectCard);
          const projectImg = document.createElement("img");
          projectImg.className = "card-img-top";
          projectImg.alt = repo.name;
          projectImg.src = "/static/assets/ProjDeafaultImg.png";
          projectCard.appendChild(projectImg);
          const projectCardBody = document.createElement("div");
          projectCardBody.className = "card-body";
          projectCard.appendChild(projectCardBody);
          const projectTitle = document.createElement("h5");
          projectTitle.className = "card-title";
          projectTitle.textContent = repo.name;
          projectCardBody.appendChild(projectTitle);
          const projectDesc = document.createElement("p");
          projectDesc.className = "card-text";
          projectDesc.textContent = repo.description;
          projectCardBody.appendChild(projectDesc);
          const projectLink = document.createElement("a");
          projectLink.className = "btn btn-primary";
          projectLink.href = repo.html_url;
          projectLink.textContent = "Ver proyecto";
          projectCardBody.appendChild(projectLink);
          fragment.appendChild(projectCol);
          return projectCol;
        });

      await Promise.all(promises);
      projectsRow.appendChild(fragment);
    });
};

// Example usage
const USER = "microsoft";
fetchAndDisplayProjects(USER);
