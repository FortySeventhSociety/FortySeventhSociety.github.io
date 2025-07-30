// D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved ///////

// Funzione per cambiare il CSS
function changeCSS(cssFile) {
    var link = document.getElementById("theme-stylesheet");

    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.id = "theme-stylesheet";
        document.head.appendChild(link);
    }

    link.href = cssFile;

    // Memorizza la scelta dell'utente nel localStorage
    localStorage.setItem("selectedCSS", cssFile);
}

// Ripristina la scelta dell'utente dal localStorage
function restoreCSS() {
    var selectedCSS = localStorage.getItem("selectedCSS") || "css/default.css";
    var selectElement = document.getElementById("css-selector");

    if (selectElement) {
        selectElement.value = selectedCSS;
        changeCSS(selectedCSS);
    }
}

/*
        setTimeout(function() {
                $(".dt-input").focus();
        }, 1000);

        setTimeout(function() {
                $(".dt-input").focus();
        }, 3000);

            setTimeout(function() {
                $(".dt-input").focus();
        }, 5000);

            setTimeout(function() {
                $(".dt-input").focus();
        }, 7000);

            setTimeout(function() {
                $(".dt-input").focus();
        }, 10000);
            */

/*
        setTimeout(function() {
        const searchInput = document.getElementById('dt-search-0');
            searchInput.focus();
        }, 5000);
        */

/*
        // JavaScript to autofocus the input field without scrolling or interfering with typing.
        // The 'DOMContentLoaded' event ensures the script runs only after the entire HTML
        // document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('dt-search-0');

            // Check if the input element exists to prevent errors
            if (searchInput) {
                // Set focus on the input field.
                // The 'focus()' method does not cause the page to scroll to the element by default,
                // which is exactly what the user requested. It also doesn't interfere with typing
                // as it simply sets the cursor in the field.
                searchInput.focus();
            }
        });
        */

async function fetchDataAndProcess() {
    try {
        const response = await fetch(
            "https://api.nomstead.com/open/marketplace",
        );
        setTimeout(function () {
            $(".dt-input").focus();
        }, 3500);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Ripristina il CSS quando la pagina viene caricata
window.onload = restoreCSS;

fetchDataAndProcess();
