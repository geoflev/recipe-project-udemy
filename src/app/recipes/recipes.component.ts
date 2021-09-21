import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor() { }

  //subscribe to the service to get all changes and then assign so i can show this in the template
  ngOnInit(): void {
  }

}
