let userID;
// form validation
// validate form
const validateForm = () => {
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const phone = $("#phone").val();
  //   const email = $("#email").val();
  //   const address = $("#address").val();

  if (firstName === "" || lastName === "" || phone === "") {
    const msg = `<h2>Inputs are invalid/empty.</h2>`;
    $(".form-msg").html(msg);
    return false;
  }
  $(".form-msg").empty();
  return true;
};

const resetFormInputs = () => {
  $("#firstName").val("");
  $("#lastName").val("");
  $("#phone").val("");
  $("#email").val("");
  $("#address").val("");
};

// show all data function
function showContacts() {
  let contactDB;

  if (localStorage.getItem("contactDB") === null) {
    contactDB = [];
  } else {
    contactDB = JSON.parse(localStorage.getItem("contactDB"));
  }

  let html = "";

  //   if (contactDB.length !== 0) {
  contactDB.forEach((element, index) => {
    html += `
        <li class='contact-list-info' data-id="${element.id}" >
            <span onclick="showContactDetails(${element.id})">${
      element.firstName.charAt(0).toUpperCase() + element.firstName.slice(1)
    } ${
      element.lastName.charAt(0).toUpperCase() + element.lastName.slice(1)
    }</span>
            <div>
                <button onclick="updateContact(${+element.id})" class="material-symbols-outlined contact-edit-btn">edit_square</button>
                <button onclick="deleteContact(${+element.id})" class="material-symbols-outlined contact-delete-btn">delete</button>
            </div>
        </li>`;
  });

  $("#contact-lists").html(html);
}

// function to add data to local storage
const addContact = () => {
  $(".form-msg").empty();
  let contactDB;
  // if form valid
  if (validateForm() === true) {
    if (localStorage.getItem("contactDB") === null) {
      contactDB = [];
    } else {
      contactDB = JSON.parse(localStorage.getItem("contactDB"));
    }

    contactDB.push({
      id: contactDB.length + 1,
      firstName: $("#firstName").val().toLowerCase(),
      lastName: $("#lastName").val().toLowerCase(),
      phone: $("#phone").val().toLowerCase(),
      email: $("#email").val().toLowerCase(),
      address: $("#address").val().toLowerCase(),
    });

    localStorage.setItem("contactDB", JSON.stringify(contactDB));

    showContacts();
    resetFormInputs();
    $(".contact-add-modal").removeClass("open"); // remove modal
    $(".contact-info").css({ display: "none" });
    $(".home").css({ display: "block" });
    $("#search-form").css({ display: "block" });
  }
};

// delete contact from localstorage
const deleteContact = (index) => {
  let contactDB;

  if (localStorage.getItem("contactDB") === null) {
    contactDB = [];
  } else {
    contactDB = JSON.parse(localStorage.getItem("contactDB"));
  }

  contactDB = contactDB.filter((obj) => obj.id !== index);

  localStorage.setItem("contactDB", JSON.stringify(contactDB));
  showContacts();
};

// update data from localstorage
const updateContact = (id) => {
  userID = id;
  $(".contact-add-modal").addClass("open"); // open modal
  $(".form-msg").empty();
  $("#form-save-btn").css({ display: "none" }); // hide save btn
  $("#form-update-btn").css({ display: "block" }); // show update btn
  $("#form-heading").html("Update Contact"); // change form heading

  let contactDB;

  if (localStorage.getItem("contactDB") === null) {
    contactDB = [];
  } else {
    contactDB = JSON.parse(localStorage.getItem("contactDB"));
  }

  const index = contactDB.findIndex((obj) => obj.id === userID);

  $("#firstName").val(contactDB[index].firstName);
  $("#lastName").val(contactDB[index].lastName);
  $("#phone").val(contactDB[index].phone);
  $("#email").val(contactDB[index].email);
  $("#address").val(contactDB[index].address);

  $("#form-update-btn").click(() => {
    const index = contactDB.findIndex((obj) => obj.id === userID);
    if (validateForm() === true) {
      contactDB[index].firstName = $("#firstName").val().toLowerCase();
      contactDB[index].lastName = $("#lastName").val().toLowerCase();
      contactDB[index].phone = $("#phone").val().toLowerCase();
      contactDB[index].email = $("#email").val().toLowerCase();
      contactDB[index].address = $("#address").val().toLowerCase();

      localStorage.setItem("contactDB", JSON.stringify(contactDB)); // save to db

      showContacts(); // render contact lists

      resetFormInputs(); // emtpy input fileds
      $(".contact-info").css({ display: "none" }); // hide contact info
      $("#form-save-btn").css({ display: "block" }); // show save btn
      $("#form-update-btn").css({ display: "none" }); // hide save btn
      $(".home-btn").css({ transform: "translateX(-120vw)" }); // hide back to home btn
      $(".contact-add-modal").removeClass("open"); // remove modal
      $("#search").val(""); // empty search field
      $("#search-form").css({ display: "block" }); // display search field
      $(".home").css({ display: "block" }); // show home
    }
  });
};

