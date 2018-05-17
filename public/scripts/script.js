const submitButton = document.querySelector('button');


const fetchToken = async (e) => {
  e.preventDefault();

  const admin = checkAdmin();

  const inputs = document.querySelectorAll('input');
  let body;

  if (admin.length) {
    body = {
    email: inputs[0].value,
    appName: inputs[1].value,
    admin: admin[0]
    }; 
  } else {
    body = {
      email: inputs[0].value,
      appName: inputs[1].value,
    }
  }

  const response = await fetch('/authenticate', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const token = await response.json();
  inputs[0].value = '';
  inputs[1].value = '';
  showToken(token);

};

const checkAdmin = () => {
  const email = document.querySelector('.email').value;
  const isTuring = email.includes('turing.io');
  if (isTuring) {
    return [email];
  } else {
    return [];
  }
}

const showToken = token => {
  const parent = document.querySelector('section');
  const child = document.createElement('article');
  child.setAttribute('class', 'token')
  child.innerHTML = `<h2>Your token is: token:${token.token}</h2>`;
  parent.appendChild(child);
}


submitButton.addEventListener('click', fetchToken)
