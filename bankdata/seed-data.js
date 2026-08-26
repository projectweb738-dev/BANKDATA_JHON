const { Client } = require('pg');
const client = new Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.mgmfcxpjweljmyfvjupg',
  password: 'Ideal for agent-first workflows: update your schema in code, push it to GitHub, and Supa',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  await client.connect();
  const now = new Date().toISOString();

  // ── PEGAWAI ─────────────────────────────────────────────
  console.log('Inserting pegawai...');
  const pegawaiData = [
    { nip: '198504152010011001', nama: 'Ahmad Fauzi', jabatan: 'Kepala Bidang Anggaran', golongan: 'IV/a', unit_kerja: 'BPKAD', pendidikan_terakhir: 'S2', tmt_jabatan: '2020-01-01', status: 'aktif' },
    { nip: '197812222005012002', nama: 'Sri Wahyuni', jabatan: 'Kepala Sub Bidang Penatausahaan', golongan: 'III/d', unit_kerja: 'BPKAD', pendidikan_terakhir: 'S1', tmt_jabatan: '2018-03-01', status: 'aktif' },
    { nip: '199003101512031003', nama: 'Budi Santoso', jabatan: 'Analis Keuangan', golongan: 'III/b', unit_kerja: 'Bidang Akuntansi', pendidikan_terakhir: 'S1', tmt_jabatan: '2019-06-01', status: 'aktif' },
    { nip: '198801012006011004', nama: 'Rahma Dewi', jabatan: 'Staff Pengelola Aset', golongan: 'III/a', unit_kerja: 'Bidang Aset', pendidikan_terakhir: 'D3', tmt_jabatan: '2017-08-01', status: 'aktif' },
    { nip: '197506151999031005', nama: 'Joko Widodo Prasetyo', jabatan: 'Kepala Sub Bagian Umum', golongan: 'IV/b', unit_kerja: 'Sekretariat', pendidikan_terakhir: 'S2', tmt_jabatan: '2015-02-01', status: 'aktif' },
    { nip: '196905221990022006', nama: 'Siti Fatimah', jabatan: 'Bendahara Pengeluaran', golongan: 'III/c', unit_kerja: 'BPKAD', pendidikan_terakhir: 'S1', tmt_jabatan: '2012-07-01', status: 'aktif' },
    { nip: '198201082003122007', nama: 'Andi Mahendra', jabatan: 'Pengadministrasi Keuangan', golongan: 'II/d', unit_kerja: 'Bidang Perbendaharaan', pendidikan_terakhir: 'SMA/SMK', tmt_jabatan: '2016-01-01', status: 'aktif' },
    { nip: '197711032000031008', nama: 'Dewi Rahayu', jabatan: 'Kepala Bidang Perbendaharaan', golongan: 'IV/a', unit_kerja: 'Bidang Perbendaharaan', pendidikan_terakhir: 'S2', tmt_jabatan: '2021-04-01', status: 'aktif' },
    { nip: '198903252014021009', nama: 'Rizky Pratama', jabatan: 'Analis Aset Daerah', golongan: 'III/b', unit_kerja: 'Bidang Aset', pendidikan_terakhir: 'S1', tmt_jabatan: '2020-09-01', status: 'aktif' },
    { nip: '196803141988031010', nama: 'Hendra Gunawan', jabatan: 'Kepala Bidang Aset', golongan: 'IV/b', unit_kerja: 'Bidang Aset', pendidikan_terakhir: 'S2', tmt_jabatan: '2013-05-01', status: 'pensiun' },
  ];
  for (const p of pegawaiData) {
    await client.query(
      `INSERT INTO pegawai (nip, nama, jabatan, golongan, unit_kerja, pendidikan_terakhir, tmt_jabatan, status, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'1',$9,$9)
       ON CONFLICT (nip) DO NOTHING`,
      [p.nip, p.nama, p.jabatan, p.golongan, p.unit_kerja, p.pendidikan_terakhir, p.tmt_jabatan, p.status, now]
    );
  }
  console.log('  pegawai: done');

  // ── PROGRAM ─────────────────────────────────────────────
  console.log('Inserting program...');
  const programData = [
    { kode_program: 'PRG-2026-001', nama_program: 'Peningkatan Kapasitas Pengelolaan Keuangan Daerah', tahun_anggaran: 2026, unit_pelaksana: 'BPKAD', target: 2500000000, realisasi: 1800000000, status: 'berjalan' },
    { kode_program: 'PRG-2026-002', nama_program: 'Optimalisasi Pengelolaan Aset Daerah', tahun_anggaran: 2026, unit_pelaksana: 'Bidang Aset', target: 1500000000, realisasi: 750000000, status: 'berjalan' },
    { kode_program: 'PRG-2026-003', nama_program: 'Pengembangan Sistem Informasi Keuangan', tahun_anggaran: 2026, unit_pelaksana: 'Bidang Akuntansi', target: 800000000, realisasi: 800000000, status: 'selesai' },
    { kode_program: 'PRG-2025-001', nama_program: 'Rekonsiliasi Laporan Keuangan 2025', tahun_anggaran: 2025, unit_pelaksana: 'BPKAD', target: 1200000000, realisasi: 1200000000, status: 'selesai' },
    { kode_program: 'PRG-2025-002', nama_program: 'Inventarisasi Aset Tetap Provinsi', tahun_anggaran: 2025, unit_pelaksana: 'Bidang Aset', target: 950000000, realisasi: 720000000, status: 'selesai' },
    { kode_program: 'PRG-2026-004', nama_program: 'Pembinaan Pengelolaan Keuangan OPD', tahun_anggaran: 2026, unit_pelaksana: 'Bidang Perbendaharaan', target: 600000000, realisasi: 120000000, status: 'berjalan' },
    { kode_program: 'PRG-2026-005', nama_program: 'Perencanaan Anggaran APBD 2027', tahun_anggaran: 2026, unit_pelaksana: 'Bidang Anggaran', target: 400000000, realisasi: 0, status: 'perencanaan' },
  ];
  for (const p of programData) {
    await client.query(
      `INSERT INTO program (kode_program, nama_program, tahun_anggaran, unit_pelaksana, target, realisasi, status, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'1',$8,$8)
       ON CONFLICT DO NOTHING`,
      [p.kode_program, p.nama_program, p.tahun_anggaran, p.unit_pelaksana, p.target, p.realisasi, p.status, now]
    );
  }
  console.log('  program: done');

  // ── ASET ─────────────────────────────────────────────
  console.log('Inserting aset...');
  const asetData = [
    { kode_aset: 'AST-001-2024', nama_aset: 'Laptop Dell Latitude 5540', kategori: 'Peralatan Komputer', lokasi: 'Ruang Kepala BPKAD', tahun_perolehan: 2024, nilai_perolehan: 18500000, kondisi: 'baik' },
    { kode_aset: 'AST-002-2024', nama_aset: 'Printer HP LaserJet Pro', kategori: 'Peralatan Komputer', lokasi: 'Ruang Sekretariat', tahun_perolehan: 2024, nilai_perolehan: 4200000, kondisi: 'baik' },
    { kode_aset: 'AST-003-2023', nama_aset: 'Kendaraan Operasional Toyota Innova', kategori: 'Kendaraan Dinas', lokasi: 'Garasi BPKAD', tahun_perolehan: 2023, nilai_perolehan: 385000000, kondisi: 'baik' },
    { kode_aset: 'AST-004-2022', nama_aset: 'Meja Kerja Kayu Jati', kategori: 'Furnitur', lokasi: 'Ruang Bidang Anggaran', tahun_perolehan: 2022, nilai_perolehan: 3500000, kondisi: 'baik' },
    { kode_aset: 'AST-005-2021', nama_aset: 'AC Split 2 PK', kategori: 'Peralatan Gedung', lokasi: 'Ruang Rapat Utama', tahun_perolehan: 2021, nilai_perolehan: 6800000, kondisi: 'rusak_ringan' },
    { kode_aset: 'AST-006-2020', nama_aset: 'Proyektor Epson EB-X51', kategori: 'Peralatan Presentasi', lokasi: 'Ruang Rapat Utama', tahun_perolehan: 2020, nilai_perolehan: 8500000, kondisi: 'rusak_ringan' },
    { kode_aset: 'AST-007-2019', nama_aset: 'Komputer Desktop PC i5', kategori: 'Peralatan Komputer', lokasi: 'Ruang Bidang Aset', tahun_perolehan: 2019, nilai_perolehan: 12000000, kondisi: 'rusak_berat' },
    { kode_aset: 'AST-008-2024', nama_aset: 'Server Dell PowerEdge R350', kategori: 'Peralatan Server', lokasi: 'Ruang Server', tahun_perolehan: 2024, nilai_perolehan: 125000000, kondisi: 'baik' },
  ];
  for (const a of asetData) {
    await client.query(
      `INSERT INTO aset (kode_aset, nama_aset, kategori, lokasi, tahun_perolehan, nilai_perolehan, kondisi, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'1',$8,$8)
       ON CONFLICT DO NOTHING`,
      [a.kode_aset, a.nama_aset, a.kategori, a.lokasi, a.tahun_perolehan, a.nilai_perolehan, a.kondisi, now]
    );
  }
  console.log('  aset: done');

  // ── KEUANGAN ─────────────────────────────────────────────
  console.log('Inserting keuangan...');
  const keuanganData = [
    { no_transaksi: 'TRX-2026-0001', tanggal: '2026-01-15', jenis: 'anggaran', nominal: 2500000000, keterangan: 'Anggaran Peningkatan Kapasitas Pengelolaan Keuangan' },
    { no_transaksi: 'TRX-2026-0002', tanggal: '2026-02-01', jenis: 'realisasi', nominal: 450000000, keterangan: 'Realisasi Belanja Pegawai Januari 2026' },
    { no_transaksi: 'TRX-2026-0003', tanggal: '2026-02-10', jenis: 'anggaran', nominal: 1500000000, keterangan: 'Anggaran Optimalisasi Pengelolaan Aset' },
    { no_transaksi: 'TRX-2026-0004', tanggal: '2026-02-28', jenis: 'realisasi', nominal: 380000000, keterangan: 'Realisasi Belanja Barang Februari 2026' },
    { no_transaksi: 'TRX-2026-0005', tanggal: '2026-03-15', jenis: 'realisasi', nominal: 125000000, keterangan: 'Pengadaan Server Dell PowerEdge R350' },
    { no_transaksi: 'TRX-2026-0006', tanggal: '2026-03-20', jenis: 'anggaran', nominal: 800000000, keterangan: 'Anggaran Pengembangan Sistem Informasi' },
    { no_transaksi: 'TRX-2026-0007', tanggal: '2026-04-01', jenis: 'realisasi', nominal: 800000000, keterangan: 'Realisasi Pengembangan Sistem Informasi Keuangan' },
    { no_transaksi: 'TRX-2025-0101', tanggal: '2025-12-15', jenis: 'realisasi', nominal: 1200000000, keterangan: 'Realisasi Rekonsiliasi Laporan Keuangan 2025' },
  ];
  for (const k of keuanganData) {
    await client.query(
      `INSERT INTO keuangan (no_transaksi, tanggal, jenis, nominal, keterangan, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'1',$6,$6)
       ON CONFLICT DO NOTHING`,
      [k.no_transaksi, k.tanggal, k.jenis, k.nominal, k.keterangan, now]
    );
  }
  console.log('  keuangan: done');

  // ── Verify counts ──
  console.log('\n=== Final row counts ===');
  for (const t of ['pegawai', 'program', 'aset', 'keuangan']) {
    const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
    console.log(`  ${t}: ${r.rows[0].count} rows`);
  }

  await client.end();
  console.log('\nDone!');
}
seed().catch(e => { console.error(e); client.end(); });
