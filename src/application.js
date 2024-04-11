import axios from 'axios';
import onChange from 'on-change';

const validateName = (name) => (name.trim().length ? [] : ['cant be empty']);
const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['email is invalid']);
const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

export default () => {
  const state = {
    values: {
      name: '',
      email: '',
    },
    error: {
      name: [],
      email: [],
    },
  };

  const formHTML = `
    <form id="registrationForm">
    <div class="form-group">
        <label for="inputName">Name</label>
        <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
    </div>
    <div class="form-group">
        <label for="inputEmail">Email</label>
        <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
    </div>
    <input type="submit" value="Submit" class="btn btn-primary">
</form>`;

  const formContainer = document.querySelector('.form-container');
  formContainer.innerHTML = formHTML;

  const form = document.querySelector('form');
  const submit = document.querySelector('[type="submit"]');

  const watchedState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    if (validateField(selector, state.values[selector]).length === 0) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    submit.disabled = state.error.name.length !== 0 || state.error.email.length !== 0;
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const data = new FormData(form).get(targetName);
    watchedState.values[targetName] = data;
    watchedState.error[targetName] = validateField(targetName, data);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/users', {})
      .then((response) => {
        document.body.innerHTML = `<p>${response.data.message}</p>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
