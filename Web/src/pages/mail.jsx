import React from "react";
import { useState } from "react";
import { Html, Head, Preview, Body, Container, Text, Link, table, Row, Column, Img } from "@react-email/components";
import {getOrderByID} from "../services/apiService";

export default function OrderConfirmationEmail(id_order) {
    const [order_details, setOrder_detail] = useState([]);
    const [order, setOrder] = useState([]);


    const fetchOrder = async () => {
        const response = await getOrderByID(id_order);
        setOrder(response.data);
        setOrder_detail(response.data.order_details);
    };
    fetchOrder();
    // let originalItemTotal = parseInt(price * quantity);
    // let discountedItemTotal = parseInt(price * quantity * (1 - discount / 100));
  return (
    <Html>
      <Head />
      <Preview>Đơn hàng của bạn đã được thanh toán thành công!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.header}>
            Tuyệt vời, bạn đã thanh toán thành công cho đơn hàng <strong>{order.id_order}</strong> 
            <span style={styles.shopeeHighlight}>Hệ thống</span> đã thông báo để Người bán nhanh chóng chuyển hàng cho bạn.
          </Text>

          {/* Order Info */}
          <Text style={styles.sectionTitle}>THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA</Text>
          <table style={styles.table}>
            <Row>
              <Column>
                <Text>
                  <strong>Mã đơn hàng:</strong>{order.id_order}
                </Text>
                <Text><strong>Ngày đặt hàng:</strong> {order.created_at}</Text>
                <Text><strong>Người bán:</strong> Ecomers</Text>
              </Column>
            </Row>
          </table>

          {/* Product Info */}
          <table style={styles.table}>
            {order_details.map((order_detail) => (
                <Row key={order_detail.id_book}>
                    <Column style={styles.imageColumn}>
                        <Img src={`data:image/jpeg;base64,${order_detail.image_data}`}  width={100} />
                    </Column>
                    <Column style={styles.productDetails}>
                        <Text><strong>{order_detail.book_name}</strong></Text>
                        <Text><strong>Số lượng:</strong> {order_detail.quantity}</Text>
                        <Text><strong>Giá:</strong> {order_detail.price}</Text>
                    </Column>
                </Row>
            ))}
          </table>

          {/* Pricing Details */}
          <table style={styles.table}>
            <Row>
              <Column><Text><strong>Tổng tiền:</strong></Text></Column>
              <Column><Text>{order.total_price}</Text></Column>
            </Row>
            <Row>
              <Column><Text><strong>Discount từ <span style={styles.shopeeHighlight}>Ecom</span>:</strong></Text></Column>
              <Column><Text>- </Text></Column>
            </Row>
            <Row>
              <Column><Text><strong>Phí vận chuyển:</strong></Text></Column>
              <Column><Text>₫0</Text></Column>
            </Row>
            <Row>
              <Column><Text><strong>Tổng thanh toán:</strong></Text></Column>
              <Column><Text>={order.total_price}</Text></Column>
            </Row>
          </table>

          {/* Shipping Info */}
          <Text style={styles.sectionTitle}>THÔNG TIN NHẬN HÀNG</Text>
          <Text><strong>Tên người nhận:</strong> {order.full_name}</Text>
          <Text><strong>Số điện thoại:</strong> {order.phone_number}</Text>
          <Text><strong>Địa chỉ nhận hàng:</strong> {order.detailed_address}, {order.ward}, {order.district}, {order.province}</Text>

          {/* Payment Info */}
          <Text style={styles.sectionTitle}>THÔNG TIN THANH TOÁN</Text>
          <Text><strong>Trạng thái thanh toán:</strong> {order.payment_status}</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const styles = {
  body: {
    backgroundColor: "#f6f6f6",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "auto",
  },
  header: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px",
  },
  orderLink: {
    color: "#ff6600",
    textDecoration: "none",
  },
  shopeeHighlight: {
    backgroundColor: "#ffeb99",
    padding: "2px 4px",
    borderRadius: "3px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "5px",
  },
  table: {
    width: "100%",
    marginTop: "10px",
    borderCollapse: "collapse",
  },
  imageColumn: {
    width: "120px",
    paddingRight: "10px",
  },
  productDetails: {
    verticalAlign: "top",
  },
};