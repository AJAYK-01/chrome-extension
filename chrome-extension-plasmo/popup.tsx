import { useState } from "react";

function IndexPopup() {
  const [data, setData] = useState("");

  const popupHtml = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="popup_css.css">
    <title>Vibinex</title>
    <script src="popup.js"></script>
</head>

<body>
    <div id="loading-div" class="container">
        <div class="loader"></div>
    </div>
    <div id="login-div" class="container">
        <div class="heading">
            <img src="../resources/vibinex-logo.png" class="heading_logo" alt="Vibinex logo" />
            <p class="heading_text">Vibinex</p>
        </div>
        <div class="second_box">
            <img src="../resources/lightIcon.png" alt="" class="light-icon">
            <p id="highlightedText">Vibinex is active, but key features are missing.</p>
        </div>
        <div class="mainContent">
            <p class="secondHeading" id="advantagesHeading">Signup now to unlock the following: </p>
            <ul class="unorderList">
                <li><span class="list_item">Highlight important PRs to review</span></li>
                <li><span class="list_item">Highlight important sections of code</span></li>
                <li><span class="list_item">Get PR review coverage</span></li>
            </ul>
        </div>
    </div>
    <div id="session-div" class="container">
        <div class="heading">
            <img src="../resources/vibinex-logo.png" class="heading_logo" alt="Vibinex logo" />
            <p class="heading_text">Vibinex</p>
            <a class="button" style="width: fit-content;" href="https://vibinex.com/u" target="_blank">Dashboard</a>
        </div>
        <div class="second_box">
            <img src="../resources/lightIcon.png" alt="" class="light-icon">
            <p id="highlightedText">Vibinex is active!</p>
        </div>
        <div id="user_div">
            <img id="session-image" alt="User Profile Pic" class="profile_picture" />
            <h1 id="session-name" class="title"></h1>
            <p class="subtitle">
                You are logged in as <span id="session-email"></span>
            </p>
            <form id="signout-form" method="POST" target="_blank">
                <input class="csrfToken" type="hidden" name="csrfToken" />
                <button type="submit" class="logout_button">
                    <small>(Logout)</small>
                </button>
            </form>
            <a href="https://www.producthunt.com/products/vibinex-code-review/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-vibinex&#0045;code&#0045;review"
                target="_blank">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=534479&theme=light"
                    alt="Vibinex&#0032;Code&#0045;Review - A&#0032;distributed&#0032;process&#0032;for&#0032;reviewing&#0032;pull&#0032;requests&#0046; | Product Hunt"
                    class="producthunt_review_button" width="250" height="54" />
            </a>
        </div>
    </div>
    <footer>
        <a id="rate_us_anchor" href="https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc"
            target="_blank">Rate us!</a>
        <p id="version">Version number</p>
    </footer>
</body>

</html>
  `;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  };

  // Inject the HTML code into the component
  return <div dangerouslySetInnerHTML={{ __html: popupHtml }} />;
}

export default IndexPopup;
