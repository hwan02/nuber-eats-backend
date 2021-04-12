import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) { }

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurants.findOne(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }
    // order에서 각 item을 OrderItem으로 만든다. forEach 안에서는  return을 못 한다.
    for (const item of items){
      const dish = await this.dishes.findOne(item.dishId);
      if (!dish) {
        return{
          ok: false,
          error: "Dish not found."
        }
      }
      for (const itemOption of item.options) {
        const dishOption = dish.options.find(
          dishOption => dishOption.name === itemOption.name,
        );
        if (dishOption) {
          if (dishOption.extra) {
            console.log(`$USD + ${dishOption.extra}`);
          } else {
            const dishOptionChoice = dishOption.choices.find(
              optionChoice => optionChoice.name === itemOption.choice,
            );
            if (dishOptionChoice) {
              if (dishOptionChoice.extra) {
                console.log(`$USD + ${dishOptionChoice.extra}`);
              }
            }
          }
        }
      }
      // await this.orderItems.save(this.orderItems.create({
      //   dish,
      //   options: item.options,
      // })
      // )
      // const order = await this.orders.save(
      //   this.orders.create({
      //     customer,
      //     restaurant,
      //   }),
      // );
      // console.log(order);
    }
  }
}