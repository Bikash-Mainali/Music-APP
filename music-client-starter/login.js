"usestrict"
// const HEADERS = {
//     'Content-Type': 'application/json'
// }

const TOKEN = localStorage.getItem('token');

const HEADERS = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
}

//window.onload = function(){
    document.getElementById('loginBtn').onclick = login;
//}

async function login(){
    debugger
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        username: username,
        password: password
    }
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {'Content-Type': 'application/json'}
    });

    if(response.ok){
        const result = await response.json();
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('username', result.username);
        //location.href = 'welcome.html';
        document.getElementById('music-section').style.display = 'block';

    } else {
        document.getElementById('errorMsg').innerText = 'Incorrect username and password';
    }

}