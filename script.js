"use strict";

const missions = [
 {id:"antalya",city:"Antalya",park:"Güllük Dağı (Termessos) Millî Parkı",lat:36.98847911576245,lon:30.467727169313214,difficulty:"BAŞLANGIÇ",level:"Kolay",duration:125,water:3,lines:2,wind:"Poyraz",speed:16,dir:225,spread:.21,fireOffset:[20,10],story:"Termessos çevresindeki ormanlık alanda yangın ihbarı alındı. Rüzgâr alevleri koruma alanına doğru taşıyor; doğal ve tarihî çevreyi korumalısın.",description:"Antalya · İlk müdahale operasyonu",weather:"Ilık · Orta nem"},
 {id:"mugla",city:"Muğla",park:"Marmaris Millî Parkı",lat:36.85643971236706,lon:28.32285446299242,difficulty:"ORTA",level:"Orta",duration:125,water:3,lines:2,wind:"Lodos",speed:24,dir:225,spread:.23,fireOffset:[-14,-8],story:"Marmaris'in çam ormanlarında başlayan kurgusal yangın, lodosla birlikte büyüme riski taşıyor. Müdahale kaynaklarını dikkatli kullan.",description:"Muğla · Kıyı ormanlarını koru",weather:"Sıcak · Kuru"},
 {id:"izmir",city:"İzmir",park:"Dilek Yarımadası Büyük Menderes Deltası Millî Parkı",lat:37.697830096230035,lon:27.187240511753245,difficulty:"ORTA",level:"Orta",duration:125,water:4,lines:2,wind:"İmbat",speed:21,dir:180,spread:.24,fireOffset:[22,0],story:"Dilek Yarımadası çevresindeki ormanlık alanda yangın başladı. Değişken kıyı rüzgârı alevleri korunan doğal alana taşıyabilir.",description:"İzmir · Kıyı ve maki alanları",weather:"Değişken · Orta nem"},
 {id:"canakkale",city:"Çanakkale",park:"Kazdağı Millî Parkı",lat:39.64695962052076,lon:26.956869535338793,difficulty:"ZOR",level:"Zor",duration:120,water:4,lines:2,wind:"Karayel",speed:32,dir:225,spread:.28,fireOffset:[20,10],story:"Kazdağı eteklerinde kuvvetli karayel etkisi var. Yangın daha hızlı yayılabilir; koruma hattını doğru yerde kurmalısın.",description:"Çanakkale · Kuvvetli rüzgâr operasyonu",weather:"Sıcak · Rüzgârlı"},
 {id:"adana",city:"Adana",park:"Karatepe-Aslantaş Millî Parkı",lat:37.297490496173424,lon:36.25227034803289,difficulty:"UZMAN",level:"Uzman",duration:115,water:4,lines:2,wind:"Keşişleme",speed:38,dir:180,spread:.31,fireOffset:[20,0],story:"Karatepe-Aslantaş çevresinde sıcak ve kuru hava koşulları hâkim. Kuvvetli rüzgâr yangını hızlandırırken sınırlı kaynaklarla alanı korumalısın.",description:"Adana · Zorlu arazi operasyonu",weather:"Çok sıcak · Kuru"},
 {id:"beytepe",city:"Ankara",park:"Hacettepe Beytepe Kampüsü · Özel Görev",lat:39.878851242178044,lon:32.73749796110494,difficulty:"BONUS",level:"Özel görev",duration:125,water:4,lines:2,wind:"Kuzeybatı",speed:19,dir:315,spread:.22,fireOffset:[-20,10],story:"Beytepe Kampüsü yakınındaki ağaçlık alanda kurgusal yangın ihbarı alındı. Kampüs çevresindeki yeşil dokuyu ve yerleşkeyi koru.",description:"Ankara · Bonus kampüs görevi",weather:"Serin · Orta nem"}
];

const STORAGE = "alevleYarisV2";
const LANG_STORAGE = "alevleYarisLanguage";
// İlk kez gelen oyuncuya isim sor; daha önce isim belirleyen oyuncunun kaydını koru.
const hasSavedPlayerName = (() => {
 try {
  const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
  return !!(saved && typeof saved.name === "string" && saved.name.trim() && saved.name.trim() !== "Oyuncu");
 } catch {
  return false;
 }
})();
let currentLang = localStorage.getItem(LANG_STORAGE) || "tr";

const UI = {
 tr: {
  "brandTitle":"Alevle Yarış","brandSubtitle":"Türkiye'de Yangınla Mücadele","selectionTitle":"Türkiye görev haritası","selectionHint":"Bir görev noktası seç","operationCenter":"Operasyon merkezi",
  "completed":"Tamamlanan","stars":"Yıldızlar","lives":"Can","prepare":"Göreve hazırlan →",
  "highScore":"Rekorlarım","bestTotal":"En iyi toplam puan","missionRecords":"Görev rekorları",
  "operationPanel":"Operasyon paneli","remainingTime":"Kalan süre","score":"Puan","burningCells":"Yanan hücreler","greenThreat":"Yeşil Alan Tehdidi",
  "forestProtection":"Millî parkın korunma oranı","fireControl":"Yangın kontrol seviyesi","parkDistance":"Park sınırına mesafe","spreadRate":"Yayılma hızı",
  "water":"Su","waterHelp":"Etki alanını gör, tıkla","firebreak":"Yangın şeridi","firebreakHelp":"İki nokta seçerek çiz","remaining":"Kalan hak:",
  "toolHint":"Müdahale aracını seç ve harita üzerinde kullan.","pause":"Ⅱ Duraklat","resume":"▶ Devam et","back":"← Görevler",
  "analysisTitle":"Yangın Alanı Analizi · OpenLayers","analysisDesc":"Görev alanı, yangın başlangıcı ve etkilenen hücreler.",
  "legendPark":"Koruma alanı","legendFire":"Yangından etkilenen hücre","legendStart":"Başlangıç noktası",
  "retry":"Yeniden dene","resultBack":"Görev seçimine dön","restartTitle":"Tüm canların tükendi!",
  "restartDesc":"Yeni oyuna başlarsan tamamladığın görevler, yıldızların ve puan rekorların silinecek. Baştan başlamak istiyor musun?",
  "restartYes":"Evet, baştan başla","cancel":"İptal","nameTitle":"Oyuncu adını değiştir","nameDesc":"Oyunda görünmesini istediğin adı yaz.","namePlaceholder":"Oyuncu adı","save":"Kaydet","dismiss":"Vazgeç",
  "mission":"Görev","seconds":"saniye","waterRights":"su hakkı","firebreakRights":"yangın şeridi","done":"TAMAM","easy":"Kolay","medium":"Orta","hard":"Zor","expert":"Uzman","special":"Özel görev",
  "start":"BAŞLANGIÇ","mid":"ORTA","difficult":"ZOR","advanced":"UZMAN","bonus":"BONUS"
 },
 en: {
  "brandTitle":"Race Against the Flames","brandSubtitle":"Wildfire Response in Türkiye","selectionTitle":"Mission map of Türkiye","selectionHint":"Select a mission location","operationCenter":"Operations center",
  "completed":"Completed","stars":"Stars","lives":"Lives","prepare":"Prepare for mission →",
  "highScore":"High Scores","bestTotal":"Combined Best Score","missionRecords":"Mission Records",
  "operationPanel":"Operations panel","remainingTime":"Time remaining","score":"Score","burningCells":"Burning cells","greenThreat":"Protected Area Threat",
  "forestProtection":"National park protection","fireControl":"Fire control level","parkDistance":"Distance to park boundary","spreadRate":"Fire spread rate",
  "water":"Water","waterHelp":"Preview the area, then click","firebreak":"Firebreak","firebreakHelp":"Draw by selecting two points","remaining":"Remaining:",
  "toolHint":"Select a response tool and use it on the map.","pause":"Ⅱ Pause","resume":"▶ Resume","back":"← Missions",
  "analysisTitle":"Fire Area Analysis · OpenLayers","analysisDesc":"Mission area, fire origin and affected cells.",
  "legendPark":"Protected area","legendFire":"Fire-affected cell","legendStart":"Starting point",
  "retry":"Try again","resultBack":"Back to mission selection","restartTitle":"All lives lost!",
  "restartDesc":"Starting a new game will erase your completed missions, stars and high scores. Do you want to start over?",
  "restartYes":"Yes, start over","cancel":"Cancel","nameTitle":"Change player name","nameDesc":"Enter the name you want to use in the game.","namePlaceholder":"Player name","save":"Save","dismiss":"Cancel",
  "mission":"Mission","seconds":"sec","waterRights":"water uses","firebreakRights":"firebreaks","done":"COMPLETED","easy":"Easy","medium":"Medium","hard":"Hard","expert":"Expert","special":"Special mission",
  "start":"STARTER","mid":"MEDIUM","difficult":"HARD","advanced":"EXPERT","bonus":"BONUS"
 }
};

