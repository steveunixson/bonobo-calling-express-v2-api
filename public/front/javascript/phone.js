const call = async () => {
  const Token = await axios.get('/api/v2/yandex-key');
  const secretKey = '102';
  const mcConfig = { login: `${Token.data.yandex}`, password: `${secretKey}` };
  await MightyCallWebPhone.ApplyConfig(mcConfig);
  await MightyCallWebPhone.Phone.Init('phone');
};
call()
  .then(() => {
    document.querySelector('.btn.btn-danger.black').disabled = true;
  })
  .catch((exception) => { console.log(exception); });

let step = 0;
function startCall() {
  function counter() {
    return step++;
  }
  axios.post('/api/v2/numbers', { base: 'Говно залупа пенис хер 2', id: `${counter()}` }, {
    headers: {
      'x-api-key': '1',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIE5vbiBBZG1pbiA5IiwicGFzc3dvcmQiOiIydk5GZkR4QXpxdEFHbXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTUzODc1MDA2Mn0.qRx6xsVbxhaGbjPib1c-TGK4ehnzTcy30vBEo02j7xE',
    },
  })
    .then((response) => {
      console.log(response.data.msg.phoneNumber);
      document.getElementById('companyName').innerText = `Компания: ${response.data.msg.companyName}`;
    })
    .catch((exception) => {
      console.log(exception);
    });
  function webPhoneOnCallOutgoing(callInfo) {
    console.log(`Звонок от:${callInfo.From}`);
    console.log(`Звонок к:${callInfo.To}`);
    document.getElementById('nextNumber').disabled = true;
    document.getElementById('prevNumber').disabled = true;
    document.querySelector('.btn.btn-danger.black').disabled = true;
  }
  MightyCallWebPhone.Phone.OnCallOutgoing.subscribe(webPhoneOnCallOutgoing);
  console.log(step);
  localStorage.setItem('lastContactID', step);
}

function prevCall() {
  function counter() {
    return step--;
  }
  axios.post('/api/v2/numbers', { base: 'Говно залупа пенис хер 2', id: `${counter()}` }, {
    headers: {
      'x-api-key': '1',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIE5vbiBBZG1pbiA5IiwicGFzc3dvcmQiOiIydk5GZkR4QXpxdEFHbXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTUzODc1MDA2Mn0.qRx6xsVbxhaGbjPib1c-TGK4ehnzTcy30vBEo02j7xE',
    },
  })
    .then((response) => {
      console.log(response.data.msg.phoneNumber);
      document.getElementById('companyName').innerText = `Компания: ${response.data.msg.companyName}`;
    })
    .catch((exception) => {
      console.log(exception);
      localStorage.removeItem('lastContactID');
    });
  console.log(step);
  localStorage.setItem('lastContactID', step);
}

function endCall() {
  MightyCallWebPhone.Phone.HangUp();
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: visible';
  document.getElementById('nextNumber').disabled = true;
  document.getElementById('prevNumber').disabled = true;
  document.querySelector('.btn.btn-danger.black').disabled = true;
}

document.getElementById('selectLeedStatus').style = 'visibility: hidden';
document.getElementById('selectLeed').style = 'visibility: hidden';
document.getElementById('selectRecallProject').style = 'visibility: hidden';
document.getElementById('selectDeny').style = 'visibility: hidden';
document.getElementById('dateLead').style = 'visibility: hidden';
document.getElementById('timeLead').style = 'visibility: hidden';
document.getElementById('lprEmailInput').style = 'visibility: hidden';
document.getElementById('selectRecallReason').style = 'visibility: hidden';
document.getElementById('recallDate').style = 'visibility: hidden';
document.getElementById('recallTime').style = 'visibility: hidden';

function selectRecalStatus() {
  document.getElementById('selectRecallReason').style = 'visibility: visible';
}

function selectRecallDate() {
  document.getElementById('recallDate').style = 'visibility: visible';
  document.getElementById('recallTime').style = 'visibility: visible';
}

function selectLead() {
  document.getElementById('selectLeedStatus').style = 'visibility: visible';
}

function selectLeadDate() {
  document.getElementById('dateLead').style = 'visibility: visible';
  document.getElementById('timeLead').style = 'visibility: visible';
}

function showLead() {
  document.getElementById('selectLeed').style = 'visibility: visible';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
}

function showRecal() {
  document.getElementById('selectRecallProject').style = 'visibility: visible';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('dateLead').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
}

function showDeny() {
  document.getElementById('selectDeny').style = 'visibility: visible';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
}

function selectDeny() {
  if (document.getElementById('selectDeny').value === 'offer') {
    document.getElementById('lprEmailInput').style = 'visibility: visible';
  } else {
    document.getElementById('lprEmailInput').style = 'visibility: hidden';
  }
}

function onLeadSelectChange() {
  if (document.getElementById('selectLeed').value === 'Good Morning') {
    document.querySelector('#selectLeedStatus').children[0].disabled = false;
    document.querySelector('#selectLeedStatus').children[1].disabled = false;
    document.querySelector('#selectLeedStatus').children[2].disabled = true;
    document.querySelector('#selectLeedStatus').children[3].disabled = true;
    document.querySelector('#selectLeedStatus').children[4].disabled = true;
    document.querySelector('#selectLeedStatus').children[5].disabled = true;
  }
  if (document.getElementById('selectLeed').value === 'Key to Call') {
    document.querySelector('#selectLeedStatus').children[0].disabled = true;
    document.querySelector('#selectLeedStatus').children[1].disabled = true;
    document.querySelector('#selectLeedStatus').children[2].disabled = false;
    document.querySelector('#selectLeedStatus').children[3].disabled = false;
    document.querySelector('#selectLeedStatus').children[4].disabled = true;
    document.querySelector('#selectLeedStatus').children[5].disabled = true;
  }
  if (document.getElementById('selectLeed').value === 'Bonobo') {
    document.querySelector('#selectLeedStatus').children[0].disabled = true;
    document.querySelector('#selectLeedStatus').children[1].disabled = true;
    document.querySelector('#selectLeedStatus').children[2].disabled = true;
    document.querySelector('#selectLeedStatus').children[3].disabled = true;
    document.querySelector('#selectLeedStatus').children[4].disabled = false;
    document.querySelector('#selectLeedStatus').children[5].disabled = false;
  }
}

function sendStatus() {
  document.getElementById('nextNumber').disabled = false;
  document.getElementById('prevNumber').disabled = false;
  document.querySelector('.btn.btn-danger.black').disabled = false;
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('dateLead').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: hidden';
}
