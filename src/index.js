import axios from "axios";

const invitationAPI = axios.create({ baseURL: process.env.API_URL });

const templates = {
  commentList: document.querySelector("#comments").content,
  leaveSvgEl: document.querySelector("#modal-leave-done").content
};

async function comments() {
  const res = await invitationAPI.get(
    `/comments?_sort=id&_order=desc&_limit=3`
  );

  document.querySelector(".testmonial-grid").textContent = "";

  res.data.forEach(comm => {
    const fragment = document.importNode(templates.commentList, true);
    const bodyEl = fragment.querySelector(".testmonial-text");
    const authorEl = fragment.querySelector(".author");
    bodyEl.textContent = comm.body;
    authorEl.textContent = comm.name;
    document.querySelector(".testmonial-grid").appendChild(fragment);
  });
}

comments();

const svgFragment = document.importNode(templates.leaveSvgEl, true);

const btnLeaveComm = document.querySelector(".leave-comment");
const modalFormEl = document.querySelector(".leave-comm-form");

const btnModalClose = document.querySelector(".btn-cancel");
const commNameEl = document.querySelector("#comment-name");
const commBodyEl = document.querySelector("#comment-body");
const modalBtnLeave = document.querySelector(".btn-leave-comm");

btnLeaveComm.addEventListener("click", e => {
  $("#leaveCommModal").modal("toggle");
});

btnModalClose.addEventListener("click", e => {
  $("#leaveCommModal").modal("hide");
});

modalBtnLeave.addEventListener("click", async e => {
  e.preventDefault();
  const now = new Date();
  const reviewDate = now.toDateString();
  const payload = {
    name: commNameEl.value,
    body: commBodyEl.value,
    date: reviewDate
  };
  modalFormEl.textContent = "";
  modalFormEl.appendChild(svgFragment);
  // console.log(payload.name, payload.body, payload.date);
  const res = await invitationAPI.post(`/comments`, payload);
  comments();
});

/* hero slide images */
const slides = document.getElementsByClassName("js__imageBox");
const dots = document.getElementsByClassName("slide-badge");
let slideIndex = 0;

const openBadge1 = document.querySelector(".badge1");
const openBadge2 = document.querySelector(".badge2");
const openBadge3 = document.querySelector(".badge3");

openBadge1.addEventListener("click", e => {
  currentSlide(0);
});

openBadge2.addEventListener("click", e => {
  currentSlide(1);
});

openBadge3.addEventListener("click", e => {
  currentSlide(2);
});

function currentSlide(n) {
  showSlide((slideIndex = n));
}

function showSlide(n) {
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  if (n > slides.length) {
    slideIndex = 1;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
}

function autoShowSlide() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
  slideIndex++;
  if (slideIndex > slides.length - 1) {
    slideIndex = 0;
  }
  setTimeout(autoShowSlide, 4000);
}

autoShowSlide();

/* Mobile navigation */
$(document).ready(function() {
  $(".js--nav-icon").click(function() {
    const nav = $(".js--main-nav");
    const icon = $(".js--nav-icon i");
    const mobileMenu = $(".main-nav");
    const logo = $(".logo");

    nav.slideToggle(200);

    if (icon.hasClass("fa-bars")) {
      icon.addClass("fa-times");
      icon.removeClass("fa-bars");
      mobileMenu.css("display", "block");
      logo.css("display", "none");
    } else {
      icon.addClass("fa-bars");
      icon.removeClass("fa-times");
      mobileMenu.css("display", "none");
      logo.css("display", "block");
    }
  });
});

/* where-and-when section : tab control */

const openTab1 = document.querySelector(".tab1");
const openTab2 = document.querySelector(".tab2");
const openTab3 = document.querySelector(".tab3");

openTab1.addEventListener("click", e => {
  openEvent(event, "wedding");
});

openTab2.addEventListener("click", e => {
  openEvent(event, "bridalshower");
});

openTab3.addEventListener("click", e => {
  openEvent(event, "family");
});

function openEvent(event, eventName) {
  const tabContent = document.querySelectorAll(".js__event-box");
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  const tabLinks = document.querySelectorAll(".tab-links");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.querySelector(`#${eventName}`).style.display = "block";
  event.currentTarget.className += " active";
}

// 구글 맵 설정
function initMap() {
  const weddingParty = {
    lat: 37.249854,
    lng: 127.099823
  };
  const bridalParty = {
    lat: 37.511183,
    lng: 127.526446
  };

  let map = new google.maps.Map(document.getElementById("js__google-map"), {
    zoom: 15,
    center: weddingParty
  });
  let map2 = new google.maps.Map(document.getElementById("js__google-map2"), {
    zoom: 16,
    center: bridalParty
  });

  const icons = {
    wedding: {
      icon:
        "https://github.com/beigenut/ex-design-03-invitation/blob/master/src/images/location.png?raw=true"
    },
    bridal: {
      icon:
        "https://github.com/beigenut/ex-design-03-invitation/blob/master/src/images/location2.png?raw=true"
    }
  };

  const marker = new google.maps.Marker({
    position: weddingParty,
    map: map,
    animation: google.maps.Animation.DROP,
    title: "라비다 하우스 3층",
    icon: icons.wedding.icon
  });

  const marker2 = new google.maps.Marker({
    position: bridalParty,
    map: map2,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "펜션",
    icon: icons.bridal.icon
  });

  marker.addListener("click", toggleBounce);
  marker2.addListener("click", toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

initMap();

// bubbly-button
const animateButton = e => {
  e.target.classList.add("animate");
  setTimeout(function() {
    e.target.classList.remove("animate");
  }, 1000);
};

const bubblyButtons = document.getElementsByClassName("bubbly-button");

for (let i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener("click", animateButton, false);
}

// scroll smoothes
$(document).ready(function() {
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top
            },
            1000,
            function() {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            }
          );
        }
      }
    });
});