const MISSION_EN = {
 antalya:{park:"Güllük Dağı (Termessos) National Park",level:"Easy",difficulty:"STARTER",story:"A wildfire has been reported in the forest around Termessos. The wind is pushing the flames toward the protected area; protect its natural and historical environment.",description:"Antalya · Initial response operation",weather:"Mild · Moderate humidity",wind:"Northeasterly"},
 mugla:{park:"Marmaris National Park",level:"Medium",difficulty:"MEDIUM",story:"A simulated wildfire has started in the pine forests of Marmaris and may intensify with the southerly wind. Use your response resources carefully.",description:"Muğla · Protect the coastal forests",weather:"Hot · Dry",wind:"Southerly"},
 izmir:{park:"Dilek Peninsula–Büyük Menderes Delta National Park",level:"Medium",difficulty:"MEDIUM",story:"A wildfire has started in the forest around the Dilek Peninsula. Changing coastal winds may carry the flames into the protected natural area.",description:"İzmir · Coastal and maquis areas",weather:"Variable · Moderate humidity",wind:"Sea breeze"},
 canakkale:{park:"Mount Ida (Kazdağı) National Park",level:"Hard",difficulty:"HARD",story:"Strong northwesterly winds are affecting the foothills of Mount Ida. The fire may spread faster; establish the firebreak in the right place.",description:"Çanakkale · Strong-wind operation",weather:"Hot · Windy",wind:"Northwesterly"},
 adana:{park:"Karatepe-Aslantaş National Park",level:"Expert",difficulty:"EXPERT",story:"Hot and dry conditions prevail around Karatepe-Aslantaş. Strong winds are accelerating the fire; protect the area with limited resources.",description:"Adana · Challenging terrain operation",weather:"Very hot · Dry",wind:"Southeasterly"},
 beytepe:{park:"Hacettepe Beytepe Campus · Special Mission",level:"Special mission",difficulty:"BONUS",story:"A simulated wildfire has been reported in a wooded area near Beytepe Campus. Protect the green areas and campus surroundings.",description:"Ankara · Bonus campus mission",weather:"Cool · Moderate humidity",wind:"Northwesterly"}
};

const TEXT_EN = {
 "Önce önceki görevi tamamlamalısın.":"Complete the previous mission first.",
 "Canların bitti. Yeni oyun başlatmalısın.":"You are out of lives. Start a new game.",
 "Yangının başlangıç noktası":"Fire starting point",
 "Süre doldu; yangın tamamen kontrol altına alınamadı.":"Time is up; the fire was not fully contained.",
 "Bu noktada müdahale edilebilecek aktif alev yok. Su hakkın korunuyor.":"There are no active flames to target here. Your water supply is preserved.",
 "Su müdahalesi başarılı!":"Water intervention successful!",
 "💧 Su müdahalesi başarılı!":"💧 Water intervention successful!",
 "Başlangıç noktası seçildi. Şimdi yangın şeridinin bitiş noktasını seç.":"Starting point selected. Now choose the endpoint of the firebreak.",
 "Yangın şeridi oluşturuldu. Alevin bu hattı geçerek yayılması engellenir.":"Firebreak created. The line prevents flames from spreading across it.",
 "🧯 Yangın şeridi oluşturuldu!":"🧯 Firebreak created!",
 "Müdahale aracını seç.":"Select a response tool.",
 "Yangın koruma alanına ulaştı.":"The fire reached the protected area.",
 "Yangın söndürüldü ve 5 saniyelik kontrol süresince yeniden başlamadı.":"The fire was extinguished and did not reignite during the 5-second monitoring period.",
 "⚠️ Yangın millî park sınırına yaklaşıyor!":"⚠️ The fire is approaching the national park boundary!",
 "Oyun duraklatıldı":"Game paused","Oyun devam ediyor.":"Game resumed.",
 "Yeni oyun başladı. Tüm ilerleme sıfırlandı.":"A new game has started. All progress has been reset.",
 "Bu noktada müdahale edilebilecek aktif alev yok. Su hakkın korunuyor.":"There are no active flames to target here. Your water supply is preserved.",
 "Müdahale aracını seç.":"Select a response tool.",
 "Su müdahalesi başarılı! ":"Water intervention successful! ",
 "Yangın şeridi: önce başlangıç, sonra bitiş noktasını seç.":"Firebreak: select a starting point, then an endpoint.",
 "Oyun duraklatıldı. Devam etmek için butona bas.":"Game paused. Press the button to resume.",
 "Görevden ayrıldın. Bir can kaybettin; göreve yeniden başladığında kaynakların sıfırlanacak.":"You left the mission and lost one life. Your resources will reset when you restart the mission."
};

