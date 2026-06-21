
fetch('schema.json')
  .then(res => res.json())
  .then(schema => buildForm(schema));

function buildForm(schema) {
  document.getElementById('form-title').textContent = schema.formTitle;
  const form = document.getElementById('dynamic-form');

  schema.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'field-group';

    const label = document.createElement('label');
    label.textContent = field.label + (field.required ? ' *' : '');
    label.htmlFor = field.id;
    group.appendChild(label);

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      field.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        input.appendChild(o);
      });
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.placeholder = field.placeholder || '';
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.placeholder = field.placeholder || '';
    }
    input.id = field.id;
    input.name = field.id;
    group.appendChild(input);

    const errMsg = document.createElement('div');
    errMsg.className = 'error-msg';
    errMsg.id = field.id + '-error';
    group.appendChild(errMsg);
    form.appendChild(group);
  });

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Submit';
  form.appendChild(btn);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    schema.fields.forEach(field => {
      if (field.required) {
        const val = document.getElementById(field.id).value.trim();
        const err = document.getElementById(field.id + '-error');
        const inp = document.getElementById(field.id);
        if (!val) {
          inp.classList.add('error');
          err.textContent = field.label + ' is required.';
          valid = false;
        } else {
          inp.classList.remove('error');
          err.textContent = '';
        }
      }
    });
    if (valid) {
      form.classList.add('hidden');
      document.getElementById('success-msg').classList.remove('hidden');
    }
  });
}
