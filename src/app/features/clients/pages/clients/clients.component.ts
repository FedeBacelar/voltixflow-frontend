import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ClientApiService} from "../../../../core/services/client-api.service";
import {Subject, takeUntil} from "rxjs";
import {IClient, IGetAllClientQuery} from "../../../../shared/models/client.model";
import {NgForOf, NgIf} from "@angular/common";
import {ClientItemComponent} from "../../components/client-item/client-item.component";
import {IFilterOption} from "../../../../shared/models/filterOption";
import {SearchFilterComponent} from "../../../../shared/components/search-filter/search-filter.component";
import {ClientCreateModalComponent} from "../../components/client-create-modal/client-create-modal.component";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    NgForOf,
    ClientItemComponent,
    SearchFilterComponent,
    NgIf,
    ClientCreateModalComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnDestroy, AfterViewInit {
  @ViewChild('clientListBottom', { static: true })
  clientListBottom!: ElementRef<HTMLElement>;
  @ViewChild('listContainer') listContainerRef!: ElementRef<HTMLDivElement>;

  public clients: IClient[] = [];
  private pageSize   = 5;
  private pageNumber = 1;

  private readonly destroy$ = new Subject<void>();
  private sentinelObserver?: IntersectionObserver;

  public filterOptions:IFilterOption[] = [
    { label: 'Nombre', value: '' },
    { label: 'CUIT', value: '' },
    { label: 'Mail', value: '' }
  ]

  private filterByName:string = '';
  private filterByCUIT:string = '';
  private filterByEmail:string = '';

  private forceGet:boolean = false;

  clientSelected:IClient | undefined = undefined;
  openCreateModal:boolean = true;


  constructor(private clientApiService: ClientApiService) {}

  ngAfterViewInit() {
    this.sentinelObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.loadPage();
    });
    this.sentinelObserver.observe(this.clientListBottom.nativeElement);
  }

  private hasVerticalScroll(): boolean {
    const el = this.listContainerRef.nativeElement;
    return el.scrollHeight > el.clientHeight;
  }

  private loadPage() {
    const query: IGetAllClientQuery = {
      pageNumber: this.pageNumber++,
      pageSize:   this.pageSize,
      name:this.filterByName,
      cuit: this.filterByCUIT,
      email: this.filterByEmail
    };
    this.clientApiService.getAllClients(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(page => {
        this.clients.push(...page);
        setTimeout(() => {
          if ((!this.hasVerticalScroll() && page.length != 0) || this.forceGet) {
            this.loadPage();
          }
        }, 0);
      });
  }

  filterEvent(filter:IFilterOption){
    this.filterByName = '';
    this.filterByCUIT = '';
    this.filterByEmail = '';
    switch (filter.label){
      case 'Nombre':
        this.filterByName = filter.value
        break;
      case 'CUIT':
        this.filterByCUIT = filter.value
        break;
      case 'Mail':
        this.filterByEmail = filter.value
        break;
    }
    this.pageNumber = 1;
    this.clients = []
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