function trText(key) { return currentLang === "en" ? (TEXT_EN[key] || key) : key; }
function missionField(m, field) { return currentLang === "en" ? (MISSION_EN[m.id]?.[field] ?? m[field]) : m[field]; }
function applyLanguage(lang) {
 currentLang = lang === "en" ? "en" : "tr";
 localStorage.setItem(LANG_STORAGE, currentLang);
 document.documentElement.lang = currentLang;
 document.title = currentLang === "en"
  ? "Race Against the Flames | Wildfire Response in Türkiye"
  : "Alevle Yarış | Türkiye'de Yangınla Mücadele";
 document.querySelectorAll("[data-i18n]").forEach(el => {
  const key = el.getAttribute("data-i18n");
  el.textContent = UI[currentLang][key] || UI.tr[key] || el.textContent;
 });
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = UI[currentLang][el.dataset.i18nPlaceholder] || "");
 $("langTR").classList.toggle("active", currentLang === "tr");
 $("langEN").classList.toggle("active", currentLang === "en");
 $("langTR").setAttribute("aria-pressed", String(currentLang === "tr"));
 $("langEN").setAttribute("aria-pressed", String(currentLang === "en"));
 renderProfile();
 renderMissionList();
 if (selected) selectMission(selected.id);
 if (game && !game.done) updateHUD();
}

const freshProfile = () => ({
 name:"Oyuncu",
 lives:3,
 unlocked:1,
 completed:{},
 best:{},
 totalScore:0
});

let requirePlayerName = !hasSavedPlayerName;

let profile = loadProfile(),
 selected = missions[0],
 selectionMap,
 gameMap,
 game,
 analysisMap = null,
 tickTimer,
 countdown,
 activeTool = null,
 firstBreak = null,
 paused = false,
 toastTimer,
 waterPreview = null;

const $ = id => document.getElementById(id);

function loadProfile() {
 try {
  return {
   ...freshProfile(),
   ...JSON.parse(localStorage.getItem(STORAGE) || "{}")
  };
 } catch {
  return freshProfile();
 }
}

function saveProfile() {
 localStorage.setItem(STORAGE, JSON.stringify(profile));
 renderProfile();
}

function notify(s) {
 $("toast").textContent = trText(s);
 $("toast").classList.remove("hidden");
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2600);
}

function hearts(n) {
 return "❤️".repeat(Math.max(0,n)) + "🤍".repeat(Math.max(0,3-n));
}

function allMissionsCompleted() {
 return missions.every(m => !!profile.completed[m.id]);
}

function showGrandFinale() {
 $("resultTitle").textContent = (currentLang === "en" ? "🏆 TÜRKİYE IS SAVED!" : "🏆 TÜRKİYE KURTARILDI!");
 $("resultText").textContent = (currentLang === "en" ? "You completed all six operations and successfully protected the mission areas across Türkiye!" : "Altı operasyonun tamamını bitirdin. Türkiye'nin görev alanlarını başarıyla korudun!");

 $("resultDetails").innerHTML = `
  <div class="stats-strip">
   <div class="mini-stat"><span>${currentLang === "en" ? "Missions completed" : "Tamamlanan görev"}</span><b>6/6</b></div>
   <div class="mini-stat"><span>${currentLang === "en" ? "Total stars" : "Toplam yıldız"}</span><b>${Object.values(profile.completed).reduce((a,v)=>a+(v.stars||0),0)}/18</b></div>
   <div class="mini-stat"><span>${currentLang === "en" ? "Total score" : "Genel puan"}</span><b>${profile.totalScore||0}</b></div>
  </div>
  <p>${currentLang === "en" ? `Great work, ${profile.name}! All missions completed.` : `Harika iş çıkardın, ${profile.name}! Tüm görevler tamamlandı.`}</p>
 `;

 $("retryBtn").classList.add("hidden");
 $("resultBackBtn").textContent = (currentLang === "en" ? "Return to operations center" : "Operasyon merkezine dön");
 $("overlay").classList.remove("hidden");
}

function renderProfile() {
    const playerName = profile.name || "Oyuncu";
    $("playerChip").textContent = currentLang === "en"
        ? "👤 Player: " + (playerName === "Oyuncu" ? "Player" : playerName)
        : "👤 Oyuncu: " + (playerName === "Player" ? "Oyuncu" : playerName);

    $("completedStat").textContent = Object.keys(profile.completed).length + "/6";
    const stars = Object.values(profile.completed).reduce((a, v) => a + (v.stars || 0), 0);
    $("starsStat").textContent = stars + "/18";
    $("livesStat").textContent = hearts(profile.lives);
    $("headerProgress").textContent =
        (currentLang === "en" ? "Mission " : "Görev ") +
        Math.min(profile.unlocked, 6) + "/6 · ⭐ " + stars + "/18";

    // Genel rekor: her görevin en yüksek puanlarının toplamı.
    const bestScores = missions.map(m =>
        Number(profile.best?.[m.id] || profile.completed?.[m.id]?.score || 0)
    );
    const combinedBest = bestScores.reduce((sum, value) => sum + value, 0);
    $("bestTotalScore").textContent = combinedBest.toLocaleString(
        currentLang === "en" ? "en-US" : "tr-TR"
    );
    $("missionRecords").innerHTML = missions.map((m, i) => {
        const score = bestScores[i];
        return `<div class="record-row"><span>${m.city}</span><strong>${
            score > 0 ? score.toLocaleString(currentLang === "en" ? "en-US" : "tr-TR") + " PTS" : "—"
        }</strong></div>`;
    }).join("");
}

function makeSelectionMap() {
 selectionMap = L.map("map", {
  zoomControl:true,
  scrollWheelZoom:true
 }).setView([38.2,34.2],5);

 L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
   attribution:"Tiles © Esri",
   maxZoom:19,
   noWrap:true
  }
 ).addTo(selectionMap);

 missions.forEach((m,i) => {
  m.marker = L.circleMarker([m.lat,m.lon], {
   radius:8,
   color:"#ffb05b",
   weight:2,
   fillColor:m.id === selected.id ? "#f15b2a" : (i < profile.unlocked ? "#ffb05b" : "#6e7770"),
   fillOpacity:1
  }).addTo(selectionMap);

  m.marker.bindTooltip(
   (i < profile.unlocked ? "" : "🔒 ") + m.city + " · " + missionField(m,"park")
  );

  m.marker.on("click", () => selectMission(m.id));
 });
}

function updateMissionMarkers() {
 missions.forEach((m,i) => {
  if(!m.marker)return;
  const unlocked=i < profile.unlocked;
  m.marker.setStyle({
   fillColor:m.id === selected.id ? "#f15b2a" : (unlocked ? "#ffb05b" : "#6e7770")
  });
  m.marker.setTooltipContent(
   (unlocked ? "" : "🔒 ") + m.city + " · " + missionField(m,"park")
  );
 });
}

function setHint(message) {
 const instruction=$("gameInstruction");
 if(instruction)instruction.textContent=trText(message);
}

