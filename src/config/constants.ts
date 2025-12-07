export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
} as const;

export const VEHICLE_TYPE = {
    CAR: 'car',
    BIKE: 'bike',
    VAN: 'van',
    SUV: 'suv',
} as const;

export const AVAILABLE_STATUS = {
    AVAILABLE: 'available',
    BOOKED: 'booked',
} as const;

export const BOOKING_STATUS = {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
    RETURNED: 'returned',
} as const;