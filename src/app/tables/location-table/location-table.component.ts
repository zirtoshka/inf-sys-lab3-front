import {ChangeDetectorRef, Component, inject, ViewChild} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {NzPaginationComponent} from 'ng-zorro-antd/pagination';
import {NzTableComponent, NzThAddOnComponent} from 'ng-zorro-antd/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Location} from '../../dragondto/location';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {CoordinatesFormComponent} from '../../forms/coordinates-form/coordinates-form.component';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {LocationFormComponent} from '../../forms/location-form/location-form.component';
import {LocationService} from '../../services/location.service';
import {DtoTable} from '../dto-table';
import {WebSocketService} from '../../websocket.service';
import {DragonCave} from '../../dragondto/dragoncave';
import {NzRadioComponent} from 'ng-zorro-antd/radio';
import {NzIconDirective} from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-location-table',
  imports: [
    NgForOf,
    NzPaginationComponent,
    NzTableComponent,
    NzThAddOnComponent,
    ReactiveFormsModule,
    FormsModule,
    NzButtonComponent,
    NzPopconfirmDirective,
    CoordinatesFormComponent,
    NzModalComponent,
    LocationFormComponent,
    NzRadioComponent,
    NzIconDirective,
    NgClass
  ],
  providers: [NzModalService],
  templateUrl: './location-table.component.html',
  standalone: true,
  styleUrl: './location-table.component.css'
})
export class LocationTableComponent extends DtoTable<Location> {
  private locationService = inject(LocationService);
  @ViewChild(LocationFormComponent) locationFormComponent!: LocationFormComponent;
  dataEdit: Location | undefined;
  isLocationModalVisible = false;

  sortOrderX: 'X_ASC' | 'X_DESC' | null = null;
  sortOrderY: 'Y_ASC' | 'Y_DESC' | null = null;
  sortOrderZ: 'Z_ASC' | 'Z_DESC' | null = null;
  sortOrderName: 'NAME_ASC' | 'NAME_DESC' | null = null;


  constructor(cd: ChangeDetectorRef) {
    super(cd, inject(WebSocketService));
    this.sortOrder = {
      id: undefined,
      x: undefined,
      y: undefined,
      z: undefined,
      name: undefined,
    }
    this.filters={
      id: undefined,
      canEdit: undefined,
      name:undefined,
      x:undefined,
      y:undefined,
      z:undefined,
    }
  }


  loadData(page: number, size: number, sort?: string, filters?: Record<string, any>): void {
    this.locationService.getLocations(page, size, sort,
      filters?.['id'], filters?.['canEdit'],undefined,
      filters?.['name'], filters?.['x'],filters?.['y'],filters?.['z'],
    ).subscribe({
      next: (response) => {
        this.listOfData = response.content.map(loc => ({
          id: loc.id,
          x: loc.x,
          y:loc.y,
          canEdit: loc.canEdit,
          z:loc.z,
          name: loc.name,
        }));
        this.currPage = response.number + 1;
        this.pageSize = response.size;
        this.totalElements = response.totalElements;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки:', err); //todo
      },
    });
  }






  deleteRow(id: number): void {
    this.locationService.deleteLocation(
      {id: id})
      .subscribe((res) => {
        console.log(res);
      })
  }


  handleOkLocation() {
    this.locationFormComponent.updateLocation();
    this.isLocationModalVisible=false;
  }

  ngAfterViewChecked(): void {
    if (this.locationFormComponent) {
      if (this.dataEdit) {
        this.locationFormComponent.setDefaultData(this.dataEdit);
      }
      this.locationFormComponent.hideAddButtonFn();
    }
    this.cd.detectChanges();

  }

  openEditModal(data: Location): void {
    this.isLocationModalVisible = true;
    this.dataEdit = data;
  }

  getId(item: Location): any {
    return item.id;
  }

  getWebSocketTopic(): string {
    return 'locations';
  }
}
