import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile-categorylist',
  templateUrl: './profile-categorylist.component.html',
  styleUrls: ['./profile-categorylist.component.css']
})
export class ProfileCategorylistComponent implements OnInit {

  @Output() onRemoveCategory: EventEmitter<string> = new EventEmitter();
  @Input() category: string;
  constructor() { }

  ngOnInit(): void {
  }

  removeCategory(category: string)
  {
    this.onRemoveCategory.emit(category);
  }

}
