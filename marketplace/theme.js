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

        const input = $(".dt-input")

        setTimeout(function() {
            let inputElement = input;
            inputElement.selectionStart = inputElement.value.length;
            inputElement.selectionEnd = inputElement.value.length;
            inputElement.select();
        }, 1000);

        setTimeout(function() {
            let inputElement = input;
            inputElement.selectionStart = inputElement.value.length;
            inputElement.selectionEnd = inputElement.value.length;
            inputElement.select();
        }, 3000);

            setTimeout(function() {
            let inputElement = input;
            inputElement.selectionStart = inputElement.value.length;
            inputElement.selectionEnd = inputElement.value.length;
            inputElement.select();
        }, 5000);

            setTimeout(function() {
            let inputElement = input;
            inputElement.selectionStart = inputElement.value.length;
            inputElement.selectionEnd = inputElement.value.length;
            inputElement.select();
        }, 7000);

            setTimeout(function() {
            let inputElement = input;
            inputElement.selectionStart = inputElement.value.length;
            inputElement.selectionEnd = inputElement.value.length;
            inputElement.select();
        }, 10000);
            
        // Ripristina il CSS quando la pagina viene caricata
        window.onload = restoreCSS;