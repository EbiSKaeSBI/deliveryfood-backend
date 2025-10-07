import { PrismaClient, UserRole, DeliveryStatus, KitchenType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

async function main() {
    console.log('Start seeding...');

    // Очистка базы данных (осторожно!)
    await prisma.deliveryContent.deleteMany();
    await prisma.delivery.deleteMany();
    await prisma.product.deleteMany();
    await prisma.partner.deleteMany();
    await prisma.user.deleteMany();

    // Создание пользователей
    const users = await prisma.user.createMany({
        data: [
            {
                name: 'Администратор',
                email: 'admin@example.com',
                password: await hashPassword("admin123"), // password: admin123
                role: UserRole.ADMIN,
                phone: '+79991112233',
            },
            {
                name: 'Иван Петров',
                email: 'user@example.com',
                password: await hashPassword("user123!"), // password: user123
                role: UserRole.USER,
                phone: '+79994445566',
            },
            {
                name: 'Мария Сидорова',
                email: 'maria@example.com',
                password: await hashPassword("user123!"),
                role: UserRole.USER,
                phone: '+79997778899',
            },
        ],
    });

    console.log('Created users');

    // Создание партнеров (ресторанов)
    const partners = await prisma.partner.createMany({
        data: [
            {
                name: 'Пицца Мания',
                timeOfDelivery: 30,
                stars: 4.7,
                minPrice: 500,
                kitchen: KitchenType.PIZZA,
                image: 'https://example.com/images/pizza-mania.jpg',
            },
            {
                name: 'Суши Вок',
                timeOfDelivery: 45,
                stars: 4.5,
                minPrice: 700,
                kitchen: KitchenType.SUSHI,
                image: 'https://example.com/images/sushi-wok.jpg',
            },
            {
                name: 'Русский Дворик',
                timeOfDelivery: 25,
                stars: 4.8,
                minPrice: 400,
                kitchen: KitchenType.RUSSIAN,
                image: 'https://example.com/images/russian-court.jpg',
            },
            {
                name: 'Бургер Кингдом',
                timeOfDelivery: 20,
                stars: 4.3,
                minPrice: 300,
                kitchen: KitchenType.BURGER,
                image: 'https://example.com/images/burger-kingdom.jpg',
            },
        ],
    });

    console.log('Created partners');

    // Получаем созданных партнеров для создания продуктов
    const pizzaPartner = await prisma.partner.findFirst({
        where: { name: 'Пицца Мания' },
    });

    const sushiPartner = await prisma.partner.findFirst({
        where: { name: 'Суши Вок' },
    });

    const russianPartner = await prisma.partner.findFirst({
        where: { name: 'Русский Дворик' },
    });

    const burgerPartner = await prisma.partner.findFirst({
        where: { name: 'Бургер Кингдом' },
    });

    // Создание продуктов для пиццерии
    if (pizzaPartner) {
        await prisma.product.createMany({
            data: [
                {
                    partnerId: pizzaPartner.id,
                    name: 'Пепперони',
                    description: 'Пицца с пепперони и моцареллой',
                    price: 650,
                    image: 'https://example.com/images/pepperoni.jpg',
                },
                {
                    partnerId: pizzaPartner.id,
                    name: 'Маргарита',
                    description: 'Классическая пицца с томатами и моцареллой',
                    price: 550,
                    image: 'https://example.com/images/margarita.jpg',
                },
                {
                    partnerId: pizzaPartner.id,
                    name: 'Четыре сыра',
                    description: 'Пицца с моцареллой, горгонзолой, пармезаном и фетой',
                    price: 750,
                    image: 'https://example.com/images/four-cheese.jpg',
                },
            ],
        });
    }

    // Создание продуктов для суши-бара
    if (sushiPartner) {
        await prisma.product.createMany({
            data: [
                {
                    partnerId: sushiPartner.id,
                    name: 'Филадельфия',
                    description: 'Ролл с лососем, сливочным сыром и огурцом',
                    price: 450,
                    image: 'https://example.com/images/philadelphia.jpg',
                },
                {
                    partnerId: sushiPartner.id,
                    name: 'Калифорния',
                    description: 'Ролл с крабом, авокадо и огурцом',
                    price: 380,
                    image: 'https://example.com/images/california.jpg',
                },
                {
                    partnerId: sushiPartner.id,
                    name: 'Темпура сет',
                    description: 'Набор роллов в темпуре',
                    price: 1200,
                    image: 'https://example.com/images/tempura-set.jpg',
                },
            ],
        });
    }

    // Создание продуктов для русской кухни
    if (russianPartner) {
        await prisma.product.createMany({
            data: [
                {
                    partnerId: russianPartner.id,
                    name: 'Борщ',
                    description: 'Традиционный украинский борщ со сметаной',
                    price: 250,
                    image: 'https://example.com/images/borscht.jpg',
                },
                {
                    partnerId: russianPartner.id,
                    name: 'Пельмени',
                    description: 'Домашние пельмени со сметаной',
                    price: 350,
                    image: 'https://example.com/images/dumplings.jpg',
                },
                {
                    partnerId: russianPartner.id,
                    name: 'Блины с икрой',
                    description: 'Тонкие блины с красной икрой',
                    price: 500,
                    image: 'https://example.com/images/pancakes-caviar.jpg',
                },
            ],
        });
    }

    // Создание продуктов для бургерной
    if (burgerPartner) {
        await prisma.product.createMany({
            data: [
                {
                    partnerId: burgerPartner.id,
                    name: 'Чизбургер',
                    description: 'Бургер с говяжьей котлетой и сыром',
                    price: 280,
                    image: 'https://example.com/images/cheeseburger.jpg',
                },
                {
                    partnerId: burgerPartner.id,
                    name: 'Бекон бургер',
                    description: 'Бургер с беконом и соусом барбекю',
                    price: 350,
                    image: 'https://example.com/images/bacon-burger.jpg',
                },
                {
                    partnerId: burgerPartner.id,
                    name: 'Вегетарианский бургер',
                    description: 'Бургер с овощной котлетой',
                    price: 320,
                    image: 'https://example.com/images/veggie-burger.jpg',
                },
            ],
        });
    }

    console.log('Created products');

    // Получаем пользователей и продукты для создания доставок
    const user = await prisma.user.findFirst({
        where: { email: 'user@example.com' },
    });

    const pepperoni = await prisma.product.findFirst({
        where: { name: 'Пепперони' },
    });

    const philadelphia = await prisma.product.findFirst({
        where: { name: 'Филадельфия' },
    });

    // Создание доставок
    if (user && pizzaPartner && pepperoni && philadelphia) {
        const delivery1 = await prisma.delivery.create({
            data: {
                userId: user.id,
                partnerId: pizzaPartner.id,
                status: DeliveryStatus.DELIVERED,
                totalAmount: 1300,
                address: 'ул. Примерная, д. 10, кв. 25',
                phone: user.phone!,
                comment: 'Позвонить за 10 минут до доставки',
            },
        });

        const delivery2 = await prisma.delivery.create({
            data: {
                userId: user.id,
                partnerId: sushiPartner!.id,
                status: DeliveryStatus.DELIVERING,
                totalAmount: 830,
                address: 'ул. Тестовая, д. 5, кв. 12',
                phone: user.phone!,
            },
        });

        // Создание содержимого доставок
        await prisma.deliveryContent.createMany({
            data: [
                {
                    deliveryId: delivery1.id,
                    productId: pepperoni.id,
                    productName: pepperoni.name,
                    quantity: 2,
                    price: pepperoni.price,
                    total: pepperoni.price * 2,
                },
                {
                    deliveryId: delivery2.id,
                    productId: philadelphia.id,
                    productName: philadelphia.name,
                    quantity: 1,
                    price: philadelphia.price,
                    total: philadelphia.price,
                },
                {
                    deliveryId: delivery2.id,
                    productId: null,
                    productName: 'Соус соевый',
                    quantity: 2,
                    price: 50,
                    total: 100,
                },
            ],
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });