const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {db} = require('./model/dbConnection'); 
const moment = require('moment');
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/assets')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});
const upload = multer({ storage: fileStorageEngine });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET db sewa (WORK)
app.get("/api/readData", (req, res) =>{
    const sqlQuery = "SELECT * from sewa";

    db.query(sqlQuery, (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            res.send(result);
            console.log(result);

        }
    });
});

//POST Pengajuan (WORK)
app.post("/api/createPengajuan", (req, res) =>{
    const id_customer = req.body.id_customer;
    const tanggal_sewa = req.body.tanggal_sewa;
    const tanggal_pengembalian = req.body.tanggal_pengembalian;
    const tanggal_pengajuan = moment().format("YYYY-MM-DD");
    
    const sqlQuery = "INSERT INTO sewa (id_customer, tanggal_sewa, tanggal_pengembalian, tanggal_pengajuan) VALUE (?, ?, ?, ?)";
    db.query(sqlQuery, [id_customer, tanggal_sewa, tanggal_pengembalian, tanggal_pengajuan], (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            res.send(result);
            console.log(result);
        }
    });
});

//POST Status (WORK)
app.post("/api/createStatus", (req, res) =>{
    const status_peminjaman = req.body.status_peminjaman;
    const status_pembayaran = req.body.status_pembayaran;
    const status_pembayaran_denda = req.body.status_pembayaran_denda;
    
    const sqlQuery = "INSERT INTO sewa (status_peminjaman, status_pembayaran, status_pembayaran_denda) VALUE (?, ?, ?)";
    db.query(sqlQuery, [status_peminjaman, status_pembayaran, status_pembayaran_denda], (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            res.send(result);
            console.log(result);
        }
    });
});

//PUT update Status (WORK)
app.put("/api/updateStatus", (req, res) =>{
    const status_peminjaman = req.body.status_peminjaman;
    const status_pembayaran = req.body.status_pembayaran;
    const status_pembayaran_denda = req.body.status_pembayaran_denda;
    const id_sewa = req.body.id_sewa;
    
    const sqlQuery = "UPDATE sewa SET status_peminjaman = ?, status_pembayaran = ?, status_pembayaran_denda = ? WHERE id_sewa = ?";
    db.query(sqlQuery, [status_peminjaman, status_pembayaran, status_pembayaran_denda, id_sewa], (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            res.send(result);
            console.log(result);
        }
    });
});

//PUT update bukti pembayaran (WORK)
app.put("/buktipembayaran", upload.fields([{name: "pembayaran"}, {name: "denda"}]), (req, res) =>{
    const bukti_pembayaran =  req.files.pembayaran[0].filename;
    const bukti_pembayaran_denda =  req.files.denda[0].filename;
    const id_sewa = req.body.id_sewa;
    console.log(bukti_pembayaran,bukti_pembayaran_denda);

    const sqlQuery = "UPDATE sewa SET bukti_pembayaran = ?, bukti_pembayaran_denda = ? WHERE id_sewa = ?";
    db.query(sqlQuery, [bukti_pembayaran, bukti_pembayaran_denda, id_sewa], (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            res.json({
                status: "sukses",
                id: id_sewa,
                bayar: bukti_pembayaran,
                denda : bukti_pembayaran_denda
            });
        
            console.log(result);
        }
    });
});

app.listen(5000, () => {
    console.log('Server running in port 5000..');
});