// D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved ///////

    const switchButton2 = document.getElementById('switch2');
    const togglePage = () => {
        switchButton2.classList.toggle('checked');
        document.documentElement.classList.toggle('vision-ui');
        setTimeout(()=>{window. location = '../../index.html'},1000);
    };
    switchButton2.addEventListener('click', togglePage);