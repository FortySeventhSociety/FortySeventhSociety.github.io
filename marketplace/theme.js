
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
            var selectedCSS = localStorage.getItem('selectedCSS') || 'default.css';
            var selectElement = document.getElementById('css-selector');

            if (selectElement) {
                selectElement.value = selectedCSS;
                changeCSS(selectedCSS);
            }
        }

        // Ripristina il CSS quando la pagina viene caricata
        window.onload = restoreCSS;