const db = require("../config/dbConfig.js");

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Get Balance
 *     tags: [3. Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get Balance / Saldo Berhasil
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
*/
const getBalance = async (req, res) => {
  try {
    const { id } = req.user;

    const [rows] = await db.execute("SELECT saldo FROM users WHERE id = ?", [id]);

    const balance = rows[0].saldo;

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 505, 
      message: "Server error" });
  }
};

/**
 * @swagger
 * /topup:
 *   post:
 *     summary: Topup Balance
 *     tags: [3. Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               top_up_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Request Successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
*/
const topupBalance = async (req, res) => {
  try {
    const { id } = req.user;
    const { top_up_amount } = req.body;

    // Validasi input
    if (isNaN(top_up_amount) || Number(top_up_amount) <= 0) {
      return res.status(400).json({
        status: 102,
        message: "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
      });
    }

    const [userRows] = await db.execute("SELECT saldo FROM users WHERE id = ?", [id]);
    const currentBalance = Number(userRows[0].saldo);
    const newBalance = currentBalance + Number(top_up_amount);

    await db.execute("UPDATE users SET saldo = ? WHERE id = ?", [newBalance, id]);

    const invoice_number = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [transactionResult] = await db.execute(
      `INSERT INTO transaction_history (user_id, invoice_number, transaction_type, total_amount)
       VALUES (?, ?, ?, ?)`,
      [id, invoice_number, 'TOPUP', top_up_amount]
    );

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: { balance: newBalance }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        status: 505, 
        message: "Server error" });
  }
};

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Create Transaction
 *     tags: [3. Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_code:
 *                 type: string
 *             required:
 *               - service_code
 *     responses:
 *       200:
 *         description: Transaksi berhasil
 *       400:
 *         description: Service ataus Layanan tidak ditemukan
 *       500:
 *         description: Server error
 */
const createTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { service_code } = req.body;

    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: "Isi semua field"
      });
    }

    // Ambil harga service
    const [serviceRows] = await db.execute(
      "SELECT service_name, service_tariff FROM service WHERE service_code = ?",
      [service_code]
    );

    if (serviceRows.length === 0) {
      return res.status(400).json({ status: 102, message: "Service tidak ditemukan" });
    }

    const total_amount = Number(serviceRows[0].service_tariff);

    // Cek dulu saldonya
    const [userRows] = await db.execute("SELECT saldo FROM users WHERE id = ?", [id]);
    const currentBalance = Number(userRows[0].saldo);
    if (currentBalance < total_amount) {
      return res.status(400).json({ 
        status: 104, 
        message: "Saldo tidak cukup" });
    }

    // Kurangi saldo
    const newBalance = currentBalance - total_amount;
    await db.execute("UPDATE users SET saldo = ? WHERE id = ?", [newBalance, id]);

    const invoice_number = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await db.execute(
      `INSERT INTO transaction_history 
         (user_id, invoice_number, transaction_type, total_amount, service_code)
       VALUES (?, ?, 'PAYMENT', ?, ?)`,
      [id, invoice_number, total_amount, service_code]
    );

    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number,
        service_code,
        service_name: serviceRows[0].service_name,
        transaction_type: "PAYMENT",
        total_amount,
        created_on: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 505, message: "Server error" });
  }
};

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary: Get history transaksi
 *     tags: [3. Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Get History Berhasil
 *       500:
 *         description: Server error
 */
const getTransactionHistory = async (req, res) => {
  try {
    const { id } = req.user;
    let { offset = 0, limit = 3 } = req.query;

    // Set offset dan limit
    offset = Number(offset);
    limit = Number(limit);
    if (isNaN(offset) || offset < 0) offset = 0;
    if (isNaN(limit) || limit <= 0) limit = 3;

    const [rows] = await db.execute(
      `SELECT 
          th.invoice_number,
          th.transaction_type,
          CASE 
            WHEN th.transaction_type='TOPUP' THEN 'Top Up balance'
            ELSE s.service_name
          END AS description,
          th.total_amount,
          th.created_at AS created_on
       FROM transaction_history th
       LEFT JOIN service s ON th.service_code = s.service_code
       WHERE th.user_id = ?
       ORDER BY th.created_at DESC
       LIMIT ?, ?`,
      [id, offset, limit]
    );

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit,
        records: rows
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 505, message: "Server error" });
  }
}

module.exports = { getBalance, topupBalance, createTransaction, getTransactionHistory };
