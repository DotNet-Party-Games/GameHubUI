import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IUser } from './user';
import { UserapiService } from '../services/userapi.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface MockUser {
  userId: number,
  userName: string,
  email: string,
  registerDate: string
}

const MOCK_DATA : MockUser[] =
[
  {
    "userId": 1,
    "userName": "test",
    "email": "test@gmail.com",
    "registerDate": "2021-08-06T18:58:21.753",
  },
  {
    "userId": 2,
    "userName": "string",
    "email": "string@gmail.com",
    "registerDate": "2021-08-06T18:58:21.753"
  },
  {
    "userId": 4,
    "userName": "bob",
    "email": "bob2@gmail.com",
    "registerDate": "2021-08-09T16:32:00.82"
  },
  {
    "userId": 5,
    "userName": "bob3",
    "email": "bob3@gmail.com",
    "registerDate": "2021-08-09T16:53:52.702"
  },
  {
    "userId": 7,
    "userName": "bob4",
    "email": "bob4@gmail.com",
    "registerDate": "2021-08-09T17:39:03.097"
  },
  {
    "userId": 9,
    "userName": "bob2",
    "email": "bob2@gmail.com",
    "registerDate": "2021-08-10T15:11:21.05"
  }
]

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  users: IUser[];
  displayedColumns: string[] = ['username', 'email', 'registerDate', 'edit', 'delete'];
  dataSource: MatTableDataSource<IUser>;
  mockDataSource: MatTableDataSource<MockUser>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(MatSort) mockSort: MatSort;

  constructor(private UserApi:UserapiService) { 
    this.users = new Array<IUser>();
    this.dataSource = new MatTableDataSource();
    this.mockDataSource = new MatTableDataSource(MOCK_DATA);
  }

  ngOnInit(): void 
  {
    this.getAllUser();
    this.dataSource = new MatTableDataSource(Array.from(this.users));
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
    });
    this.dataSource.sort = this.sort;
    this.mockDataSource.sort = this.mockSort;
  }

  getAllUser()
  {
    this.UserApi.getAllUser().subscribe(
      (response) => {
        this.users = response;
        this.dataSource = new MatTableDataSource(Array.from(this.users));
      }
    )
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.mockDataSource.filter = filterValue.trim().toLowerCase();
  }
}