function renderMissionList() {
 $("missionList").innerHTML = missions.map((m,i) => {
  const open = i < profile.unlocked;
  const done = profile.completed[m.id];
  const stars = done ? "⭐".repeat(done.stars) : "";

  return `
   <button class="mission ${m.id===selected.id?"active":""} ${open?"":"locked"}"
    data-id="${m.id}" ${open?"":"disabled"}>
    <span class="tree">${open?(done?"🏆":"🌲"):"🔒"}</span>
    <span class="mission-info">
     <b>${m.city} ${stars}</b>
     <small>${missionField(m,"park")}</small>
    </span>
    <span class="level">${done?UI[currentLang].done:(currentLang === "en" ? MISSION_EN[m.id].difficulty : m.difficulty)}</span>
   </button>
  `;
 }).join("");

 document.querySelectorAll(".mission:not(:disabled)").forEach(b => {
  b.addEventListener("click", () => selectMission(b.dataset.id));
 });
 updateMissionMarkers();
}

function selectMission(id) {
 const index = missions.findIndex(m => m.id === id);

 if (index >= profile.unlocked) {
  notify("Önce önceki görevi tamamlamalısın.");
  return;
 }

 selected = missions[index];
 renderMissionList();

 $("missionTitle").textContent = selected.city + (currentLang === "en" ? " Operation" : " operasyonu");
 $("missionDescription").textContent = missionField(selected,"description");
 $("missionStory").textContent = missionField(selected,"story");

 $("difficultyTag").textContent = missionField(selected,"level");
 $("timeTag").textContent = selected.duration + " " + UI[currentLang].seconds;
 $("waterTag").textContent = selected.water + " " + UI[currentLang].waterRights;
 $("breakTag").textContent = "2 " + UI[currentLang].firebreakRights;
 $("weatherTag").textContent = missionField(selected,"weather");

 if (selectionMap) {
  selectionMap.flyTo([selected.lat,selected.lon],7,{duration:.5});
 }
}

function boundsFor(m) {
 return [[m.lat-.19,m.lon-.25],[m.lat+.19,m.lon+.25]];
}

function startMission() {
 if (profile.lives <= 0) {
  notify("Canların bitti. Yeni oyun başlatmalısın.");
  return;
 }

 $("selectionView").classList.add("hidden");
 $("gameView").classList.remove("hidden");
 $("overlay").classList.add("hidden");

 $("gameMissionName").textContent = selected.city + " · " + missionField(selected,"park");

 if (gameMap) {
  gameMap.remove();
  gameMap = null;
 }

 gameMap = L.map("gameMap", {
  zoomControl:true,
  maxBounds:boundsFor(selected),
  maxBoundsViscosity:.85
 }).setView([selected.lat,selected.lon],10);

 L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {attribution:"Tiles © Esri",maxZoom:19,noWrap:true}
 ).addTo(gameMap);

 const b = boundsFor(selected);
 gameMap.fitBounds(b);

 const park = L.circle([selected.lat,selected.lon], {
  radius:2600,
  color:"#74d18b",
  weight:2,
  fillColor:"#55b96f",
  fillOpacity:.12,
  dashArray:"6 6"
 }).addTo(gameMap);

 park.bindTooltip(missionField(selected,"park"),{
  permanent:true,
  direction:"top",
  className:"park-label"
 });

 const N=64;
 const forest=new Uint8Array(N*N);
 const heat=new Float32Array(N*N);
 const age=new Uint8Array(N*N);
 const barriers=new Uint8Array(N*N);
 const wet=new Uint8Array(N*N);

 const parkX=32,parkY=32;
 const offsetX=selected.fireOffset[0]+Math.round((Math.random()-.5)*6);
 const offsetY=selected.fireOffset[1]+Math.round((Math.random()-.5)*6);

 let fireX=Math.max(5,Math.min(N-6,parkX+offsetX));
 let fireY=Math.max(5,Math.min(N-6,parkY+offsetY));

 const idx=(x,y)=>y*N+x;

 // Marmaris için yaklaşık kara maskesi.
 const marmarisLand=[
  [0,0],[64,0],[64,64],[48,58],[40,55],
  [32,50],[26,44],[22,38],[18,32],[17,26],
  [19,20],[22,16],[30,12],[42,8],[64,6]
 ];

 function insideMarmarisLand(x,y) {
  let inside=false;

  for(let i=0,j=marmarisLand.length-1;i<marmarisLand.length;j=i++) {
   const xi=marmarisLand[i][0],yi=marmarisLand[i][1];
   const xj=marmarisLand[j][0],yj=marmarisLand[j][1];

   if(((yi>y)!==(yj>y)) &&
    (x<(xj-xi)*(y-yi)/(yj-yi+1e-9)+xi)) {
    inside=!inside;
   }
  }

  return inside;
 }

 for(let y=0;y<N;y++) {
  for(let x=0;x<N;x++) {
   const d=Math.hypot(x-parkX,y-parkY);

   if(selected.id==="mugla") {
    forest[idx(x,y)] =
     insideMarmarisLand(x+.5,y+.5) &&
     ((x*7+y*11)%17!==0) ? 1 : 0;
   } else {
    forest[idx(x,y)] =
     (d<27 && ((x*7+y*11)%17!==0)) ? 1 :
     (((x*13+y*5)%9<6) ? 1 : 0);
   }
  }
 }

 if(selected.id==="mugla" && !forest[idx(fireX,fireY)]) {
  let nearest=null,best=Infinity;

  for(let y=0;y<N;y++) {
   for(let x=0;x<N;x++) {
    if(forest[idx(x,y)]) {
     const d=Math.hypot(x-fireX,y-fireY);

     if(d<best) {
      best=d;
      nearest={x,y};
     }
    }
   }
  }

  if(nearest) {
   fireX=nearest.x;
   fireY=nearest.y;
  }
 }

 for(let oy=-1;oy<=1;oy++) {
  for(let ox=-1;ox<=1;ox++) {
   const x=fireX+ox,y=fireY+oy;

   if(x>=0&&x<N&&y>=0&&y<N&&forest[idx(x,y)]) {
    heat[idx(x,y)]=1;
    age[idx(x,y)]=1;
   }
  }
 }

 const parkCells=[];

 for(let y=0;y<N;y++) {
  for(let x=0;x<N;x++) {
   if(Math.hypot(x-parkX,y-parkY)<7) {
    parkCells.push(idx(x,y));
   }
  }
 }

 const canvas=document.createElement("canvas");
 canvas.width=N*4;
 canvas.height=N*4;

 const ctx=canvas.getContext("2d");
 ctx.imageSmoothingEnabled=true;

 const overlay=L.imageOverlay(canvas.toDataURL(),b,{
  opacity:.95,
  interactive:false
 }).addTo(gameMap);

 game={
  N,forest,heat,age,barriers,wet,parkCells,
  parkX,parkY,fireX,fireY,canvas,ctx,overlay,b,
  water:selected.water,
  lines:2,
  time:selected.duration,
  score:0,
  done:false,
  tick:0,
  initialFire:9,
  paused:false,
  parkHit:false,
  firebreakLayers:[],
  startBurning:9
 };

 const fireMarker=L.circleMarker(
  [cellLat(fireY),cellLon(fireX)],
  {
   radius:6,
   color:"#ffd078",
   fillColor:"#ff4a24",
   fillOpacity:1,
   weight:2
  }
 ).addTo(gameMap);

 fireMarker.bindTooltip(currentLang === "en" ? "Fire starting point" : "Yangının başlangıç noktası");
 game.fireMarker=fireMarker;
 game.park=park;

 gameMap.on("click",onMapClick);
 gameMap.on("mousemove",onMapMove);

 activeTool=null;
 firstBreak=null;
 paused=false;

 $("pauseBtn").textContent="Ⅱ Duraklat";
 $("pauseBtn").disabled=false;

 updateHUD();
 renderHeat();

 clearInterval(tickTimer);
 clearInterval(countdown);

 tickTimer=setInterval(simulate,1000);

 countdown=setInterval(()=>{
  if(!game||game.done||paused)return;

  game.time--;
  updateHUD();

  if(game.time<=0) {
   finishGame(false,"Süre doldu; yangın tamamen kontrol altına alınamadı.");
  }
 },1000);

 setTimeout(()=>gameMap.invalidateSize(),200);
}

