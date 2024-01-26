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
        label: "Pending",
        value: ORDER_STATUS.PENDING
    },
    {
        label: "Paid",
        value: ORDER_STATUS.PAID
    },
    {
        label: "Cancelled",
        value: ORDER_STATUS.CANCELLED
    },
    {
        label: "Confirmed",
        value: ORDER_STATUS.CONFIRMED
    },
    {
        label: "Refunded",
        value: ORDER_STATUS.REFUNDED
    },
    {
        label: "Delivering",
        value: ORDER_STATUS.DELIVERING
    },
    {
        label: "Delivered",
        value: ORDER_STATUS.DELIVERED
    }
]