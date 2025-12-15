document.addEventListener("DOMContentLoaded", () => {
  const childrenList = [
    "אושר",
    "בסמה",
    "בארי",
    "ליאם",
    "אומור",
    "רנא",
    "אברהים",
    "מיאר",
    "מיאל",
    "סהר",
    "דין",
    "ארי-רפאל",
    "שחר",
    "אליאב",
    "עומרי",
    "אריאל",
    "לני",
    "הדס",
  ];

  createNameDivs(childrenList);
  setupSelectAndTap();
  setupResetButton(childrenList);
});

function createNameDivs(namesArray) {
  const namesContainer = document.getElementById("names");
  namesContainer.innerHTML = "";

  namesArray.forEach((name, index) => {
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("name");
    nameDiv.textContent = name;
    nameDiv.id = "name-" + index;
    namesContainer.appendChild(nameDiv);
  });
}

function setupSelectAndTap() {
  let selectedName = null;
  const namesContainer = document.getElementById("names");
  const transports = document.querySelectorAll(".transport");

  // Function to handle name selection
  function selectName(name) {
    // Only allow selection from the names container
    if (name.parentElement !== namesContainer) return;

    if (selectedName) {
      selectedName.classList.remove("selected");
    }
    selectedName = name;
    selectedName.classList.add("selected");
    const allNames = Array.from(document.querySelectorAll(".name"));
    disableOtherNames(allNames, name);
  }

  // Add event listeners to names container (event delegation)
  namesContainer.addEventListener("click", (e) => {
    const name = e.target.closest(".name");
    if (name && name.parentElement === namesContainer) {
      e.stopPropagation();
      selectName(name);
    }
  });

  // Add touch support for better mobile/touch screen experience
  namesContainer.addEventListener("touchend", (e) => {
    const name = e.target.closest(".name");
    if (name && name.parentElement === namesContainer) {
      e.preventDefault();
      e.stopPropagation();
      selectName(name);
    }
  });

  transports.forEach((transport) => {
    // Create names container for this transport if it doesn't exist
    let namesContainerInTransport = transport.querySelector(".names-container");
    if (!namesContainerInTransport) {
      namesContainerInTransport = document.createElement("div");
      namesContainerInTransport.classList.add("names-container");
      const countElement = transport.querySelector(".count");
      transport.insertBefore(namesContainerInTransport, countElement);
    }

    transport.addEventListener("click", (e) => {
      e.stopPropagation();
      if (selectedName && selectedName.parentElement === namesContainer) {
        // Create a clone for the transport box
        const nameClone = selectedName.cloneNode(true);
        nameClone.classList.remove("selected", "disabled");
        nameClone.style.transform = "scale(1)";
        nameClone.style.animation = "none";

        // Get or create names container
        let container = transport.querySelector(".names-container");
        if (!container) {
          container = document.createElement("div");
          container.classList.add("names-container");
          const countElement = transport.querySelector(".count");
          transport.insertBefore(container, countElement);
        }

        container.appendChild(nameClone);
        updateCount(transport);

        // Remove the selected name from container
        selectedName.remove();
        selectedName = null;

        // Re-enable all remaining names
        const remainingNames = Array.from(document.querySelectorAll(".name"));
        enableAllNames(remainingNames);
      }
    });

    // Add touch support
    transport.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (selectedName && selectedName.parentElement === namesContainer) {
        const nameClone = selectedName.cloneNode(true);
        nameClone.classList.remove("selected", "disabled");
        nameClone.style.transform = "scale(1)";
        nameClone.style.animation = "none";

        // Get or create names container
        let container = transport.querySelector(".names-container");
        if (!container) {
          container = document.createElement("div");
          container.classList.add("names-container");
          const countElement = transport.querySelector(".count");
          transport.insertBefore(container, countElement);
        }

        container.appendChild(nameClone);
        updateCount(transport);

        selectedName.remove();
        selectedName = null;

        const remainingNames = Array.from(document.querySelectorAll(".name"));
        enableAllNames(remainingNames);
      }
    });
  });
}

function disableOtherNames(names, selected) {
  names.forEach((name) => {
    if (name !== selected) {
      name.classList.add("disabled");
    }
  });
}

function enableAllNames(names) {
  names.forEach((name) => {
    name.classList.remove("disabled", "selected");
  });
}

function updateCount(transport) {
  const container = transport.querySelector(".names-container");
  const count = container ? container.querySelectorAll(".name").length : 0;
  const countElement = transport.querySelector(".count");
  countElement.textContent = `${count}`;
}

function setupResetButton(childrenList) {
  const resetBtn = document.getElementById("reset-btn");

  function resetAll() {
    // Remove all names from transport boxes
    const transports = document.querySelectorAll(".transport");
    transports.forEach((transport) => {
      const container = transport.querySelector(".names-container");
      if (container) {
        container.remove();
      }
      updateCount(transport);
    });

    // Recreate all name divs in the names container
    createNameDivs(childrenList);

    // Re-setup event listeners to recreate containers
    setupSelectAndTap();
  }

  resetBtn.addEventListener("click", resetAll);

  // Add touch support
  resetBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    resetAll();
  });
}
