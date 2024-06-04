export enum ORDER_STATUS {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
    REFUNDED = 'REFUNDED',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
}

export const ORDER_STATUS_LABEL = [
    {
        label: "Đang chờ",
        value: ORDER_STATUS.PENDING
    },
    {
        label: "Đã thanh toán",
        value: ORDER_STATUS.PAID
    },
    {
        label: "Đã hủy",
        value: ORDER_STATUS.CANCELLED
    },
    {
        label: "Đã xác nhận",
        value: ORDER_STATUS.CONFIRMED
    },
    {
        label: "Đã hoàn tiền",
        value: ORDER_STATUS.REFUNDED
    },
    {
        label: "Đang giao",
        value: ORDER_STATUS.DELIVERING
    },
    {
        label: "Đã giao",
        value: ORDER_STATUS.DELIVERED
    }
]

export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay',
}

export const PAYMENT_METHOD_LABEL = [
    {
        label: "COD",
        value: PaymentMethod.COD
    },
    {
        label: "VNPay",
        value: PaymentMethod.VNPAY
    }
]