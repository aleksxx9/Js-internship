if (!localStorage.getItem('contacts')) {
    localStorage.setItem('contacts', "[]");
}
else {
    PostContacts(JSON.parse(localStorage.getItem('contacts')));
}

function Submit() {
    const errorMsg = document.getElementsByClassName('error');
    errorMsg[0].innerHTML = '';
    const form = document.getElementById('form').elements;
    const field = {};
    const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const dateReg = new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
    let error = '';
    for (let i = 0; i < (form.length - 1); i++) {
        switch (i) {
            case 2:
                if (!dateReg.test(form[2].value)) {
                    error = 'Date format must be yyyy-mm-dd';
                    ErrorMsg(error);
                    return false;
                }
                break;
            case 4:
                if (!emailReg.test(form[4].value)) {
                    error = "Incorrect email format";
                    ErrorMsg(error);
                    return false;
                }
                break;
        }
        field[form[i].name] = form[i].value;
    }
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    let unique = true;
    contacts.map(el => {
        if ((el.email === form[4].value || el.phone === form[3].value) && unique) {
            error = 'Email and phone number must be unique';
            ErrorMsg(error);
            unique = false;
        }
    })
    if (error === '') {
        contacts.push(field);
        localStorage.setItem('contacts', JSON.stringify(contacts))
        PostContacts(contacts);
        form.reset();
    }
}

document.getElementById('firstname').addEventListener('keydown', (e) => {
    Prevent(e, /^[a-zA-Z\b\t]+$/);
})
document.getElementById('lastname').addEventListener('keydown', (e) => {
    Prevent(e, /^[a-zA-Z\b\t]+$/);
})

function Prevent(e, reg) {
    const regex = new RegExp(reg);
    const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(key)) {
        e.preventDefault();
        return false;
    }
}
function ErrorMsg(msg) {
    const error = document.getElementsByClassName('error');
    const text = document.createElement('div');
    text.innerHTML = msg;
    error[0].appendChild(text);
}
function PostContacts(data) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    data.map(el => {
        const contact = document.createElement('div');
        const del = document.createElement('button');
        del.classList.add('delete');
        del.innerHTML = 'delete';
        contact.innerHTML = "First name: " + el.firstname + "</br>Last name: " + el.lastname + "</br>Date of birth: " + el.birthdate + "</br>Phone: " + el.phone + "</br>E-mail: " + el.email + "</br>Address: " + el.address + "</br>";
        contact.append(del);
        container.append(contact);
    })
}
document.querySelector('.container').addEventListener('click', e => {
    if (e.target.textContent === 'delete') {
        const elem = e.target.parentNode;
        const number = /Phone: (.*?)<br>/i.exec(elem.innerHTML);
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        const newContacts = [];
        contacts.map(e => {
            if (e.phone === number[1]) {

            }
            else {
                newContacts.push(e);
            }
        })
        localStorage.setItem('contacts', JSON.stringify(newContacts));
        elem.remove();
    }
})
