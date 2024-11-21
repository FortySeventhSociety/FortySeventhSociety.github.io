// D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved ///////

    const switchButton3 = document.getElementById('switch3');
    const togglePage2 = () => {
        switchButton3.classList.toggle('checked2');
        document.documentElement.classList.toggle('vision-ui');
        setTimeout(()=>{window. location = '../index.html'},1000);
    };
    switchButton3.addEventListener('click', togglePage2);