function cellLat(y) {
 return game.b[1][0]+
  (y/(game.N-1))*(game.b[0][0]-game.b[1][0]);
}

function cellLon(x) {
 return game.b[0][1]+
  (x/(game.N-1))*(game.b[1][1]-game.b[0][1]);
}

function nearestCell(ll) {
 const x=Math.round(
  (ll.lng-game.b[0][1])/
  (game.b[1][1]-game.b[0][1])*(game.N-1)
 );

 const y=Math.round(
  (ll.lat-game.b[1][0])/
  (game.b[0][0]-game.b[1][0])*(game.N-1)
 );

 return {
  x:Math.max(0,Math.min(game.N-1,x)),
  y:Math.max(0,Math.min(game.N-1,y))
 };
}

function onMapMove(e) {
 if(!game||game.done||activeTool!=="water")return;

 const ll=e.latlng;
 const previewRadius=650;

 if(waterPreview) {
  waterPreview.setLatLng(ll);
  waterPreview.setRadius(previewRadius);
 } else {
  waterPreview=L.circle(ll,{
   radius:previewRadius,
   color:"#78d5ff",
   weight:2,
   fillColor:"#65c9f4",
   fillOpacity:.18,
   dashArray:"5 5",
   interactive:false
  }).addTo(gameMap);
 }
}

function onMapClick(e) {
 if(!game||game.done||paused)return;

 if(activeTool==="water") {
  if(game.water<=0)return;

  const c=nearestCell(e.latlng);
  let target=null,best=Infinity;

  for(let y=Math.max(0,c.y-8);y<=Math.min(game.N-1,c.y+8);y++) {
   for(let x=Math.max(0,c.x-8);x<=Math.min(game.N-1,c.x+8);x++) {
    const i=y*game.N+x;
    const d=Math.hypot(x-c.x,y-c.y);

    if(game.heat[i]>.08&&d<best) {
     best=d;
     target={x,y};
    }
   }
  }

  if(!target) {
   setHint("Bu noktada müdahale edilebilecek aktif alev yok. Su hakkın korunuyor.");
   return;
  }

  game.water--;
  let extinguished=0;
  // Su müdahalesi, hedefin çevresindeki en yakın 12 hücreyi etkiler.
  const affectedCells=[];
  for(let y=Math.max(0,target.y-2);y<=Math.min(game.N-1,target.y+2);y++) {
   for(let x=Math.max(0,target.x-2);x<=Math.min(game.N-1,target.x+2);x++) {
    affectedCells.push({x,y,d:Math.hypot(x-target.x,y-target.y)});
   }
  }
  affectedCells.sort((a,b)=>a.d-b.d);

  affectedCells.slice(0,16).forEach(({x,y})=>{
   const i=y*game.N+x;
   if(game.heat[i]>.08)extinguished++;
   game.heat[i]=0;
   game.age[i]=0;
   game.wet[i]=8;
  });

  game.score+=Math.max(40,extinguished*8);

  const splash=L.circle(
   [cellLat(target.y),cellLon(target.x)],
   {
    radius:650,
    color:"#75c9ef",
    weight:2,
    fillColor:"#55b9ec",
    fillOpacity:.2,
    dashArray:"5 5"
   }
  ).addTo(gameMap);

  setTimeout(()=>{
   if(gameMap&&gameMap.hasLayer(splash)) {
    gameMap.removeLayer(splash);
   }
  },2600);

  setHint("Su müdahalesi başarılı! "+extinguished+" yanan hücre söndürüldü. Kalan su: "+game.water+". Haritaya tıklayarak devam edebilirsin.");
  notify("💧 Su müdahalesi başarılı!");
  // Su aracı, haklar bitene kadar aktif kalır; tekrar ikon seçmek gerekmez.
  if(game.water<=0) setTool(null);
  updateHUD();
  renderHeat();
  return;
 }

 if(activeTool==="break") {
  if(game.lines<=0)return;

  if(!firstBreak) {
   firstBreak=e.latlng;
   setHint("Başlangıç noktası seçildi. Şimdi yangın şeridinin bitiş noktasını seç.");
   return;
  }

  const a=nearestCell(firstBreak);
  const b=nearestCell(e.latlng);
  const steps=Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y),1);

  for(let s=0;s<=steps;s++) {
   const x=Math.round(a.x+(b.x-a.x)*s/steps);
   const y=Math.round(a.y+(b.y-a.y)*s/steps);

   if(x>=0&&x<game.N&&y>=0&&y<game.N) {
    game.barriers[y*game.N+x]=1;
   }
  }

  L.polyline([firstBreak,e.latlng],{
   color:"#17231b",
   weight:6,
   opacity:.95,
   lineCap:"round"
  }).addTo(gameMap);

  L.polyline([firstBreak,e.latlng],{
   color:"#e8c98c",
   weight:2.5,
   opacity:1,
   lineCap:"round"
  }).addTo(gameMap);

  firstBreak=null;
  game.lines--;
  game.score+=100;

  setHint("Yangın şeridi oluşturuldu. Alevin bu hattı geçerek yayılması engellenir.");
  notify("🧯 Yangın şeridi oluşturuldu!");
  setTool(null);
  updateHUD();
  return;
 }
}

