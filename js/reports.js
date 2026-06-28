/**
 * reports.js - Export (PDF / Excel) + Import (CSV / Excel)
 * Load AFTER shared.js and data.js
 */

/* ── lazy-load CDN scripts ───────────────────────────────────────────────── */
function _loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script'); s.src = src;
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function _ensurePDF() {
  await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');
}

async function _ensureXLSX() {
  await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
}

/* ── helper: RGB arrays ──────────────────────────────────────────────────── */
const C = {
  navy:   [2,  12,  27],
  blue:   [0,  87, 255],
  cyan:   [0, 212, 255],
  gold:   [255,215,  0],
  green:  [0, 255,136],
  white:  [255,255,255],
  silver: [200,216,255],
  bronze: [255,184,125],
  dgray:  [30, 50, 80],
  lgray:  [240,248,255],
  mute:   [100,140,180],
};

/* ══════════════════════════════════════════════════════════════════════════
   PDF EXPORT
   Design: dark branded header + stats row + colour-coded table + footer
   Completely different from "friend's" plain-white format
   ══════════════════════════════════════════════════════════════════════════ */
async function downloadPDF() {
  toast('📄 Building PDF…', 'info', 20000);

  await _ensurePDF();

  /* fetch live data */
  const [lbSnap, champMetaDoc, predsSnap, champsSnap] = await Promise.all([
    db.collection('leaderboard').get(),
    db.collection('meta').doc('officialChampion').get(),
    db.collection('predictions').get(),
    db.collection('champions').get(),
  ]);

  const entries     = lbSnap.docs.map(d=>d.data()).sort((a,b)=>(b.points||0)-(a.points||0));
  const preds       = predsSnap.docs.map(d=>d.data());
  const champPicks  = champsSnap.docs.map(d=>d.data());
  const officialChamp = champMetaDoc.exists ? champMetaDoc.data().team : null;

  const { jsPDF } = window.jspdf;
  const doc  = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W    = 210;          // page width mm
  const M    = 14;           // margin
  const now  = new Date().toLocaleString('id-ID', { dateStyle:'full', timeStyle:'short' });

  /* ── PAGE 1: HEADER BAND ─────────────────────────────────────────────── */
  // dark background strip
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, W, 52, 'F');

  // left cyan accent stripe
  doc.setFillColor(...C.cyan);
  doc.rect(0, 0, 5, 52, 'F');

  // bottom gold accent line
  doc.setFillColor(...C.gold);
  doc.rect(0, 52, W, 1.5, 'F');

  // circle logo
  doc.setFillColor(...C.blue);
  doc.circle(M + 8, 19, 8, 'F');
  doc.setFillColor(...C.cyan);
  doc.circle(M + 8, 19, 5.5, 'F');
  doc.setFillColor(...C.navy);
  doc.setFontSize(11);
  doc.setFont('helvetica','bold');
  doc.setTextColor(...C.navy);
  doc.text('26', M + 5.2, 21.5);

  // app title
  doc.setTextColor(...C.cyan);
  doc.setFontSize(22);
  doc.setFont('helvetica','bold');
  doc.text('FIFA WORLD CUP 2026', M + 22, 16);

  doc.setTextColor(...C.gold);
  doc.setFontSize(12);
  doc.text('⚽  PREDICTION HUB - LAPORAN RESMI', M + 22, 25);

  doc.setTextColor(...C.mute);
  doc.setFontSize(8);
  doc.setFont('helvetica','normal');
  doc.text(`Dicetak pada: ${now}`, M + 22, 32);
  doc.text(`Total Peserta: ${entries.length}   |   Total Prediksi: ${preds.length}   |   Prediksi Juara: ${champPicks.length}`, M + 22, 38);

  // official champion badge (right side)
  if (officialChamp) {
    doc.setFillColor(...C.gold);
    doc.roundedRect(W - M - 52, 8, 52, 36, 4, 4, 'F');
    doc.setTextColor(...C.navy);
    doc.setFontSize(7);
    doc.setFont('helvetica','bold');
    doc.text('🏆 JUARA RESMI 2026', W - M - 50, 17);
    doc.setFontSize(14);
    doc.text(teamName(officialChamp).toUpperCase(), W - M - 50, 29, { maxWidth: 48 });
    doc.setFontSize(8);
    doc.text('+50 poin untuk yang tepat', W - M - 50, 40);
  }

  /* ── STATS BOXES ─────────────────────────────────────────────────────── */
  const sy = 60;
  const boxW = 55, boxH = 22, gap = 6;
  const stats = [
    { lbl:'Total Peserta',   val: entries.length,                          col: C.cyan  },
    { lbl:'Total Prediksi',  val: preds.length,                            col: C.green },
    { lbl:'Poin Tertinggi',  val: (entries[0]?.points || 0)+' pts',        col: C.gold  },
    { lbl:'Prediksi Juara',  val: champPicks.length,                       col: C.silver},
  ];
  stats.forEach((s, i) => {
    const x = M + i*(boxW + gap);
    doc.setFillColor(...s.col);
    doc.roundedRect(x, sy, boxW, boxH, 3, 3, 'F');
    doc.setTextColor(...C.navy);
    doc.setFontSize(7);
    doc.setFont('helvetica','normal');
    doc.text(s.lbl, x+3, sy+7);
    doc.setFontSize(15);
    doc.setFont('helvetica','bold');
    doc.text(String(s.val), x+3, sy+18);
  });

  /* ── LEADERBOARD TABLE ───────────────────────────────────────────────── */
  const tbY = sy + boxH + 10;

  // section header
  doc.setFillColor(...C.blue);
  doc.rect(M, tbY, 3, 12, 'F');
  doc.setTextColor(...C.blue);
  doc.setFontSize(13);
  doc.setFont('helvetica','bold');
  doc.text('LEADERBOARD UTAMA', M+6, tbY+9);

  const medals = ['🥇','🥈','🥉'];

  doc.autoTable({
    startY: tbY + 14,
    margin: { left: M, right: M },
    head: [['#','Nama Peserta','Skor Tepat','Pemenang Tepat','Prediksi Juara','Bracket','Total Poin']],
    body: entries.map((e, i) => [
      (medals[i] || (i+1)),
      e.userName || '-',
      e.exactCount || 0,
      e.correctWinnerCount || 0,
      (WC_TEAMS[e.championPick]?.name) || '-',
      e.bracketCorrectCount || 0,
      (e.points || 0) + ' pts',
    ]),
    headStyles:{
      fillColor: C.navy,
      textColor: C.cyan,
      fontStyle:'bold', fontSize:8,
      lineColor: C.blue, lineWidth:0.4,
    },
    bodyStyles:{ fontSize:8, textColor:C.dgray },
    alternateRowStyles:{ fillColor:C.lgray },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const ri = data.row.index;
      if (ri === 0) { data.cell.styles.fillColor = [255,248,200]; data.cell.styles.fontStyle='bold'; }
      if (ri === 1) { data.cell.styles.fillColor = [230,238,255]; }
      if (ri === 2) { data.cell.styles.fillColor = [255,235,210]; }
    },
    columnStyles:{
      0:{cellWidth:12, halign:'center'},
      2:{halign:'center'}, 3:{halign:'center'},
      5:{halign:'center'},
      6:{fontStyle:'bold', halign:'right', textColor:C.blue},
    },
  });

  /* ── CHAMPION PICKS BREAKDOWN ────────────────────────────────────────── */
  const afterLb = doc.lastAutoTable.finalY + 10;

  if (afterLb < 250) {
    doc.setFillColor(...C.gold);
    doc.rect(M, afterLb, 3, 12, 'F');
    doc.setTextColor(...C.gold.map(v=>Math.min(v-30,220)));
    doc.setFontSize(13);
    doc.setFont('helvetica','bold');
    doc.text('DISTRIBUSI PREDIKSI JUARA', M+6, afterLb+9);

    const counts = {};
    champPicks.forEach(c => { if(c.championTeam) counts[c.championTeam]=(counts[c.championTeam]||0)+1; });
    const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const total  = champPicks.length || 1;

    doc.autoTable({
      startY: afterLb + 14,
      margin: { left: M, right: M },
      head: [['Negara','Jumlah Pick','Persentase','Status']],
      body: sorted.map(([code, cnt]) => [
        (WC_TEAMS[code]?.name || code),
        cnt,
        ((cnt/total)*100).toFixed(1)+'%',
        officialChamp === code ? '🏆 JUARA' : '-',
      ]),
      headStyles:{ fillColor:[100,75,0], textColor:C.gold, fontStyle:'bold', fontSize:8 },
      bodyStyles:{ fontSize:8 },
      alternateRowStyles:{ fillColor:[255,252,230] },
      columnStyles:{ 2:{halign:'right'}, 3:{halign:'center'} },
    });
  }

  /* ── PAGE 2: PREDICTIONS DETAIL (if any) ─────────────────────────────── */
  if (preds.length) {
    doc.addPage();

    doc.setFillColor(...C.navy);
    doc.rect(0, 0, W, 20, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(0, 20, W, 1, 'F');
    doc.setTextColor(...C.cyan);
    doc.setFontSize(14);
    doc.setFont('helvetica','bold');
    doc.text('DETAIL SEMUA PREDIKSI SKOR', M, 13);

    doc.autoTable({
      startY: 28,
      margin: { left: M, right: M },
      head: [['Peserta','Pertandingan','Tim A','Pred A','Pred B','Tim B','Saved At']],
      body: preds.slice(0,100).map(p => [
        p.userName||'-', p.matchId||'-',
        (WC_TEAMS[p.teamA]?.name||p.teamA||'-'),
        p.predScoreA ?? '-',
        p.predScoreB ?? '-',
        (WC_TEAMS[p.teamB]?.name||p.teamB||'-'),
        p.savedAt?.toDate ? p.savedAt.toDate().toLocaleString('id-ID') : '-',
      ]),
      headStyles:{ fillColor:C.blue, textColor:C.white, fontStyle:'bold', fontSize:7.5 },
      bodyStyles:{ fontSize:7.5 },
      alternateRowStyles:{ fillColor:C.lgray },
    });
  }

  /* ── FOOTER (all pages) ──────────────────────────────────────────────── */
  const pageCount = doc.internal.getNumberOfPages();
  for (let pg = 1; pg <= pageCount; pg++) {
    doc.setPage(pg);
    const pH = doc.internal.pageSize.height;
    doc.setFillColor(...C.navy);
    doc.rect(0, pH-12, W, 12, 'F');
    doc.setFillColor(...C.cyan);
    doc.rect(0, pH-12, W, 0.8, 'F');
    doc.setTextColor(...C.mute);
    doc.setFontSize(7);
    doc.setFont('helvetica','normal');
    doc.text('FIFA World Cup 2026 Prediction Hub  |  Laporan Rahasia - Jangan disebarkan tanpa izin', M, pH-4.5);
    doc.text(`Halaman ${pg} / ${pageCount}`, W-M, pH-4.5, { align:'right' });
  }

  doc.save(`WC2026-Laporan-${Date.now()}.pdf`);
  toast('✓ PDF berhasil diunduh!', 'ok');
}

