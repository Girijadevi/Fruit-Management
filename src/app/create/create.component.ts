import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FruitsService } from '../fruits.service';
import { HttpClient } from '@angular/common/http';
import { Fruits } from '../interface/fruits';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
    name = '';
    quantity ='';
    price ='';
    responseData : any;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required])
  });



  constructor(private fruitsService : FruitsService, private http: HttpClient, private router: Router){}

  onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){
      this.fruitsService.addFruits(this.form.value).subscribe({
        next: (val: any) => {
          this.router.navigateByUrl("");
        },
        error: (err: any) => {
          console.error(err);

        }
      })
    }
  }
}