// rsvp form adding control
let currentOpen = 1;
const plus = document.querySelector(".js__add");
const remove = document.querySelector(".js__remove");
const form2 = document.querySelector(".second");
const form3 = document.querySelector(".third");
const name3El = document.querySelector("#rsvp-name-thr");
const name2El = document.querySelector("#rsvp-name-scd");
const name1El = document.querySelector("#rsvp-name");
const btnAttend = document.querySelector(".submit-attend");

const name1 = document.querySelector(".name1");
const contact1 = document.querySelector(".contact1");
const checked1 = document.querySelector(".checked1");
const comment1 = document.querySelector(".comment1");
const isAtteding1 = checked1.checked ? "yes" : "no";

const name2 = document.querySelector(".name2");
const contact2 = document.querySelector(".contact2");
const checked2 = document.querySelector(".checked2");
const comment2 = document.querySelector(".comment2");
const isAtteding2 = checked2.checked ? "yes" : "no";

const name3 = document.querySelector(".name3");
const contact3 = document.querySelector(".contact3");
const checked3 = document.querySelector(".checked3");
const comment3 = document.querySelector(".comment3");
const isAtteding3 = checked3.checked ? "yes" : "no";

plus.addEventListener("click", e => {
  e.preventDefault();
  if (currentOpen === 1) {
    form2.classList.remove("hide");
    currentOpen = 2;
    remove.classList.remove("btn-disable");
  } else {
    form3.classList.remove("hide");
    currentOpen = 3;
    plus.classList.add("btn-disable");
  }
});

remove.addEventListener("click", e => {
  e.preventDefault();
  if (currentOpen === 3) {
    form3.classList.add("hide");
    currentOpen = 2;
    plus.classList.remove("btn-disable");
  } else {
    form2.classList.add("hide");
    currentOpen = 1;
    plus.classList.remove("btn-disable");
    remove.classList.add("btn-disable");
  }
});

btnAttend.addEventListener("click", async e => {
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  if (currentOpen === 1) {
    name1El.value === "" ? alert("이름을 입력해주세요!") : sendApplication();
  } else if (currentOpen === 2) {
    name1El.value === "" || name2El.value === ""
      ? alert("이름을 입력해주세요!")
      : sendApplication();
  } else if (currentOpen === 3) {
    name1El.value === "" || name2El.value === "" || name3El.value === ""
      ? alert("이름을 입력해주세요!")
      : sendApplication();
  }
});

async function sendApplication() {
  const now = new Date();
  const reviewDate = now.toDateString();
  const payload = [
    {
      date: reviewDate,
      name: name1.value,
      contact: contact1.value,
      attendence: isAtteding1,
      comment: comment1.value
    },
    {
      date: reviewDate,
      name: name2.value,
      contact: contact2.value,
      attendence: isAtteding2,
      comment: comment2.value
    },
    {
      date: reviewDate,
      name: name3.value,
      contact: contact3.value,
      attendence: isAtteding3,
      comment: comment3.value
    }
  ];

  const attendedName = document.querySelector(".attendies");
  let attediesName = "";
  for (let i = 0; i < currentOpen; i++) {
    const res = await invitationAPI.post(`/attendies`, payload[i]);
    // console.log(payload[i]);
    attediesName += `${payload[i].name}, `;
  }
  attendedName.textContent = `${attediesName}의 신청이 완료되었습니다!`;
  $("#doneModal").modal("toggle");

  name1.value = "";
  contact1.value = "";
  comment1.value = "";
  checked1.checked = true;
  name2.value = "";
  contact2.value = "";
  comment2.value = "";
  checked2.checked = true;
  name3.value = "";
  contact3.value = "";
  comment3.value = "";
  checked3.checked = true;
}

// 카카오 친구 1:1 대화 연결
const chatToUs = document.querySelector(".kakao2");

Kakao.init("2fde21c147f65fbd8a546b41a606a3dd");

// 카카오 내비 연동
const kakaoNav = document.querySelectorAll(".kakaoNav");

for (let i = 0; i < kakaoNav.length; i++) {
  kakaoNav[i].addEventListener("click", e => {
    e.preventDefault();
    Kakao.Navi.start({
      name: "라비다 하우스",
      x: 127.099823,
      y: 37.249854,
      coordType: 'wgs84'
    });
  });
}