function setTool(t) {
 activeTool=t;
 firstBreak=null;

 $("waterTool").classList.toggle("active",t==="water");
 $("breakTool").classList.toggle("active",t==="break");

 if(waterPreview) {
  gameMap.removeLayer(waterPreview);
  waterPreview=null;
 }

 if(t==="water") {
  setHint("Su: Fareyi haritada gezdirerek küçük etki alanını gör, aktif alevin yakınına tıkla.");
 } else if(t==="break") {
  setHint("Yangın şeridi: önce başlangıç, sonra bitiş noktasını seç.");
 } else {
  setHint("Müdahale aracını seç.");
 }
}
function simulate() {
 if(!game||game.done||paused)return;

 game.tick++;

 const {N,heat,age,forest,barriers,wet}=game;
 const next=new Float32Array(heat);
 const windRad=selected.dir*Math.PI/180;
 const wx=Math.cos(windRad),wy=Math.sin(windRad);

 for(let i=0;i<wet.length;i++) {
  if(wet[i]>0)wet[i]--;
 }

 for(let y=1;y<N-1;y++) {
  for(let x=1;x<N-1;x++) {
   const i=y*N+x;

   if(heat[i]>.12) {
    age[i]=Math.min(255,age[i]+1);

    if(age[i]>21) {
     next[i]=0;
     continue;
    }

    for(let oy=-1;oy<=1;oy++) {
     for(let ox=-1;ox<=1;ox++) {
      if(!ox&&!oy)continue;

      const xx=x+ox,yy=y+oy,j=yy*N+xx;

      if(!forest[j]||heat[j]>.1||barriers[j]||wet[j]>0)continue;

      const d=Math.hypot(ox,oy);
      const alignment=(ox*wx+oy*wy)/d;
      const p=selected.spread*(.24+Math.max(0,alignment)*1.05)*(d===1?1:.68);

      if(Math.random()<p) {
       next[j]=Math.max(next[j],.85);
       age[j]=Math.max(age[j],1);
      }
     }
    }

    if(Math.random()<.07) {
     const xx=Math.round(x+wx*2);
     const yy=Math.round(y+wy*2);

     if(xx>0&&xx<N&&yy>0&&yy<N) {
      const j=yy*N+xx;

      if(forest[j]&&!barriers[j]&&wet[j]===0) {
       next[j]=Math.max(next[j],.75);
       age[j]=Math.max(age[j],1);
      }
     }
    }
   } else if(heat[i]>.01) {
    next[i]=Math.max(0,heat[i]-.09);
   }
  }
 }

 game.heat=next;

 const parkBurn=game.parkCells.filter(i=>next[i]>.1).length;
 game.parkHit=parkBurn>0;

 if(game.parkHit) {
  finishGame(false,"Yangın koruma alanına ulaştı.");
  return;
 }

 renderHeat();
 updateHUD();

 const burning=next.reduce((a,v)=>a+(v>.1?1:0),0);

 if(burning===0) {
  game.clearTicks=(game.clearTicks||0)+1;

  if(game.clearTicks>=5) {
   finishGame(true,"Yangın söndürüldü ve 5 saniyelik kontrol süresince yeniden başlamadı.");
  }
 } else {
  game.clearTicks=0;
 }
}

function renderHeat() {
 const {N,ctx,canvas,heat,overlay}=game;
 const w=canvas.width,h=canvas.height;

 ctx.clearRect(0,0,w,h);
 ctx.imageSmoothingEnabled=true;

 for(let y=0;y<N;y++) {
  for(let x=0;x<N;x++) {
   const i=y*N+x,v=heat[i];

   if(v<.08||!game.forest[i])continue;

   const px=(x+.5)/N*w;
   const py=(y+.5)/N*h;
   const radius=(1.25+v*2.1)*(w/N);

   const g=ctx.createRadialGradient(px,py,0,px,py,radius);

   g.addColorStop(0,"rgba(190,25,12,.94)");
   g.addColorStop(.22,"rgba(244,55,18,.88)");
   g.addColorStop(.48,"rgba(255,116,28,.58)");
   g.addColorStop(.76,"rgba(255,174,58,.20)");
   g.addColorStop(1,"rgba(255,174,58,0)");

   ctx.fillStyle=g;
   ctx.beginPath();
   ctx.arc(px,py,radius,0,Math.PI*2);
   ctx.fill();
  }
 }

 if(selected.id==="mugla") {
  const mask=document.createElement("canvas");
  mask.width=w;
  mask.height=h;

  const mctx=mask.getContext("2d");

  for(let y=0;y<N;y++) {
   for(let x=0;x<N;x++) {
    if(game.forest[y*N+x]) {
     mctx.fillStyle="#fff";
     mctx.fillRect(x/N*w,y/N*h,w/N+1,h/N+1);
    }
   }
  }

  ctx.globalCompositeOperation="destination-in";
  ctx.drawImage(mask,0,0);
  ctx.globalCompositeOperation="source-over";
 }

 overlay.setUrl(canvas.toDataURL("image/png"));
}

function updateHUD() {
 if(!game)return;

 const burning=game.heat.reduce((a,v)=>a+(v>.1?1:0),0);
 const parkBurn=game.parkCells.filter(i=>game.heat[i]>.1).length;

 const safe=Math.max(
  0,100-Math.round(parkBurn/game.parkCells.length*100)
 );

 const control=Math.max(
  0,
  Math.min(100,Math.round((1-burning/Math.max(1,game.N*game.N*.22))*100))
 );

 $("time").textContent=game.time;
 $("score").textContent=game.score;
 $("burning").textContent=burning;
 $("waterCount").textContent=game.water;
 $("breakCount").textContent=game.lines;

 $("forestBar").style.width=safe+"%";
 $("forestPct").textContent=safe+"%";

 $("controlBar").style.width=control+"%";
 $("controlPct").textContent=control+"%";

 $("risk").textContent=game.parkHit?(currentLang === "en" ? "Very high" : "Çok yüksek"):
  burning>70?(currentLang === "en" ? "High" : "Yüksek"):burning>25?UI[currentLang].medium:(currentLang === "en" ? "Low" : "Düşük");

 $("waterTool").disabled=game.water<=0;
 $("breakTool").disabled=game.lines<=0;

 $("windName").textContent=missionField(selected,"wind");
 $("windSpeed").textContent=(currentLang === "en" ? "Wind: " : "Rüzgâr: ")+selected.speed+(currentLang === "en" ? " km/h" : " km/sa");

 $("windArrow").style.transform=`rotate(${selected.dir}deg)`;
 $("lifeHUD").textContent=hearts(profile.lives);

 const dist=Math.max(
  0,(Math.hypot(game.fireX-game.parkX,game.fireY-game.parkY)-Math.sqrt(burning)/2)*.18
 );

 $("parkDistance").textContent=dist.toFixed(1)+" km";

 const spread=selected.speed>=30?(currentLang === "en" ? "High" : "Yüksek"):
  selected.speed>=20?UI[currentLang].medium:(currentLang === "en" ? "Low" : "Düşük");

 $("spreadLevel").textContent=spread;
 $("spreadLevel").className=spread===(currentLang === "en" ? "High" : "Yüksek")?"danger":
  spread===(currentLang === "en" ? "Low" : "Düşük")?"good":"";

 if(dist<1.2&&burning>0) {
  notify("⚠️ Yangın millî park sınırına yaklaşıyor!");
 }
}

