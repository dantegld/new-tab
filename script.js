    (function(){
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

        if (bar && tooltip) {
            bar.addEventListener('mouseenter', function(){ tooltip.setAttribute('aria-hidden', 'false'); });
            bar.addEventListener('mouseleave', function(){ tooltip.setAttribute('aria-hidden', 'true'); });
        }

        const now = new Date();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout(function(){
            update();
            setInterval(update, 60 * 1000);
        }, msToNextMinute);
    })();