import React from "react";
import { Html, Head, Preview, Body, Container, Text, Link, table, Row, Column, Img } from "@react-email/components";

export default function OrderConfirmationEmail({ order, orderDetails }) {
    
    if (!order) {
        console.log('Missing order data');
        return null;
    }
    let priceSubtotal = 0;
    let discountedSubtotal = 0;
    orderDetails.forEach(detail => {
        priceSubtotal += detail.price * detail.quantity;
        discountedSubtotal += parseInt(detail.price * detail.quantity * (detail.discount / 100));
    });


    return (
      <Html>
      <Head />
      <Preview>Đơn hàng của bạn đã được thanh toán thành công!</Preview>
      <Body style={{ backgroundColor: "#f6f6f6", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", maxWidth: "600px", margin: "auto" }}>
        <Text style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
          Tuyệt vời, bạn đã thanh toán thành công cho đơn hàng <strong>{order.id_order} </strong> 
          Hệ thống đã thông báo để Người bán nhanh chóng chuyển hàng cho bạn.
        </Text>

        <Text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
          THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA
        </Text>
        <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <tbody>
          <Row>
            <Column>
            <Text>
              <strong>Mã đơn hàng:</strong> {order.id_order}
            </Text>
            <Text><strong>Ngày đặt hàng:</strong> {order.created_at}</Text>
            <Text><strong>Người bán:</strong> Ecomers</Text>
            </Column>
          </Row>
          </tbody>
        </table>

        <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <tbody>
          {orderDetails.length > 0 ? (
            orderDetails.map((detail) => (
            <Row key={detail?.id_book || Math.random()}>
              <Column style={{ verticalAlign: "top" }}>
              <Text><strong>{detail.book_name }</strong></Text>
              <Text><strong>Số lượng:</strong> {detail.quantity }</Text>
              <Text><strong>Giá:</strong> {formatCurrency(detail.price) }</Text>
              </Column>
            </Row>
            ))
          ) : (
            <Row>
            <Column>
              <Text>Không có thông tin chi tiết đơn hàng</Text>
            </Column>
            </Row>
          )}
          </tbody>
        </table>

        <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <Row>
          <Column style={{ width: "70%" }}><Text><strong>Tổng tiền:</strong></Text></Column>
          <Column style={{ width: "30%", textAlign: "right" }}><Text>{formatCurrency(priceSubtotal)}</Text></Column>
          </Row>
          <Row>
          <Column style={{ width: "70%" }}><Text><strong>Discount từ Ecoms:</strong></Text></Column>
          <Column style={{ width: "30%", textAlign: "right" }}><Text>- {formatCurrency(discountedSubtotal)}</Text></Column>
          </Row>
          <Row>
          <Column style={{ width: "70%" }}><Text><strong>Phí vận chuyển:</strong></Text></Column>
          <Column style={{ width: "30%", textAlign: "right" }}><Text>₫0</Text></Column>
          </Row>
          <Row>
          <Column style={{ width: "70%" }}><Text><strong>Tổng thanh toán:</strong></Text></Column>
          <Column style={{ width: "30%", textAlign: "right" }}><Text>{formatCurrency(order.total_price)}</Text></Column>
          </Row>
        </table>

        <Text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
          THÔNG TIN NHẬN HÀNG
        </Text>
        <Text><strong>Tên người nhận:</strong> {order.full_name}</Text>
        <Text><strong>Số điện thoại:</strong> {order.phone_number}</Text>
        <Text><strong>Địa chỉ nhận hàng:</strong> {order.detailed_address}, {order.ward}, {order.district}, {order.province}</Text>

        <Text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
          THÔNG TIN THANH TOÁN
        </Text>
        <Text><strong>Trạng thái thanh toán:</strong> {order.payment_status}</Text>
        </Container>
      </Body>
      </Html>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
    }).format(amount) + 'đ';
}; 