/* ══════════════════════════════════════════════════════════════════════════
   EXCEL EXPORT (4 sheets, styled)
   ══════════════════════════════════════════════════════════════════════════ */
async function downloadExcel() {
  toast('📊 Building Excel…', 'info', 20000);
  await _ensureXLSX();

  const [lbSnap, predsSnap, champsSnap, resultsSnap, champMetaDoc] = await Promise.all([
    db.collection('leaderboard').get(),
    db.collection('predictions').get(),
    db.collection('champions').get(),
    db.collection('results').get(),
    db.collection('meta').doc('officialChampion').get(),
  ]);

  const entries       = lbSnap.docs.map(d=>d.data()).sort((a,b)=>(b.points||0)-(a.points||0));
  const preds         = predsSnap.docs.map(d=>d.data());
  const champPicks    = champsSnap.docs.map(d=>d.data());
  const results       = resultsSnap.docs.map(d=>d.data());
  const officialChamp = champMetaDoc.exists ? champMetaDoc.data().team : null;
  const wb = XLSX.utils.book_new();
  const now = new Date().toLocaleString('id-ID');

  /* helper: add header style row placeholder (SheetJS community doesn't support cell styles, we use a trick) */
  const toSheet = (rows) => XLSX.utils.aoa_to_sheet(rows);
  const setCW   = (ws, widths) => { ws['!cols'] = widths.map(w => ({ wch: w })); };

  /* ── Sheet 1: RINGKASAN (Summary) ──────────────────────────────────── */
  const counts = {};
  champPicks.forEach(c => { if(c.championTeam) counts[c.championTeam]=(counts[c.championTeam]||0)+1; });
  const topPick = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];

  const s1 = toSheet([
    ['FIFA WORLD CUP 2026 - PREDICTION HUB'],
    ['Laporan dihasilkan pada: ' + now],
    ['Juara Resmi:', officialChamp ? teamName(officialChamp) : '(Belum ditentukan)', '', 'Poin Bonus Juara: 50'],
    [],
    ['=== STATISTIK UTAMA ==='],
    ['Total Peserta',      entries.length],
    ['Total Prediksi',     preds.length],
    ['Total Prediksi Juara', champPicks.length],
    ['Poin Tertinggi',     entries[0]?.points || 0],
    ['Pemimpin Saat Ini',  entries[0]?.userName || '-'],
    ['Prediksi Juara Terpopuler', topPick ? `${teamName(topPick[0])} (${topPick[1]}x)` : '-'],
    [],
    ['=== TOP 10 PEMAIN ==='],
    ['Pos','Nama Peserta','Total Poin','Skor Tepat','Pemenang Tepat','Bracket Tepat','Prediksi Juara','Juara Benar?'],
    ...entries.slice(0,10).map((e,i) => [
      i+1, e.userName||'-', e.points||0,
      e.exactCount||0, e.correctWinnerCount||0, e.bracketCorrectCount||0,
      teamName(e.championPick)||'-', e.championCorrect?'✓ YA':'✗ Belum',
    ]),
    [],
    ['=== KUNCI POIN ==='],
    ['Skor Tepat','+10 poin'],
    ['Pemenang Tepat','+5 poin'],
    ['Bracket Tepat','+5 poin'],
    ['Prediksi Juara Tepat','+50 poin'],
  ]);
  setCW(s1, [28,22,18,18,18,18,22,14]);
  XLSX.utils.book_append_sheet(wb, s1, '📊 Ringkasan');

  /* ── Sheet 2: LEADERBOARD ───────────────────────────────────────────── */
  const s2 = toSheet([
    ['FIFA WORLD CUP 2026 - LEADERBOARD LENGKAP'],
    ['Diperbarui: ' + now],
    [],
    ['Pos','Nama Peserta','Total Poin','Skor Tepat','Pemenang Tepat','Bracket Tepat','Prediksi Juara','Juara Benar?','Jml Prediksi'],
    ...entries.map((e,i) => [
      i+1, e.userName||'-', e.points||0,
      e.exactCount||0, e.correctWinnerCount||0, e.bracketCorrectCount||0,
      teamName(e.championPick)||'-', e.championCorrect?'✓ YA':'✗ Belum',
      e.predictionsCount||0,
    ]),
  ]);
  setCW(s2, [6,25,12,12,16,14,22,14,14]);
  s2['!merges'] = [{ s:{r:0,c:0}, e:{r:0,c:8} }];
  XLSX.utils.book_append_sheet(wb, s2, '🏆 Leaderboard');

  /* ── Sheet 3: SEMUA PREDIKSI ────────────────────────────────────────── */
  const s3 = toSheet([
    ['FIFA WORLD CUP 2026 - SEMUA PREDIKSI SKOR'],
    ['Total: ' + preds.length + ' prediksi  |  Diperbarui: ' + now],
    [],
    ['Nama Peserta','ID Pertandingan','Tim A','Prediksi A','Prediksi B','Tim B','Disimpan Pada'],
    ...preds.map(p => [
      p.userName||'-', p.matchId||'-',
      teamName(p.teamA)||p.teamA||'-',
      p.predScoreA ?? '-',
      p.predScoreB ?? '-',
      teamName(p.teamB)||p.teamB||'-',
      p.savedAt?.toDate ? p.savedAt.toDate().toLocaleString('id-ID') : '-',
    ]),
  ]);
  setCW(s3, [22,14,20,12,12,20,22]);
  XLSX.utils.book_append_sheet(wb, s3, '⚽ Prediksi');

  /* ── Sheet 4: PREDIKSI JUARA ────────────────────────────────────────── */
  const s4 = toSheet([
    ['FIFA WORLD CUP 2026 - PREDIKSI JUARA DUNIA'],
    ['Juara Resmi: ' + (officialChamp ? teamName(officialChamp) : 'Belum ditentukan') + '  |  Diperbarui: ' + now],
    [],
    ['Nama Peserta','Pilihan Juara','Benar?','Disimpan Pada'],
    ...champPicks.map(c => [
      c.userName||'-',
      teamName(c.championTeam)||c.championTeam||'-',
      officialChamp ? (c.championTeam === officialChamp ? '✓ BENAR (+50 poin)' : '✗ Salah') : 'Belum dinilai',
      c.savedAt?.toDate ? c.savedAt.toDate().toLocaleString('id-ID') : '-',
    ]),
    [],
    ['=== REKAP DISTRIBUSI ==='],
    ['Negara','Jumlah Dipilih','Persentase'],
    ...Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([code,cnt]) => [
      teamName(code)||code, cnt,
      ((cnt/(champPicks.length||1))*100).toFixed(1)+'%',
    ]),
  ]);
  setCW(s4, [25,25,20,22,14,12]);
  XLSX.utils.book_append_sheet(wb, s4, '🌟 Prediksi Juara');

  /* ── Sheet 5: HASIL RESMI ───────────────────────────────────────────── */
  const s5 = toSheet([
    ['FIFA WORLD CUP 2026 - HASIL RESMI PERTANDINGAN'],
    ['Diperbarui: ' + now],
    [],
    ['ID Match','Tim A','Skor A','Skor B','Tim B','Pemenang','Ditentukan Lewat','Selesai?'],
    ...results.map(r => [
      r.matchId||'-',
      teamName(r.teamA)||r.teamA||'-',
      r.scoreA ?? '-', r.scoreB ?? '-',
      teamName(r.teamB)||r.teamB||'-',
      teamName(r.winner)||r.winner||'Seri',
      r.decidedBy === 'et' ? 'Perpanjangan Waktu' : r.decidedBy === 'pens' ? 'Adu Penalti' : 'Waktu Normal',
      r.completed ? '✓' : '✗',
    ]),
  ]);
  setCW(s5, [14,22,8,8,22,22,22,10]);
  XLSX.utils.book_append_sheet(wb, s5, '📋 Hasil Resmi');

  XLSX.writeFile(wb, `WC2026-Laporan-Lengkap-${Date.now()}.xlsx`);
  toast('✓ Excel berhasil diunduh (5 sheet)!', 'ok');
}

