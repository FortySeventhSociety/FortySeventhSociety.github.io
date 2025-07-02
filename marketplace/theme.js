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
            localStorage.setItem('selectedCSS', cssFile);
        }

        // Ripristina la scelta dell'utente dal localStorage
        function restoreCSS() {
            var selectedCSS = localStorage.getItem('selectedCSS') || 'css/default.css';
            var selectElement = document.getElementById('css-selector');

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

          const searchInput = $('.dt-input');

            while (true) {
                if (searchInput) {
                searchInput.focus();
                    break;
                } else {
                  setTimeout(function() {
                  }, 1000);
                }
            }
            
            

        // Ripristina il CSS quando la pagina viene caricata
        window.onload = restoreCSS;