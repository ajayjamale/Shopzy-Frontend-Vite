export var OrderStatus
;(function (OrderStatus) {
  OrderStatus['PENDING'] = 'PENDING'
  OrderStatus['PLACED'] = 'PLACED'
  OrderStatus['CONFIRMED'] = 'CONFIRMED'
  OrderStatus['SHIPPED'] = 'SHIPPED'
  OrderStatus['DELIVERED'] = 'DELIVERED'
  OrderStatus['CANCELLED'] = 'CANCELLED'
  OrderStatus['REFUND_INITIATED'] = 'REFUND_INITIATED'
  OrderStatus['RETURNED'] = 'RETURNED'
  OrderStatus['RETURN_REQUESTED'] = 'RETURN_REQUESTED'
})(OrderStatus || (OrderStatus = {}))
