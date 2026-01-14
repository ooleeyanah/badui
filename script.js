(() => {
  const storageKey = "badui.users";
  let memoryUsers = {};
  const feedback = document.getElementById("feedback");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const randomButton = document.getElementById("random-btn");
  const passwordField = document.getElementById("text");
  const scrollRoot = document.scrollingElement || document.documentElement;
  let isInvertedScroll = false;

  const getUsers = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return { ...memoryUsers };
      }
      return JSON.parse(raw);
    } catch (error) {
      return { ...memoryUsers };
    }
  };

  const setUsers = (users) => {
    memoryUsers = { ...users };
    try {
      localStorage.setItem(storageKey, JSON.stringify(users));
    } catch (error) {
      // Fallback to in-memory only when storage is blocked.
    }
  };

  const setFeedback = (message, tone) => {
    if (!message) {
      if (feedback) {
        feedback.textContent = "";
        feedback.className = "";
      }
      return;
    }

    if (feedback) {
      feedback.textContent = message;
      feedback.className = tone ? `feedback ${tone}` : "feedback";
      return;
    }

    alert(message);
  };

  const isValidUsername = (username) =>
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{5}$/.test(username);

  const hasSpecialChar = (value) => /[^A-Za-z0-9]/.test(value);

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const firstName = signupForm.elements["first_name"].value.trim();
      const lastName = signupForm.elements["last_name"].value.trim();
      const username = signupForm.elements["user_name"].value.trim();
      const password = passwordField ? passwordField.value.trim() : "";

      if (!firstName || !lastName || !username || !password) {
        setFeedback("Fill out every field before signing up.", "error");
        return;
      }

      if (firstName.length < 10) {
        setFeedback("First name must be at least 10 characters.", "error");
        return;
      }

      if (!hasSpecialChar(lastName)) {
        setFeedback("Last name must include a special character.", "error");
        return;
      }

      if (!isValidUsername(username)) {
        setFeedback("Username must be 5 chars with 1 digit, 1 lowercase, 1 uppercase.", "error");
        return;
      }

      if (password !== "password invalid") {
        setFeedback("You must use the Randomize password exactly.", "error");
        return;
      }

      const users = getUsers();

      const isExisting = Boolean(users[username]);

      users[username] = {
        firstName,
        lastName,
        password,
      };

      setUsers(users);
      signupForm.reset();
      if (passwordField) {
        passwordField.value = "";
      }
      const successMessage = isExisting
        ? "Account updated. Log in below."
        : "Account created. Log in below.";
      setFeedback(successMessage, "success");
      alert(successMessage);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = loginForm.elements["login_user_name"].value.trim();
      const password = loginForm.elements["login_password"].value;

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
      const loginMessage = `Login successfully, ${user.firstName}!`;
      setFeedback(loginMessage, "success");
      alert(loginMessage);
    });
  }

  if (randomButton && passwordField) {
    randomButton.addEventListener("click", () => {
      passwordField.value = "password invalid";
    });
  }

  window.addEventListener(
    "wheel",
    (event) => {
      if (isInvertedScroll) {
        return;
      }
      isInvertedScroll = true;
      event.preventDefault();
      scrollRoot.scrollTop -= event.deltaY;
      requestAnimationFrame(() => {
        isInvertedScroll = false;
      });
    },
    { passive: false }
  );
})();
