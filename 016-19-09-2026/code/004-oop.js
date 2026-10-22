class PaymentService {
    process(amount) {
        throw new Error("process() must be implemented");
    }
}

const paymentService = new PaymentService();
paymentService.process(100);