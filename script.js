//Checking if there is already any contacts to load
if (!localStorage.getItem('contacts')) {
    localStorage.setItem('contacts', "[]");
}
else {
    PostContacts(JSON.parse(localStorage.getItem('contacts')));
}

function Submit() {
    //Gets list of contacts with added contact
    const [field, error] = AddContact('form');
    //adds to localstorage and renders new list if there's no errors
    if (error === '') {
        let contacts = JSON.parse(localStorage.getItem('contacts'));
        contacts.push(field);
        localStorage.setItem('contacts', JSON.stringify(contacts))
        PostContacts(contacts);
        form.reset();
    }
}

function AddContact(formName) {
    //clears previous errors
    const errorMsg = document.getElementsByClassName('error');
    errorMsg[0].innerHTML = '';
    const form = document.getElementById(formName).elements;
    const field = {};
    const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const dateReg = new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
    let error = '';
    //creates an object from form values
    for (let i = 0; i < (form.length - 1); i++) {
        switch (i) {
            case 2:
                if (!dateReg.test(form[2].value)) {
                    error = 'Date format must be yyyy-mm-dd';
                    ErrorMsg(error);
                }
                break;
            case 4:
                if (!emailReg.test(form[4].value)) {
                    error = "Incorrect email format";
                    ErrorMsg(error);
                }
                break;
        }
        field[form[i].name] = form[i].value;
    }
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    let unique = true;
    //gets last contact that was edited values to compare Email and phone number with other contacts
    const edit = Object.values(JSON.parse(localStorage.getItem('edit')));
    contacts.map(el => {
        if (formName === 'editContact') {
            if ((edit[3] !== form[3].value && ((el.phone === form[3].value) && unique)) || (edit[4] !== form[4].value && ((el.email === form[4].value) && unique))) {
                error = 'Email and phone number must be unique';
                ErrorMsg(error);
                unique = false;
            }
        }
        else if ((el.email === form[4].value || el.phone === form[3].value) && unique) {
            error = 'Email and phone number must be unique';
            ErrorMsg(error);
            unique = false;
        }
    })
    let data = [];
    data.push(field);
    data.push(error);
    return data;
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
//Writes error message 
function ErrorMsg(msg) {
    const error = document.getElementsByClassName('error');
    const text = document.createElement('div');
    text.innerHTML = msg;
    error[0].appendChild(text);
}

//Renders all contacts to the screen
function PostContacts(data) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    data.map(el => {
        const contact = document.createElement('div');
        contact.classList.add('box');
        const del = document.createElement('button');
        del.classList.add('delete');
        del.innerHTML = 'delete';
        const edit = document.createElement('button');
        edit.classList.add('editButton');
        edit.innerHTML = 'edit';
        contact.innerHTML = "First name: " + el.firstname + "</br>Last name: " + el.lastname + "</br>Date of birth: " + el.birthdate + "</br>Phone: " + el.phone + "</br>E-mail: " + el.email + "</br>Address: " + el.address + "</br>";
        contact.append(del);
        contact.append(edit);
        container.append(contact);
    })
}

//Edit and delete buttons 
document.querySelector('.container').addEventListener('click', e => {
    const elem = e.target.parentNode;
    //Gets number, so we can tell which contact to delete from localstorage
    const number = /Phone: (.*?)<br>/i.exec(elem.innerHTML);
    if (e.target.textContent === 'delete') {
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        const newContacts = [];
        contacts.map(e => {
            if (e.phone !== number[1]) {
                newContacts.push(e);
            }
        })
        localStorage.setItem('contacts', JSON.stringify(newContacts));
        elem.remove();
    }

    if (e.target.textContent === 'edit') {
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        const display = document.getElementById('edit');
        //Makes edit form visible
        display.style.display = 'inline';
        const form = document.getElementById('editContact').elements;
        contacts.map(data => {
            if (data.phone == number[1]) {
                contactValues = Object.values(data);
                localStorage.setItem('edit', JSON.stringify(data));
                for (let i = 0; i < (form.length - 1); i++) {
                    //Loads selected contact information to edit form
                    form[i].value = contactValues[i];
                }
            }
        })
    }
})

function Edit() {
    const [field, error] = AddContact('editContact');
    const contacts = JSON.parse(localStorage.getItem('contacts'));
    const editingContact = JSON.parse(localStorage.getItem('edit'));
    const newContacts = [];
    if (error === '') {
        contacts.map(e => {
            //Loads edited contacts information
            if (e.phone == editingContact.phone) {
                newContacts.push(field)
            }
            else {
                newContacts.push(e);
            }
        })
        localStorage.setItem('contacts', JSON.stringify(newContacts));
        PostContacts(newContacts);
        document.getElementById('edit').style.display = 'none';
    }
}

//Hides edit form
function Cancel() {
    document.getElementById('edit').style.display = 'none';
}