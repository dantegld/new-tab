function time_bar(){
    const bar = document.getElementById('day-progress');
    const fill = bar.querySelector('.fill');
    const tooltip = document.getElementById('day-tooltip');

    function update() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ms = now.getMilliseconds();
        
        const totalMsSinceMidnight = (h * 3600 + m * 60 + s) * 1000 + ms;
        
        const START_TIME = 25200000; //7u (7*3600*1000)
        const END_TIME = 82800000; //23u (23*3600*1000)
        const ACTIVE_TIME = 57600000; //16u (23u-7u)
        const OFF_TIME = 28800000; //8u (24u-16u)
        
        let p = 0;
        
        if (totalMsSinceMidnight >= START_TIME && totalMsSinceMidnight < END_TIME) {
            p = ((totalMsSinceMidnight - START_TIME) / ACTIVE_TIME) * 100;
            bar.classList.remove('off-hours');
            if (tooltip) tooltip.textContent = Math.round(p) + '%';
        } else {
            bar.classList.add('off-hours');
            let msSince11PM = 0;
            let msUntil7AM = 0;
            
            if (totalMsSinceMidnight >= END_TIME) {
                msSince11PM = totalMsSinceMidnight - END_TIME;
                msUntil7AM = (24 * 3600 * 1000) - totalMsSinceMidnight + START_TIME;
            } else {
                msSince11PM = totalMsSinceMidnight + (24 * 3600 * 1000 - END_TIME);
                msUntil7AM = START_TIME - totalMsSinceMidnight;
            }
            
            p = 100 - ((msSince11PM / OFF_TIME) * 100);
            
            const hrsLeft = Math.floor(msUntil7AM / (3600 * 1000));
            const minsLeft = Math.floor((msUntil7AM % (3600 * 1000)) / (60 * 1000));
            
            if (tooltip) {
                if (hrsLeft > 0) {
                    tooltip.textContent = `${hrsLeft}h ${minsLeft}m`;
                } else {
                    tooltip.textContent = `${minsLeft}m`;
                }
            }
        }
        
        p = Math.min(100, Math.max(0, p));
        fill.style.transform = 'scaleX(' + (p / 100) + ')';
        bar.setAttribute('aria-valuenow', Math.round(p));
    }

    setTimeout(update, 50)
    
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    setTimeout(function(){
        update();
        setInterval(update, 60 * 1000);
    }, msToNextMinute);
};


function change_color_setting(){
    const bar = document.getElementById("fill");
    const color_form = document.getElementById("settings-color-form");

    const color_classes = ['progress-bar-default', 'progress-bar-green', 'progress-bar-blue'];
    if (!color_form || !bar) return;
    color_form.addEventListener('change', (event)=> {
        const selected_color = event.target.value;

        bar.classList.remove(...color_classes);
        bar.classList.add(selected_color);
        try { localStorage.setItem('helium_color', selected_color); } catch(e){}
    })
}

function load_color_setting(){
    const bar = document.getElementById("fill");
    const color_form = document.getElementById("settings-color-form");
    const color_classes = ['progress-bar-default', 'progress-bar-green', 'progress-bar-blue'];
    if (!bar) return;

    const stored = localStorage.getItem('helium_color') || 'progress-bar-default';
    bar.classList.remove(...color_classes);
    bar.classList.add(stored);

    if (color_form) {
        const input = color_form.querySelector(`input[value="${stored}"]`);
        if (input) input.checked = true;
    }
}





// ------------MAIN------------

//init time
time_bar();


// settings
const tooltip = document.getElementById("day-tooltip")
const settings = document.getElementById("settings")
if (tooltip && settings) {
    tooltip.addEventListener("click", ()=>settings.classList.toggle("hide"))
}


load_color_setting();
change_color_setting();

