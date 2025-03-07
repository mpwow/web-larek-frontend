import { IEvents } from '../base/events';

export class OrderModel {
    protected payment: string;
    protected email: string;
    protected phone: string;
    protected address: string;
    protected items: string[];
    protected total: number;


    constructor(protected events: IEvents) {
        this.payment = "online";
        this.email = '';
        this.phone = '';
        this.address = '';
        this.total = 0;
        this.items = [];
    }

    set orderItems(items: string[]) {
        this.items = items;
    }

    set totalCost(price: number) {
        this.total = price;
    }

    set paymentType(payment: string) {
        this.payment = payment;
    }

    set deliveryAddress(address: string) {
        this.address = address;
    }

    set userEmail(email: string) {
        this.email = email;
    }

    set userPhone(phone: string) {
        this.phone = phone;
    }

    get orderRequest() {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items,
        }
    }
}