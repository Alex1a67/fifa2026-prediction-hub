const FIFA_RANKING = {
  ARG: 1,  // Argentina
  ESP: 2,  // Spanyol
  FRA: 3,  // Prancis
  ENG: 4,  // Inggris
  POR: 5,  // Portugal
  BRA: 6,  // Brasil
  MAR: 7,  // Maroko
  NED: 8,  // Belanda
  BEL: 9,  // Belgia
  GER: 10, // Jerman
  HRV: 11, // Kroasia (CRO)
  COL: 13, // Kolombia
  MEX: 14, // Meksiko
  SEN: 15, // Senegal
  URY: 16, // Uruguay
  USA: 17, // Amerika Serikat
  JPN: 18, // Jepang
  SUI: 19, // Swiss
  IRN: 20, // Iran
  TUR: 22, // Turki
  ECU: 23, // Ekuador
  AUT: 24, // Austria
  KOR: 25, // Korea Selatan
  AUS: 27, // Australia
  ALG: 28, // Aljazair
  EGY: 29, // Mesir
  CAN: 30, // Kanada
  NOR: 31, // Norwegia
  CIV: 33, // Pantai Gading
  PAN: 34, // Panama
  SWE: 38, // Swedia
  CZE: 40, // Ceko
  PAR: 41, // Paraguay
  SCO: 42, // Skotlandia
  TUN: 45, // Tunisia
  COD: 46, // RD Kongo (Zaire)
  UZB: 50, // Uzbekistan
  QAT: 56, // Qatar
  IRQ: 57, // Irak
  RSA: 60, // Afrika Selatan (RSA/RSA)
  KSA: 61, // Arab Saudi
  JOR: 63, // Yordania
  BIH: 64, // Bosnia & Herzegovina
  CPV: 67, // Tanjung Verde
  GHA: 73, // Ghana
  HAI: 82, // Haiti
  CUW: 83, // Curaçao
  NZL: 85  // Selandia Baru
};


const teamA = document.getElementById("teamA");
const teamB = document.getElementById("teamB");

teamList().forEach(team => {

    teamA.innerHTML += `
      <option value="${team.code}">
        ${team.name}
      </option>
    `;

    teamB.innerHTML += `
      <option value="${team.code}">
        ${team.name}
      </option>
    `;
});

teamA.value = "ARG";
teamB.value = "BRA";

updateFlags();

teamA.addEventListener("change", updateFlags);
teamB.addEventListener("change", updateFlags);

function updateFlags(){

    document.getElementById("flagA").src =
        flagUrl(teamA.value,160);

    document.getElementById("flagB").src =
        flagUrl(teamB.value,160);
}

document
.getElementById("simulateBtn")
.addEventListener("click", runAI);

function strength(code){

    const rank = FIFA_RANKING[code] || 50;

    return 200 - rank;
}

function runAI(){

    const A = teamA.value;
    const B = teamB.value;

    if(A === B){

        toast("Choose two different countries","warn");
        return;
    }

    let winA = 0;
    let winB = 0;
    let draw = 0;

    for(let i=0;i<1000;i++){

        const powerA =
            strength(A) +
            Math.random()*20;

        const powerB =
            strength(B) +
            Math.random()*20;

        if(powerA > powerB + 5){

            winA++;

        }else if(powerB > powerA + 5){

            winB++;

        }else{

            draw++;
        }
    }

    const total = winA + winB + draw;

    const pA =
        ((winA / total) * 100).toFixed(1);

    const pB =
        ((winB / total) * 100).toFixed(1);

    const pD =
        ((draw / total) * 100).toFixed(1);

    const rankA = FIFA_RANKING[A];
    const rankB = FIFA_RANKING[B];

    const diff = rankB - rankA;

    let scoreA =
        Math.max(
            0,
            Math.round(
                1.5 +
                diff/15 +
                Math.random()*2
            )
        );

    let scoreB =
        Math.max(
            0,
            Math.round(
                1.5 -
                diff/15 +
                Math.random()*2
            )
        );

    let winner = "Draw";

    if(scoreA > scoreB)
        winner = teamName(A);

    if(scoreB > scoreA)
        winner = teamName(B);

    const confidence =
        Math.max(
            pA,
            pB
        );

    document.getElementById("result").innerHTML = `

<div class="card no-hover" style="padding:1.5rem">

<div style="
display:flex;
justify-content:space-around;
align-items:center;
flex-wrap:wrap;
gap:1rem;
">

<div style="text-align:center">

<img src="${flagUrl(A,160)}"
style="width:90px;border-radius:12px">

<h3>${teamName(A)}</h3>

<small>Rank #${rankA}</small>

</div>

<div style="text-align:center">

<div style="
font-size:3.5rem;
font-weight:900;
line-height:1;
">

${scoreA} - ${scoreB}

</div>

<div class="badge badge-gold">
AI Result
</div>

</div>

<div style="text-align:center">

<img src="${flagUrl(B,160)}"
style="width:90px;border-radius:12px">

<h3>${teamName(B)}</h3>

<small>Rank #${rankB}</small>

</div>

</div>

<p style="
text-align:center;
margin-top:1rem;
font-size:1.1rem;
">

Predicted Winner:
<strong>${winner}</strong>

</p>

<div style="margin-top:1rem">

<div class="badge badge-cyan">
Win Probability
</div>

<div style="
display:flex;
height:18px;
overflow:hidden;
border-radius:999px;
margin-top:12px;
">

<div style="
width:${pA}%;
background:#00D4FF;
"></div>

<div style="
width:${pD}%;
background:#777;
"></div>

<div style="
width:${pB}%;
background:#FFD700;
"></div>

</div>

<div style="
display:flex;
justify-content:space-between;
margin-top:.5rem;
font-size:.9rem;
">

<span>${teamName(A)} ${pA}%</span>
<span>Draw ${pD}%</span>
<span>${teamName(B)} ${pB}%</span>

</div>

</div>

<div style="
margin-top:1rem;
text-align:center;
">

<span class="badge badge-green">
Confidence ${confidence}%
</span>

</div>

</div>


`;

    confetti(1800);
}