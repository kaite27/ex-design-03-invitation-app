import axios from "axios";

const invitationAPI = axios.create({ baseURL: process.env.API_URL });

const templates = {
  commentList: document.querySelector("#comments").content,
  leaveSvgEl: document.querySelector("#modal-leave-done").content
};

async function comments() {
  const res = await invitationAPI.get(
    `/comments?_sort=id&_order=desc`
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
