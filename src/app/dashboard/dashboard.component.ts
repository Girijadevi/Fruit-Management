import { Component, ElementRef, ViewChild } from '@angular/core';
import { FruitsService } from '../fruits.service';
import { Router } from '@angular/router';
import { Fruits } from '../interface/fruits';
import * as bootstrap from 'bootstrap';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{
  

  deleteId: number = -1;
  editId: number = -1;
  fruitss: Fruits[] = [];
  oldData: any;
  selectedIds :number[] = [];
  searchTerm: string = '';
  filteredItems: Fruits[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  sortDirections: { [key: string]: 'asc' | 'desc' } = {
    name: 'asc',
    quantity: 'asc',
    price: 'asc'
  };

  constructor(private fruitsService : FruitsService, private router: Router){
  }


  ngOnInit(){
    this.fetchFruits();
  }

  fetchFruits(){
    this.fruitsService.getFruits().subscribe({
      next: data => {
        this.fruitss = data;
        this.filteredItems = this.fruitss;
      },
      error: console.log,
    })
  }

  updateFruits(id : number, fruits : Fruits): void {
    this.fruitsService.updateFruits(id, fruits).subscribe((updateFruits)=>{
      this.editId = -1;
    },
    error=>{console.log("Error in Editing");
  });
   }
   
   isEditable(id: number): boolean{
    return id == this.editId;
   }  

   editFruits(fruits : Fruits): void{
    this.oldData = JSON.stringify(fruits);
    this.fruitss.forEach(element => {
      element.isEditing=false;
    });
    this.editId = fruits.id;
   } 

  deleteFruits(){
    var selectedIds= this.fruitss.filter(frt => frt.selected).map(frt => frt.id);
    if(selectedIds.length == 0)
        selectedIds = [this.deleteId];
  selectedIds.forEach(deleteId => {
    this.fruitsService.deleteFruits(deleteId).subscribe(data=>{
      this.ngOnInit();
    });
    this.triggerReset();
    this.ngOnInit();
  });
  } 

  handleDeleteAll(){
  const selectedIds=this.fruitss.filter(frt => frt.selected).map(frt => frt.id);
  selectedIds.forEach(deleteId => {
    this.fruitsService.deleteFruits(deleteId).subscribe(data=>{
      console.log("success??");
    });
    this.ngOnInit();
  });
}

  @ViewChild('selectAllCheckbox')
  selectAllCheckbox!: ElementRef<HTMLInputElement>;

  toggleSelectAll(){
    const checked = this.selectAllCheckbox.nativeElement.checked;
    this.fruitss.forEach(frt => 
      (frt.selected = checked));
  }

  toggleCheckbox(id: number){
    this.fruitss[id].selected=!this.fruitss[id].selected;
    const allSelected= this.fruitss.every(frt => frt.selected);
    this.selectAllCheckbox.nativeElement.checked = allSelected;
  }


  @ViewChild('helloModal') helloEl?: ElementRef;
  modal?: bootstrap.Modal;
  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.helloEl?.nativeElement, {});
  }
  trigger(id: number) {
    this.deleteId = id;
    this.modal?.toggle();
  }
  triggerMultiple() {
    this.modal?.toggle();
  }
  
  triggerReset() {
    this.deleteId = -1;
    this.modal?.toggle();
  }

  onCancel(obj:any){
    const oldObj =JSON.parse(this.oldData);
    obj.name = oldObj.name;
    obj.quantity = oldObj.quantity;
    obj.price = oldObj.price;
    this.editId = -1;
    obj.isEditable = false;
   }
  
   sortFruitsBy(criteria: keyof Fruits) {
    this.sortDirections[criteria] = this.sortDirections[criteria] === 'asc' ? 'desc' : 'asc';

    this.filteredItems.sort((a, b) => {
      const valueA = a[criteria] ?? '';
      const valueB = b[criteria] ?? '';

      if (valueA < valueB) return this.sortDirections[criteria] === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirections[criteria] === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filterFruits() {
    this.filteredItems = this.fruitss.filter(fruit => 
      fruit.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      fruit.quantity.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      fruit.price.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  paginate(array: any[], pageNumber: number, pageSize: number): any[] {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  get paginatedItems() {
    return this.paginate(this.filteredItems, this.currentPage, this.itemsPerPage);
  }
  get totalPages() {
    return Array(Math.ceil(this.filteredItems.length / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
  }
}
 