function pauseGame() {
 if(!game||game.done)return;

 paused=!paused;
 game.paused=paused;

 $("pauseBtn").textContent=paused?UI[currentLang].resume:UI[currentLang].pause;
 $("gameInstruction").textContent=paused?(currentLang === "en" ? "Game paused" : "Oyun duraklatıldı"):(currentLang === "en" ? "Select a response tool" : "Müdahale aracını seç");

 if(paused) {
  setTool(null);
  setHint(currentLang === "en" ? "Game paused. Press the button to resume." : "Oyun duraklatıldı. Devam etmek için butona bas.");
  notify("Oyun duraklatıldı.");
 } else {
  setHint(currentLang === "en" ? "Game resumed." : "Oyun devam ediyor.");
  notify("Oyun devam ediyor.");
 }
}

// OPENLAYERS ANALİZ HARİTASI
function showAnalysisMap(success) {
 const section=$("analysisSection");
 if(!section||typeof ol==="undefined"||!game)return;

 section.classList.remove("hidden");
 const analysisElement=$("analysisMap");
 analysisElement.style.height="250px";
 analysisElement.style.position="relative";

 const oldMessage=$("analysisEmptyMessage");
 if(oldMessage)oldMessage.remove();

 if(analysisMap) {
  analysisMap.setTarget(null);
  analysisMap=null;
 }

 const features=[];
 let affectedCellCount=0;
 const parkCenter=ol.proj.fromLonLat([selected.lon,selected.lat]);

 const parkFeature=new ol.Feature({
  geometry:new ol.geom.Circle(parkCenter,2600),
  type:"park"
 });
 parkFeature.setStyle(new ol.style.Style({
  fill:new ol.style.Fill({color:"rgba(85,185,111,0.16)"}),
  stroke:new ol.style.Stroke({color:"#74d18b",width:3,lineDash:[8,5]})
 }));
 features.push(parkFeature);

 const N=game.N;
 for(let y=0;y<N;y++) {
  for(let x=0;x<N;x++) {
   const i=y*N+x;
   if(game.heat[i]>.08) {
    affectedCellCount++;
    const left=game.b[0][1]+(x/(N-1))*(game.b[1][1]-game.b[0][1]);
    const right=game.b[0][1]+(Math.min(N-1,x+1)/(N-1))*(game.b[1][1]-game.b[0][1]);
    const bottom=game.b[1][0]+(y/(N-1))*(game.b[0][0]-game.b[1][0]);
    const top=game.b[1][0]+(Math.min(N-1,y+1)/(N-1))*(game.b[0][0]-game.b[1][0]);

    const corners=[
     ol.proj.fromLonLat([left,bottom]),
     ol.proj.fromLonLat([right,bottom]),
     ol.proj.fromLonLat([right,top]),
     ol.proj.fromLonLat([left,top]),
     ol.proj.fromLonLat([left,bottom])
    ];
    const feature=new ol.Feature({
     geometry:new ol.geom.Polygon([corners]),
     type:"fire"
    });
    feature.setStyle(new ol.style.Style({
     fill:new ol.style.Fill({color:"rgba(255,80,30,0.65)"}),
     stroke:new ol.style.Stroke({color:"#ff572b",width:1})
    }));
    features.push(feature);
   }
  }
 }

 const startFeature=new ol.Feature({
  geometry:new ol.geom.Point(ol.proj.fromLonLat([
   cellLon(game.fireX),
   cellLat(game.fireY)
  ])),
  type:"start"
 });
 startFeature.setStyle(new ol.style.Style({
  image:new ol.style.Circle({
   radius:8,
   fill:new ol.style.Fill({color:"#fff0a8"}),
   stroke:new ol.style.Stroke({color:"#f04424",width:3})
  })
 }));
 features.push(startFeature);

 const vectorSource=new ol.source.Vector({features});
 const vectorLayer=new ol.layer.Vector({source:vectorSource});

 analysisMap=new ol.Map({
  target:"analysisMap",
  layers:[
   new ol.layer.Tile({source:new ol.source.OSM()}),
   vectorLayer
  ],
  view:new ol.View({center:parkCenter,zoom:11})
 });

 analysisMap.getView().fit(vectorSource.getExtent(),{
  padding:[25,25,25,25],
  maxZoom:11
 });

 if(affectedCellCount===0) {
  const message=document.createElement("div");
  message.id="analysisEmptyMessage";
  message.textContent=success
   ? "Görev başarıyla tamamlandı. Yangın kontrol altına alındı; etkilenen aktif hücre bulunmuyor."
   : "Aktif yangın hücresi bulunmuyor. Yangın başlangıç noktası ve koruma alanı haritada gösteriliyor.";
  Object.assign(message.style,{
   position:"absolute",
   zIndex:"10",
   top:"12px",
   left:"50%",
   transform:"translateX(-50%)",
   width:"calc(100% - 32px)",
   maxWidth:"420px",
   padding:"10px 14px",
   border:"1px solid #74d18b",
   borderRadius:"10px",
   background:"rgba(20,42,29,.94)",
   color:"#d9f5df",
   fontSize:"12px",
   textAlign:"center",
   lineHeight:"1.5",
   pointerEvents:"none",
   boxSizing:"border-box"
  });
  analysisElement.appendChild(message);
 }

 setTimeout(()=>{if(analysisMap)analysisMap.updateSize();},250);
}

