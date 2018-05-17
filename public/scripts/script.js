const submitButton = document.querySelector('button');


const fetchToken = async (e) => {
  const inputs = document.querySelectorAll('input');
  const body = {
    email: inputs[0].value,
    appName: inputs[1].value
  }

  const response = await fetch('/authenticate', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  })

  const token = await response.json();
   inputs[0].value = '';
   inputs[1].value = '';

   showToken(token)

}

const showToken = token => {
  console.log(token)
  const parent = document.querySelector('section');
  const child = document.createElement('article');
  child.innerHTML = `<h2>Your token is: token:${token.token}</h2>`;
  parent.appendChild(child);
}


submitButton.addEventListener('click', fetchToken)
