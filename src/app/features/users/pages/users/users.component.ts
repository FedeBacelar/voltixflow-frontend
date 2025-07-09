import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {SearchFilterComponent} from "../../../../shared/components/search-filter/search-filter.component";
import {Subject, takeUntil} from "rxjs";
import {IDropOption} from "../../../../shared/models/filterOption";
import {IGetAllUserQuery, IUser} from "../../../../shared/models/user.model";
import {UserApiService} from "../../../../core/services/user-api.service";
import {UserItemComponent} from "../../components/user-item/user-item.component";
import {UserCreateModalComponent} from "../../components/user-create-modal/user-create-modal.component";
import {UserEditModalComponent} from "../../components/user-edit-modal/user-edit-modal.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SearchFilterComponent,
    UserItemComponent,
    UserCreateModalComponent,
    UserEditModalComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnDestroy, AfterViewInit {
  @ViewChild('usersListBottom', { static: true })
  usersListBottom!: ElementRef<HTMLElement>;
  @ViewChild('listContainer') listContainerRef!: ElementRef<HTMLDivElement>;

  public users: IUser[] = [];
  private pageSize   = 5;
  private pageNumber = 1;

  private readonly destroy$ = new Subject<void>();
  private sentinelObserver?: IntersectionObserver;

  public filterOptions:IDropOption[] = [
    { label: 'Nombre', value: '' },
  ]

  private filterByName:string = '';

  private forceGet:boolean = false;

  userSelected:IUser | undefined = undefined;
  openCreateModal:boolean = false;


  constructor(private userApiService: UserApiService) {}

  ngAfterViewInit() {
    this.sentinelObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.loadPage();
    });
    this.sentinelObserver.observe(this.usersListBottom.nativeElement);
  }

  private hasVerticalScroll(): boolean {
    const el = this.listContainerRef.nativeElement;
    return el.scrollHeight > el.clientHeight;
  }

  private loadPage() {
    const query: IGetAllUserQuery = {
      pageNumber: this.pageNumber++,
      pageSize:   this.pageSize,
      name:this.filterByName,
    };
    this.userApiService.getAllUsers(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(page => {
        this.users.push(...page);
        setTimeout(() => {
          if ((!this.hasVerticalScroll() && page.length != 0) || this.forceGet) {
            this.loadPage();
          }
        }, 0);
      });
  }

  filterEvent(filter:IDropOption){
    this.filterByName = '';
    switch (filter.label){
      case 'Nombre':
        this.filterByName = filter.value
        break;
    }
    this.resetUserList();
  }

  resetUserList(){
    this.openCreateModal = false;
    this.pageNumber = 1;
    this.users = [];
    this.loadPage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.sentinelObserver) {
      this.sentinelObserver.disconnect();
    }
  }

}