/* ══════════════════════════════════════════════════════════════════════════
   IMPORT FROM CSV
   Expected columns: userName, matchId, teamA, teamB, predScoreA, predScoreB
   ══════════════════════════════════════════════════════════════════════════ */
async function importFromCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const lines = e.target.result.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) { toast('File CSV kosong atau tidak valid.', 'warn'); return reject(); }

        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g,'').toLowerCase());
        const rows = lines.slice(1).map(line => {
          const vals = line.split(',').map(v => v.trim().replace(/['"]/g,''));
          const obj = {};
          headers.forEach((h,i) => { obj[h] = vals[i] || ''; });
          return obj;
        }).filter(r => r.username || r.username);

        if (!rows.length) { toast('Tidak ada baris data valid di CSV.', 'warn'); return reject(); }

        toast(`📥 Mengimpor ${rows.length} baris…`, 'info', 15000);

        const batch = db.batch();
        let count = 0;
        rows.forEach(r => {
          const uname = r.username || r.username || r.name || r.nama || '';
          const matchId = r.matchid || r.match_id || r.pertandingan || '';
          const tA = (r.teama || r.tim_a || r.home || '').toUpperCase();
          const tB = (r.teamb || r.tim_b || r.away || '').toUpperCase();
          const sA = parseInt(r.predscorea || r.skor_a || r.score_a || '0', 10);
          const sB = parseInt(r.predscoreb || r.skor_b || r.score_b || '0', 10);
          if (!uname || !matchId) return;
          const docId = `${slug(uname)}_${matchId}`;
          batch.set(db.collection('predictions').doc(docId), {
            userName: uname.trim(), matchId, teamA: tA, teamB: tB,
            predScoreA: isNaN(sA)?0:sA, predScoreB: isNaN(sB)?0:sB,
            importedAt: firebase.firestore.FieldValue.serverTimestamp(),
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          count++;
        });
        await batch.commit();
        toast(`✓ ${count} prediksi berhasil diimpor ke Firebase!`, 'ok');
        resolve(count);
      } catch(err) { toast('Import gagal: ' + err.message, 'err', 6000); reject(err); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   IMPORT FROM EXCEL
   ══════════════════════════════════════════════════════════════════════════ */
async function importFromExcel(file) {
  await _ensureXLSX();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type:'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval:'' });

        if (!rows.length) { toast('File Excel tidak memiliki data.', 'warn'); return reject(); }

        toast(`📥 Mengimpor ${rows.length} baris dari Excel…`, 'info', 15000);

        const batch = db.batch();
        let count = 0;
        rows.forEach(r => {
          // accept various column name formats
          const uname   = String(r['userName'] || r['Nama Peserta'] || r['username'] || r['name'] || r['nama'] || '').trim();
          const matchId = String(r['matchId'] || r['match_id'] || r['ID Pertandingan'] || r['Pertandingan'] || '').trim();
          const tA = String(r['teamA'] || r['Tim A'] || r['home'] || '').toUpperCase().trim();
          const tB = String(r['teamB'] || r['Tim B'] || r['away'] || '').toUpperCase().trim();
          const sA = parseInt(r['predScoreA'] || r['Prediksi A'] || r['Skor A'] || 0, 10);
          const sB = parseInt(r['predScoreB'] || r['Prediksi B'] || r['Skor B'] || 0, 10);
          if (!uname || !matchId) return;
          const docId = `${slug(uname)}_${matchId}`;
          batch.set(db.collection('predictions').doc(docId), {
            userName: uname, matchId, teamA: tA||null, teamB: tB||null,
            predScoreA: isNaN(sA)?0:sA, predScoreB: isNaN(sB)?0:sB,
            importedAt: firebase.firestore.FieldValue.serverTimestamp(),
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge:true });
          count++;
        });
        await batch.commit();
        toast(`✓ ${count} prediksi dari Excel berhasil diimpor!`, 'ok');
        resolve(count);
      } catch(err) { toast('Import Excel gagal: ' + err.message, 'err', 6000); reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/* ── CSV template download ───────────────────────────────────────────────── */
function downloadCSVTemplate() {
  const rows = [
    'userName,matchId,teamA,teamB,predScoreA,predScoreB',
    'Budi Santoso,R16-1,BEL,NED,2,1',
    'Siti Rahayu,R16-1,BEL,NED,1,1',
    'Ahmad Fauzi,R16-2,ARG,AUS,3,0',
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([rows], { type:'text/csv' }));
  a.download = 'template-impor-prediksi.csv';
  a.click();
  toast('✓ Template CSV diunduh. Isi kolom lalu impor kembali.', 'ok');
}
