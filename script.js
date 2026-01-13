(() => {
  const storageKey = "badui.users";
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  const feedback = document.getElementById("feedback");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  const getUsers = () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return {};
    }
  };

  const setUsers = (users) => {
    localStorage.setItem(storageKey, JSON.stringify(users));
  };

  const setFeedback = (message, tone) => {
    feedback.textContent = message;
    feedback.classList.remove("success", "error");
    if (tone) {
      feedback.classList.add(tone);
    }
  };

  const switchPanel = (targetId) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.target === targetId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    setFeedback("", "");
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchPanel(tab.dataset.target);
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = signupForm.elements["first_name"].value.trim();
    const lastName = signupForm.elements["last_name"].value.trim();
    const username = signupForm.elements["user_name"].value.trim();
    const password = signupForm.elements["password"].value;
    const passwordConfirm = signupForm.elements["password_confirm"].value;

    if (!firstName || !lastName || !username || !password || !passwordConfirm) {
      setFeedback("Please fill out every field.", "error");
      return;
    }

    if (password.length < 8) {
      setFeedback("Password must be at least 8 characters.", "error");
      return;
    }

    if (password !== passwordConfirm) {
      setFeedback("Passwords do not match.", "error");
      return;
    }

    const users = getUsers();

    if (users[username]) {
      setFeedback("That username is already taken.", "error");
      return;
    }

    users[username] = {
      firstName,
      lastName,
      password,
    };

    setUsers(users);
    signupForm.reset();
    switchPanel("login-panel");
    setFeedback("Account created. Please log in.", "success");
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginForm.elements["user_name"].value.trim();
    const password = loginForm.elements["password"].value;

    if (!username || !password) {
      setFeedback("Enter your username and password.", "error");
      return;
    }

    const users = getUsers();
    const user = users[username];

    if (!user || user.password !== password) {
      setFeedback("Invalid username or password.", "error");
      return;
    }

    loginForm.reset();
    setFeedback(`Welcome back, ${user.firstName}!`, "success");
  });
})();
