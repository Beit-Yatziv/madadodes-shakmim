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

  const step2Section = document.getElementById("step-2-section");

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

    // Highlight step 2 to guide the child
    step2Section.classList.add("active-step");
  }

  // Use touchstart for faster response on touch devices
  namesContainer.addEventListener("touchstart", (e) => {
    const name = e.target.closest(".name");
    if (name && name.parentElement === namesContainer) {
      e.preventDefault();
      selectName(name);
    }
  }, { passive: false });

  // Fallback click for non-touch devices
  namesContainer.addEventListener("click", (e) => {
    const name = e.target.closest(".name");
    if (name && name.parentElement === namesContainer) {
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

    // Function to handle transport selection
    function handleTransportSelect() {
      if (selectedName && selectedName.parentElement === namesContainer) {
        // Create a clone for the transport box
        const nameClone = selectedName.cloneNode(true);
        nameClone.classList.remove("selected", "disabled");
        nameClone.style.transform = "";

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

        // Re-enable all remaining names and remove step 2 highlight
        const remainingNames = Array.from(document.querySelectorAll(".name"));
        enableAllNames(remainingNames);
        step2Section.classList.remove("active-step");
      }
    }

    // Use touchstart for faster response on touch devices
    transport.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleTransportSelect();
    }, { passive: false });

    // Fallback click for non-touch devices
    transport.addEventListener("click", handleTransportSelect);
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
  const step2Section = document.getElementById("step-2-section");

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

    // Remove step 2 highlight
    step2Section.classList.remove("active-step");

    // Re-setup event listeners to recreate containers
    setupSelectAndTap();
  }

  // Use touchstart for faster response
  resetBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    resetAll();
  }, { passive: false });

  // Fallback click for non-touch devices
  resetBtn.addEventListener("click", resetAll);
}