function finishGame(success,reason) {
 if(!game||game.done)return;

 game.done=true;

 clearInterval(tickTimer);
 clearInterval(countdown);

 if(waterPreview) {
  gameMap.removeLayer(waterPreview);
  waterPreview=null;
 }

 const saved=Math.max(
  0,
  100-Math.round(
   game.parkCells.filter(i=>game.heat[i]>.1).length/
   game.parkCells.length*100
  )
 );

 const efficiency=game.water/selected.water+game.lines/2;

 const stars=success?
  (game.time>45&&efficiency>=.7?3:game.time>15?2:1):0;

 const total=game.score+
  Math.max(0,game.time)*12+
  (success?500:0)+
  (stars*100);

 if(success) {
  const old=profile.completed[selected.id];

  profile.completed[selected.id]={
   stars:Math.max(stars,old?.stars||0),
   score:Math.max(total,old?.score||0)
  };

  profile.best[selected.id]=Math.max(profile.best[selected.id]||0,total);

  profile.totalScore+=total;

  const index=missions.findIndex(m=>m.id===selected.id);

  profile.unlocked=Math.max(
   profile.unlocked,
   Math.min(6,index+2)
  );
 } else {
  profile.lives=Math.max(0,profile.lives-1);
 }

 saveProfile();

 $("resultTitle").textContent=success?
  (currentLang === "en" ? "🌲 Mission completed!" : "🌲 Görev tamamlandı!"):(currentLang === "en" ? "🔥 Mission failed" : "🔥 Görev başarısız");

 $("resultText").textContent=
  (currentLang === "en" ? trText(reason)+" Protection: "+saved+"%. Total score: "+total+"." : (currentLang === "en" ? trText(reason)+" Protection rate: "+saved+"%. Total score: "+total+"." : reason+" Koruma oranı: %"+saved+". Toplam puan: "+total+"."));

 $("resultDetails").innerHTML=`
  <div class="stats-strip">
   <div class="mini-stat"><span>${UI[currentLang].stars}</span><b>${success?"⭐".repeat(stars):"—"}</b></div>
   <div class="mini-stat"><span>${currentLang === "en" ? "Protection" : "Koruma"}</span><b>%${saved}</b></div>
   <div class="mini-stat"><span>${UI[currentLang].remainingTime}</span><b>${game.time} sn</b></div>
  </div>
  <p>${currentLang === "en" ? "Water used: " : "Su kullanımı: "}${selected.water-game.water}/${selected.water} ·
  ${currentLang === "en" ? "Firebreaks: " : "Yangın şeridi: "}${2-game.lines}/2 ·
  ${success?
   (currentLang === "en" ? "Next mission "+(profile.unlocked>missions.findIndex(m=>m.id===selected.id)+1?"unlocked":"completed") : "Sonraki görev "+(profile.unlocked>missions.findIndex(m=>m.id===selected.id)+1?"açıldı":"tamamlandı")):
   (currentLang === "en" ? "Lives left: " : "Kalan can: ")+profile.lives}</p>
 `;

 $("retryBtn").textContent=profile.lives>0?UI[currentLang].retry:(currentLang === "en" ? "New game" : "Yeni oyun");

 $("overlay").classList.remove("hidden");

 showAnalysisMap(success);

 if(success&&allMissionsCompleted()) {
  showGrandFinale();
 }

 if(!success&&profile.lives===0) {
  $("resultTitle").textContent=(currentLang === "en" ? "Game over" : "Oyun bitti");

  $("resultText").textContent=
   (currentLang === "en" ? "You have lost all three lives. A new game will restart every mission from the beginning." : "Üç can hakkını da kaybettin. Yeni oyunda tüm görevlere en baştan başlayacaksın.");

  $("retryBtn").textContent=(currentLang === "en" ? "Start over" : "Baştan başla");
  $("retryBtn").classList.remove("hidden");
 }
}

function resetWholeGame() {
 profile=freshProfile();
 saveProfile();

 selected=missions[0];

 renderMissionList();
 selectMission(selected.id);

 notify("Yeni oyun başladı. Tüm ilerleme sıfırlandı.");
}

function showRestartConfirm() {
 $("overlay").classList.add("hidden");
 $("restartConfirm").classList.remove("hidden");
}

function hideRestartConfirm() {
 $("restartConfirm").classList.add("hidden");
}

function backToSelection() {
 // Aktif görevden çıkmak bir can kaybettirir.
 if(game&&!game.done) {
  game.done=true;

  clearInterval(tickTimer);
  clearInterval(countdown);

  if(waterPreview) {
   gameMap.removeLayer(waterPreview);
   waterPreview=null;
  }

  profile.lives=Math.max(0,profile.lives-1);
  saveProfile();

  const lostAll=profile.lives===0;

  game=null;
  paused=false;

  $("overlay").classList.add("hidden");
  $("gameView").classList.add("hidden");
  $("selectionView").classList.remove("hidden");

  renderMissionList();
  renderProfile();

  if(selectionMap) {
   setTimeout(()=>selectionMap.invalidateSize(),100);
  }

  if(lostAll) {
   showRestartConfirm();
  } else {
   notify("Görevden ayrıldın. Bir can kaybettin; göreve yeniden başladığında kaynakların sıfırlanacak.");
  }

  return;
 }

 clearInterval(tickTimer);
 clearInterval(countdown);

 game=null;
 paused=false;

 $("overlay").classList.add("hidden");
 $("gameView").classList.add("hidden");
 $("selectionView").classList.remove("hidden");

 $("analysisSection").classList.add("hidden");

 if(analysisMap) {
  analysisMap.setTarget(null);
  analysisMap=null;
 }

 renderMissionList();
 renderProfile();

 if(selectionMap) {
  setTimeout(()=>selectionMap.invalidateSize(),100);
 }
}

// BUTON VE ETKİLEŞİM OLAYLARI
$("prepareBtn").addEventListener("click",()=>{
 if(profile.lives<=0) {
  showRestartConfirm();
  return;
 }

 startMission();
});

$("waterTool").addEventListener("click",()=>{
 setTool(activeTool==="water"?null:"water");
});

$("breakTool").addEventListener("click",()=>{
 setTool(activeTool==="break"?null:"break");
});

$("pauseBtn").addEventListener("click",pauseGame);
$("backBtn").addEventListener("click",backToSelection);
$("resultBackBtn").addEventListener("click",backToSelection);

$("retryBtn").addEventListener("click",()=>{
 if(profile.lives<=0) {
  showRestartConfirm();
  return;
 }

 $("overlay").classList.add("hidden");
 startMission();
});

$("confirmRestartBtn").addEventListener("click",()=>{
 hideRestartConfirm();
 resetWholeGame();
 backToSelection();
});

$("cancelRestartBtn").addEventListener("click",()=>{
 hideRestartConfirm();

 if(game&&game.done) {
  $("overlay").classList.remove("hidden");
 }
});

// OYUNCU ADI
function openPlayerNameDialog() {
 const input=$("playerNameInput");

 input.value=requirePlayerName ? "" : (profile.name||"Oyuncu");
 $("cancelPlayerNameBtn").classList.toggle("hidden", requirePlayerName);
 $("playerNameDialog").classList.remove("hidden");

 setTimeout(()=>{
  input.focus();
  input.select();
 },50);
}

function savePlayerName() {
 const name=$("playerNameInput").value.trim();

 if(!name) {
  $("playerNameInput").focus();
  return;
 }

 profile.name=name.slice(0,18);
 requirePlayerName=false;
 $("cancelPlayerNameBtn").classList.remove("hidden");

 saveProfile();
 renderProfile();

 $("playerNameDialog").classList.add("hidden");
}

$("playerChip").addEventListener("click",openPlayerNameDialog);
$("savePlayerNameBtn").addEventListener("click",savePlayerName);

$("cancelPlayerNameBtn").addEventListener("click",()=>{
 if(requirePlayerName)return;
 $("playerNameDialog").classList.add("hidden");
});

$("playerNameInput").addEventListener("keydown",e=>{
 if(e.key==="Enter")savePlayerName();

 if(e.key==="Escape") {
  $("playerNameDialog").classList.add("hidden");
 }
});

$("playerNameDialog").addEventListener("click",e=>{
 if(e.target.id==="playerNameDialog" && !requirePlayerName) {
  $("playerNameDialog").classList.add("hidden");
 }
});

// LANGUAGE SWITCH
$("langTR").addEventListener("click",()=>applyLanguage("tr"));
$("langEN").addEventListener("click",()=>applyLanguage("en"));

// OYUNU BAŞLAT
applyLanguage(currentLang);
renderProfile();
makeSelectionMap();
renderMissionList();
selectMission(selected.id);

if(requirePlayerName) {
 openPlayerNameDialog();
}

if(allMissionsCompleted()) {
 showGrandFinale();
}