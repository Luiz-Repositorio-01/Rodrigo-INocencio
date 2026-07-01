// NAV SCROLL STATE
const navbar = document.getElementById('navbar');
function onScroll(){
  if(!navbar) return;
  if(window.scrollY > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function toggleMenu(){
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}
if(hamburger){
  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
  window.addEventListener('keydown', e=>{
    if(e.key === 'Escape'){
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
if('IntersectionObserver' in window && revealEls.length){
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el=>revealObserver.observe(el));
} else {
  revealEls.forEach(el=>el.classList.add('in-view'));
}

// STAT COUNTERS
const counters = document.querySelectorAll('.stat-number[data-target]');
function animateCounter(el){
  const target = parseInt(el.getAttribute('data-target'), 10) || 0;
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const start = performance.now();
  function step(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if(progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}
if(counters.length){
  if('IntersectionObserver' in window){
    const counterObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.4 });
    counters.forEach(el=>counterObserver.observe(el));
  } else {
    counters.forEach(el=>animateCounter(el));
  }
}

// SKILL BAR FILL
const skillFills = document.querySelectorAll('.skill-fill[data-pct]');
if(skillFills.length){
  if('IntersectionObserver' in window){
    const skillObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.getAttribute('data-pct') + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.3 });
    skillFills.forEach(el=>skillObserver.observe(el));
  } else {
    skillFills.forEach(el=> el.style.width = el.getAttribute('data-pct') + '%');
  }
}

// HERO BG TEXT PARALLAX
const bgText = document.querySelector('.hero-bg-text');
if(bgText){
  window.addEventListener('scroll', ()=>{
    const offset = window.scrollY * 0.15;
    bgText.style.transform = `translateY(${offset}px)`;
  }, { passive:true });
}

// CHART.JS GLOBAL THEME + INIT (guarded, only runs if Chart is loaded and canvases exist)
if(typeof Chart !== 'undefined'){
  Chart.defaults.color = '#888';
  Chart.defaults.font.family = "'Oswald', sans-serif";
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

  const goldC = '#C9A84C';
  const redC = '#C0392B';
  const goldLight = '#E8C96A';

  const growthCanvas = document.getElementById('growthChart');
  if(growthCanvas){
    new Chart(growthCanvas, {
      type:'line',
      data:{
        labels:['2011','2013','2015','2017','2019','2021','2023','2025','2026'],
        datasets:[{
          label:'Pacientes atendidos (acumulado)',
          data:[10,45,90,150,220,300,390,470,520],
          borderColor:goldC,
          backgroundColor:'rgba(201,168,76,0.15)',
          pointBackgroundColor:redC,
          pointBorderColor:'#000',
          pointRadius:4,
          borderWidth:3,
          fill:true,
          tension:.35
        }]
      },
      options:{
        responsive:true,
        plugins:{ legend:{ labels:{ color:'#ccc' } } },
        scales:{
          x:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'#888' } },
          y:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'#888' } }
        }
      }
    });
  }

  const radarCanvas = document.getElementById('radarChart');
  if(radarCanvas){
    new Chart(radarCanvas, {
      type:'radar',
      data:{
        labels:['Ortopédica','Esportiva','Geriátrica','MTC / Acupuntura','Osteopatia / Quiro','Performance','Recovery'],
        datasets:[{
          label:'Foco de atuação',
          data:[92,95,80,85,90,93,88],
          backgroundColor:'rgba(201,168,76,0.18)',
          borderColor:goldC,
          pointBackgroundColor:redC,
          pointBorderColor:'#000',
          borderWidth:2
        }]
      },
      options:{
        responsive:true,
        plugins:{ legend:{ display:false } },
        scales:{
          r:{
            angleLines:{ color:'rgba(255,255,255,0.08)' },
            grid:{ color:'rgba(255,255,255,0.08)' },
            pointLabels:{ color:'#ccc', font:{ size:11 } },
            ticks:{ display:false, backdropColor:'transparent' },
            suggestedMin:0, suggestedMax:100
          }
        }
      }
    });
  }

  const doughnutCanvas = document.getElementById('doughnutChart');
  if(doughnutCanvas){
    new Chart(doughnutCanvas, {
      type:'doughnut',
      data:{
        labels:['Fisioterapia Ortopédica','Fisioterapia Esportiva','Osteopatia / Quiropraxia','Recovery','MTC / Acupuntura'],
        datasets:[{
          data:[30,25,20,15,10],
          backgroundColor:[goldC, redC, goldLight, '#8B0000', '#555'],
          borderColor:'#000',
          borderWidth:2
        }]
      },
      options:{
        responsive:true,
        plugins:{ legend:{ position:'bottom', labels:{ color:'#ccc', boxWidth:14, padding:14 } } }
      }
    });
  }
}
