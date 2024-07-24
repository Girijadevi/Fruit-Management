export class Fruits {
    id : number;
	name : string;	
	quantity : number;
	price : number;
    isEditing : boolean | undefined;
    selected : boolean | undefined;

    constructor(id : number, name : string, quantity : number, price : number){
        this.id=id;
        this.name=name;
        this.quantity=quantity;
        this.price=price;
    }
}
