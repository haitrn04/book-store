const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {

});

const addresscon = {
    addOrderAndOrderDetail: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN"); // Bắt đầu transaction
    
            const { id_account, address_id, payment_status, order_status, order_details } = req.body;
    
            // Tính tổng tiền từ danh sách sản phẩm
            let total_price = 0;
            for (const detail of order_details) {
                total_price += parseInt(detail.qty * detail.price * (100 - detail.discount) / 100, 10);
            }

    
            // Thêm đơn hàng vào bảng orders
            const orderQuery = `
                INSERT INTO public.orders (id_account, total_price, address_id, payment_status, order_status, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id_order;
            `;
            const orderValues = [id_account, total_price, address_id, payment_status, order_status];
            const orderResult = await client.query(orderQuery, orderValues);
            const id_order = orderResult.rows[0].id_order;
    
            // Thêm chi tiết đơn hàng vào bảng order_details
            const orderDetailQuery = `
                INSERT INTO public.order_details (id_order, id_book, quantity)
                VALUES ($1, $2, $3);
            `;
    
            for (const detail of order_details) {
                const detailValues = [id_order, detail.id_book, detail.qty];
                await client.query(orderDetailQuery, detailValues);
            }
    
            await client.query("COMMIT"); // Xác nhận transaction
    
            res.status(200).json({ message: "Order added successfully", id_order, total_price });
        } catch (error) {
            await client.query("ROLLBACK"); // Hủy thao tác nếu có lỗi
            console.error("Error adding order:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    }
};

module.exports = addresscon;