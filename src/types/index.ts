import { ref } from "vue"
export interface CarInterface {
    brand:string,
    price:number
}
export interface CarInterface2{
    Brand:string,
    Price:number
}
export type Cars = Array<CarInterface>