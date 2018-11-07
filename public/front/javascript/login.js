function loginUser() {
  const login = async () => {
    const org = await axios.get('/api/v2/org');
    const token = await axios.post('/api/v2/user/login', {
      username: document.getElementById('InputLogin').value,
      password: document.getElementById('InputPassword').value,
    }, {
      headers: {
        'x-api-key': org.data.msg,
      },
    });
    return token.data;
  };
  login()
    .then((result) => {
      if (!result.token) {
        console.log('Unauthorized');
      } else {
        localStorage.setItem('token', result.token);
        window.location = 'begin.html';
      }
    })
    .catch((exception) => {
      console.log(exception);
    });
}