// Search Contact
$("#search").on("input", (e) => {
  const value = e.target.value.toLowerCase();
  let contactDB;

  if (localStorage.getItem("contactDB") === null) {
    contactDB = [];
  } else {
    contactDB = JSON.parse(localStorage.getItem("contactDB"));
  }

  let res = [];

  contactDB.forEach((contact) => {
    const isMatch =
      contact.firstName.toLowerCase().includes(value) ||
      contact.lastName.toLowerCase().includes(value);

    isMatch ? res.push(contact) : null;
  });

  let html = "";
  if (res.length !== 0) {
    res.forEach((element) => {
      html += `
            <li class='contact-list-info'data-id="${element.id}">
                <span  onclick="showContactDetails(${element.id})" >${
        element.firstName.charAt(0).toUpperCase() + element.firstName.slice(1)
      } ${
        element.lastName.charAt(0).toUpperCase() + element.lastName.slice(1)
      }</span>
                <div>
                    <button onclick="updateContact(${
                      element.id
                    })" class="material-symbols-outlined contact-edit-btn">edit_square</button>
                    <button onclick="deleteContact(${
                      element.id
                    })" class="material-symbols-outlined contact-delete-btn">delete</button>
                </div>
            </li>`;
    });
    $("#contact-lists").html(html);
    $(".home-btn").css({ transform: "translateX(-120vw)" });
  } else {
    console.log("else");
    html += `
              <li class='no-contact-msg'>
                  No Contact Found
              </li>`;
    $("#contact-lists").html(html);
    $(".home-btn").css({ transform: "translateX(0)" });
  }
});

// ! show contact details
const showContactDetails = (id) => {
  $(".contact-info").css({ display: "flex" });
  $(".home").css({ display: "none" });
  $("#search-form").css({ display: "none" });

  let contactDB;

  if (localStorage.getItem("contactDB") === null) {
    contactDB = [];
  } else {
    contactDB = JSON.parse(localStorage.getItem("contactDB"));
  }

  let usrInfo;
  contactDB.find((obj) => {
    if (obj.id === id) {
      usrInfo = obj;
    }
  });
  $("#user-name-letter").html(usrInfo.firstName.charAt(0).toUpperCase());
  $("#user-name").html(
    `${
      usrInfo.firstName.charAt(0).toUpperCase() + usrInfo.firstName.slice(1)
    } ${usrInfo.lastName.charAt(0).toUpperCase() + usrInfo.lastName.slice(1)}`
  );
  $("#user-email").html(`${usrInfo.email}`);
  $("#user-address").html(`${usrInfo.address}`);

  $(".user-info-btn-container").html(`
  <button class="contact-info-back-btn" onclick="backBtnEventHandler()">&#8592; Back</button>
  <button class="contact-info-edit-btn" onclick="updateContact(${usrInfo.id})">Edit</button>
  `);
};
// Form field reset
const formFieldReset = () => {
  $("#firstName").val("");
  $("#lastName").val("");
  $("#phone").val("");
  $("#email").val("");
  $("#address").val("");
};

// open form modal
$("#add-contact-btn").click(() => {
  $(".contact-add-modal").addClass("open");
  $(".form-msg").empty();
});
// close form modal
$("#add-contact-close-btn").click(() => {
  $(".form-msg").empty();
  $(".contact-add-modal").removeClass("open");
});

// back to home
$(".home-btn").click(() => {
  showContacts();
  $(".home-btn").css({ transform: "translateX(-120vw)" });
  $("#search").val("");
});

const backBtnEventHandler = () => {
  $(".contact-info").css({ display: "none" });
  $(".home").css({ display: "block" });
  $("#search-form").css({ display: "block" });
};

// Load All data when document
window.onload = showContacts();
